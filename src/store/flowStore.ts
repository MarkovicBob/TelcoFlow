// src/store/flowStore.ts
import { create } from "zustand";
import type { Node, Edge, Connection, NodeChange, EdgeChange } from "reactflow";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "reactflow";
import { nanoid } from "nanoid";
import type { NodeType, NodeData } from "../types/nodes";

interface FlowState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNode: Node<NodeData> | null;
  selectedNodes: string[]; // Array of node IDs for multi-selection
  clipboard: Node<NodeData> | null;
  
  // History for undo/redo
  history: {
    past: Array<{ nodes: Node<NodeData>[]; edges: Edge[] }>;
    future: Array<{ nodes: Node<NodeData>[]; edges: Edge[] }>;
  };
  
  // Actions
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  // Node operations
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  selectNode: (node: Node<NodeData> | null) => void;
  selectNodeMulti: (nodeId: string, multiSelect: boolean) => void; // For Shift+Click and Ctrl+Click
  clearSelection: () => void;
  
  // Copy/Paste operations
  copyNode: () => void;
  pasteNode: (position: { x: number; y: number }) => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Utility
  clearFlow: () => void;
  loadFlow: (nodes: Node<NodeData>[], edges: Edge[]) => void;
}

const createDefaultNodeData = (type: NodeType): NodeData => {
  const baseData = {
    label: `New ${type}`,
    description: "",
  };

  switch (type) {
    case "start":
      return { ...baseData, label: "Start", trigger: "inbound" as const };
    case "end":
      return { ...baseData, label: "End", reason: "Call completed" };
    case "ivr":
      return {
        ...baseData,
        label: "IVR Menu",
        audioType: "tts" as const,
        ttsText: "Press 1 for sales, press 2 for support",
        options: [
          { key: "1", label: "Sales" },
          { key: "2", label: "Support" },
        ],
        timeout: 5,
        maxRetries: 3,
      };
    case "transfer":
      return {
        ...baseData,
        label: "Transfer",
        transferType: "cold" as const,
        destination: "",
      };
    case "queue":
      return {
        ...baseData,
        label: "Queue",
        queueName: "support",
        priority: "normal" as const,
        maxWaitTime: 300,
        positionAnnouncement: true,
      };
    case "playMessage":
      return {
        ...baseData,
        label: "Play Message",
        audioType: "tts" as const,
        ttsText: "Thank you for calling",
      };
    case "getInput":
      return {
        ...baseData,
        label: "Get Input",
        inputType: "dtmf" as const,
        maxLength: 10,
        timeout: 5,
        variableName: "user_input",
      };
    case "decision":
      return {
        ...baseData,
        label: "Decision",
        condition: "${variable} == 'value'",
        trueLabel: "Yes",
        falseLabel: "No",
      };
    case "apiCall":
      return {
        ...baseData,
        label: "API Call",
        url: "",
        method: "POST" as const,
        timeout: 10,
      };
    case "record":
      return {
        ...baseData,
        label: "Record",
        maxDuration: 120,
        beep: true,
        transcribe: false,
      };
    case "wait":
      return {
        ...baseData,
        label: "Wait",
        duration: 5,
        unit: "seconds" as const,
      };
    case "setVariable":
      return {
        ...baseData,
        label: "Set Variable",
        variableName: "my_variable",
        value: "",
        valueType: "string" as const,
      };
    default:
      return baseData;
  }
};

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedNodes: [],
  clipboard: null,
  history: {
    past: [],
    future: [],
  },

  setNodes: (nodes) => set({ nodes }),
  
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  addNode: (type, position) => {
    const newNode: Node<NodeData> = {
      id: nanoid(),
      type: type,
      position,
      data: createDefaultNodeData(type),
    };

    const state = get();
    set({
      nodes: [...state.nodes, newNode],
      history: {
        past: [...state.history.past, { nodes: state.nodes, edges: state.edges }],
        future: [],
      },
    });
  },

  updateNode: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },

  deleteNode: (id) => {
    const state = get();
    set({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
      history: {
        past: [...state.history.past, { nodes: state.nodes, edges: state.edges }],
        future: [],
      },
    });
  },

  selectNode: (node) => {
    set({ selectedNode: node, selectedNodes: node ? [node.id] : [] });
  },

  selectNodeMulti: (nodeId, multiSelect) => {
    const state = get();
    const currentSelectedNodes = state.selectedNodes;
    
    if (multiSelect) {
      // Shift+Click or Ctrl+Click behavior
      if (currentSelectedNodes.includes(nodeId)) {
        // If already selected, toggle off
        set({
          selectedNodes: currentSelectedNodes.filter((id) => id !== nodeId),
          selectedNode: null,
        });
      } else {
        // Add to selection
        set({
          selectedNodes: [...currentSelectedNodes, nodeId],
        });
      }
    } else {
      // Single click - replace selection
      set({
        selectedNodes: [nodeId],
        selectedNode: state.nodes.find((n) => n.id === nodeId) || null,
      });
    }
  },

  clearSelection: () => {
    set({ selectedNode: null, selectedNodes: [] });
  },

  undo: () => {
    const { history, nodes, edges } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      history: {
        past: newPast,
        future: [{ nodes, edges }, ...history.future],
      },
    });
  },

  redo: () => {
    const { history, nodes, edges } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      nodes: next.nodes,
      edges: next.edges,
      history: {
        past: [...history.past, { nodes, edges }],
        future: newFuture,
      },
    });
  },

  canUndo: () => get().history.past.length > 0,
  
  canRedo: () => get().history.future.length > 0,

  clearFlow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      history: { past: [], future: [] },
    });
  },

  loadFlow: (nodes, edges) => {
    set({
      nodes,
      edges,
      selectedNode: null,
      history: { past: [], future: [] },
    });
  },

  copyNode: () => {
    const selectedNode = get().selectedNode;
    if (!selectedNode) return;

    set({ clipboard: selectedNode });
  },

  pasteNode: (position) => {
    const clipboard = get().clipboard;
    if (!clipboard) return;

    const newNodeId = nanoid();
    const newNode: Node<NodeData> = {
      id: newNodeId,
      type: clipboard.type,
      position,
      data: clipboard.data as NodeData,
    };

    const state = get();
    set({
      nodes: [...state.nodes, newNode],
      selectedNode: newNode,
      history: {
        past: [...state.history.past, { nodes: state.nodes, edges: state.edges }],
        future: [],
      },
    });
  },
}));
