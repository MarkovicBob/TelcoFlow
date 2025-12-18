import type { Node, Edge } from "reactflow";
import type { NodeData, NodeType } from "../types/nodes";

export interface FlowTemplateMetadata {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
}

export interface FlowTemplate {
  metadata: FlowTemplateMetadata;
  nodes: Node<NodeData>[];
  edges: Edge[];
}

const makeNode = (
  id: string,
  type: NodeType,
  x: number,
  y: number,
  data: Partial<NodeData>
): Node<NodeData> => {
  const { label: l, description: d, ...rest } = data;
  return {
    id,
    type,
    position: { x, y },
    data: {
      label: l ?? `${type}`,
      description: d ?? "",
      ...(rest as Partial<NodeData>),
    } as NodeData,
  };
};

export const TEMPLATES: FlowTemplate[] = [
  {
    metadata: {
      id: "customer-support-ivr",
      name: "Customer Support IVR",
      description: "Main customer support flow with IVR and queue",
      tags: ["ivr", "queue", "support"],
    },
    nodes: [
      makeNode("start-1", "start", 100, 100, { label: "Start", trigger: "inbound" }),
      makeNode("ivr-1", "ivr", 300, 100, {
        label: "Main Menu",
        audioType: "tts",
        ttsText: "Press 1 for Sales, 2 for Support",
        options: [
          { key: "1", label: "Sales", targetId: "transfer-1" },
          { key: "2", label: "Support", targetId: "queue-1" },
        ],
        timeout: 5,
        maxRetries: 3,
      }),
      makeNode("transfer-1", "transfer", 550, 40, {
        label: "Sales",
        transferType: "cold",
        destination: "+385123456",
      }),
      makeNode("queue-1", "queue", 550, 160, {
        label: "Support Queue",
        queueName: "support",
        priority: "normal",
        maxWaitTime: 300,
        positionAnnouncement: true,
      }),
      makeNode("end-1", "end", 800, 100, { label: "End", reason: "Complete" }),
    ],
    edges: [
      { id: "e1", source: "start-1", target: "ivr-1" },
      { id: "e2", source: "ivr-1", target: "transfer-1", label: "1" },
      { id: "e3", source: "ivr-1", target: "queue-1", label: "2" },
      { id: "e4", source: "transfer-1", target: "end-1" },
      { id: "e5", source: "queue-1", target: "end-1" },
    ],
  },
  {
    metadata: {
      id: "simple-decision-route",
      name: "Simple Decision Route",
      description: "Route based on variable with API call",
      tags: ["decision", "api"],
    },
    nodes: [
      makeNode("start-2", "start", 100, 100, { label: "Start", trigger: "inbound" }),
      makeNode("set-2", "setVariable", 300, 100, {
        label: "Set Tier",
        variableName: "tier",
        value: "premium",
        valueType: "string",
      }),
      makeNode("decision-2", "decision", 520, 100, {
        label: "Is Premium?",
        condition: "${tier} === 'premium'",
        trueLabel: "Yes",
        falseLabel: "No",
      }),
      makeNode("api-2", "apiCall", 720, 40, {
        label: "Premium Endpoint",
        url: "https://api.example.com/premium",
        method: "POST",
        timeout: 10,
      }),
      makeNode("message-2", "playMessage", 720, 160, {
        label: "Fallback Message",
        audioType: "tts",
        ttsText: "You are on the basic plan",
      }),
      makeNode("end-2", "end", 940, 100, { label: "End", reason: "Complete" }),
    ],
    edges: [
      { id: "e21", source: "start-2", target: "set-2" },
      { id: "e22", source: "set-2", target: "decision-2" },
      { id: "e23", source: "decision-2", target: "api-2", label: "Yes" },
      { id: "e24", source: "decision-2", target: "message-2", label: "No" },
      { id: "e25", source: "api-2", target: "end-2" },
      { id: "e26", source: "message-2", target: "end-2" },
    ],
  },
];

export const listTemplates = (): FlowTemplateMetadata[] =>
  TEMPLATES.map((t) => t.metadata);

export const getTemplateById = (id: string): FlowTemplate | undefined =>
  TEMPLATES.find((t) => t.metadata.id === id);
