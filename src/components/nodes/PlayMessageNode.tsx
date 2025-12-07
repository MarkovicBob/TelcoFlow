// src/components/nodes/PlayMessageNode.tsx
import React from "react";
import type { NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";
import type { PlayMessageNodeData } from "../../types/nodes";

export const PlayMessageNode: React.FC<NodeProps<PlayMessageNodeData>> = (props) => {
  return <BaseNode {...props} />;
};
