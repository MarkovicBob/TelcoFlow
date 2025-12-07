// src/components/nodes/EndNode.tsx
import React from "react";
import type { NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";
import type { EndNodeData } from "../../types/nodes";

export const EndNode: React.FC<NodeProps<EndNodeData>> = (props) => {
  return <BaseNode {...props} hasInput={true} hasOutput={false} />;
};
