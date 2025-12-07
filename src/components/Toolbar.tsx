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
  const { undo, redo, canUndo, canRedo, nodes, edges } = useFlowStore();

  const handleTestFlow = () => {
    // Validation checks
    const errors: string[] = [];

    // Check if there are any nodes
    if (nodes.length === 0) {
      errors.push("❌ Flow is empty. Add nodes to begin.");
    } else {
      // Check for Start node
      const hasStart = nodes.some((node) => node.type === "start");
      if (!hasStart) {
        errors.push("❌ Missing Start node. Every flow must start with a Start node.");
      }

      // Check for End node
      const hasEnd = nodes.some((node) => node.type === "end");
      if (!hasEnd) {
        errors.push("❌ Missing End node. Every flow must end with an End node.");
      }

      // Check for unconnected nodes (dangling nodes)
      const connectedNodeIds = new Set<string>();
      edges.forEach((edge) => {
        connectedNodeIds.add(edge.source);
        connectedNodeIds.add(edge.target);
      });

      const unconnectedNodes = nodes.filter(
        (node) => !connectedNodeIds.has(node.id) && node.type !== "start"
      );

      if (unconnectedNodes.length > 0) {
        errors.push(
          `⚠️ ${unconnectedNodes.length} node(s) are not connected. All nodes must be part of the flow.`
        );
      }
    }

    // Show results
    if (errors.length === 0) {
      alert(
        `✅ Flow is valid!\n\n📊 Summary:\n- Nodes: ${nodes.length}\n- Connections: ${edges.length}\n\nYour flow looks good to go!`
      );
    } else {
      alert(`Flow Validation Results:\n\n${errors.join("\n")}`);
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
    </div>
  );
};

export default Toolbar;