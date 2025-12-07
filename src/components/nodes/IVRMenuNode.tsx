// src/components/nodes/IVRMenuNode.tsx
import React from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import { Menu } from "lucide-react";
import type { IVRMenuNodeData } from "../../types/nodes";
import { NODE_DEFINITIONS } from "../../types/nodes";

export const IVRMenuNode: React.FC<NodeProps<IVRMenuNodeData>> = ({
  data,
  selected,
}) => {
  const definition = NODE_DEFINITIONS.ivr;
  const color = definition.color;
  const outputCount = data.options?.length || 2;

  return (
    <div
      className={`
        bg-slate-900 rounded-lg shadow-lg border-2 transition-all
        ${selected ? "ring-2 ring-blue-400 scale-105" : ""}
      `}
      style={{ borderColor: color, minWidth: "220px" }}
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
        <Menu size={16} />
        <span className="uppercase tracking-wide">IVR MENU</span>
      </div>

      {/* Body */}
      <div className="px-3 py-3">
        <div className="text-sm font-medium text-slate-100 mb-1">{data.label}</div>
        {data.ttsText && (
          <div className="text-xs text-slate-400 mb-2 italic">"{data.ttsText.substring(0, 40)}..."</div>
        )}
        <div className="text-xs text-slate-500">
          Options: {outputCount} | Timeout: {data.timeout}s
        </div>
      </div>

      {/* Multiple Output Handles */}
      <div className="relative pb-1">
        {data.options?.map((option, i) => (
          <Handle
            key={option.key}
            type="source"
            position={Position.Bottom}
            id={`output-${option.key}`}
            className="w-3 h-3 !bg-blue-500 !border-2 !border-slate-900"
            style={{
              left: `${((i + 1) * 100) / (outputCount + 1)}%`,
              transform: "translateX(-50%)",
            }}
          />
        ))}
      </div>
    </div>
  );
};
