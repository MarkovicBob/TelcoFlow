// src/components/Toolbar.tsx
import React from "react";
import { 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Play, 
  Save,
  Download 
} from "lucide-react";
import { useReactFlow } from "reactflow";
import { useFlowStore } from "../store/flowStore";

const Toolbar: React.FC = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { undo, redo, canUndo, canRedo } = useFlowStore();

  return (
    <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center gap-2">
      {/* Undo/Redo */}
      <button
        onClick={undo}
        disabled={!canUndo()}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all text-sm text-slate-300
          flex items-center gap-2
        "
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={16} />
        Undo
      </button>
      <button
        onClick={redo}
        disabled={!canRedo()}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all text-sm text-slate-300
          flex items-center gap-2
        "
        title="Redo (Ctrl+Y)"
      >
        <Redo2 size={16} />
        Redo
      </button>

      <div className="w-px h-6 bg-slate-700 mx-2" />

      {/* Zoom Controls */}
      <button
        onClick={() => zoomOut()}
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-blue-500
          transition-all text-sm text-slate-300
          flex items-center gap-2
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
          transition-all text-sm text-slate-300
          flex items-center gap-2
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
          transition-all text-sm text-slate-300
          flex items-center gap-2
        "
        title="Fit View"
      >
        <Maximize2 size={16} />
        Fit
      </button>

      <div className="w-px h-6 bg-slate-700 mx-2" />

      {/* Actions */}
      <button
        className="
          px-4 py-1.5 rounded-md border border-blue-600
          bg-blue-600 hover:bg-blue-700
          transition-all text-sm text-white font-medium
          flex items-center gap-2
        "
        title="Test Flow"
      >
        <Play size={16} />
        Test Flow
      </button>

      <div className="flex-1" />

      {/* Right Side Actions */}
      <button
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-green-500
          transition-all text-sm text-slate-300
          flex items-center gap-2
        "
        title="Save Flow"
      >
        <Save size={16} />
        Save
      </button>
      <button
        className="
          px-3 py-1.5 rounded-md border border-slate-700
          hover:bg-slate-800 hover:border-purple-500
          transition-all text-sm text-slate-300
          flex items-center gap-2
        "
        title="Export Flow"
      >
        <Download size={16} />
        Export
      </button>
    </div>
  );
};

export default Toolbar;