// src/utils/simulator/handlers.ts
import type { NodeHandler } from "./types";
import { evaluateExpression } from "./evaluator";
import type { Edge } from "reactflow";

export const getNodeHandlers = (edges: Edge[]): Record<string, NodeHandler> => ({
  start: async ({ node, addLog }) => {
    addLog({ nodeId: node.id, nodeType: node.type || "start", message: "Flow started" });
    const edge = edges.find((e) => e.source === node.id);
    return { nextNodeId: edge ? edge.target : null };
  },

  end: async ({ node, addLog }) => {
    addLog({ nodeId: node.id, nodeType: node.type || "end", message: "Flow ended" });
    return { nextNodeId: null };
  },

  "set-variable": async ({ node, variables, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const varName = data?.variableName ?? "unknown";
    const value = data?.value ?? "";
    variables.values[String(varName)] = value;
    addLog({
      nodeId: node.id,
      nodeType: node.type || "set-variable",
      message: `Set ${varName} = ${JSON.stringify(value)}`,
      data: { varName, value },
    });
    const edge = edges.find((e) => e.source === node.id);
    return { nextNodeId: edge ? edge.target : null };
  },

  decision: async ({ node, variables, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const condition = (data?.condition as string) || "true";
    const result = evaluateExpression(condition, { variables: variables.values });
    const isTrue = Boolean(result);

    const decisionEdges = edges.filter((e) => e.source === node.id);
    const nextEdge =
      decisionEdges.find((e) => e.label === (isTrue ? "true" : "false")) ||
      decisionEdges.find((e) => e.label === (isTrue ? "Yes" : "No")) ||
      decisionEdges[isTrue ? 0 : 1] ||
      decisionEdges[0];

    addLog({
      nodeId: node.id,
      nodeType: node.type || "decision",
      message: `Decision: "${condition}" => ${isTrue}`,
      data: { condition, result: isTrue },
    });

    return { nextNodeId: nextEdge ? nextEdge.target : null };
  },

  ivr: async ({ node, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const prompt = (data?.prompt as string) || "IVR";
    addLog({ nodeId: node.id, nodeType: node.type || "ivr", message: `IVR: ${prompt}` });
    const edge = edges.find((e) => e.source === node.id);
    return { nextNodeId: edge ? edge.target : null };
  },

  queue: async ({ node, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const holdMusic = (data?.holdMusic as string) || "default";
    addLog({ nodeId: node.id, nodeType: node.type || "queue", message: `Queue with hold music: ${holdMusic}` });
    const edge = edges.find((e) => e.source === node.id);
    return { nextNodeId: edge ? edge.target : null };
  },

  "api-call": async ({ node, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const endpoint = (data?.endpoint as string) || "http://localhost";
    addLog({
      nodeId: node.id,
      nodeType: node.type || "api-call",
      message: `API Call to: ${endpoint} (simulated)`,
      data: { endpoint },
    });
    const edge = edges.find((e) => e.source === node.id);
    return { nextNodeId: edge ? edge.target : null };
  },

  "get-input": async ({ node, variables, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const inputType = (data?.inputType as string) || "dtmf";
    addLog({
      nodeId: node.id,
      nodeType: node.type || "get-input",
      message: `Get input (${inputType}) - using mock value`,
    });
    // Mock: set a variable with input
    variables.values["last_input"] = "1"; // Mock input
    const edge = edges.find((e) => e.source === node.id);
    return { nextNodeId: edge ? edge.target : null };
  },

  wait: async ({ node, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const duration = (data?.duration as number) || 1;
    addLog({
      nodeId: node.id,
      nodeType: node.type || "wait",
      message: `Wait for ${duration} seconds`,
    });
    const edge = edges.find((e) => e.source === node.id);
    return { nextNodeId: edge ? edge.target : null };
  },

  record: async ({ node, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const maxDuration = (data?.maxDuration as number) || 10;
    addLog({
      nodeId: node.id,
      nodeType: node.type || "record",
      message: `Record call (max ${maxDuration}s) - simulated`,
    });
    const edge = edges.find((e) => e.source === node.id);
    return { nextNodeId: edge ? edge.target : null };
  },
});
