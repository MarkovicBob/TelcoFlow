// src/utils/validation.ts
import { z } from "zod";
import type { NodeType } from "../types/nodes";

// Validation schemas for each node type
export const nodeValidationSchemas: Record<NodeType, z.ZodSchema> = {
  start: z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    trigger: z.enum(["inbound", "outbound", "scheduled"]),
  }),

  end: z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    reason: z.string().optional(),
    dispositionCode: z.string().optional(),
  }),

  ivr: z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    audioType: z.enum(["tts", "file"]),
    audioFile: z.string().optional(),
    ttsText: z.string().optional(),
    options: z.array(
      z.object({
        key: z.string().min(1, "Key is required"),
        label: z.string().min(1, "Label is required"),
        targetId: z.string().optional(),
      })
    ),
    timeout: z.number().min(1, "Timeout must be at least 1 second"),
    maxRetries: z.number().min(0, "Max retries must be 0 or more"),
    invalidInputMessage: z.string().optional(),
    noInputMessage: z.string().optional(),
  }),

  transfer: z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    transferType: z.enum(["warm", "cold", "attended"]),
    destination: z.string().min(1, "Destination is required"),
    timeout: z.number().optional(),
  }),

  queue: z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    queueName: z.string().min(1, "Queue name is required"),
    priority: z.enum(["low", "normal", "high", "urgent"]),
    maxWaitTime: z.number().min(1, "Max wait time must be at least 1 second"),
    holdMusic: z.string().optional(),
    positionAnnouncement: z.boolean(),
  }),

  playMessage: z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    audioType: z.enum(["tts", "file"]),
    audioFile: z.string().optional(),
    ttsText: z.string().optional(),
    language: z.string().optional(),
  }),

  getInput: z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    inputType: z.enum(["dtmf", "speech", "both"]),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    timeout: z.number().min(1, "Timeout must be at least 1 second"),
    terminatorKey: z.string().optional(),
    variableName: z.string().min(1, "Variable name is required"),
  }),

  decision: z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    condition: z.string().min(1, "Condition is required"),
    trueLabel: z.string().optional(),
    falseLabel: z.string().optional(),
  }),

  apiCall: z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    url: z.string().url("Invalid URL"),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]),
    headers: z.record(z.string(), z.string()).optional(),
    body: z.string().optional(),
    responseMapping: z.record(z.string(), z.string()).optional(),
    timeout: z.number().min(1, "Timeout must be at least 1 second"),
  }),

  record: z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    maxDuration: z.number().min(1, "Max duration must be at least 1 second"),
    beep: z.boolean(),
    transcribe: z.boolean(),
  }),

  wait: z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    duration: z.number().min(1, "Duration must be at least 1"),
    unit: z.enum(["seconds", "minutes"]),
  }),

  setVariable: z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    variableName: z.string().min(1, "Variable name is required"),
    value: z.string().min(1, "Value is required"),
    valueType: z.enum(["string", "number", "boolean", "expression"]),
  }),
};

// General flow validation
export const flowValidationSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      position: z.object({ x: z.number(), y: z.number() }),
      data: z.record(z.string(), z.unknown()),
    })
  ),
  edges: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
      sourceHandle: z.string().optional(),
      targetHandle: z.string().optional(),
    })
  ),
});

export const validateNode = (type: NodeType, data: unknown) => {
  const schema = nodeValidationSchemas[type];
  if (!schema) return { valid: false, errors: ["Unknown node type"] };

  try {
    schema.parse(data);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, errors: error.issues.map((e) => `${e.path.join(".")}: ${e.message}`) };
    }
    return { valid: false, errors: ["Unknown validation error"] };
  }
};
