import FlowCanvas from "./components/FlowCanvas";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NodeDetailsPanel from "./components/NodeDetailsPanel";
import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import SimulatorPanel from "./components/SimulatorPanel";
import Toolbar from "./components/Toolbar";
import ValidationPanel from "./components/ValidationPanel";
import { ReactFlowProvider } from "reactflow";
import { useFlowStore } from "./store/flowStore";

// src/App.tsx

const App: React.FC = () => {
  const { loadSavedFlow, saveFlow, nodes } = useFlowStore();

  // Load saved flow on mount
  useEffect(() => {
    loadSavedFlow();
  }, [loadSavedFlow]);

  // Auto-save every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (nodes.length > 0) {
        saveFlow();
        console.log("Auto-saved flow");
      }
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [saveFlow, nodes]);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        <Sidebar />

        <div className="flex-1 flex flex-col min-h-[50vh]">
          <ReactFlowProvider>
            <Toolbar />
            <FlowCanvas />
            <ValidationPanel />
            <SimulatorPanel />
          </ReactFlowProvider>
        </div>
        <div className="hidden md:block">
          <NodeDetailsPanel />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
