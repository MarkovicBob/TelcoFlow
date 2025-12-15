import type { Edge, Node } from "reactflow";
import type { NodeData } from "../types/nodes";

// src/utils/flowValidation.ts

export interface ValidationError {
  id: string;
  type: "error" | "warning";
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validates the entire flow and returns errors/warnings
 */
export function validateFlow(
  nodes: Node<NodeData>[],
  edges: Edge[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // 1. Check if flow is empty
  if (nodes.length === 0) {
    errors.push({
      id: "empty-flow",
      type: "error",
      message: "Flow is empty. Add nodes to begin.",
    });
    return { isValid: false, errors, warnings };
  }

  // 2. Check for Start node
  const startNodes = nodes.filter((node) => node.type === "start");
  if (startNodes.length === 0) {
    errors.push({
      id: "no-start",
      type: "error",
      message: "Missing Start node. Every flow must start with a Start node.",
    });
  } else if (startNodes.length > 1) {
    warnings.push({
      id: "multiple-start",
      type: "warning",
      message: `Found ${startNodes.length} Start nodes. Only one Start node should be used.`,
    });
  }

  // 3. Check for End node
  const endNodes = nodes.filter((node) => node.type === "end");
  if (endNodes.length === 0) {
    errors.push({
      id: "no-end",
      type: "error",
      message: "Missing End node. Every flow must end with an End node.",
    });
  }

  // 4. Check for orphaned nodes (unconnected)
  const orphanedNodes = findOrphanedNodes(nodes, edges);
  if (orphanedNodes.length > 0) {
    orphanedNodes.forEach((node) => {
      warnings.push({
        id: `orphaned-${node.id}`,
        type: "warning",
        message: `Node "${
          node.data.label || node.type
        }" is not connected to the flow.`,
        nodeId: node.id,
      });
    });
  }

  // 5. Check for circular references
  const circularPaths = detectCircularReferences(nodes, edges);
  if (circularPaths.length > 0) {
    errors.push({
      id: "circular-reference",
      type: "error",
      message: `Detected circular reference involving ${circularPaths.length} node(s). Flows cannot loop indefinitely.`,
    });
  }

  // 6. Check for unreachable End nodes
  const unreachableEnds = findUnreachableEndNodes(nodes, edges);
  if (unreachableEnds.length > 0) {
    unreachableEnds.forEach((node) => {
      warnings.push({
        id: `unreachable-end-${node.id}`,
        type: "warning",
        message: `End node is unreachable from Start node.`,
        nodeId: node.id,
      });
    });
  }

  // 7. Validate required fields for each node
  const fieldErrors = validateNodeFields(nodes);
  errors.push(...fieldErrors);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Find nodes that are not connected to any other nodes
 * (except Start node which doesn't need incoming edges)
 */
function findOrphanedNodes(
  nodes: Node<NodeData>[],
  edges: Edge[]
): Node<NodeData>[] {
  const connectedNodeIds = new Set<string>();

  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  return nodes.filter((node) => {
    // Node is orphaned if it's not in the connected set at all
    return !connectedNodeIds.has(node.id);
  });
}

/**
 * Detect circular references using depth-first search
 */
function detectCircularReferences(
  nodes: Node<NodeData>[],
  edges: Edge[]
): string[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const circularNodes: string[] = [];

  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, []);
    }
    adjacency.get(edge.source)!.push(edge.target);
  });

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacency.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        // Cycle detected
        circularNodes.push(neighbor);
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  // Check each node
  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  });

  return circularNodes;
}

/**
 * Find End nodes that cannot be reached from Start node
 */
function findUnreachableEndNodes(
  nodes: Node<NodeData>[],
  edges: Edge[]
): Node<NodeData>[] {
  const startNodes = nodes.filter((node) => node.type === "start");
  if (startNodes.length === 0) return [];

  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, []);
    }
    adjacency.get(edge.source)!.push(edge.target);
  });

  // BFS from all Start nodes to find reachable nodes
  const reachable = new Set<string>();
  const queue: string[] = startNodes.map((n) => n.id);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (reachable.has(current)) continue;

    reachable.add(current);
    const neighbors = adjacency.get(current) || [];
    queue.push(...neighbors);
  }

  // Find End nodes that are not reachable
  const endNodes = nodes.filter((node) => node.type === "end");
  return endNodes.filter((node) => !reachable.has(node.id));
}

/**
 * Validate required fields for each node type
 */
