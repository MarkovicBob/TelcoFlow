import React from "react";
import type { NodeProps } from "reactflow";
import type { PlayMessageNodeData } from "../../types/nodes";
import { BaseNode } from "./BaseNode";

// src/components/nodes/PlayMessageNode.tsx

export const PlayMessageNode: React.FC<NodeProps<PlayMessageNodeData>> = (
  props
) => {
  return <BaseNode {...props} />;
};
