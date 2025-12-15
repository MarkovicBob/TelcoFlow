import React from "react";
import { User, Zap } from "lucide-react";

// src/components/Header.tsx

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Zap className="text-blue-500" size={24} />
        <div>
          <h1 className="text-xl font-semibold text-slate-100">TelcoFlow</h1>
          <p className="text-xs text-slate-400">Low-Code Call Flow Builder</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-400">
          Project:{" "}
          <span className="text-slate-200 font-medium">
            Customer Support IVR
          </span>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
          <User size={18} className="text-white" />
        </div>
      </div>
    </header>
  );
};

export default Header;
