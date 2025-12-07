// src/components/nodes/RecordNode.tsx
import React from "react";
import type { NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";
import type { RecordNodeData } from "../../types/nodes";

export const RecordNode: React.FC<NodeProps<RecordNodeData>> = (props) => {
  const { data } = props;
  
  return (
    <BaseNode {...props}>
      {data && (
        <div className="text-xs text-slate-400 mt-1">
          Max: {data.maxDuration}s | Beep: {data.beep ? "Yes" : "No"} | Transcribe: {data.transcribe ? "Yes" : "No"}
        </div>
      )}
    </BaseNode>
  );
};
