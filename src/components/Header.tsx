import React from "react";
import { useState } from "react";
import { useFlowStore } from "../store/flowStore";
import { useUserStore } from "../store/userStore";
import { exportMarkdown } from "../utils/exportDocs";
import { exportCanvasPDF, exportCanvasPNG } from "../utils/exportImage";

import {
  Download,
  FileText,
  ImageDown,
  LogOut,
  Settings,
  User,
  Zap,
} from "lucide-react";

interface HeaderProps {
  onOpenAccount?: () => void;
}

// src/components/Header.tsx

const Header: React.FC<HeaderProps> = ({ onOpenAccount }) => {
  const { projectMetadata, setProjectMetadata, exportFlow, nodes, edges } =
    useFlowStore();
  const { user, logout } = useUserStore();
  const [accountOpen, setAccountOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [projectName, setProjectName] = useState(projectMetadata.name);

  const handleSaveProjectName = () => {
    if (projectName.trim()) {
      setProjectMetadata({ ...projectMetadata, name: projectName });
      setEditingName(false);
    }
  };

  const exportJson = () => {
    exportFlow();
  };

  const exportDocs = () => {
    exportMarkdown(nodes, edges, projectMetadata);
  };

  const exportPng = () => {
    exportCanvasPNG();
  };

  const exportPdf = () => {
    exportCanvasPDF();
  };

  return (
    <header className="h-12 md:h-14 lg:h-16 bg-slate-900 border-b border-slate-800 px-3 md:px-4 lg:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 md:gap-3">
        <Zap className="text-blue-500" size={20} />
        <div>
          <h1 className="text-base md:text-lg lg:text-xl font-semibold text-slate-100">
            TelcoFlow
          </h1>
          <p className="text-[10px] md:text-xs text-slate-400">
            Low-Code Call Flow Builder
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
        <div className="hidden md:flex items-center gap-2">
          <div className="text-sm text-slate-400 flex items-center gap-2">
            Project:{" "}
            {editingName ? (
              <div className="flex gap-1 items-center">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSaveProjectName()
                  }
                  className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 w-32 text-sm focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleSaveProjectName}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setEditingName(false);
                    setProjectName(projectMetadata.name);
                  }}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="text-slate-200 font-medium hover:text-blue-400 transition-colors cursor-pointer"
              >
                {projectMetadata.name}
              </button>
            )}
          </div>
          <button
            onClick={exportJson}
            className="flex items-center gap-1 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 hover:bg-slate-700"
            title="Export JSON"
          >
            <Download size={14} /> JSON
          </button>
          <button
            onClick={exportDocs}
            className="flex items-center gap-1 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 hover:bg-slate-700"
            title="Export Docs (Markdown)"
          >
            <FileText size={14} /> Docs
          </button>
          <button
            onClick={exportPng}
            className="flex items-center gap-1 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 hover:bg-slate-700"
            title="Export Canvas (PNG)"
          >
            <ImageDown size={14} /> PNG
          </button>
          <button
            onClick={exportPdf}
            className="flex items-center gap-1 text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 hover:bg-slate-700"
            title="Export Canvas (PDF)"
          >
            <FileText size={14} /> PDF
          </button>
        </div>

        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all relative"
              title="Account"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={18} className="text-white" />
              )}
            </button>

            {/* Account Dropdown */}
            {accountOpen && user && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAccountOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
                  {/* User Info */}
                  <div className="p-3 border-b border-slate-700 bg-slate-900/50">
                    <p className="text-sm font-semibold text-slate-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        onOpenAccount?.();
                        setAccountOpen(false);
                        // Account modal will be handled by parent
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setAccountOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
