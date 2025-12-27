import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import type { Node } from "reactflow";
import { useFlowStore } from "../store/flowStore";
import { NODE_DEFINITIONS } from "../types/nodes";
import type { NodeData, NodeType } from "../types/nodes";
import { nodeValidationSchemas } from "../utils/validation";

// src/components/NodeDetailsPanel.tsx
import type {
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";

// Helper function to get usage information for each node type
const getNodeUsageInfo = (nodeType: NodeType): string[] => {
  const usageInfo: Record<NodeType, string[]> = {
    start: [
      "Defines the entry point when a call enters your flow",
      "Configure trigger type: inbound, outbound, or scheduled calls",
      "Every flow must have exactly one Start node",
      "Connect to the next step in your call flow",
    ],
    end: [
      "Terminates the active call session",
      "Set a disposition code to track call outcomes",
      "Specify a reason for ending the call",
      "Use multiple End nodes for different call outcomes",
    ],
    ivr: [
      "Create interactive voice menus with multiple options",
      "Support both Text-to-Speech and audio file playback",
      "Configure DTMF key mappings (0-9, *, #)",
      "Set timeout and retry behavior for invalid inputs",
      "Route callers to different paths based on their selection",
    ],
    transfer: [
      "Transfer calls to phone numbers, extensions, or queues",
      "Choose transfer type: warm, cold, or attended",
      "Set timeout duration for transfer attempts",
      "Handle failed transfers with alternative routing",
    ],
    queue: [
      "Place callers in hold queue for available agents",
      "Set priority levels: low, normal, high, urgent",
      "Configure maximum wait time before timeout",
      "Play hold music and position announcements",
      "Track queue metrics and caller experience",
    ],
    playMessage: [
      "Play audio messages or Text-to-Speech to callers",
      "Upload custom audio files or use TTS",
      "Select language and voice for TTS messages",
      "Use for greetings, instructions, or information",
      "Combine with other nodes for complex messaging",
    ],
    getInput: [
      "Collect DTMF digits or speech input from callers",
      "Set minimum and maximum input length",
      "Define timeout for user response",
      "Store input in variables for later use",
      "Support both keypad and voice recognition",
    ],
    decision: [
      "Create conditional branching based on variables or logic",
      "Compare values, check conditions, or evaluate expressions",
      "Route to True or False paths based on condition",
      "Use for business logic and dynamic routing",
      "Access variables from previous nodes",
    ],
    apiCall: [
      "Call external REST APIs to fetch or send data",
      "Support GET, POST, PUT, DELETE methods",
      "Add custom headers and request body",
      "Map API response to flow variables",
      "Integrate with CRMs, databases, and external systems",
    ],
    record: [
      "Record caller's voice message or conversation",
      "Set maximum recording duration",
      "Play beep before recording starts",
      "Enable automatic transcription",
      "Store recordings for later playback or analysis",
    ],
    wait: [
      "Pause flow execution for specified time",
      "Set duration in seconds or minutes",
      "Use for delays between actions",
      "Useful for pacing interactions or waiting for external events",
    ],
    setVariable: [
      "Create or update flow variables",
      "Store values as string, number, or boolean",
      "Use expressions for dynamic values",
      "Access variables in other nodes",
      "Track state throughout the call flow",
    ],
  };

  return usageInfo[nodeType] || ["No usage information available"];
};

const NodeDetailsPanel: React.FC = () => {
  const { selectedNode, updateNode, clearSelection, deleteNode } =
    useFlowStore();

  if (!selectedNode) {
    return null;
  }

  const nodeType = selectedNode.type as NodeType;
  const nodeDefinition = NODE_DEFINITIONS[nodeType];

  return (
    <DetailsPanelContent
      node={selectedNode as Node<NodeData>}
      nodeType={nodeType}
      nodeDefinition={nodeDefinition}
      onUpdate={(data) => updateNode(selectedNode.id, data)}
      onClose={() => clearSelection()}
      onDelete={() => {
        deleteNode(selectedNode.id);
        clearSelection();
      }}
    />
  );
};

interface DetailsPanelContentProps {
  node: Node<NodeData>;
  nodeType: NodeType;
  nodeDefinition: (typeof NODE_DEFINITIONS)[NodeType];
  onUpdate: (data: NodeData) => void;
  onClose: () => void;
  onDelete: () => void;
}

const DetailsPanelContent: React.FC<DetailsPanelContentProps> = ({
  node,
  nodeType,
  nodeDefinition,
  onUpdate,
  onClose,
  onDelete,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setFocus,
  } = useForm<NodeData>({
    resolver: zodResolver(nodeValidationSchemas[nodeType]),
    defaultValues: node.data as NodeData,
  });

  const [toast, setToast] = useState<{
    message: string;
    variant: "error" | "success";
  } | null>(null);

  useEffect(() => {
    if (!errors || Object.keys(errors).length === 0) return;
    const firstKey = Object.keys(errors)[0];
    setFocus(firstKey as keyof NodeData);
  }, [errors, setFocus]);

  const onSubmit = (data: NodeData) => {
    onUpdate(data);
    setToast({ message: "Changes saved", variant: "success" });
  };

  const onSubmitError = (formErrors: FieldErrors<NodeData>) => {
    const first = Object.values(formErrors)[0];
    const message =
      typeof first === "object" && first?.message
        ? String(first.message)
        : "Please fix validation errors.";
    setToast({ message, variant: "error" });
  };

  useEffect(() => {
    reset(node.data);
  }, [node.id, reset, node.data]);

  return (
    <div
      className="
      w-full sm:w-72 md:w-64 lg:w-80 xl:w-96 
      bg-slate-900 border-t sm:border-t-0 sm:border-l border-slate-800 
      flex flex-col h-full relative overflow-hidden
      text-xs sm:text-sm
    "
    >
      {toast && (
        <div
          className={`absolute right-4 top-4 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm shadow-lg transition-opacity duration-200
            ${
              toast.variant === "error"
                ? "bg-red-900/70 text-red-50 border border-red-500/40"
                : "bg-emerald-900/60 text-emerald-50 border border-emerald-500/30"
            }
          `}
        >
          {toast.message}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between p-2 md:p-3 border-b border-slate-800 shrink-0">
        <h2 className="text-[10px] md:text-xs font-semibold text-slate-100 leading-tight">
          {nodeDefinition.label.toUpperCase()} PROPERTIES
        </h2>
        <div className="flex items-center gap-1 md:gap-1.5">
          <button
            onClick={onDelete}
            className="text-[10px] md:text-xs bg-red-600 hover:bg-red-500 text-white rounded px-1.5 py-0.5 md:px-2 md:py-1"
            aria-label="Delete node"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close properties panel"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 md:p-3">
        <form
          onSubmit={handleSubmit(onSubmit, onSubmitError)}
          className="space-y-2 md:space-y-3"
        >
          {/* Label Field */}
          <FormSection title="Basic Information">
            <FormField
              label="Label"
              register={register("label")}
              error={errors.label?.message}
              placeholder="Enter node label"
            />
            <FormField
              label="Description"
              register={register("description")}
              error={errors.description?.message}
              placeholder="Optional description"
              textarea
            />
          </FormSection>

          {/* Node-Specific Fields */}
          <NodeSpecificFields
            nodeType={nodeType}
            register={register}
            watch={watch}
            errors={errors}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-blue-600 hover:bg-blue-700
              text-white text-xs md:text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          >
            Save Changes
          </button>

          {/* Node Information */}
          <div className="mt-4 p-3 md:p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: nodeDefinition.color + "20",
                  color: nodeDefinition.color,
                }}
              >
                <span className="text-lg">ℹ️</span>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-slate-100 mb-1">
                  About {nodeDefinition.label}
                </h3>
                <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">
                  {nodeDefinition.description}
                </p>
              </div>
            </div>

            {/* Node-specific usage information */}
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <p className="text-[10px] md:text-xs font-medium text-slate-300 mb-2">
                What you can do:
              </p>
              <ul className="space-y-1.5 text-[10px] md:text-xs text-slate-400">
                {getNodeUsageInfo(nodeType).map((info, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span className="flex-1">{info}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <p className="text-[9px] md:text-[10px] text-slate-500 italic">
                Category:{" "}
                {nodeDefinition.category.charAt(0).toUpperCase() +
                  nodeDefinition.category.slice(1)}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
  options?: Array<{ value: string; label: string }>;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  register,
  error,
  placeholder,
  textarea = false,
  type = "text",
  options,
}) => {
  const baseFieldClasses = `
    w-full px-2 py-1.5 md:px-3 md:py-2 rounded-md bg-slate-800
    border text-slate-100 text-xs md:text-sm placeholder-slate-500
    focus:outline-none focus:ring-1
  `;

  const resolvedClasses = `${baseFieldClasses} ${
    error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-slate-700 focus:border-blue-500 focus:ring-blue-500"
  }`;

  return (
    <div className="space-y-1 md:space-y-1.5">
      <label className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </label>
      {options ? (
        <select {...(register as object)} className={resolvedClasses}>
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          {...(register as object)}
          placeholder={placeholder}
          className={`${resolvedClasses} resize-none h-20`}
        />
      ) : (
        <input
          {...(register as object)}
          type={type}
          placeholder={placeholder}
          className={resolvedClasses}
        />
      )}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const NodeSpecificFields: React.FC<{
  nodeType: NodeType;
  register: UseFormRegister<NodeData>;
  watch: UseFormWatch<NodeData>;
  errors: Record<string, unknown>;
}> = ({ nodeType, register, watch, errors }) => {
  const audioType = watch("audioType") as string | undefined;
  const errorMessage = (key: string) => {
    const err = errors[key] as { message?: string } | undefined;
    return err?.message;
  };

  switch (nodeType) {
    case "start":
      return (
        <FormSection title="Trigger Configuration">
          <FormField
            label="Trigger"
            register={register("trigger")}
            error={errorMessage("trigger")}
            options={[
              { value: "inbound", label: "Inbound Call" },
              { value: "outbound", label: "Outbound Call" },
              { value: "scheduled", label: "Scheduled" },
            ]}
          />
        </FormSection>
      );

    case "ivr":
      return (
        <FormSection title="Audio Configuration">
          <FormField
            label="Audio Type"
            register={register("audioType")}
            error={errorMessage("audioType")}
            options={[
              { value: "tts", label: "Text-to-Speech" },
              { value: "file", label: "Audio File" },
            ]}
          />
          {audioType === "tts" && (
            <FormField
              label="TTS Message"
              register={register("ttsText")}
              error={errorMessage("ttsText")}
              placeholder="Enter message to be spoken"
              textarea
            />
          )}
          <FormField
            label="Timeout (seconds)"
            register={register("timeout", { valueAsNumber: true })}
            error={errorMessage("timeout")}
            type="number"
          />
          <FormField
            label="Max Retries"
            register={register("maxRetries", { valueAsNumber: true })}
            error={errorMessage("maxRetries")}
            type="number"
          />
        </FormSection>
      );

    case "transfer":
      return (
        <FormSection title="Transfer Configuration">
          <FormField
            label="Transfer Type"
            register={register("transferType")}
            error={errorMessage("transferType")}
            options={[
              { value: "cold", label: "Cold Transfer" },
              { value: "warm", label: "Warm Transfer" },
              { value: "attended", label: "Attended Transfer" },
            ]}
          />
          <FormField
            label="Destination"
            register={register("destination")}
            error={errorMessage("destination")}
            placeholder="Extension or phone number"
          />
        </FormSection>
      );

    case "queue":
      return (
        <FormSection title="Queue Configuration">
          <FormField
            label="Queue Name"
            register={register("queueName")}
            error={errorMessage("queueName")}
            placeholder="e.g., support, sales"
          />
          <FormField
            label="Priority"
            register={register("priority")}
            error={errorMessage("priority")}
            options={[
              { value: "low", label: "Low" },
              { value: "normal", label: "Normal" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ]}
          />
          <FormField
            label="Max Wait Time (seconds)"
            register={register("maxWaitTime", { valueAsNumber: true })}
            error={errorMessage("maxWaitTime")}
            type="number"
          />
        </FormSection>
      );

    case "decision":
      return (
        <FormSection title="Condition">
          <FormField
            label="Expression"
            register={register("condition")}
            error={errorMessage("condition")}
            placeholder='e.g., ${variable} == "value"'
            textarea
          />
          <FormField
            label="True Label"
            register={register("trueLabel")}
            error={errorMessage("trueLabel")}
            placeholder="Label for true branch"
          />
          <FormField
            label="False Label"
            register={register("falseLabel")}
            error={errorMessage("falseLabel")}
            placeholder="Label for false branch"
          />
        </FormSection>
      );

    case "apiCall":
      return (
        <FormSection title="API Configuration">
          <FormField
            label="URL"
            register={register("url")}
            error={errorMessage("url")}
            placeholder="https://api.example.com/endpoint"
          />
          <FormField
            label="Method"
            register={register("method")}
            error={errorMessage("method")}
            options={[
              { value: "GET", label: "GET" },
              { value: "POST", label: "POST" },
              { value: "PUT", label: "PUT" },
              { value: "DELETE", label: "DELETE" },
            ]}
          />
          <FormField
            label="Timeout (seconds)"
            register={register("timeout", { valueAsNumber: true })}
            error={errorMessage("timeout")}
            type="number"
          />
        </FormSection>
      );

    case "getInput":
      return (
        <FormSection title="Input Configuration">
          <FormField
            label="Input Type"
            register={register("inputType")}
            error={errorMessage("inputType")}
            options={[
              { value: "dtmf", label: "DTMF (Dial Pad)" },
              { value: "speech", label: "Speech" },
              { value: "both", label: "Both" },
            ]}
          />
          <FormField
            label="Variable Name"
            register={register("variableName")}
            error={errorMessage("variableName")}
            placeholder="e.g., user_selection"
          />
          <FormField
            label="Timeout (seconds)"
            register={register("timeout", { valueAsNumber: true })}
            error={errorMessage("timeout")}
            type="number"
          />
        </FormSection>
      );

    default:
      return null;
  }
};

export default NodeDetailsPanel;
