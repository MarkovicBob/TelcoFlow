import React from "react";
import type { NodeProps } from "reactflow";
import type { QueueNodeData } from "../../types/nodes";
import { BaseNode } from "./BaseNode";

// src/components/nodes/QueueNode.tsx

export const QueueNode: React.FC<NodeProps<QueueNodeData>> = (props) => {
  const { data } = props;

  return (
    <BaseNode {...props}>
      {data.queueName && (
        <div className="text-xs text-slate-400 mt-1">
          Queue: {data.queueName} | Max: {data.maxWaitTime}s
        </div>
      )}
    </BaseNode>
  );
};
