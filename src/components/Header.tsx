import React from "react";
import { Download, FileText, ImageDown, User, Zap } from "lucide-react";
import { useFlowStore } from "../store/flowStore";
import { exportMarkdown } from "../utils/exportDocs";
import { exportCanvasPDF, exportCanvasPNG } from "../utils/exportImage";

// src/components/Header.tsx

const Header: React.FC = () => {
  const { projectMetadata, exportFlow, nodes, edges } = useFlowStore();

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
