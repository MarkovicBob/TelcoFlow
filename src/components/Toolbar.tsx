import React, { useRef } from "react";
import { useReactFlow } from "reactflow";
import { useFlowStore } from "../store/flowStore";
import { validateFlow } from "../utils/flowValidation";

// src/components/Toolbar.tsx
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Save,
  Download,
  Upload,
  BarChart3,
  Zap,
  Trash2,
} from "lucide-react";

interface ToolbarProps {
  onOpenSimulator?: () => void;
  onOpenTemplates?: () => void;
  onOpenConfirmDialog?: (
    title: string,
    message: string,
    onConfirm: () => void,
    isDangerous?: boolean,
    isInfo?: boolean
  ) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onOpenSimulator,
  onOpenTemplates,
  onOpenConfirmDialog,
}) => {
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
    importFlow,
    clearFlow,
  } = useFlowStore();

  const handleTestFlow = () => {
    const result = validateFlow(nodes, edges);
    setValidationResults(result.errors, result.warnings);
    toggleValidationPanel();
  };

  const handleSave = () => {
    saveFlow();
    onOpenConfirmDialog?.(
      "Flow Saved",
      "Your flow has been saved successfully!",
      () => {},
      false,
      true
    );
  };

  const handleExport = () => {
    exportFlow();
  };

  const handleClearCanvas = () => {
    if (nodes.length === 0) {
      onOpenConfirmDialog?.(
        "Canvas Empty",
        "The canvas is empty. There is nothing to clear.",
        () => {},
        false,
        true
      );
      return;
    }

    onOpenConfirmDialog?.(
      "Clear Canvas",
      "Are you sure you want to clear the entire canvas? This action cannot be undone.",
      () => {
        clearFlow();
      },
      true,
      false
    );
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
        onOpenConfirmDialog?.(
          "Flow Imported",
          "Your flow has been imported successfully!",
          () => {},
          false,
          true
        );
      } catch {
        onOpenConfirmDialog?.(
          "Import Failed",
          "Failed to import flow. Invalid file format.",
          () => {},
          true,
          false
        );
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-2 md:px-3 py-1.5 md:py-2 flex flex-wrap items-center gap-1.5 md:gap-2 shrink-0">
      {/* Undo/Redo */}
      <button
        onClick={undo}
        disabled={!canUndo()}
        className="
          px-2 md:px-3 py-1 md:py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all text-xs text-slate-300
          flex items-center gap-1 md:gap-2 shrink-0
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

      {/* Templates Button */}
      <button
        onClick={onOpenTemplates}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-yellow-500
          transition-all text-xs sm:text-sm text-slate-300
          flex items-center gap-2 shrink-0
        "
        title="Load Template"
      >
        <Zap size={16} />
        <span className="hidden sm:inline">Templates</span>
      </button>

      {/* Simulator Button */}
      <button
        onClick={onOpenSimulator}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-purple-500
          transition-all text-xs sm:text-sm text-slate-300
          flex items-center gap-2 shrink-0
        "
        title="Open Simulator"
      >
        <BarChart3 size={16} />
        <span className="hidden sm:inline">Simulator</span>
      </button>

      {/* Clear Canvas Button */}
      <button
        onClick={handleClearCanvas}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-red-500
          transition-all text-xs sm:text-sm text-slate-300
          flex items-center gap-2 shrink-0
        "
        title="Clear Canvas"
      >
        <Trash2 size={16} />
        <span className="hidden sm:inline">Clear</span>
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
