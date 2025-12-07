// src/components/nodes/index.ts
export { StartNode } from "./StartNode";
export { EndNode } from "./EndNode";
export { IVRMenuNode } from "./IVRMenuNode";
export { TransferNode } from "./TransferNode";
export { QueueNode } from "./QueueNode";
export { PlayMessageNode } from "./PlayMessageNode";
export { DecisionNode } from "./DecisionNode";
export { GetInputNode } from "./GetInputNode";
export { APICallNode } from "./APICallNode";
export { RecordNode } from "./RecordNode";
export { WaitNode } from "./WaitNode";
export { SetVariableNode } from "./SetVariableNode";
export { BaseNode } from "./BaseNode";

// Node type mapping for ReactFlow
import { StartNode } from "./StartNode";
import { EndNode } from "./EndNode";
import { IVRMenuNode } from "./IVRMenuNode";
import { TransferNode } from "./TransferNode";
import { QueueNode } from "./QueueNode";
import { PlayMessageNode } from "./PlayMessageNode";
import { DecisionNode } from "./DecisionNode";
import { GetInputNode } from "./GetInputNode";
import { APICallNode } from "./APICallNode";
import { RecordNode } from "./RecordNode";
import { WaitNode } from "./WaitNode";
import { SetVariableNode } from "./SetVariableNode";

export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  ivr: IVRMenuNode,
  transfer: TransferNode,
  queue: QueueNode,
  playMessage: PlayMessageNode,
  getInput: GetInputNode,
  decision: DecisionNode,
  apiCall: APICallNode,
  record: RecordNode,
  wait: WaitNode,
  setVariable: SetVariableNode,
};
