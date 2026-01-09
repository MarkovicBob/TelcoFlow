import Account from "./components/Account";
import ConfirmDialog from "./components/ConfirmDialog";
import FlowCanvas from "./components/FlowCanvas";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NodeDetailsPanel from "./components/NodeDetailsPanel";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import SimulatorPanel from "./components/SimulatorPanel";
import TemplatesModal from "./components/TemplatesModal";
import Toolbar from "./components/Toolbar";
import ValidationPanel from "./components/ValidationPanel";
import { ReactFlowProvider } from "reactflow";
import { useFlowStore } from "./store/flowStore";
import { initializeUserStore, useUserStore } from "./store/userStore";

// src/App.tsx

const App: React.FC = () => {
  const { loadSavedFlow, saveFlow, nodes, edges, clearFlow } = useFlowStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileSimulatorOpen, setMobileSimulatorOpen] = useState(false);
  const [desktopSimulatorOpen, setDesktopSimulatorOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isDangerous?: boolean;
    isInfo?: boolean;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    isDangerous: false,
    isInfo: false,
    onConfirm: undefined,
  });

  // Initialize user store and load saved flow on mount
  useEffect(() => {
    initializeUserStore();

    // If no user, create a demo user
    const currentUser = useUserStore.getState().user;
    if (!currentUser) {
      useUserStore.setState({
        user: {
          id: "user-default",
          name: "Guest",
          email: "guest@telcoflow.local",
          createdAt: new Date(),
        },
      });
    }

    // Try to load saved flow, if it doesn't exist, start with empty canvas
    const flowLoaded = loadSavedFlow();
    if (!flowLoaded) {
      console.log("No saved flow, starting with empty canvas");
      clearFlow();
    }
  }, [loadSavedFlow, clearFlow]);

  // Auto-save every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (nodes.length > 0) {
        saveFlow();
        console.log("Auto-saved flow (2 min interval)");
      }
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [saveFlow, nodes]);

  // Auto-save when nodes or edges change (with debounce)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (nodes.length > 0) {
        saveFlow();
        console.log("Auto-saved flow (on change)");
      }
    }, 1000); // Wait 1 second after changes stop before saving

    return () => clearTimeout(timeout);
  }, [nodes, edges, saveFlow]);
  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      <Header onOpenAccount={() => setAccountOpen(true)} />

      <main className="flex flex-col md:flex-row flex-1 overflow-hidden relative min-h-0">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onMobileToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <div className="flex-1 flex flex-col min-h-[50vh]">
          <ReactFlowProvider>
            <Toolbar
              onOpenSimulator={() => setDesktopSimulatorOpen(true)}
              onOpenTemplates={() => setTemplatesOpen(true)}
              onOpenConfirmDialog={(
                title,
                message,
                onConfirm,
                isDangerous,
                isInfo
              ) => {
                setConfirmDialog({
                  isOpen: true,
                  title,
                  message,
                  isDangerous: isDangerous || false,
                  isInfo: isInfo || false,
                  onConfirm,
                });
              }}
            />
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
            <TemplatesModal
              isOpen={templatesOpen}
              onClose={() => setTemplatesOpen(false)}
              onTemplateLoaded={() => {
                setDesktopSimulatorOpen(true);
              }}
            />
            <ConfirmDialog
              isOpen={confirmDialog.isOpen}
              title={confirmDialog.title}
              message={confirmDialog.message}
              isDangerous={confirmDialog.isDangerous}
              isInfo={confirmDialog.isInfo}
              confirmText="Clear"
              cancelText="Cancel"
              onConfirm={() => {
                confirmDialog.onConfirm?.();
                setConfirmDialog({ ...confirmDialog, isOpen: false });
              }}
              onCancel={() =>
                setConfirmDialog({ ...confirmDialog, isOpen: false })
              }
            />
            <Account
              isOpen={accountOpen}
              onClose={() => setAccountOpen(false)}
              onOpenConfirmDialog={(
                title,
                message,
                onConfirm,
                isDangerous,
                isInfo
              ) => {
                setConfirmDialog({
                  isOpen: true,
                  title,
                  message,
                  isDangerous: isDangerous || false,
                  isInfo: isInfo || false,
                  onConfirm,
                });
              }}
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
