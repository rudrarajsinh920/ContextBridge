import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import http from 'http';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function assert(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, error: errorMsg });
    console.error(`  [FAIL] ${name} - ${errorMsg}`);
  }
}

async function request(
  serverUrl: string,
  method: string,
  path: string,
  body?: unknown
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, serverUrl);
    const postData = body ? JSON.stringify(body) : undefined;

    const req = http.request(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        },
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = rawData ? JSON.parse(rawData) : {};
            resolve({ status: res.statusCode || 500, body: parsed });
          } catch {
            resolve({ status: res.statusCode || 500, body: rawData });
          }
        });
      }
    );

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('Starting ContextBridge Milestone 2 Automated Test Suite');
  console.log('========================================================\n');

  const app = createApp();
  let server: http.Server;
  let serverUrl = '';
  let mongod: MongoMemoryServer | null = null;

  // Start HTTP server on dynamic port
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      serverUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  try {
    // -------------------------------------------------------------
    // PART 1: Database Disconnected Checks
    // -------------------------------------------------------------
    console.log('Testing Database Disconnection Behavior...');

    await assert('GET /api/health reports 503 degraded when DB is disconnected', async () => {
      const res = await request(serverUrl, 'GET', '/api/health');
      if (res.status !== 503) throw new Error(`Expected status 503, received ${res.status}`);
      if (res.body.status !== 'degraded') throw new Error(`Expected status 'degraded', got '${res.body.status}'`);
      if (res.body.database?.connected !== false) throw new Error('Expected database.connected to be false');
    });

    await assert('GET /api/projects returns 503 when DB is disconnected', async () => {
      const res = await request(serverUrl, 'GET', '/api/projects');
      if (res.status !== 503) throw new Error(`Expected status 503, received ${res.status}`);
      if (!res.body.message?.includes('Database service is currently unavailable')) {
        throw new Error(`Unexpected message: ${res.body.message}`);
      }
    });

    await assert('POST /api/projects returns 503 when DB is disconnected', async () => {
      const res = await request(serverUrl, 'POST', '/api/projects', { name: 'Test' });
      if (res.status !== 503) throw new Error(`Expected status 503, received ${res.status}`);
    });

    // -------------------------------------------------------------
    // PART 2: In-Memory Database Initialization & Health Check
    // -------------------------------------------------------------
    console.log('\nInitializing In-Memory MongoDB Instance...');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connectDatabase(uri);

    await assert('GET /api/health reports 200 OK when DB is connected', async () => {
      const res = await request(serverUrl, 'GET', '/api/health');
      if (res.status !== 200) throw new Error(`Expected status 200, received ${res.status}`);
      if (res.body.status !== 'ok') throw new Error(`Expected status 'ok', got '${res.body.status}'`);
      if (res.body.database?.connected !== true) throw new Error('Expected database.connected to be true');
    });

    // -------------------------------------------------------------
    // PART 3: Request Validation & Rejection of Invalid Input
    // -------------------------------------------------------------
    console.log('\nTesting Validation and Error Handling...');

    await assert('POST /api/projects rejects missing name with 400', async () => {
      const res = await request(serverUrl, 'POST', '/api/projects', {});
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    });

    await assert('POST /api/projects rejects empty/whitespace name with 400', async () => {
      const res = await request(serverUrl, 'POST', '/api/projects', { name: '   ' });
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    });

    await assert('POST /api/projects rejects name exceeding 100 characters with 400', async () => {
      const longName = 'A'.repeat(101);
      const res = await request(serverUrl, 'POST', '/api/projects', { name: longName });
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    });

    await assert('POST /api/projects rejects description exceeding 1000 characters with 400', async () => {
      const longDesc = 'B'.repeat(1001);
      const res = await request(serverUrl, 'POST', '/api/projects', {
        name: 'Valid Project',
        description: longDesc,
      });
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    });

    await assert('POST /api/projects rejects invalid status with 400', async () => {
      const res = await request(serverUrl, 'POST', '/api/projects', {
        name: 'Valid Project',
        status: 'invalid_status',
      });
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    });

    await assert('POST /api/projects rejects unexpected unmodeled fields with 400', async () => {
      const res = await request(serverUrl, 'POST', '/api/projects', {
        name: 'Valid Project',
        maliciousField: true,
      });
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
      if (!res.body.message?.includes('Unexpected field(s) rejected')) {
        throw new Error(`Expected unexpected field message, got: ${res.body.message}`);
      }
    });

    // -------------------------------------------------------------
    // PART 4: Project CRUD Operations
    // -------------------------------------------------------------
    console.log('\nTesting Complete Project CRUD Operations...');

    let createdProjectId = '';

    await assert('POST /api/projects creates a valid project with 201', async () => {
      const res = await request(serverUrl, 'POST', '/api/projects', {
        name: 'ContextBridge Core',
        description: 'AI-powered project continuity architecture',
        status: 'active',
      });
      if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
      if (!res.body.data?._id) throw new Error('Expected created project to have _id');
      if (res.body.data.name !== 'ContextBridge Core') throw new Error('Name mismatch');
      if (res.body.data.status !== 'active') throw new Error('Status mismatch');
      createdProjectId = res.body.data._id;
    });

    await assert('GET /api/projects returns project list with count and 200', async () => {
      const res = await request(serverUrl, 'GET', '/api/projects');
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (res.body.count < 1) throw new Error(`Expected count >= 1, got ${res.body.count}`);
      if (!Array.isArray(res.body.data)) throw new Error('Expected data to be an array');
    });

    await assert('GET /api/projects/:id returns single project with 200', async () => {
      const res = await request(serverUrl, 'GET', `/api/projects/${createdProjectId}`);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (res.body.data._id !== createdProjectId) throw new Error('ID mismatch');
      if (res.body.data.name !== 'ContextBridge Core') throw new Error('Name mismatch');
    });

    await assert('PATCH /api/projects/:id updates allowed fields with 200', async () => {
      const res = await request(serverUrl, 'PATCH', `/api/projects/${createdProjectId}`, {
        name: 'ContextBridge Platform',
        status: 'archived',
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (res.body.data.name !== 'ContextBridge Platform') throw new Error('Updated name mismatch');
      if (res.body.data.status !== 'archived') throw new Error('Updated status mismatch');
    });

    await assert('PATCH /api/projects/:id rejects empty update body with 400', async () => {
      const res = await request(serverUrl, 'PATCH', `/api/projects/${createdProjectId}`, {});
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    });

    await assert('PATCH /api/projects/:id rejects unexpected fields with 400', async () => {
      const res = await request(serverUrl, 'PATCH', `/api/projects/${createdProjectId}`, {
        fakeField: 'value',
      });
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    });

    // -------------------------------------------------------------
    // PART 5: Nonexistent and Invalid ObjectId Handling
    // -------------------------------------------------------------
    console.log('\nTesting Invalid and Nonexistent ObjectId Handling...');

    const invalidId = 'not-a-valid-objectid';
    const nonExistentId = '507f1f77bcf86cd799439011';

    await assert('GET /api/projects/:id returns 400 for invalid ObjectId format', async () => {
      const res = await request(serverUrl, 'GET', `/api/projects/${invalidId}`);
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    });

    await assert('PATCH /api/projects/:id returns 400 for invalid ObjectId format', async () => {
      const res = await request(serverUrl, 'PATCH', `/api/projects/${invalidId}`, { name: 'New' });
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    });

    await assert('DELETE /api/projects/:id returns 400 for invalid ObjectId format', async () => {
      const res = await request(serverUrl, 'DELETE', `/api/projects/${invalidId}`);
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    });

    await assert('GET /api/projects/:id returns 404 for nonexistent ObjectId', async () => {
      const res = await request(serverUrl, 'GET', `/api/projects/${nonExistentId}`);
      if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    });

    await assert('PATCH /api/projects/:id returns 404 for nonexistent ObjectId', async () => {
      const res = await request(serverUrl, 'PATCH', `/api/projects/${nonExistentId}`, { name: 'New' });
      if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    });

    await assert('DELETE /api/projects/:id returns 404 for nonexistent ObjectId', async () => {
      const res = await request(serverUrl, 'DELETE', `/api/projects/${nonExistentId}`);
      if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    });

    // -------------------------------------------------------------
    // PART 6: Deletion Operation
    // -------------------------------------------------------------
    console.log('\nTesting Project Deletion...');

    await assert('DELETE /api/projects/:id deletes project and returns 200', async () => {
      const res = await request(serverUrl, 'DELETE', `/api/projects/${createdProjectId}`);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (res.body.data?.id !== createdProjectId) throw new Error('Deleted ID mismatch');
    });

    await assert('GET /api/projects/:id returns 404 after project was deleted', async () => {
      const res = await request(serverUrl, 'GET', `/api/projects/${createdProjectId}`);
      if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    });
  } finally {
    // Teardown
    console.log('\nTearing down test services...');
    await disconnectDatabase();
    if (mongod) {
      await mongod.stop();
    }
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  }

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n========================================================');
  console.log(`Test Execution Finished: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Unhandled fatal error in test runner:', err);
  process.exit(1);
});
