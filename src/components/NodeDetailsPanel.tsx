// src/components/NodeDetailsPanel.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type {
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useFlowStore } from "../store/flowStore";
import { NODE_DEFINITIONS } from "../types/nodes";
import type { Node } from "reactflow";
import type { NodeData, NodeType } from "../types/nodes";
import { nodeValidationSchemas } from "../utils/validation";

const NodeDetailsPanel: React.FC = () => {
  const { selectedNode, updateNode, clearSelection } = useFlowStore();

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
    />
  );
};

interface DetailsPanelContentProps {
  node: Node<NodeData>;
  nodeType: NodeType;
  nodeDefinition: (typeof NODE_DEFINITIONS)[NodeType];
  onUpdate: (data: NodeData) => void;
  onClose: () => void;
}

const DetailsPanelContent: React.FC<DetailsPanelContentProps> = ({
  node,
  nodeType,
  nodeDefinition,
  onUpdate,
  onClose,
}) => {
  const { register, handleSubmit, formState: { errors }, watch, reset, setFocus } = useForm<NodeData>({
    resolver: zodResolver(nodeValidationSchemas[nodeType]),
    defaultValues: node.data as NodeData,
  });

  const [toast, setToast] = useState<{ message: string; variant: "error" | "success" } | null>(null);

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
    const message = typeof first === "object" && first?.message ? String(first.message) : "Please fix validation errors.";
    setToast({ message, variant: "error" });
  };

  useEffect(() => {
    reset(node.data);
  }, [node.id, reset, node.data]);

  return (
    <div className="w-full sm:w-96 bg-slate-900 border-t sm:border-t-0 sm:border-l border-slate-800 flex flex-col h-full relative">
      {toast && (
        <div
          className={`absolute right-4 top-4 px-4 py-2 rounded-lg text-sm shadow-lg transition-opacity duration-200
            ${toast.variant === "error" ? "bg-red-900/70 text-red-50 border border-red-500/40" : "bg-emerald-900/60 text-emerald-50 border border-emerald-500/30"}
          `}
        >
          {toast.message}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-slate-100">
          {nodeDefinition.label.toUpperCase()} PROPERTIES
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)} className="space-y-4">
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
              w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700
              text-white font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          >
            Save Changes
          </button>
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
    w-full px-3 py-2 rounded-md bg-slate-800
    border text-slate-100 text-sm placeholder-slate-500
    focus:outline-none focus:ring-1
  `;

  const resolvedClasses = `${baseFieldClasses} ${
    error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-slate-700 focus:border-blue-500 focus:ring-blue-500"
  }`;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </label>
      {options ? (
        <select
          {...(register as object)}
          className={resolvedClasses}
        >
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
