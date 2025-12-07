// src/components/FlowCanvas.tsx
import "reactflow/dist/style.css";
import React, { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
} from "reactflow";
import type { ReactFlowInstance } from "reactflow";
import { useFlowStore } from "../store/flowStore";
import { nodeTypes } from "./nodes";
import type { NodeType } from "../types/nodes";

const FlowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
  } = useFlowStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow") as NodeType;
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

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: typeof nodes[0]) => {
      selectNode(node);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div ref={reactFlowWrapper} className="h-full w-full bg-slate-950">
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
          className="bg-slate-900 border border-slate-700 rounded-lg"
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
        <Panel position="top-left" className="bg-slate-900/90 border border-slate-700 rounded-lg px-4 py-2">
          <div className="text-xs text-slate-400">
            <span className="font-medium text-slate-300">Nodes:</span> {nodes.length} | 
            <span className="font-medium text-slate-300 ml-2">Edges:</span> {edges.length}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
