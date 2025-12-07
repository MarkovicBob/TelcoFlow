// src/components/nodes/DecisionNode.tsx
import React from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import { GitBranch } from "lucide-react";
import type { DecisionNodeData } from "../../types/nodes";
import { NODE_DEFINITIONS } from "../../types/nodes";

export const DecisionNode: React.FC<NodeProps<DecisionNodeData>> = ({
  data,
  selected,
}) => {
  const definition = NODE_DEFINITIONS.decision;
  const color = definition.color;

  return (
    <div
      className={`
        bg-slate-900 rounded-lg shadow-lg border-2 transition-all
        ${selected ? "ring-2 ring-blue-400 scale-105" : ""}
      `}
      style={{ borderColor: color, minWidth: "180px" }}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-slate-900"
      />

      {/* Header */}
      <div
        className="px-3 py-2 border-b border-slate-700 flex items-center gap-2 font-semibold text-sm"
        style={{ color }}
      >
        <GitBranch size={16} />
        <span className="uppercase tracking-wide">DECISION</span>
      </div>

      {/* Body */}
      <div className="px-3 py-3">
        <div className="text-sm font-medium text-slate-100 mb-1">{data.label}</div>
        {data.condition && (
          <div className="text-xs text-slate-400 font-mono">{data.condition.substring(0, 30)}...</div>
        )}
      </div>

      {/* Two Output Handles (True/False) */}
      <div className="flex justify-around pb-1">
        <div className="flex flex-col items-center">
          <span className="text-xs text-green-400 mb-1">{data.trueLabel || "Yes"}</span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="w-3 h-3 !bg-green-500 !border-2 !border-slate-900"
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-red-400 mb-1">{data.falseLabel || "No"}</span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="w-3 h-3 !bg-red-500 !border-2 !border-slate-900"
          />
        </div>
      </div>
    </div>
  );
};
