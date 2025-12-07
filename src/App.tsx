// src/App.tsx
import React from "react";
import { ReactFlowProvider } from "reactflow";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import FlowCanvas from "./components/FlowCanvas";
import Toolbar from "./components/Toolbar";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <ReactFlowProvider>
            <Toolbar />
            <FlowCanvas />
          </ReactFlowProvider>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Auto-saved just now</span>
        </div>
        <div>
          <span>Built with ❤️ by Bob | December 2025</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
