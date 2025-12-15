import type { Edge, Node } from "reactflow";
import type { NodeData } from "../../types/nodes";

export type SimulatorStatus =
  | "idle"
  | "running"
  | "paused"
  | "stopped"
  | "completed"
  | "error";

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface SimulationLogEntry {
  timestamp: string;
  level: LogLevel;
  nodeId: string;
  nodeType: string;
  message: string;
  duration?: number; // milliseconds
  data?: Record<string, unknown>;
}

export interface VariableContext {
  // flat key-value store for simplicity; can extend to scoped later
  values: Record<string, unknown>;
}

export interface SimulationMetrics {
  totalDuration: number; // milliseconds
  nodeExecutionCount: Record<string, number>;
  errorCount: number;
  warningCount: number;
}

export interface SimulationState {
  status: SimulatorStatus;
  currentNodeId: string | null;
  stepsExecuted: number;
  maxSteps: number;
  variables: VariableContext;
  logs: SimulationLogEntry[];
  metrics: SimulationMetrics;
  startTime: number | null; // timestamp
  endTime: number | null; // timestamp
}

export type NodeHandler = (args: {
  node: Node<NodeData>;
  variables: VariableContext;
  addLog: (entry: Omit<SimulationLogEntry, "timestamp" | "duration">) => void;
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
