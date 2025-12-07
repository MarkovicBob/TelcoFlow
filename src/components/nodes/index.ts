// src/components/nodes/index.ts
export { StartNode } from "./StartNode";
export { EndNode } from "./EndNode";
export { IVRMenuNode } from "./IVRMenuNode";
export { TransferNode } from "./TransferNode";
export { QueueNode } from "./QueueNode";
export { PlayMessageNode } from "./PlayMessageNode";
export { DecisionNode } from "./DecisionNode";
export { BaseNode } from "./BaseNode";

// Node type mapping for ReactFlow
import { StartNode } from "./StartNode";
import { EndNode } from "./EndNode";
import { IVRMenuNode } from "./IVRMenuNode";
import { TransferNode } from "./TransferNode";
import { QueueNode } from "./QueueNode";
import { PlayMessageNode } from "./PlayMessageNode";
import { DecisionNode } from "./DecisionNode";
import { BaseNode } from "./BaseNode";

export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  ivr: IVRMenuNode,
  transfer: TransferNode,
  queue: QueueNode,
  playMessage: PlayMessageNode,
  getInput: BaseNode,
  decision: DecisionNode,
  apiCall: BaseNode,
  record: BaseNode,
  wait: BaseNode,
  setVariable: BaseNode,
};
