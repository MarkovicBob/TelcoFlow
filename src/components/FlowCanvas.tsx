import "reactflow/dist/style.css";
import React, { useCallback, useRef } from "react";
import { BarChart3, Menu } from "lucide-react";
import type { ReactFlowInstance } from "reactflow";
import { useFlowStore } from "../store/flowStore";
import type { NodeType } from "../types/nodes";
import { nodeTypes } from "./nodes";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
} from "reactflow";

interface FlowCanvasProps {
  onOpenSidebar?: () => void;
  onOpenSimulator?: () => void;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  onOpenSidebar,
  onOpenSimulator,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance | null>(null);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNodeMulti,
    clearSelection,
    copyNode,
    pasteNode,
    deleteNode,
    selectedNodes,
    undo,
    redo,
  } = useFlowStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        "application/reactflow"
      ) as NodeType;
      if (!type || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode(type, position);
    },
    [reactFlowInstance, addNode]
  );

  // Touch support for mobile drag-and-drop
  const onTouchMove = useCallback(() => {
    // Touch se kreće
  }, []);

  const onTouchEnd = useCallback(() => {
    // Handled via custom event from Sidebar
  }, []);

  // Suppress wheel and touch events to prevent passive listener warnings
  React.useEffect(() => {
    const element = reactFlowWrapper.current;
    if (!element) return;

    const preventPassive = (e: Event) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    element.addEventListener("touchmove", preventPassive, { passive: false });
    element.addEventListener("wheel", preventPassive, { passive: false });

    return () => {
      element.removeEventListener("touchmove", preventPassive);
      element.removeEventListener("wheel", preventPassive);
    };
  }, []);
  React.useEffect(() => {
    const handleCanvasDrop = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { nodeType, clientX, clientY } = customEvent.detail;

      if (!nodeType || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: clientX - reactFlowBounds.left,
        y: clientY - reactFlowBounds.top,
      });

      addNode(nodeType as NodeType, position);
    };

    // Listen on document level for custom drop events
    document.addEventListener("canvasDropNode", handleCanvasDrop);

    return () => {
      document.removeEventListener("canvasDropNode", handleCanvasDrop);
    };
  }, [reactFlowInstance, addNode]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: (typeof nodes)[0]) => {
      const isMultiSelect = event.shiftKey || event.ctrlKey || event.metaKey;
      selectNodeMulti(node.id, isMultiSelect);
    },
    [selectNodeMulti]
  );

  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // Keyboard shortcuts for copy/paste/undo/redo
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Undo
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        undo();
      }
      // Redo (Ctrl+Shift+Z or Ctrl+Y)
      else if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "y" || (event.key === "z" && event.shiftKey))
      ) {
        event.preventDefault();
        redo();
      }
      // Copy
      else if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        event.preventDefault();
        copyNode();
      }
      // Paste
      else if ((event.ctrlKey || event.metaKey) && event.key === "v") {
        event.preventDefault();
        if (reactFlowInstance && reactFlowWrapper.current) {
          // Paste at center of canvas
          const bounds = reactFlowWrapper.current.getBoundingClientRect();
          const centerX = bounds.width / 2;
          const centerY = bounds.height / 2;

          const position = reactFlowInstance.screenToFlowPosition({
            x: centerX,
            y: centerY,
          });

          pasteNode(position);
        }
      }
      // Delete
      else if (event.key === "Delete") {
        // Delete selected nodes
        if (selectedNodes && selectedNodes.length > 0) {
          event.preventDefault();
          selectedNodes.forEach((id) => deleteNode(id));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    undo,
    redo,
    copyNode,
    pasteNode,
    reactFlowInstance,
    deleteNode,
    selectedNodes,
  ]);

  return (
    <div
      ref={reactFlowWrapper}
      className="h-full w-full bg-slate-950 touch-manipulation overflow-hidden"
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: false,
          style: { stroke: "#64748b", strokeWidth: 2 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#1e293b"
        />
        <Controls
          className="bg-slate-800 border border-slate-700 rounded-lg"
          showInteractive={false}
        />
        <MiniMap
          className="hidden md:block bg-slate-900 border border-slate-700 rounded-lg"
          nodeColor={(node) => {
            const nodeType = node.type as NodeType;
            const colors: Record<string, string> = {
              start: "#22c55e",
              end: "#ef4444",
              ivr: "#3b82f6",
              transfer: "#8b5cf6",
              queue: "#f59e0b",
              playMessage: "#6366f1",
              getInput: "#ec4899",
              decision: "#f97316",
              apiCall: "#06b6d4",
              record: "#d946ef",
              wait: "#84cc16",
              setVariable: "#14b8a6",
            };
            return colors[nodeType] || "#3b82f6";
          }}
          maskColor="rgba(15, 23, 42, 0.8)"
        />

        {/* Info Panel */}
        <Panel
          position="top-left"
          className="bg-slate-900/90 border border-slate-700 rounded-lg px-4 py-2"
        >
          <div className="text-xs text-slate-400">
            <span className="font-medium text-slate-300">Nodes:</span>{" "}
            {nodes.length} |
            <span className="font-medium text-slate-300 ml-2">Edges:</span>{" "}
            {edges.length}
          </div>
        </Panel>

        {/* Mobile Hamburger Controls */}
        <Panel position="top-right" className="md:hidden flex gap-2">
          <button
            onClick={onOpenSidebar}
            className="bg-slate-900/90 border border-slate-700 rounded-lg p-2 hover:bg-slate-800"
            aria-label="Open node library"
          >
            <Menu size={20} className="text-slate-300" />
          </button>
          <button
            onClick={onOpenSimulator}
            className="bg-slate-900/90 border border-slate-700 rounded-lg p-2 hover:bg-slate-800"
            aria-label="Open simulator"
          >
            <BarChart3 size={20} className="text-slate-300" />
          </button>
        </Panel>

        {/* Delete Selected (touch-friendly) */}
        {selectedNodes && selectedNodes.length > 0 && (
          <Panel
            position="bottom-left"
            className="bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 md:mb-0 mb-2"
          >
            <button
              onClick={() => selectedNodes.forEach((id) => deleteNode(id))}
              className="text-xs bg-red-600 hover:bg-red-500 text-white rounded px-3 py-1"
              aria-label="Delete selected nodes"
            >
              Delete Selected ({selectedNodes.length})
            </button>
          </Panel>
        )}

        {/* Mobile MiniMap - Bottom Right Panel */}
        <Panel position="bottom-right" className="md:hidden">
          <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-2 w-32 h-24 overflow-hidden">
            <MiniMap
              className="w-full h-full"
              nodeColor={(node) => {
                const nodeType = node.type as NodeType;
                const colors: Record<string, string> = {
                  start: "#22c55e",
                  end: "#ef4444",
                  ivr: "#3b82f6",
                  transfer: "#8b5cf6",
                  queue: "#f59e0b",
                  playMessage: "#6366f1",
                  getInput: "#ec4899",
                  decision: "#f97316",
                  apiCall: "#06b6d4",
                  record: "#d946ef",
                  wait: "#84cc16",
                  setVariable: "#14b8a6",
                };
                return colors[nodeType] || "#3b82f6";
              }}
              maskColor="rgba(15, 23, 42, 0.8)"
              pannable
              zoomable
            />
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
