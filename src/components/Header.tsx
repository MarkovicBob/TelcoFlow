import React from "react";
import { Download, FileText, ImageDown, Layers, User, Zap } from "lucide-react";
import { useFlowStore } from "../store/flowStore";
import { exportMarkdown } from "../utils/exportDocs";
import { exportCanvasPDF, exportCanvasPNG } from "../utils/exportImage";
import { getTemplateById, listTemplates } from "../utils/templates";

// src/components/Header.tsx

const Header: React.FC = () => {
  const {
    loadFlow,
    setProjectMetadata,
    projectMetadata,
    exportFlow,
    nodes,
    edges,
  } = useFlowStore();
  const templates = listTemplates();

  const onTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    const tpl = getTemplateById(id);
    if (!tpl) return;
    loadFlow(tpl.nodes, tpl.edges);
    setProjectMetadata({
      name: tpl.metadata.name,
      description: tpl.metadata.description,
      tags: tpl.metadata.tags,
    });
  };

  const exportJson = () => {
    exportFlow();
  };

  const exportDocs = () => {
    exportMarkdown(nodes, edges, projectMetadata);
  };

  const exportPng = () => {
    exportCanvasPNG();
  };

  const exportPdf = () => {
    exportCanvasPDF();
  };

  return (
    <header className="h-12 md:h-14 lg:h-16 bg-slate-900 border-b border-slate-800 px-3 md:px-4 lg:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 md:gap-3">
        <Zap className="text-blue-500" size={20} />
        <div>
          <h1 className="text-base md:text-lg lg:text-xl font-semibold text-slate-100">
            TelcoFlow
          </h1>
          <p className="text-[10px] md:text-xs text-slate-400">
            Low-Code Call Flow Builder
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-slate-400" />
          <select
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded px-2 py-1"
            onChange={onTemplateChange}
            defaultValue=""
          >
            <option value="" disabled>
              Load Template...
            </option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="text-sm text-slate-400">
            Project:{" "}
            <span className="text-slate-200 font-medium">
              {projectMetadata.name}
            </span>
          </div>
          <button
            onClick={exportJson}
            className="flex items-center gap-1 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 hover:bg-slate-700"
            title="Export JSON"
          >
            <Download size={14} /> JSON
          </button>
          <button
            onClick={exportDocs}
            className="flex items-center gap-1 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 hover:bg-slate-700"
            title="Export Docs (Markdown)"
          >
            <FileText size={14} /> Docs
          </button>
          <button
            onClick={exportPng}
            className="flex items-center gap-1 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 hover:bg-slate-700"
            title="Export Canvas (PNG)"
          >
            <ImageDown size={14} /> PNG
          </button>
          <button
            onClick={exportPdf}
            className="flex items-center gap-1 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 hover:bg-slate-700"
            title="Export Canvas (PDF)"
          >
            <FileText size={14} /> PDF
          </button>
        </div>

        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
          <User size={18} className="text-white" />
        </div>
      </div>
    </header>
  );
};

export default Header;
