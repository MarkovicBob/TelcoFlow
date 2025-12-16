import {
  AlertCircle,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Eye,
  Filter,
  Logs,
  Pause,
  Play,
  RotateCcw,
  StepForward,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFlowStore } from "../store/flowStore";
import { createSimulatorEngine } from "../utils/simulator/engine";
import type { SimulationLogEntry } from "../utils/simulator/types";

const SimulatorPanel = () => {
  const {
    nodes,
    edges,
    simulatorVariables,
    resetSimulatorVariables,
    setCurrentSimulatorNodeId,
  } = useFlowStore();
  const engine = useMemo(() => createSimulatorEngine(), []);
  const [initialized, setInitialized] = useState(false);
  const [status, setStatus] = useState("idle");
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [stepsExecuted, setStepsExecuted] = useState(0);
  const [showVariables, setShowVariables] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [logLevelFilter, setLogLevelFilter] = useState<"all" | "info" | "warn" | "error">("all");
  const [logs, setLogs] = useState<SimulationLogEntry[]>([]);
  const [metrics, setMetrics] = useState({
    totalDuration: 0,
    nodeExecutionCount: {} as Record<string, number>,
    errorCount: 0,
    warningCount: 0,
  });

  const syncState = () => {
    const s = engine.getState();
    setStatus(s.status);
    setCurrentNodeId(s.currentNodeId);
    setCurrentSimulatorNodeId(s.currentNodeId);
    setStepsExecuted(s.stepsExecuted);
    setLogs([...s.logs]);
    setMetrics({ ...s.metrics });
  };

  const init = () => {
    resetSimulatorVariables();
    engine.init(nodes, edges, { maxSteps: 200 });
    setInitialized(true);
    syncState();
  };

  const onPlay = async () => {
    if (!initialized) init();
    await engine.start();
    syncState();
  };
  const onPause = () => {
    engine.pause();
    syncState();
  };
  const onStep = async () => {
    if (!initialized) init();
    await engine.step();
    syncState();
  };
  const onReset = () => {
    resetSimulatorVariables();
    setCurrentSimulatorNodeId(null);
    engine.reset();
    setLogs([]);
    syncState();
  };

  const currentNode = nodes.find((n) => n.id === currentNodeId);

  const errorLogs = logs.filter((log) => log.level === "error");
  const warnLogs = logs.filter((log) => log.level === "warn");
  
  const filteredLogs = logs.filter((log) => {
    if (logLevelFilter === "all") return true;
    return log.level === logLevelFilter;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-400";
      case "warn":
        return "text-yellow-400";
      case "info":
        return "text-blue-400";
      case "debug":
        return "text-slate-500";
      default:
        return "text-slate-400";
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return "";
    return ms < 1 ? "<1ms" : `${ms.toFixed(1)}ms`;
  };

  return (
    <div className="absolute bottom-4 left-4 bg-slate-900 border border-slate-800 rounded-lg w-96 max-h-[600px] shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-300 font-medium">Simulator</div>
          <div className="text-xs text-slate-400">
            Status:{" "}
            <span
              className={
                status === "completed"
                  ? "text-green-400"
                  : status === "error"
                  ? "text-red-400"
                  : "text-slate-200"
              }
            >
              {status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={onPlay}
            className="px-2 py-1 rounded border border-blue-600 bg-blue-600 text-white text-xs flex items-center gap-1 hover:bg-blue-700"
          >
            <Play size={14} /> Play
          </button>
          <button
            onClick={onPause}
            className="px-2 py-1 rounded border border-slate-700 text-slate-300 text-xs flex items-center gap-1 hover:bg-slate-800"
          >
            <Pause size={14} /> Pause
          </button>
          <button
            onClick={onStep}
            className="px-2 py-1 rounded border border-slate-700 text-slate-300 text-xs flex items-center gap-1 hover:bg-slate-800"
          >
            <StepForward size={14} /> Step
          </button>
          <button
            onClick={onReset}
            className="px-2 py-1 rounded border border-slate-700 text-slate-300 text-xs flex items-center gap-1 hover:bg-slate-800"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Eye size={14} /> Current:{" "}
          <span className="text-slate-200 font-mono">
            {currentNode?.data?.label || currentNodeId || "-"}
          </span>
          <span className="ml-auto">
            Steps: <span className="text-slate-200">{stepsExecuted}</span>
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {status === "error" && errorLogs.length > 0 && (
        <div className="bg-red-900/20 border-y border-red-800 px-3 py-2 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-red-300 mb-1">Execution Error</div>
            <div className="text-xs text-red-200">
              {errorLogs[errorLogs.length - 1].message}
            </div>
          </div>
        </div>
      )}

      {/* Tabs content */}
      <div className="flex-1 overflow-y-auto">
        {/* Variables section */}
        <div className="border-b border-slate-800">
          <button
            onClick={() => setShowVariables(!showVariables)}
            className="w-full px-3 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <span className="font-medium">
              Variables ({Object.keys(simulatorVariables).length})
            </span>
            {showVariables ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
          {showVariables && (
            <div className="px-3 py-2 bg-slate-950 max-h-40 overflow-y-auto">
              {Object.keys(simulatorVariables).length === 0 ? (
                <div className="text-xs text-slate-500">
                  No variables set yet
                </div>
              ) : (
                Object.entries(simulatorVariables).map(([key, value]) => (
                  <div
                    key={key}
                    className="text-xs text-slate-400 py-1 border-b border-slate-800 last:border-b-0"
                  >
                    <span className="text-slate-300 font-mono">{key}</span>:{" "}
                    <span className="text-slate-200">
                      {JSON.stringify(value)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Metrics section */}
        <div className="border-b border-slate-800">
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="w-full px-3 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <span className="font-medium flex items-center gap-2">
              <BarChart3 size={14} /> Metrics
            </span>
            {showMetrics ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showMetrics && (
            <div className="px-3 py-2 bg-slate-950">
              <div className="text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Duration:</span>
                  <span className="text-slate-200 font-mono">
                    {metrics.totalDuration > 0
                      ? `${metrics.totalDuration}ms`
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Errors:</span>
                  <span
                    className={`font-mono ${
                      metrics.errorCount > 0 ? "text-red-400" : "text-slate-500"
                    }`}
                  >
                    {metrics.errorCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Warnings:</span>
                  <span
                    className={`font-mono ${
                      metrics.warningCount > 0
                        ? "text-yellow-400"
                        : "text-slate-500"
                    }`}
                  >
                    {metrics.warningCount}
                  </span>
                </div>
                {Object.keys(metrics.nodeExecutionCount).length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800">
                    <div className="text-slate-400 mb-1">Node Executions:</div>
                    {Object.entries(metrics.nodeExecutionCount).map(
                      ([type, count]) => (
                        <div
                          key={type}
                          className="flex items-center justify-between ml-2"
                        >
                          <span className="text-slate-500">{type}:</span>
                          <span className="text-slate-300 font-mono">
                            {count}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Errors section */}
        {(errorLogs.length > 0 || warnLogs.length > 0) && (
          <div className="border-b border-slate-800">
            <button
              onClick={() => setShowErrors(!showErrors)}
              className="w-full px-3 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <span className="font-medium flex items-center gap-2">
                <AlertCircle size={14} className="text-red-400" />
                Issues ({errorLogs.length + warnLogs.length})
              </span>
              {showErrors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showErrors && (
              <div className="px-3 py-2 bg-slate-950 max-h-48 overflow-y-auto">
                {errorLogs.map((log, idx) => (
                  <div
                    key={`error-${idx}`}
                    className="text-xs py-1.5 border-b border-slate-800 last:border-b-0"
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-red-400 font-bold text-[10px]">ERROR</span>
                      <span className="text-slate-500">{log.nodeType}</span>
                    </div>
                    <div className="text-red-200 ml-0">{log.message}</div>
                  </div>
                ))}
                {warnLogs.map((log, idx) => (
                  <div
                    key={`warn-${idx}`}
                    className="text-xs py-1.5 border-b border-slate-800 last:border-b-0"
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-yellow-400 font-bold text-[10px]">WARN</span>
                      <span className="text-slate-500">{log.nodeType}</span>
                    </div>
                    <div className="text-yellow-200 ml-0">{log.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Logs section */}
        <div className="border-b border-slate-800">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="w-full px-3 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <span className="font-medium flex items-center gap-2">
              <Logs size={14} /> Logs ({filteredLogs.length}/{logs.length})
            </span>
            {showLogs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showLogs && (
            <div className="bg-slate-950">
              {/* Filter buttons */}
              <div className="px-3 py-2 flex items-center gap-1 border-b border-slate-800">
                <Filter size={12} className="text-slate-500 mr-1" />
                {(["all", "info", "warn", "error"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setLogLevelFilter(level)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase transition-colors ${
                      logLevelFilter === level
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="px-3 py-2 max-h-60 overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="text-xs text-slate-500">
                  {logs.length === 0 ? "No logs yet" : "No logs match filter"}
                </div>
              ) : (
                filteredLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-400 py-1.5 border-b border-slate-800 last:border-b-0"
                  >
                    <div className="font-mono flex items-center gap-2 mb-0.5">
                      <span className="text-slate-500">[{idx + 1}]</span>
                      <span className={`uppercase text-[10px] font-bold ${
                        getLevelColor(log.level)
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-slate-500">{log.nodeType}</span>
                      {log.duration && (
                        <span className="text-slate-600 ml-auto">
                          {formatDuration(log.duration)}
                        </span>
                      )}
                    </div>
                    <div className="text-slate-200 ml-6">{log.message}</div>
                    {log.data && (
                      <div className="text-slate-500 ml-6 text-[10px] font-mono">
                        {JSON.stringify(log.data, null, 0)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulatorPanel;
