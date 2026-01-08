import type { Edge, Node } from "reactflow";
import type { NodeData } from "../types/nodes";

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
}

// Helper to create nodes with consistent positioning
const createNode = (
  id: string,
  type: string,
  label: string,
  position: { x: number; y: number },
  data: Record<string, unknown> = {}
): Node<NodeData> => ({
  id,
  type,
  position,
  data: {
    label,
    description: `${type} node`,
    ...data,
  },
});

export const FLOW_TEMPLATES: FlowTemplate[] = [
  {
    id: "simple-ivr",
    name: "Simple IVR",
    description: "Basic Interactive Voice Response with greeting",
    icon: "🎤",
    nodes: [
      createNode("start-1", "start", "Start", { x: 100, y: 50 }),
      createNode(
        "ivr-1",
        "ivr",
        "Play Message",
        { x: 100, y: 150 },
        {
          prompt: "Welcome to our system",
        }
      ),
      createNode(
        "wait-1",
        "wait",
        "Wait",
        { x: 100, y: 250 },
        {
          duration: 2,
        }
      ),
      createNode("end-1", "end", "End", { x: 100, y: 350 }),
    ],
    edges: [
      { id: "e1-ivr", source: "start-1", target: "ivr-1" },
      { id: "e-ivr-wait", source: "ivr-1", target: "wait-1" },
      { id: "e-wait-end", source: "wait-1", target: "end-1" },
    ],
  },
  {
    id: "decision-flow",
    name: "Decision Flow",
    description: "Route call based on user decision",
    icon: "🔀",
    nodes: [
      createNode("start-2", "start", "Start", { x: 100, y: 50 }),
      createNode(
        "decision-1",
        "decision",
        "Check Input",
        { x: 100, y: 150 },
        {
          condition: "last_input === '1'",
        }
      ),
      createNode(
        "ivr-success",
        "ivr",
        "Success Path",
        { x: -100, y: 250 },
        {
          prompt: "You selected option 1",
        }
      ),
      createNode(
        "ivr-other",
        "ivr",
        "Other Path",
        { x: 300, y: 250 },
        {
          prompt: "You selected something else",
        }
      ),
      createNode("end-2", "end", "End", { x: 100, y: 350 }),
    ],
    edges: [
      { id: "e1-dec", source: "start-2", target: "decision-1" },
      {
        id: "e-dec-true",
        source: "decision-1",
        target: "ivr-success",
        label: "true",
      },
      {
        id: "e-dec-false",
        source: "decision-1",
        target: "ivr-other",
        label: "false",
      },
      { id: "e-success-end", source: "ivr-success", target: "end-2" },
      { id: "e-other-end", source: "ivr-other", target: "end-2" },
    ],
  },
  {
    id: "queue-flow",
    name: "Queue & Transfer",
    description: "Put caller in queue and transfer to agent",
    icon: "📞",
    nodes: [
      createNode("start-3", "start", "Start", { x: 100, y: 50 }),
      createNode(
        "ivr-greeting",
        "ivr",
        "Greeting",
        { x: 100, y: 150 },
        {
          prompt: "Press 1 to speak with an agent",
        }
      ),
      createNode(
        "queue-1",
        "queue",
        "Wait in Queue",
        { x: 100, y: 250 },
        {
          holdMusic: "elevator",
        }
      ),
      createNode(
        "record-1",
        "record",
        "Record",
        { x: 100, y: 350 },
        {
          maxDuration: 30,
        }
      ),
      createNode("end-3", "end", "End Call", { x: 100, y: 450 }),
    ],
    edges: [
      { id: "e1-greet", source: "start-3", target: "ivr-greeting" },
      { id: "e-greet-queue", source: "ivr-greeting", target: "queue-1" },
      { id: "e-queue-record", source: "queue-1", target: "record-1" },
      { id: "e-record-end", source: "record-1", target: "end-3" },
    ],
  },
  {
    id: "get-input-flow",
    name: "Get Input & Process",
    description: "Collect user input and process with variables",
    icon: "⌨️",
    nodes: [
      createNode("start-4", "start", "Start", { x: 100, y: 50 }),
      createNode(
        "ivr-ask",
        "ivr",
        "Ask for Input",
        { x: 100, y: 150 },
        {
          prompt: "Please enter one digit",
        }
      ),
      createNode(
        "get-input-1",
        "get-input",
        "Capture Input",
        {
          x: 100,
          y: 250,
        },
        {
          inputType: "dtmf",
        }
      ),
      createNode(
        "set-var-1",
        "set-variable",
        "Save Input",
        { x: 100, y: 350 },
        {
          variableName: "user_choice",
          value: "1",
        }
      ),
      createNode("end-4", "end", "End", { x: 100, y: 450 }),
    ],
    edges: [
      { id: "e1-ask", source: "start-4", target: "ivr-ask" },
      { id: "e-ask-input", source: "ivr-ask", target: "get-input-1" },
      { id: "e-input-var", source: "get-input-1", target: "set-var-1" },
      { id: "e-var-end", source: "set-var-1", target: "end-4" },
    ],
  },
  {
    id: "api-integration",
    name: "API Integration",
    description: "Call external API and store result",
    icon: "🌐",
    nodes: [
      createNode("start-5", "start", "Start", { x: 100, y: 50 }),
      createNode(
        "api-1",
        "api-call",
        "Call API",
        { x: 100, y: 150 },
        {
          endpoint: "https://api.example.com/status",
        }
      ),
      createNode(
        "set-result",
        "set-variable",
        "Store Result",
        {
          x: 100,
          y: 250,
        },
        {
          variableName: "api_response",
          value: "success",
        }
      ),
      createNode(
        "ivr-confirm",
        "ivr",
        "Confirm",
        { x: 100, y: 350 },
        {
          prompt: "Request has been submitted",
        }
      ),
      createNode("end-5", "end", "End", { x: 100, y: 450 }),
    ],
    edges: [
      { id: "e1-api", source: "start-5", target: "api-1" },
      { id: "e-api-result", source: "api-1", target: "set-result" },
      { id: "e-result-confirm", source: "set-result", target: "ivr-confirm" },
      { id: "e-confirm-end", source: "ivr-confirm", target: "end-5" },
    ],
  },
];
