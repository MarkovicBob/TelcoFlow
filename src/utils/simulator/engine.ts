import type { Node } from "reactflow";
import type { NodeData } from "../../types/nodes";
import type { SimulatorEngine, SimulationState, SimulatorEngineOptions, NodeHandler } from "./types";
import { getNodeHandlers } from "./handlers";

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
  };

  const addLog = (entry: { nodeId: string; nodeType: string; message: string; data?: Record<string, unknown> }) => {
    state.logs.push({ timestamp: timestamp(), ...entry });
  };

  const getStartNode = () => nodes.find((n) => n.type === "start") || null;
  const getNodeById = (id: string | null) => (id ? nodes.find((n) => n.id === id) || null : null);

  let handlers: Record<string, NodeHandler> = {};

  const runHandler = async (node: Node<NodeData>) => {
    const type = node.type || "unknown";
    const handler = handlers[type];
    if (!handler) {
      addLog({ nodeId: node.id, nodeType: type, message: "No handler for node type" });
      return { nextNodeId: null };
    }
    return handler({ node, variables: state.variables, addLog });
  };

  const stepInternal = async () => {
    if (state.status === "completed" || state.status === "stopped") return;
    if (state.stepsExecuted >= state.maxSteps) {
      state.status = "error";
      addLog({ nodeId: state.currentNodeId || "-", nodeType: "system", message: "Max steps reached" });
      return;
    }

    const node = getNodeById(state.currentNodeId) || getStartNode();
    if (!node) {
      state.status = "error";
      addLog({ nodeId: "-", nodeType: "system", message: "No start node" });
      return;
    }

    state.currentNodeId = node.id;
    const result = await runHandler(node);

    if ("error" in result) {
      state.status = "error";
      addLog({ nodeId: node.id, nodeType: node.type || "unknown", message: result.error });
      return;
    }

    state.stepsExecuted += 1;
    const { nextNodeId } = result as { nextNodeId: string | null };
    if (!nextNodeId) {
      state.status = "completed";
    } else {
      state.currentNodeId = nextNodeId;
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
      };
    },
    start: async () => {
      state.status = "running";
      await stepInternal();
      while (state.status === "running" && state.currentNodeId && state.stepsExecuted < state.maxSteps) {
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
    },
    getState: () => state,
  };
}
