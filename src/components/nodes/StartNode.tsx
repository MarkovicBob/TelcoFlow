// src/components/nodes/StartNode.tsx
import React from "react";
import type { NodeProps } from "reactflow";
import { BaseNode } from "./BaseNode";
import type { StartNodeData } from "../../types/nodes";

export const StartNode: React.FC<NodeProps<StartNodeData>> = (props) => {
  return <BaseNode {...props} hasInput={false} hasOutput={true} />;
};
