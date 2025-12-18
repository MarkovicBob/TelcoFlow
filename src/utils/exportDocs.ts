import type { Edge, Node } from "reactflow";
import type { NodeData } from "../types/nodes";

export interface ProjectMetadata {
  name: string;
  description?: string;
  tags?: string[];
}

export const exportMarkdown = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  metadata: ProjectMetadata
) => {
  const lines: string[] = [];
  lines.push(`# ${metadata.name}`);
  if (metadata.description) lines.push(`\n${metadata.description}`);
  if (metadata.tags && metadata.tags.length)
    lines.push(`\nTags: ${metadata.tags.join(", ")}`);

  lines.push("\n## Nodes");
  nodes.forEach((n) => {
    const type = n.type;
    const label = n.data.label ?? type;
    lines.push(`- ${type}: ${label} (${n.id})`);
  });

  lines.push("\n## Edges");
  edges.forEach((e) => {
    lines.push(`- ${e.source} -> ${e.target}${e.label ? ` [${e.label}]` : ""}`);
  });

  const content = lines.join("\n");
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${metadata.name.replace(/\s+/g, "_")}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
