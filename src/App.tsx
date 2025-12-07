import FlowCanvas from "./components/FlowCanvas";
import Header from "./components/Header";
import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import { ReactFlowProvider } from "reactflow";
import NodeDetailsPanel from "./components/NodeDetailsPanel";
import ValidationPanel from "./components/ValidationPanel";
import Footer from "./components/Footer";
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
