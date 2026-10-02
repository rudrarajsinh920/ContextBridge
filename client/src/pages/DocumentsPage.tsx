import React from 'react';
import { FileText, FileCode, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Badge } from '../components/common/Badge.js';
import { EmptyState } from '../components/common/EmptyState.js';

export const DocumentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Description Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <Badge variant="neutral" className="mb-3">
            Knowledge Corpus
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Documents & Evidence
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            The foundation of evidence-backed project continuity. Documents ingested here (ADRs, design specifications, PRDs, meeting minutes) will form the verifiable ground truth for teammate understanding.
          </p>
        </div>
      </div>

      {/* Honest Empty State */}
      <Card>
        <EmptyState
          icon={<FileText className="w-6 h-6 text-slate-600" />}
          badge="Corpus Empty"
          title="No Documents Ingested Yet"
          description="Document ingestion, parsing, and storage pipelines are intentionally deferred until the base infrastructure and database schema are ratified."
        />
      </Card>

      {/* Ingestion Pipeline Architecture Blueprint */}
      <Card
        title="Document Ingestion & Knowledge Pipeline Blueprint"
        subtitle="Step-by-step engineering roadmap for document processing"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="w-4 h-4 text-slate-700" />
                <h4 className="text-sm font-semibold text-slate-900">
                  1. Multi-format Ingestion
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Support Markdown, plain text, and PDF document uploads with mime-type validation and file size guards.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Multi-format Parser</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="w-4 h-4 text-slate-700" />
                <h4 className="text-sm font-semibold text-slate-900">
                  2. Chunking & Indexing
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Segment documents into semantic chunks preserving heading hierarchy and section anchors for attribution.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Semantic Extraction</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="w-4 h-4 text-slate-700" />
                <h4 className="text-sm font-semibold text-slate-900">
                  3. Citation & Evidence Links
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every generated insight references the exact source document and character offset to guarantee verifiable truth.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Evidence Ledger</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
