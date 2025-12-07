// src/components/nodes/SetVariableNode.tsx
import React from "react";
import type { NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";
import type { SetVariableNodeData } from "../../types/nodes";

export const SetVariableNode: React.FC<NodeProps<SetVariableNodeData>> = (props) => {
  const { data } = props;
  
  return (
    <BaseNode {...props}>
      {data && (
        <div className="text-xs text-slate-400 mt-1">
          ${"{" + data.variableName + "}"} = {data.value.substring(0, 20)}...
        </div>
      )}
    </BaseNode>
  );
};
