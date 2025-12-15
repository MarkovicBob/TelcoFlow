import * as Icons from "lucide-react";
import React, { useRef } from "react";
import { NODE_DEFINITIONS } from "../types/nodes";
import type { NodeType } from "../types/nodes";

// src/components/Sidebar.tsx

const Sidebar: React.FC = () => {
  const touchTrackingRef = useRef<{
    active: boolean;
    nodeType: NodeType | null;
  }>({
    active: false,
    nodeType: null,
  });

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Touch support for mobile drag-and-drop
  const onTouchStart = (_event: React.TouchEvent, nodeType: NodeType) => {
    touchTrackingRef.current.active = true;
    touchTrackingRef.current.nodeType = nodeType;
    sessionStorage.setItem("dragNodeType", nodeType);
  };

  // Global touch end handler
  React.useEffect(() => {
    const handleGlobalTouchEnd = (event: TouchEvent) => {
      if (
        !touchTrackingRef.current.active ||
        !touchTrackingRef.current.nodeType
      ) {
        return;
      }

      const touch = event.changedTouches[0];
      if (!touch) return;

      // Find the canvas element by checking if touch ended over it
      const canvasElement = document.querySelector(
        "[class*='react-flow']"
      ) as HTMLElement;
      if (!canvasElement) {
        touchTrackingRef.current.active = false;
        touchTrackingRef.current.nodeType = null;
        return;
      }

      const bounds = canvasElement.getBoundingClientRect();
      const x = touch.clientX;
      const y = touch.clientY;

      // Check if touch ended inside canvas bounds
      if (
        x >= bounds.left &&
        x <= bounds.right &&
        y >= bounds.top &&
        y <= bounds.bottom
      ) {
        const nodeType = touchTrackingRef.current.nodeType;

        // Dispatch event on document for global listen
        const dropEvent = new CustomEvent("canvasDropNode", {
          detail: {
            nodeType,
            x: x - bounds.left,
            y: y - bounds.top,
            clientX: x,
            clientY: y,
          },
          bubbles: true,
        });
        document.dispatchEvent(dropEvent);
      }

      sessionStorage.removeItem("dragNodeType");
      touchTrackingRef.current.active = false;
      touchTrackingRef.current.nodeType = null;
    };

    document.addEventListener("touchend", handleGlobalTouchEnd, false);
    return () => {
      document.removeEventListener("touchend", handleGlobalTouchEnd, false);
    };
  }, []);

  // Group nodes by category
  const nodesByCategory = Object.values(NODE_DEFINITIONS).reduce(
    (acc, node) => {
      if (!acc[node.category]) {
        acc[node.category] = [];
      }
      acc[node.category].push(node);
      return acc;
    },
    {} as Record<string, (typeof NODE_DEFINITIONS)[NodeType][]>
  );

  const categoryLabels = {
    control: "Control Flow",
    interaction: "User Interaction",
    routing: "Call Routing",
    integration: "Integration",
    utility: "Utilities",
  };

  return (
    <div className="w-full md:w-72 bg-slate-900/60 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Node Library
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(nodesByCategory).map(([category, nodes]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h3>
            <div className="space-y-2">
              {nodes.map((node) => {
                const Icon = Icons[
                  node.icon as keyof typeof Icons
                ] as React.ComponentType<{ size?: number }>;
                return (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, node.type)}
                    onTouchStart={(e) => onTouchStart(e, node.type)}
                    className="
                      group cursor-grab active:cursor-grabbing
                      bg-slate-800/50 hover:bg-slate-800 
                      border border-slate-700 hover:border-slate-600
                      rounded-lg px-3 py-2.5
                      transition-all duration-200
                      hover:scale-[1.02] hover:shadow-lg
                      touch-none
                    "
                    style={{
                      borderLeftWidth: "3px",
                      borderLeftColor: node.color,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-900"
                        style={{ color: node.color }}
                      >
                        {Icon && <Icon size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-100">
                          {node.label}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {node.description}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">
          <p className="mb-1">💡 Drag nodes to the canvas</p>
          <p>⌨️ Use Ctrl+Z/Y for undo/redo</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
