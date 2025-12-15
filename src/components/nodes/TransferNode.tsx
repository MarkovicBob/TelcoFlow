import React from "react";
import type { NodeProps } from "reactflow";
import type { TransferNodeData } from "../../types/nodes";
import { BaseNode } from "./BaseNode";

// src/components/nodes/TransferNode.tsx

export const TransferNode: React.FC<NodeProps<TransferNodeData>> = (props) => {
  const { data } = props;

  return (
    <BaseNode {...props}>
      {data.destination && (
        <div className="text-xs text-slate-400 mt-1">→ {data.destination}</div>
      )}
    </BaseNode>
  );
};
