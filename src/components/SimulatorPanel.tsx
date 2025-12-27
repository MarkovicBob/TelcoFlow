import { useEffect, useMemo, useState } from "react";
import { useFlowStore } from "../store/flowStore";
import { createSimulatorEngine } from "../utils/simulator/engine";
import type { SimulationLogEntry } from "../utils/simulator/types";

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
  X,
} from "lucide-react";

interface SimulatorPanelProps {
  mobileOpen: boolean;
  onMobileToggle: () => void;
  desktopOpen: boolean;
  onDesktopToggle: () => void;
}

const SimulatorPanel: React.FC<SimulatorPanelProps> = ({
  mobileOpen,
  onMobileToggle,
  desktopOpen,
  onDesktopToggle,
}) => {
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
  const [logLevelFilter, setLogLevelFilter] = useState<
    "all" | "info" | "warn" | "error"
  >("all");
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

  // Reset simulator kada se otvori modal
  useEffect(() => {
    if (desktopOpen || mobileOpen) {
      // Samo resetuj engine i promenljive bez setState poziva
      engine.reset();
      resetSimulatorVariables();
    }
  }, [desktopOpen, mobileOpen, engine, resetSimulatorVariables]);

  const init = () => {
    resetSimulatorVariables();
    engine.init(nodes, edges, { maxSteps: 200 });
    setInitialized(true);
    syncState();
    console.log("Simulator initialized:", engine.getState());
  };

  const onPlay = async () => {
    if (!initialized) {
      init();
    }
    console.log(
      "Starting simulation, current status:",
      engine.getState().status
    );
    await engine.start();
    console.log("Simulation finished, final status:", engine.getState().status);
    syncState();
  };

  const onPause = () => {
    engine.pause();
    syncState();
  };

  const onStep = async () => {
    if (!initialized) {
      init();
    }
    await engine.step();
    syncState();
  };

  const onReset = () => {
    resetSimulatorVariables();
    setCurrentSimulatorNodeId(null);
    engine.reset();
    setLogs([]);
    setInitialized(false);
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

  // Shared content render function (used by both desktop and mobile)
  const renderSimulatorContent = () => (
    <>
      {/* Header with status */}
      <div className="text-sm text-slate-300 font-medium mb-3">Simulator</div>
      <div className="text-xs text-slate-400 mb-3">
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

      {/* Control buttons */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
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

      {/* Current node info */}
      <div className="text-xs text-slate-400 flex items-center gap-2 mb-3">
        <Eye size={14} /> Current:{" "}
        <span className="text-slate-200 font-mono">
          {currentNode?.data?.label || currentNodeId || "-"}
        </span>
        <span className="ml-auto">
          Steps: <span className="text-slate-200">{stepsExecuted}</span>
        </span>
      </div>

      {/* Error Banner */}
      {status === "error" && errorLogs.length > 0 && (
        <div className="bg-red-900/20 border border-red-800 rounded px-3 py-2 flex items-start gap-2 mb-3">
          <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-red-300 mb-1">
              Execution Error
            </div>
            <div className="text-xs text-red-200">
              {errorLogs[errorLogs.length - 1].message}
            </div>
          </div>
        </div>
      )}

      {/* Expandable sections */}
      {/* Variables section */}
      <div className="border-t border-slate-800 mt-3 pt-2">
        <button
          onClick={() => setShowVariables(!showVariables)}
          className="w-full px-2 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800 transition-colors rounded"
        >
          <span className="font-medium">
            Variables ({Object.keys(simulatorVariables).length})
          </span>
          {showVariables ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showVariables && (
          <div className="px-2 py-2 bg-slate-950 rounded text-xs space-y-1 mt-1">
            {Object.keys(simulatorVariables).length === 0 ? (
              <div className="text-slate-500">No variables set yet</div>
            ) : (
              Object.entries(simulatorVariables).map(([key, value]) => (
                <div key={key} className="text-slate-400">
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
      <div className="border-t border-slate-800 mt-2 pt-2">
        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className="w-full px-2 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800 transition-colors rounded"
        >
          <span className="font-medium flex items-center gap-2">
            <BarChart3 size={14} /> Metrics
          </span>
          {showMetrics ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showMetrics && (
          <div className="px-2 py-2 bg-slate-950 rounded text-xs space-y-1 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Duration:</span>
              <span className="text-slate-200 font-mono">
                {metrics.totalDuration > 0 ? `${metrics.totalDuration}ms` : "-"}
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
              <div className="mt-2 pt-2 border-t border-slate-800">
                <div className="text-slate-400 mb-1">Node Executions:</div>
                {Object.entries(metrics.nodeExecutionCount).map(
                  ([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between ml-2"
                    >
                      <span className="text-slate-500">{type}:</span>
                      <span className="text-slate-300 font-mono">{count}</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Errors section */}
      {(errorLogs.length > 0 || warnLogs.length > 0) && (
        <div className="border-t border-slate-800 mt-2 pt-2">
          <button
            onClick={() => setShowErrors(!showErrors)}
            className="w-full px-2 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800 transition-colors rounded"
          >
            <span className="font-medium flex items-center gap-2">
              <AlertCircle size={14} className="text-red-400" />
              Issues ({errorLogs.length + warnLogs.length})
            </span>
            {showErrors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showErrors && (
            <div className="px-2 py-2 bg-slate-950 rounded text-xs space-y-1 mt-1 max-h-40 overflow-y-auto">
              {errorLogs.map((log, idx) => (
                <div key={`error-${idx}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-red-400 font-bold text-[10px]">
                      ERROR
                    </span>
                    <span className="text-slate-500">{log.nodeType}</span>
                  </div>
                  <div className="text-red-200">{log.message}</div>
                </div>
              ))}
              {warnLogs.map((log, idx) => (
                <div key={`warn-${idx}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-yellow-400 font-bold text-[10px]">
                      WARN
                    </span>
                    <span className="text-slate-500">{log.nodeType}</span>
                  </div>
                  <div className="text-yellow-200">{log.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Logs section */}
      <div className="border-t border-slate-800 mt-2 pt-2">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="w-full px-2 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800 transition-colors rounded"
        >
          <span className="font-medium flex items-center gap-2">
            <Logs size={14} /> Logs ({filteredLogs.length}/{logs.length})
          </span>
          {showLogs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showLogs && (
          <div className="mt-1 bg-slate-950 rounded">
            {/* Filter buttons */}
            <div className="px-2 py-2 flex items-center gap-1 border-b border-slate-800 flex-wrap">
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
            <div className="px-2 py-2 text-xs space-y-1 max-h-40 overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="text-slate-500">
                  {logs.length === 0 ? "No logs yet" : "No logs match filter"}
                </div>
              ) : (
                filteredLogs.map((log, idx) => (
                  <div key={idx}>
                    <div className="font-mono flex items-center gap-2 mb-0.5">
                      <span className="text-slate-500">[{idx + 1}]</span>
                      <span
                        className={`uppercase text-[10px] font-bold ${getLevelColor(
                          log.level
                        )}`}
                      >
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
    </>
  );

  return (
    <>
      {/* Desktop Modal Backdrop */}
      {desktopOpen && (
        <div
          className="hidden md:fixed md:inset-0 md:bg-black/60 md:z-40"
          onClick={onDesktopToggle}
        />
      )}

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onMobileToggle}
        />
      )}

      {/* Desktop Modal */}
      {desktopOpen && (
        <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center pointer-events-none">
          <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col pointer-events-auto">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 shrink-0 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">
                Simulator
              </h3>
              <button
                onClick={onDesktopToggle}
                className="p-1 hover:bg-slate-800 rounded transition-colors"
                aria-label="Close simulator"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderSimulatorContent()}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Panel */}
      {mobileOpen && (
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] bg-slate-900 border border-slate-800 rounded-t-lg shadow-lg overflow-hidden flex flex-col"
          style={{
            animation: "slideUp 0.3s ease-out",
          }}
        >
          {/* Header with close button */}
          <div className="p-3 border-b border-slate-800 shrink-0 flex items-center justify-between">
            <div className="text-sm text-slate-300 font-medium">Simulator</div>
            <button
              onClick={onMobileToggle}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
              aria-label="Close simulator"
            >
              <X size={16} className="text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {renderSimulatorContent()}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default SimulatorPanel;
