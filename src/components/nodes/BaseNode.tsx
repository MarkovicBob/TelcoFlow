import * as Icons from "lucide-react";
import React from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import { useFlowStore } from "../../store/flowStore";
import type { NodeData } from "../../types/nodes";
import { NODE_DEFINITIONS } from "../../types/nodes";

// src/components/nodes/BaseNode.tsx

interface BaseNodeProps extends NodeProps<NodeData> {
  icon?: keyof typeof Icons;
  color?: string;
  hasInput?: boolean;
  hasOutput?: boolean;
  outputCount?: number;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  data,
  type,
  selected,
  id,
  hasInput = true,
  hasOutput = true,
  outputCount = 1,
}) => {
  const definition = NODE_DEFINITIONS[type as keyof typeof NODE_DEFINITIONS];
  const Icon = Icons[
    definition?.icon as keyof typeof Icons
  ] as React.ComponentType<{ size?: number }>;
  const color = definition?.color || "#3b82f6";

  // Check if node has validation errors/warnings
  const { validationErrors, validationWarnings } = useFlowStore();
  const hasError = validationErrors.some((err) => err.nodeId === id);
  const hasWarning = validationWarnings.some((warn) => warn.nodeId === id);

  // Determine border color based on validation state
  const borderColor = hasError ? "#ef4444" : hasWarning ? "#f59e0b" : color;

  return (
    <div
      className={`
        bg-slate-900 rounded-lg shadow-lg border-2 transition-all
        ${selected ? "ring-2 ring-blue-400 scale-105" : ""}
        ${hasError ? "animate-pulse" : ""}
      `}
      style={{ borderColor, minWidth: "200px" }}
    >
      {/* Input Handle */}
      {hasInput && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-blue-500! border-2! border-slate-900!"
        />
      )}

      {/* Header */}
      <div
        className="px-3 py-2 border-b border-slate-700 flex items-center gap-2 font-semibold text-sm"
        style={{ color }}
      >
        {Icon && <Icon size={16} />}
        <span className="uppercase tracking-wide">
          {definition?.label || type}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-3">
        <div className="text-sm font-medium text-slate-100 mb-1">
          {data.label}
        </div>
        {data.description && (
          <div className="text-xs text-slate-400">{data.description}</div>
        )}
      </div>

      {/* Output Handles */}
      {hasOutput && outputCount === 1 && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-blue-500! border-2! border-slate-900!"
        />
      )}
      {hasOutput && outputCount > 1 && (
        <div className="flex justify-around pb-1">
          {Array.from({ length: outputCount }).map((_, i) => (
            <Handle
              key={i}
              type="source"
              position={Position.Bottom}
              id={`output-${i}`}
              className="w-3 h-3 bg-blue-500! border-2! border-slate-900! relative!"
              style={{
                left: `${((i + 1) * 100) / (outputCount + 1)}%`,
                transform: "translateX(-50%)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
