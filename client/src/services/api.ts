export type ProjectStatus = 'active' | 'archived';

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface DatabaseHealth {
  status: string;
  connected: boolean;
  readyState: number;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  service: string;
  uptime: number;
  timestamp: string;
  environment: string;
  database?: DatabaseHealth;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Checks backend health status from the Express API server.
 */
export async function fetchHealthStatus(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/health`, {
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok && response.status !== 503) {
    throw new Error(data.message || `API health check failed with status: ${response.status}`);
  }

  return data;
}

/**
 * Fetches all projects from the backend API.
 */
export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Failed to fetch projects (HTTP ${response.status})`);
  }

  return data.data;
}

/**
 * Creates a new project.
 */
export async function createProject(input: CreateProjectInput): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Failed to create project (HTTP ${response.status})`);
  }

  return data.data;
}

/**
 * Updates an existing project.
 */
export async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Failed to update project (HTTP ${response.status})`);
  }

  return data.data;
}

/**
 * Deletes a project by ID.
 */
export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Failed to delete project (HTTP ${response.status})`);
  }
}
