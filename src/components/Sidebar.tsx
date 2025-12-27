import * as Icons from "lucide-react";
import React, { useRef } from "react";
import { NODE_DEFINITIONS } from "../types/nodes";
import type { NodeType } from "../types/nodes";

// src/components/Sidebar.tsx

const Sidebar: React.FC = () => {
  const touchTrackingRef = useRef<{
    active: boolean;
    nodeType: NodeType | null;
    longPressTimer: number | null;
    dragGhostEl: HTMLElement | null;
  }>({
    active: false,
    nodeType: null,
    longPressTimer: null,
    dragGhostEl: null,
  });

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Touch support for mobile drag-and-drop
  const onTouchStart = (event: React.TouchEvent, nodeType: NodeType) => {
    // Long-press to start drag (prevents accidental taps)
    if (touchTrackingRef.current.longPressTimer) {
      window.clearTimeout(touchTrackingRef.current.longPressTimer);
      touchTrackingRef.current.longPressTimer = null;
    }

    const startTouch = event.touches[0];
    const startX = startTouch?.clientX ?? 0;
    const startY = startTouch?.clientY ?? 0;

    touchTrackingRef.current.longPressTimer = window.setTimeout(() => {
      touchTrackingRef.current.active = true;
      touchTrackingRef.current.nodeType = nodeType;
      sessionStorage.setItem("dragNodeType", nodeType);

      // Create drag ghost element to visualize dragging on mobile
      const ghost = document.createElement("div");
      ghost.style.position = "fixed";
      ghost.style.left = `${startX - 24}px`;
      ghost.style.top = `${startY - 24}px`;
      ghost.style.width = "48px";
      ghost.style.height = "48px";
      ghost.style.borderRadius = "10px";
      ghost.style.background = "#0f172a";
      ghost.style.border = "2px solid #3b82f6";
      ghost.style.boxShadow = "0 8px 20px rgba(0,0,0,0.45)";
      ghost.style.zIndex = "9999";
      ghost.style.opacity = "0.9";
      ghost.style.pointerEvents = "none";
      ghost.style.transition = "transform 0.05s linear";
      ghost.style.display = "flex";
      ghost.style.alignItems = "center";
      ghost.style.justifyContent = "center";
      ghost.style.color = "#3b82f6";
      ghost.style.fontSize = "11px";
      ghost.textContent = "Drag";
      document.body.appendChild(ghost);
      touchTrackingRef.current.dragGhostEl = ghost;
    }, 220); // ~220ms long-press
  };

  // Global touch end handler
  React.useEffect(() => {
    const handleGlobalTouchMove = (event: TouchEvent) => {
      if (!touchTrackingRef.current.active) return;
      const touch = event.touches[0];
      if (!touch) return;
      const ghost = touchTrackingRef.current.dragGhostEl;
      if (ghost) {
        ghost.style.left = `${touch.clientX - 24}px`;
        ghost.style.top = `${touch.clientY - 24}px`;
      }
      // prevent scrolling while dragging
      if (event.cancelable) event.preventDefault();
    };

    const handleGlobalTouchEnd = (event: TouchEvent) => {
      if (
        !touchTrackingRef.current.active ||
        !touchTrackingRef.current.nodeType
      ) {
        // Clear any pending timer
        if (touchTrackingRef.current.longPressTimer) {
          window.clearTimeout(touchTrackingRef.current.longPressTimer);
          touchTrackingRef.current.longPressTimer = null;
        }
        return;
      }

      const touch = event.changedTouches[0];
      if (!touch) return;

      // Always dispatch drop using screen coordinates; FlowCanvas will resolve position
      const nodeType = touchTrackingRef.current.nodeType;
      const dropEvent = new CustomEvent("canvasDropNode", {
        detail: {
          nodeType,
          clientX: touch.clientX,
          clientY: touch.clientY,
        },
        bubbles: true,
      });
      document.dispatchEvent(dropEvent);

      sessionStorage.removeItem("dragNodeType");
      touchTrackingRef.current.active = false;
      touchTrackingRef.current.nodeType = null;
      if (touchTrackingRef.current.dragGhostEl) {
        touchTrackingRef.current.dragGhostEl.remove();
        touchTrackingRef.current.dragGhostEl = null;
      }
    };

    const handleTouchCancel = () => {
      if (touchTrackingRef.current.longPressTimer) {
        window.clearTimeout(touchTrackingRef.current.longPressTimer);
        touchTrackingRef.current.longPressTimer = null;
      }
      if (touchTrackingRef.current.dragGhostEl) {
        touchTrackingRef.current.dragGhostEl.remove();
        touchTrackingRef.current.dragGhostEl = null;
      }
      touchTrackingRef.current.active = false;
      touchTrackingRef.current.nodeType = null;
      sessionStorage.removeItem("dragNodeType");
    };

    document.addEventListener("touchmove", handleGlobalTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleGlobalTouchEnd, false);
    document.addEventListener("touchcancel", handleTouchCancel, false);
    return () => {
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalTouchEnd, false);
      document.removeEventListener("touchcancel", handleTouchCancel, false);
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
