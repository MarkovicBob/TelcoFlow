import { X } from "lucide-react";
import { useFlowStore } from "../store/flowStore";
import { FLOW_TEMPLATES } from "../utils/flowTemplates";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateLoaded?: () => void;
}

const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onTemplateLoaded,
}) => {
  const { loadTemplate } = useFlowStore();

  const handleLoadTemplate = (templateId: string) => {
    const template = FLOW_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    loadTemplate({
      nodes: template.nodes,
      edges: template.edges,
    });

    onClose();
    onTemplateLoaded?.();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col pointer-events-auto">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">
              Select a Flow Template
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FLOW_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleLoadTemplate(template.id)}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:from-slate-700 transition-all group"
                >
                  {/* Icon + Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">{template.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {template.nodes.length} nodes · {template.edges.length}{" "}
                        connections
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 mb-4">
                    {template.description}
                  </p>

                  {/* Preview */}
                  <div className="bg-slate-950/50 rounded p-3 mb-4 text-xs">
                    <div className="text-slate-500 mb-2 font-mono">Flow:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.nodes.map((node, idx) => (
                        <div key={node.id} className="flex items-center">
                          <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs">
                            {node.data?.label || node.type}
                          </span>
                          {idx < template.nodes.length - 1 && (
                            <span className="text-slate-500 mx-1">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Load Button */}
                  <button className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors">
                    ↓ Load Template
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/50">
            <p className="text-xs text-slate-400">
              💡 Click a template to load example flow. Simulation will
              automatically start after loading.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplatesModal;
