import React from 'react';
import { ShieldCheck, Activity, Database, GitMerge, FileCheck } from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Badge } from '../components/common/Badge.js';
import { HealthResponse } from '../services/api.js';

interface DashboardPageProps {
  health: HealthResponse | null;
  healthLoading: boolean;
  healthError: string | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  health,
  healthLoading,
  healthError,
}) => {
  return (
    <div className="space-y-6">
      {/* Product Vision Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <Badge variant="info" className="mb-3">
            Product Continuity Architecture
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Bridging scattered project context into structured, evidence-backed knowledge.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            ContextBridge enables incoming and existing teammates to quickly comprehend any project by transforming disparate notes, architecture decisions, PRDs, and discussions into verified project knowledge.
          </p>
        </div>
      </div>

      {/* Backend & Database Telemetry Card */}
      <Card
        title="Infrastructure & Database Telemetry"
        subtitle="Live verification of the Express API runtime and MongoDB database connectivity"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              API Status
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  health?.status === 'ok'
                    ? 'bg-emerald-500'
                    : health?.status === 'degraded'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
              />
              <span className="text-base font-semibold text-slate-900">
                {healthLoading
                  ? 'Connecting...'
                  : health?.status === 'ok'
                  ? 'Operational'
                  : health?.status === 'degraded'
                  ? 'Degraded'
                  : 'Unreachable'}
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              GET /api/health
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              MongoDB Database
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  health?.database?.connected ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              <span className="text-base font-semibold text-slate-900">
                {healthLoading
                  ? 'Checking...'
                  : health?.database?.connected
                  ? 'Connected'
                  : 'Disconnected'}
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Mongoose State: {health?.database?.readyState ?? 0}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Environment
            </span>
            <div className="mt-1 text-base font-semibold text-slate-900">
              {health?.environment || 'development'}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Node.js + Express
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Server Uptime
            </span>
            <div className="mt-1 text-base font-semibold text-slate-900">
              {health ? `${health.uptime}s` : 'N/A'}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Continuous process
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Last Verified
            </span>
            <div className="mt-1 text-xs font-medium text-slate-700 truncate">
              {health ? new Date(health.timestamp).toLocaleTimeString() : 'Pending'}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              ISO Timestamp
            </span>
          </div>
        </div>

        {healthError && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <strong>Connectivity Note:</strong> {healthError}. Start the backend server on port 5000 using <code className="bg-amber-100 px-1 py-0.5 rounded">npm run dev</code> inside <code className="bg-amber-100 px-1 py-0.5 rounded">/server</code>.
          </div>
        )}
      </Card>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="1. Project Continuity"
          subtitle="Clear boundaries for project context"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GitMerge className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Maintains an explicit map of projects, milestones, and architectural decisions so onboarding developers never lose the “why” behind technical choices.
            </p>
          </div>
        </Card>

        <Card
          title="2. Evidence-Backed Truth"
          subtitle="Zero hallucination policy"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every synthesized insight links directly to verifiable source artifacts (PRDs, pull requests, meeting notes, ADRs). No unverified assertions.
            </p>
          </div>
        </Card>

        <Card
          title="3. Modular Ingestion"
          subtitle="Clean extensible architecture"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Independent client and server boundaries, clean middleware stacks, and strict TypeScript types prepare ContextBridge for incremental evolution.
            </p>
          </div>
        </Card>
      </div>

      {/* Engineering Principles & Foundation Checklist */}
      <Card
        title="Implementation Status & Guardrails"
        subtitle="Tracking architectural integrity and adherence to engineering rules"
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <FileCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <strong className="font-semibold text-slate-900 block">
                Rule: Real MongoDB Integration & Validated CRUD
              </strong>
              <p className="text-slate-600 text-xs mt-0.5">
                Projects are persisted in MongoDB via Mongoose with strict schema typing, input validation, and ObjectId checks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <Activity className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <strong className="font-semibold text-slate-900 block">
                Rule: Authentic Database Telemetry
              </strong>
              <p className="text-slate-600 text-xs mt-0.5">
                The health check dynamically reports Mongoose connection status and transitions to degraded HTTP 503 if disconnected.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
