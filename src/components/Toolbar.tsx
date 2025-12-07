// src/components/Toolbar.tsx
import React, { useRef } from "react";
import { 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Play, 
  Save,
  Download,
  Upload 
} from "lucide-react";
import { useReactFlow } from "reactflow";
import { useFlowStore } from "../store/flowStore";
import { validateFlow } from "../utils/flowValidation";

const Toolbar: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    nodes, 
    edges,
    setValidationResults,
    toggleValidationPanel,
    saveFlow,
    exportFlow,
    importFlow 
  } = useFlowStore();

  const handleTestFlow = () => {
    const result = validateFlow(nodes, edges);
    setValidationResults(result.errors, result.warnings);
    toggleValidationPanel();
  };

  const handleSave = () => {
    saveFlow();
    alert("✅ Flow saved successfully!");
  };

  const handleExport = () => {
    exportFlow();
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        importFlow(content);
        alert("✅ Flow imported successfully!");
      } catch {
        alert("❌ Failed to import flow. Invalid file format.");
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center gap-2 gap-y-3">
      {/* Undo/Redo */}
      <button
        onClick={undo}
        disabled={!canUndo()}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all text-xs sm:text-sm text-slate-300
          flex items-center gap-2 shrink-0
        "
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={16} />
        <span className="hidden sm:inline">Undo</span>
      </button>
      <button
        onClick={redo}
        disabled={!canRedo()}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all text-xs sm:text-sm text-slate-300
          flex items-center gap-2 shrink-0
        "
        title="Redo (Ctrl+Y)"
      >
        <Redo2 size={16} />
        <span className="hidden sm:inline">Redo</span>
      </button>

      <div className="w-px h-6 bg-slate-700 mx-2" />

      {/* Zoom Controls */}
      <button
        onClick={() => zoomOut()}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-blue-500
          transition-all text-xs sm:text-sm text-slate-300
          flex items-center gap-2 shrink-0
        "
        title="Zoom Out"
      >
        <ZoomOut size={16} />
      </button>
      <button
        onClick={() => zoomIn()}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-blue-500
          transition-all text-xs sm:text-sm text-slate-300
          flex items-center gap-2 shrink-0
        "
        title="Zoom In"
      >
        <ZoomIn size={16} />
      </button>
      <button
        onClick={() => fitView()}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-blue-500
          transition-all text-xs sm:text-sm text-slate-300
          flex items-center gap-2 shrink-0
        "
        title="Fit View"
      >
        <Maximize2 size={16} />
        <span className="hidden sm:inline">Fit</span>
      </button>

      <div className="w-px h-6 bg-slate-700 mx-2" />

      {/* Actions */}
      <button
        onClick={handleTestFlow}
        className="
          px-4 py-1.5 rounded-md border border-blue-600
          bg-blue-600 hover:bg-blue-700
          transition-all text-xs sm:text-sm text-white font-medium
          flex items-center gap-2 shrink-0
        "
        title="Test Flow"
      >
        <Play size={16} />
        <span className="hidden sm:inline">Test Flow</span>
      </button>

      <div className="flex-1 min-w-10" />

      {/* Right Side Actions */}
      <button
        onClick={handleSave}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-green-500
          transition-all text-xs sm:text-sm text-slate-300
          flex items-center gap-2 shrink-0
        "
        title="Save Flow"
      >
        <Save size={16} />
        <span className="hidden sm:inline">Save</span>
      </button>
      <button
        onClick={handleExport}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-purple-500
          transition-all text-xs sm:text-sm text-slate-300
          flex items-center gap-2 shrink-0
        "
        title="Export Flow"
      >
        <Download size={16} />
        <span className="hidden sm:inline">Export</span>
      </button>
      <button
        onClick={handleImport}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-orange-500
          transition-all text-xs sm:text-sm text-slate-300
          flex items-center gap-2 shrink-0
        "
        title="Import Flow"
      >
        <Upload size={16} />
        <span className="hidden sm:inline">Import</span>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};

export default Toolbar;