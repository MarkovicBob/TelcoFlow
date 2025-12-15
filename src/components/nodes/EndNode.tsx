import React from "react";
import type { NodeProps } from "reactflow";
import type { EndNodeData } from "../../types/nodes";
import { BaseNode } from "./BaseNode";

// src/components/nodes/EndNode.tsx

export const EndNode: React.FC<NodeProps<EndNodeData>> = (props) => {
  return <BaseNode {...props} hasInput={true} hasOutput={false} />;
};
