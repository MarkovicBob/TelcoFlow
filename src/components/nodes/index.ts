import { APICallNode } from "./APICallNode";
import { DecisionNode } from "./DecisionNode";
import { EndNode } from "./EndNode";
import { GetInputNode } from "./GetInputNode";
import { IVRMenuNode } from "./IVRMenuNode";
import { PlayMessageNode } from "./PlayMessageNode";
import { QueueNode } from "./QueueNode";
import { RecordNode } from "./RecordNode";
import { SetVariableNode } from "./SetVariableNode";
import { StartNode } from "./StartNode";
import { TransferNode } from "./TransferNode";
import { WaitNode } from "./WaitNode";

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
