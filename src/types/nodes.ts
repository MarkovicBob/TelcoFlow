// src/types/nodes.ts

export type NodeType =
  | "start"
  | "end"
  | "ivr"
  | "transfer"
  | "queue"
  | "playMessage"
  | "getInput"
  | "decision"
  | "apiCall"
  | "record"
  | "wait"
  | "setVariable";

export interface BaseNodeData {
  label: string;
  description?: string;
}

export interface StartNodeData extends BaseNodeData {
  trigger: "inbound" | "outbound" | "scheduled";
}

export interface EndNodeData extends BaseNodeData {
  reason?: string;
  dispositionCode?: string;
}

export interface IVRMenuNodeData extends BaseNodeData {
  audioType: "tts" | "file";
  audioFile?: string;
  ttsText?: string;
  options: Array<{
    key: string;
    label: string;
    targetId?: string;
  }>;
  timeout: number;
  maxRetries: number;
  invalidInputMessage?: string;
  noInputMessage?: string;
}

export interface TransferNodeData extends BaseNodeData {
  transferType: "warm" | "cold" | "attended";
  destination: string;
  timeout?: number;
}

export interface QueueNodeData extends BaseNodeData {
  queueName: string;
  priority: "low" | "normal" | "high" | "urgent";
  maxWaitTime: number;
  holdMusic?: string;
  positionAnnouncement: boolean;
}

export interface PlayMessageNodeData extends BaseNodeData {
  audioType: "tts" | "file";
  audioFile?: string;
  ttsText?: string;
  language?: string;
}

export interface GetInputNodeData extends BaseNodeData {
  inputType: "dtmf" | "speech" | "both";
  minLength?: number;
  maxLength?: number;
  timeout: number;
  terminatorKey?: string;
  variableName: string;
}

export interface DecisionNodeData extends BaseNodeData {
  condition: string;
  trueLabel?: string;
  falseLabel?: string;
}

export interface APICallNodeData extends BaseNodeData {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: string;
  responseMapping?: Record<string, string>;
  timeout: number;
}

export interface RecordNodeData extends BaseNodeData {
  maxDuration: number;
  beep: boolean;
  transcribe: boolean;
}

export interface WaitNodeData extends BaseNodeData {
  duration: number;
  unit: "seconds" | "minutes";
}

export interface SetVariableNodeData extends BaseNodeData {
  variableName: string;
  value: string;
  valueType: "string" | "number" | "boolean" | "expression";
}

export type NodeData =
  | StartNodeData
  | EndNodeData
  | IVRMenuNodeData
  | TransferNodeData
  | QueueNodeData
  | PlayMessageNodeData
  | GetInputNodeData
  | DecisionNodeData
  | APICallNodeData
  | RecordNodeData
  | WaitNodeData
  | SetVariableNodeData;

export interface NodeDefinition {
  type: NodeType;
  label: string;
  icon: string;
  color: string;
  description: string;
  category: "control" | "interaction" | "routing" | "integration" | "utility";
}

export const NODE_DEFINITIONS: Record<NodeType, NodeDefinition> = {
  start: {
    type: "start",
    label: "Start",
    icon: "PlayCircle",
    color: "#22c55e",
    description: "Entry point for the call flow",
    category: "control",
  },
  end: {
    type: "end",
    label: "End",
    icon: "XCircle",
    color: "#ef4444",
    description: "Terminate the call",
    category: "control",
  },
  ivr: {
    type: "ivr",
    label: "IVR Menu",
    icon: "Menu",
    color: "#3b82f6",
    description: "Interactive voice menu with DTMF options",
    category: "interaction",
  },
  transfer: {
    type: "transfer",
    label: "Transfer",
    icon: "PhoneForwarded",
    color: "#8b5cf6",
    description: "Transfer call to another destination",
    category: "routing",
  },
  queue: {
    type: "queue",
    label: "Queue",
    icon: "Users",
    color: "#f59e0b",
    description: "Place caller in hold queue",
    category: "routing",
  },
  playMessage: {
    type: "playMessage",
    label: "Play Message",
    icon: "Volume2",
    color: "#6366f1",
    description: "Play audio message or TTS",
    category: "interaction",
  },
  getInput: {
    type: "getInput",
    label: "Get Input",
    icon: "Keyboard",
    color: "#ec4899",
    description: "Collect DTMF or speech input",
    category: "interaction",
  },
  decision: {
    type: "decision",
    label: "Decision",
    icon: "GitBranch",
    color: "#f97316",
    description: "Conditional routing based on logic",
    category: "control",
  },
  apiCall: {
    type: "apiCall",
    label: "API Call",
    icon: "Plug",
    color: "#06b6d4",
    description: "Call external API endpoint",
    category: "integration",
  },
  record: {
    type: "record",
    label: "Record",
    icon: "Mic",
    color: "#d946ef",
    description: "Record call audio",
    category: "utility",
  },
  wait: {
    type: "wait",
    label: "Wait",
    icon: "Clock",
    color: "#84cc16",
    description: "Pause execution for specified time",
    category: "utility",
  },
  setVariable: {
    type: "setVariable",
    label: "Set Variable",
    icon: "FileEdit",
    color: "#14b8a6",
    description: "Store value in variable",
    category: "utility",
  },
};
