import FlowCanvas from "./components/FlowCanvas";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NodeDetailsPanel from "./components/NodeDetailsPanel";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import SimulatorPanel from "./components/SimulatorPanel";
import Toolbar from "./components/Toolbar";
import ValidationPanel from "./components/ValidationPanel";
import { ReactFlowProvider } from "reactflow";
import { useFlowStore } from "./store/flowStore";

// src/App.tsx

const App: React.FC = () => {
  const { loadSavedFlow, saveFlow, nodes } = useFlowStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileSimulatorOpen, setMobileSimulatorOpen] = useState(false);
  const [desktopSimulatorOpen, setDesktopSimulatorOpen] = useState(false);

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
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      <Header />

      <main className="flex flex-col md:flex-row flex-1 overflow-hidden relative min-h-0">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onMobileToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <div className="flex-1 flex flex-col min-h-[50vh]">
          <ReactFlowProvider>
            <Toolbar onOpenSimulator={() => setDesktopSimulatorOpen(true)} />
            <FlowCanvas
              onOpenSidebar={() => setMobileSidebarOpen(true)}
              onOpenSimulator={() => setMobileSimulatorOpen(true)}
            />
            <ValidationPanel />
            <SimulatorPanel
              mobileOpen={mobileSimulatorOpen}
              onMobileToggle={() =>
                setMobileSimulatorOpen(!mobileSimulatorOpen)
              }
              desktopOpen={desktopSimulatorOpen}
              onDesktopToggle={() =>
                setDesktopSimulatorOpen(!desktopSimulatorOpen)
              }
            />
          </ReactFlowProvider>
        </div>
        <NodeDetailsPanel />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
