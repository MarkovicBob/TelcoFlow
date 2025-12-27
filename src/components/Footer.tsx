import { Clock } from "lucide-react";
import { useFlowStore } from "../store/flowStore";

// src/components/Footer.tsx

const Footer = () => {
  const lastSaved = useFlowStore((state) => state.lastSaved);

  const formatTimestamp = (date: Date | null) => {
    if (!date) return "Never saved";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins === 0) return "Just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;

    // For older saves, show exact time
    return date.toLocaleString();
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 px-3 py-1.5 shrink-0 hidden lg:block">
      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          <span>Last saved: {formatTimestamp(lastSaved)}</span>
        </div>
        <div>TelcoFlow v1.0</div>
      </div>
    </div>
  );
};

export default Footer;
