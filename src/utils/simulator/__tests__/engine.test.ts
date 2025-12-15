import type { Edge, Node } from "reactflow";
import { describe, expect, it } from "vitest";
import type { NodeData } from "../../../types/nodes";
import { createSimulatorEngine } from "../engine";

const makeNode = (
  id: string,
  type: Node<NodeData>["type"],
  data: NodeData
): Node<NodeData> => ({
  id,
  type,
  position: { x: 0, y: 0 },
  data,
});

describe("Simulator Engine", () => {
  it("runs linear flow and sets variables", async () => {
    const nodes: Node<NodeData>[] = [
      makeNode("start", "start", { label: "Start", trigger: "inbound" }),
      makeNode("set-plan", "setVariable", {
        label: "Set Plan",
        variableName: "plan",
        value: "gold",
        valueType: "string",
      }),
      makeNode("decision", "decision", {
        label: "Check plan",
        condition: 'plan === "gold"',
        trueLabel: "Yes",
        falseLabel: "No",
      }),
      makeNode("end-true", "end", { label: "End True" }),
      makeNode("end-false", "end", { label: "End False" }),
    ];

    const edges: Edge[] = [
      { id: "e1", source: "start", target: "set-plan" },
      { id: "e2", source: "set-plan", target: "decision" },
      { id: "e3", source: "decision", target: "end-true", label: "true" },
      { id: "e4", source: "decision", target: "end-false", label: "false" },
    ];

    const engine = createSimulatorEngine();
    engine.init(nodes, edges, { maxSteps: 10 });

    await engine.start();
    const state = engine.getState();

    expect(state.status).toBe("completed");
    expect(state.currentNodeId).toBe("end-true");
    expect(state.stepsExecuted).toBe(4);
    expect(state.variables.values.plan).toBe("gold");

    const decisionLog = state.logs.find((log) => log.nodeType === "decision");
    expect(decisionLog?.data?.result).toBe(true);
  });

  it("stops with error when max steps reached", async () => {
    const nodes: Node<NodeData>[] = [
      makeNode("start", "start", { label: "Start", trigger: "inbound" }),
      makeNode("wait", "wait", { label: "Wait", duration: 1, unit: "seconds" }),
    ];

    const edges: Edge[] = [
      { id: "e1", source: "start", target: "wait" },
      { id: "e2", source: "wait", target: "wait" },
    ];

    const engine = createSimulatorEngine();
    engine.init(nodes, edges, { maxSteps: 2 });

    await engine.step();
    await engine.step();
    await engine.step();

    const state = engine.getState();

    expect(state.status).toBe("error");
    expect(state.stepsExecuted).toBe(2);
    const maxLog = state.logs.find(
      (log) => log.message === "Max steps reached"
    );
    expect(maxLog).toBeTruthy();
  });
});
