// src/components/nodes/WaitNode.tsx
import React from "react";
import type { NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";
import type { WaitNodeData } from "../../types/nodes";

export const WaitNode: React.FC<NodeProps<WaitNodeData>> = (props) => {
  const { data } = props;
  
  return (
    <BaseNode {...props}>
      {data && (
        <div className="text-xs text-slate-400 mt-1">
          Duration: {data.duration} {data.unit}
        </div>
      )}
    </BaseNode>
  );
};
