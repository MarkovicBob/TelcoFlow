// src/components/nodes/GetInputNode.tsx
import React from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import { Keyboard } from "lucide-react";
import type { GetInputNodeData } from "../../types/nodes";
import { NODE_DEFINITIONS } from "../../types/nodes";

export const GetInputNode: React.FC<NodeProps<GetInputNodeData>> = ({
  data,
  selected,
}) => {
  const definition = NODE_DEFINITIONS.getInput;
  const color = definition.color;

  return (
    <div
      className={`
        bg-slate-900 rounded-lg shadow-lg border-2 transition-all
        ${selected ? "ring-2 ring-blue-400 scale-105" : ""}
      `}
      style={{ borderColor: color, minWidth: "200px" }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2! border-slate-900!"
      />

      <div
        className="px-3 py-2 border-b border-slate-700 flex items-center gap-2 font-semibold text-sm"
        style={{ color }}
      >
        <Keyboard size={16} />
        <span className="uppercase tracking-wide">GET INPUT</span>
      </div>

      <div className="px-3 py-3">
        <div className="text-sm font-medium text-slate-100 mb-1">{data.label}</div>
        <div className="text-xs text-slate-400">
          Type: {data.inputType} | Timeout: {data.timeout}s
        </div>
        {data.variableName && (
          <div className="text-xs text-slate-500 mt-1">
            Saves to: ${"{data.variableName}"}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2! border-slate-900!"
      />
    </div>
  );
};
