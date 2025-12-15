import React from "react";
import type { NodeProps } from "reactflow";
import type { StartNodeData } from "../../types/nodes";
import { BaseNode } from "./BaseNode";

// src/components/nodes/StartNode.tsx

export const StartNode: React.FC<NodeProps<StartNodeData>> = (props) => {
  return <BaseNode {...props} hasInput={false} hasOutput={true} />;
};
