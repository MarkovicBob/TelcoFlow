import type { Node } from "reactflow";
import type { NodeData } from "../../types/nodes";
import { getNodeHandlers } from "./handlers";

import type {
  NodeHandler,
  SimulationState,
  SimulatorEngine,
  SimulatorEngineOptions,
} from "./types";

const timestamp = () => new Date().toISOString();

export function createSimulatorEngine(): SimulatorEngine {
  let nodes: Node<NodeData>[] = [];
  let state: SimulationState = {
    status: "idle",
    currentNodeId: null,
    stepsExecuted: 0,
    maxSteps: 500,
    variables: { values: {} },
    logs: [],
    metrics: {
      totalDuration: 0,
      nodeExecutionCount: {},
      errorCount: 0,
      warningCount: 0,
    },
    startTime: null,
    endTime: null,
  };

  const addLog = (
    entry: {
      level: "info" | "warn" | "error" | "debug";
      nodeId: string;
      nodeType: string;
      message: string;
      data?: Record<string, unknown>;
    },
    duration?: number
  ) => {
    state.logs.push({ timestamp: timestamp(), duration, ...entry });
    if (entry.level === "error") state.metrics.errorCount++;
    if (entry.level === "warn") state.metrics.warningCount++;
  };

  const getStartNode = () => nodes.find((n) => n.type === "start") || null;
  const getNodeById = (id: string | null) =>
    id ? nodes.find((n) => n.id === id) || null : null;

  let handlers: Record<string, NodeHandler> = {};

  const runHandler = async (node: Node<NodeData>) => {
    const type = node.type || "unknown";
    const handler = handlers[type];
    if (!handler) {
      addLog({
        level: "error",
        nodeId: node.id,
        nodeType: type,
        message: "No handler for node type",
      });
      return { nextNodeId: null };
    }
    const startTime = performance.now();
    const result = await handler({ node, variables: state.variables, addLog });
    const duration = performance.now() - startTime;

    // Update metrics
    state.metrics.nodeExecutionCount[type] =
      (state.metrics.nodeExecutionCount[type] || 0) + 1;

    return { ...result, duration };
  };

  const stepInternal = async () => {
    if (state.status === "completed" || state.status === "stopped") return;
    if (state.stepsExecuted >= state.maxSteps) {
      state.status = "error";
      addLog({
        level: "error",
        nodeId: state.currentNodeId || "-",
        nodeType: "system",
        message: `⏱️ Max steps (${state.maxSteps}) reached - mogućna beskonačna petlja u flow-u`,
      });
      return;
    }

    const node = getNodeById(state.currentNodeId) || getStartNode();
    if (!node) {
      state.status = "error";
      addLog({
        level: "error",
        nodeId: "-",
        nodeType: "system",
        message: "❌ Nema START noda - flow mora da počne sa START nodom",
      });
      return;
    }

    state.currentNodeId = node.id;
    try {
      const result = await runHandler(node);

      if ("error" in result) {
        state.status = "error";
        addLog(
          {
            level: "error",
            nodeId: node.id,
            nodeType: node.type || "unknown",
            message: `❌ ${result.error}`,
          },
          (result as { duration?: number }).duration
        );
        return;
      }

      state.stepsExecuted += 1;
      const { nextNodeId } = result as {
        nextNodeId: string | null;
        duration?: number;
      };
      if (!nextNodeId) {
        state.status = "completed";
        state.endTime = Date.now();
        if (state.startTime) {
          state.metrics.totalDuration = state.endTime - state.startTime;
        }
      } else {
        state.currentNodeId = nextNodeId;
      }
    } catch (err) {
      state.status = "error";
      const message = err instanceof Error ? err.message : String(err);
      addLog({
        level: "error",
        nodeId: node.id,
        nodeType: node.type || "unknown",
        message: `❌ Greška u nodu: ${message}`,
      });
    }
  };

  return {
    init: (n, e, options?: SimulatorEngineOptions) => {
      nodes = n;
      handlers = getNodeHandlers(e);
      state = {
        status: "idle",
        currentNodeId: null,
        stepsExecuted: 0,
        maxSteps: options?.maxSteps ?? 500,
        variables: { values: {} },
        logs: [],
        metrics: {
          totalDuration: 0,
          nodeExecutionCount: {},
          errorCount: 0,
          warningCount: 0,
        },
        startTime: null,
        endTime: null,
      };
    },
    start: async () => {
      state.status = "running";
      state.startTime = Date.now();
      await stepInternal();
      while (
        state.status === "running" &&
        state.currentNodeId &&
        state.stepsExecuted < state.maxSteps
      ) {
        await stepInternal();
      }
    },
    pause: () => {
      if (state.status === "running") state.status = "paused";
    },
    resume: async () => {
      if (state.status === "paused") {
        state.status = "running";
        await stepInternal();
      }
    },
    step: async () => {
      if (state.status === "idle" || state.status === "paused") {
        state.status = "running";
        await stepInternal();
        if (state.status === "running") state.status = "paused"; // single step
      }
    },
    reset: () => {
      const start = getStartNode();
      state.currentNodeId = start ? start.id : null;
      state.stepsExecuted = 0;
      state.status = "idle";
      state.variables = { values: {} };
      state.logs = [];
      state.metrics = {
        totalDuration: 0,
        nodeExecutionCount: {},
        errorCount: 0,
        warningCount: 0,
      };
      state.startTime = null;
      state.endTime = null;
    },
    getState: () => state,
  };
}