function validateNodeFields(nodes: Node<NodeData>[]): ValidationError[] {
  const errors: ValidationError[] = [];

  nodes.forEach((node) => {
    const data = node.data;

    // Check common required fields
    if (!data.label || data.label.trim() === "") {
      errors.push({
        id: `label-${node.id}`,
        type: "error",
        message: `Node "${node.type}" is missing a label.`,
        nodeId: node.id,
      });
    }

    // Type-specific validation
    switch (node.type) {
      case "transfer":
        if (
          "destination" in data &&
          (!data.destination || data.destination.trim() === "")
        ) {
          errors.push({
            id: `destination-${node.id}`,
            type: "error",
            message: `Transfer node "${data.label}" is missing destination.`,
            nodeId: node.id,
          });
        }
        break;

      case "queue":
        if (
          "queueName" in data &&
          (!data.queueName || data.queueName.trim() === "")
        ) {
          errors.push({
            id: `queue-${node.id}`,
            type: "error",
            message: `Queue node "${data.label}" is missing queue name.`,
            nodeId: node.id,
          });
        }
        break;

      case "apiCall":
        if ("url" in data && (!data.url || data.url.trim() === "")) {
          errors.push({
            id: `url-${node.id}`,
            type: "error",
            message: `API Call node "${data.label}" is missing URL.`,
            nodeId: node.id,
          });
        }
        break;

      case "getInput":
        if (
          "variableName" in data &&
          (!data.variableName || data.variableName.trim() === "")
        ) {
          errors.push({
            id: `variable-${node.id}`,
            type: "error",
            message: `Get Input node "${data.label}" is missing variable name.`,
            nodeId: node.id,
          });
        }
        break;

      case "setVariable":
        if (
          "variableName" in data &&
          (!data.variableName || data.variableName.trim() === "")
        ) {
          errors.push({
            id: `variable-${node.id}`,
            type: "error",
            message: `Set Variable node "${data.label}" is missing variable name.`,
            nodeId: node.id,
          });
        }
        break;

      case "decision":
        if (
          "condition" in data &&
          (!data.condition || data.condition.trim() === "")
        ) {
          errors.push({
            id: `condition-${node.id}`,
            type: "error",
            message: `Decision node "${data.label}" is missing condition.`,
            nodeId: node.id,
          });
        }
        break;

      case "playMessage":
      case "ivr":
        if ("audioType" in data) {
          if (
            data.audioType === "tts" &&
            "ttsText" in data &&
            (!data.ttsText || data.ttsText.trim() === "")
          ) {
            errors.push({
              id: `tts-${node.id}`,
              type: "error",
              message: `${node.type === "ivr" ? "IVR" : "Play Message"} node "${
                data.label
              }" is missing TTS text.`,
              nodeId: node.id,
            });
          } else if (
            data.audioType === "file" &&
            "audioFile" in data &&
            (!data.audioFile || data.audioFile.trim() === "")
          ) {
            errors.push({
              id: `audio-${node.id}`,
              type: "error",
              message: `${node.type === "ivr" ? "IVR" : "Play Message"} node "${
                data.label
              }" is missing audio file.`,
              nodeId: node.id,
            });
          }
        }
        break;
    }
  });

  return errors;
}

/**
 * Quick validation check (for toolbar button)
 */
export function quickValidateFlow(
  nodes: Node<NodeData>[],
  edges: Edge[]
): { isValid: boolean; summary: string } {
  const result = validateFlow(nodes, edges);

  if (result.isValid && result.warnings.length === 0) {
    return {
      isValid: true,
      summary: `✅ Flow is valid!\n\n📊 Summary:\n- Nodes: ${nodes.length}\n- Connections: ${edges.length}\n\nYour flow is ready!`,
    };
  }

  const errorCount = result.errors.length;
  const warningCount = result.warnings.length;

  let summary = "Flow Validation Results:\n\n";

  if (errorCount > 0) {
    summary += `❌ ${errorCount} Error(s):\n`;
    result.errors.slice(0, 5).forEach((err) => {
      summary += `  • ${err.message}\n`;
    });
    if (errorCount > 5) {
      summary += `  • ... and ${errorCount - 5} more\n`;
    }
    summary += "\n";
  }

  if (warningCount > 0) {
    summary += `⚠️ ${warningCount} Warning(s):\n`;
    result.warnings.slice(0, 3).forEach((warn) => {
      summary += `  • ${warn.message}\n`;
    });
    if (warningCount > 3) {
      summary += `  • ... and ${warningCount - 3} more\n`;
    }
  }

  return {
    isValid: errorCount === 0,
    summary,
  };
}
