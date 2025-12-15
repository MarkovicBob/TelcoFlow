import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, X } from "lucide-react";
import { useFlowStore } from "../store/flowStore";

// src/components/ValidationPanel.tsx

const ValidationPanel: React.FC = () => {
  const {
    validationErrors,
    validationWarnings,
    showValidationPanel,
    toggleValidationPanel,
    nodes,
  } = useFlowStore();

  if (!showValidationPanel) return null;

  const totalIssues = validationErrors.length + validationWarnings.length;

  return (
    <div className="absolute top-16 right-4 w-96 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl z-50 max-h-[70vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          {totalIssues === 0 ? (
            <>
              <CheckCircle size={20} className="text-green-500" />
              <h3 className="text-sm font-semibold text-slate-100">
                Flow Validation
              </h3>
            </>
          ) : (
            <>
              <AlertCircle size={20} className="text-red-500" />
              <h3 className="text-sm font-semibold text-slate-100">
                Validation Issues ({totalIssues})
              </h3>
            </>
          )}
        </div>
        <button
          onClick={toggleValidationPanel}
          className="text-slate-400 hover:text-slate-200 transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-4 space-y-3">
        {totalIssues === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle size={48} className="text-green-500 mb-3" />
            <p className="text-sm text-slate-300 font-medium">
              ✅ Flow is Valid!
            </p>
            <p className="text-xs text-slate-400 mt-1">
              No errors or warnings found
            </p>
            <div className="mt-4 text-xs text-slate-500">
              <p>📊 Summary:</p>
              <p>• Nodes: {nodes.length}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Errors */}
            {validationErrors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase">
                  <AlertCircle size={14} />
                  <span>Errors ({validationErrors.length})</span>
                </div>
                {validationErrors.map((error) => (
                  <div
                    key={error.id}
                    className="bg-red-950/30 border border-red-900/50 rounded-md p-3"
                  >
                    <p className="text-xs text-red-200">{error.message}</p>
                    {error.nodeId && (
                      <p className="text-[10px] text-red-400/60 mt-1">
                        Node ID: {error.nodeId}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Warnings */}
            {validationWarnings.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase">
                  <AlertTriangle size={14} />
                  <span>Warnings ({validationWarnings.length})</span>
                </div>
                {validationWarnings.map((warning) => (
                  <div
                    key={warning.id}
                    className="bg-amber-950/20 border border-amber-900/40 rounded-md p-3"
                  >
                    <p className="text-xs text-amber-200">{warning.message}</p>
                    {warning.nodeId && (
                      <p className="text-[10px] text-amber-400/60 mt-1">
                        Node ID: {warning.nodeId}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer with actions */}
      {totalIssues > 0 && (
        <div className="border-t border-slate-700 p-3 bg-slate-800/50">
          <p className="text-[10px] text-slate-400 text-center">
            Fix these issues to ensure your flow works correctly
          </p>
        </div>
      )}
    </div>
  );
};

export default ValidationPanel;
