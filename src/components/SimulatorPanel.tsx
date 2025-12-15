import {
  ChevronDown,
  ChevronUp,
  Eye,
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
  const [logs, setLogs] = useState<SimulationLogEntry[]>([]);

  const syncState = () => {
    const s = engine.getState();
    setStatus(s.status);
    setCurrentNodeId(s.currentNodeId);
    setCurrentSimulatorNodeId(s.currentNodeId);
    setStepsExecuted(s.stepsExecuted);
    setLogs([...s.logs]);
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

        {/* Logs section */}
        <div className="border-b border-slate-800">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="w-full px-3 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <span className="font-medium flex items-center gap-2">
              <Logs size={14} /> Logs ({logs.length})
            </span>
            {showLogs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showLogs && (
            <div className="px-3 py-2 bg-slate-950 max-h-60 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-xs text-slate-500">No logs yet</div>
              ) : (
                logs.map((log, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-400 py-1 border-b border-slate-800 last:border-b-0"
                  >
                    <div className="text-slate-300 font-mono flex items-center gap-2">
                      <span className="text-slate-500">[{idx + 1}]</span>
                      <span className="text-yellow-400">{log.nodeType}</span>
                    </div>
                    <div className="text-slate-200 ml-6">{log.message}</div>
                    {log.data && (
                      <div className="text-slate-500 ml-6 text-xs">
                        {JSON.stringify(log.data, null, 0)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulatorPanel;
