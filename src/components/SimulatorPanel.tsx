import { useMemo, useState } from "react";
import { Play, Pause, StepForward, RotateCcw, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { useFlowStore } from "../store/flowStore";
import { createSimulatorEngine } from "../utils/simulator/engine";

const SimulatorPanel = () => {
  const { nodes, edges, simulatorVariables, resetSimulatorVariables } = useFlowStore();
  const engine = useMemo(() => createSimulatorEngine(), []);
  const [initialized, setInitialized] = useState(false);
  const [status, setStatus] = useState("idle");
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [stepsExecuted, setStepsExecuted] = useState(0);
  const [showVariables, setShowVariables] = useState(false);

  const syncState = () => {
    const s = engine.getState();
    setStatus(s.status);
    setCurrentNodeId(s.currentNodeId);
    setStepsExecuted(s.stepsExecuted);
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
    engine.reset();
    syncState();
  };

  return (
    <div className="absolute bottom-4 left-4 bg-slate-900 border border-slate-800 rounded-lg w-96 shadow-lg overflow-hidden">
      <div className="p-3 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-300 font-medium">Simulator</div>
          <div className="text-xs text-slate-400">Status: <span className="text-slate-200">{status}</span></div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <button onClick={onPlay} className="px-2 py-1 rounded border border-blue-600 bg-blue-600 text-white text-xs flex items-center gap-1 hover:bg-blue-700">
            <Play size={14} /> Play
          </button>
          <button onClick={onPause} className="px-2 py-1 rounded border border-slate-700 text-slate-300 text-xs flex items-center gap-1 hover:bg-slate-800">
            <Pause size={14} /> Pause
          </button>
          <button onClick={onStep} className="px-2 py-1 rounded border border-slate-700 text-slate-300 text-xs flex items-center gap-1 hover:bg-slate-800">
            <StepForward size={14} /> Step
          </button>
          <button onClick={onReset} className="px-2 py-1 rounded border border-slate-700 text-slate-300 text-xs flex items-center gap-1 hover:bg-slate-800">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Eye size={14} /> Current: <span className="text-slate-200">{currentNodeId || "-"}</span>
          <span className="ml-auto">Steps: <span className="text-slate-200">{stepsExecuted}</span></span>
        </div>
      </div>

      {/* Variables section */}
      <div className="border-t border-slate-800">
        <button
          onClick={() => setShowVariables(!showVariables)}
          className="w-full px-3 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <span className="font-medium">Variables ({Object.keys(simulatorVariables).length})</span>
          {showVariables ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showVariables && (
          <div className="px-3 py-2 bg-slate-950 max-h-40 overflow-y-auto">
            {Object.keys(simulatorVariables).length === 0 ? (
              <div className="text-xs text-slate-500">No variables set yet</div>
            ) : (
              Object.entries(simulatorVariables).map(([key, value]) => (
                <div key={key} className="text-xs text-slate-400 py-1 border-b border-slate-800 last:border-b-0">
                  <span className="text-slate-300 font-mono">{key}</span>: <span className="text-slate-200">{JSON.stringify(value)}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulatorPanel;
