import type { Edge } from "reactflow";
import { evaluateExpression } from "./evaluator";
import type { NodeHandler } from "./types";

// src/utils/simulator/handlers.ts

export const getNodeHandlers = (edges: Edge[]): Record<string, NodeHandler> => {
  const getSingleNext = (nodeId: string) => {
    const edge = edges.find((e) => e.source === nodeId);
    return edge ? edge.target : null;
  };

  const startHandler: NodeHandler = async ({ node, addLog }) => {
    addLog({
      level: "info",
      nodeId: node.id,
      nodeType: node.type || "start",
      message: "Flow started",
    });
    return { nextNodeId: getSingleNext(node.id) };
  };

  const endHandler: NodeHandler = async ({ node, addLog }) => {
    addLog({
      level: "info",
      nodeId: node.id,
      nodeType: node.type || "end",
      message: "Flow ended",
    });
    return { nextNodeId: null };
  };

  const setVariableHandler: NodeHandler = async ({
    node,
    variables,
    addLog,
  }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const varName = data?.variableName ?? "unknown";
    const value = data?.value ?? "";
    variables.values[String(varName)] = value;
    addLog({
      level: "info",
      nodeId: node.id,
      nodeType: node.type || "set-variable",
      message: `Set ${varName} = ${JSON.stringify(value)}`,
      data: { varName, value },
    });
    return { nextNodeId: getSingleNext(node.id) };
  };

  const decisionHandler: NodeHandler = async ({ node, variables, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const condition = (data?.condition as string) || "true";
    const result = evaluateExpression(condition, {
      variables: variables.values,
    });
    const isTrue = Boolean(result);

    const decisionEdges = edges.filter((e) => e.source === node.id);
    const nextEdge =
      decisionEdges.find((e) => e.label === (isTrue ? "true" : "false")) ||
      decisionEdges.find((e) => e.label === (isTrue ? "Yes" : "No")) ||
      decisionEdges[isTrue ? 0 : 1] ||
      decisionEdges[0];

    addLog({
      level: "info",
      nodeId: node.id,
      nodeType: node.type || "decision",
      message: `Decision: "${condition}" => ${isTrue}`,
      data: { condition, result: isTrue },
    });

    return { nextNodeId: nextEdge ? nextEdge.target : null };
  };

  const ivrHandler: NodeHandler = async ({ node, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const prompt = (data?.prompt as string) || "IVR";
    addLog({
      level: "info",
      nodeId: node.id,
      nodeType: node.type || "ivr",
      message: `IVR: ${prompt}`,
    });
    return { nextNodeId: getSingleNext(node.id) };
  };

  const queueHandler: NodeHandler = async ({ node, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const holdMusic = (data?.holdMusic as string) || "default";
    addLog({
      level: "info",
      nodeId: node.id,
      nodeType: node.type || "queue",
      message: `Queue with hold music: ${holdMusic}`,
    });
    return { nextNodeId: getSingleNext(node.id) };
  };

  const apiCallHandler: NodeHandler = async ({ node, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const endpoint = (data?.endpoint as string) || "http://localhost";
    addLog({
      level: "info",
      nodeId: node.id,
      nodeType: node.type || "api-call",
      message: `API Call to: ${endpoint} (simulated)`,
      data: { endpoint },
    });
    return { nextNodeId: getSingleNext(node.id) };
  };

  const getInputHandler: NodeHandler = async ({ node, variables, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const inputType = (data?.inputType as string) || "dtmf";
    addLog({
      level: "info",
      nodeId: node.id,
      nodeType: node.type || "get-input",
      message: `Get input (${inputType}) - using mock value`,
    });
    variables.values["last_input"] = "1"; // Mock input
    return { nextNodeId: getSingleNext(node.id) };
  };

  const waitHandler: NodeHandler = async ({ node, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const duration = (data?.duration as number) || 1;
    addLog({
      level: "info",
      nodeId: node.id,
      nodeType: node.type || "wait",
      message: `Wait for ${duration} seconds`,
    });
    return { nextNodeId: getSingleNext(node.id) };
  };

  const recordHandler: NodeHandler = async ({ node, addLog }) => {
    const data = node.data as unknown as Record<string, unknown> | undefined;
    const maxDuration = (data?.maxDuration as number) || 10;
    addLog({
      level: "info",
      nodeId: node.id,
      nodeType: node.type || "record",
      message: `Record call (max ${maxDuration}s) - simulated`,
    });
    return { nextNodeId: getSingleNext(node.id) };
  };

  return {
    start: startHandler,
    end: endHandler,
    "set-variable": setVariableHandler,
    setVariable: setVariableHandler,
    decision: decisionHandler,
    ivr: ivrHandler,
    queue: queueHandler,
    "api-call": apiCallHandler,
    apiCall: apiCallHandler,
    "get-input": getInputHandler,
    getInput: getInputHandler,
    wait: waitHandler,
    record: recordHandler,
  };
};
