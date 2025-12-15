import type { Edge, Node } from "reactflow";
import type { NodeData } from "../../types/nodes";

export type SimulatorStatus =
  | "idle"
  | "running"
  | "paused"
  | "stopped"
  | "completed"
  | "error";

export interface SimulationLogEntry {
  timestamp: string;
  nodeId: string;
  nodeType: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface VariableContext {
  // flat key-value store for simplicity; can extend to scoped later
  values: Record<string, unknown>;
}

export interface SimulationState {
  status: SimulatorStatus;
  currentNodeId: string | null;
  stepsExecuted: number;
  maxSteps: number;
  variables: VariableContext;
  logs: SimulationLogEntry[];
}

export type NodeHandler = (args: {
  node: Node<NodeData>;
  variables: VariableContext;
  addLog: (entry: Omit<SimulationLogEntry, "timestamp">) => void;
}) => Promise<{ nextNodeId: string | null } | { error: string }>;

export interface SimulatorEngineOptions {
  maxSteps?: number;
}

export interface SimulatorEngine {
  init: (
    nodes: Node<NodeData>[],
    edges: Edge[],
    options?: SimulatorEngineOptions
  ) => void;
  start: () => Promise<void>;
  pause: () => void;
  resume: () => Promise<void>;
  step: () => Promise<void>;
  reset: () => void;
  getState: () => SimulationState;
}
