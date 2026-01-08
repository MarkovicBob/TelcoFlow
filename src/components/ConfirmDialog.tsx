import React from "react";
import { AlertCircle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isInfo?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  isInfo = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onCancel} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">
          {/* Header with Icon */}
          <div
            className={`p-6 border-b ${
              isDangerous
                ? "border-red-800 bg-red-900/20"
                : isInfo
                ? "border-blue-800 bg-blue-900/20"
                : "border-slate-700"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full ${
                  isDangerous
                    ? "bg-red-900/30"
                    : isInfo
                    ? "bg-blue-900/40"
                    : "bg-blue-900/30"
                }`}
              >
                <AlertCircle
                  size={24}
                  className={
                    isDangerous
                      ? "text-red-400"
                      : isInfo
                      ? "text-blue-500"
                      : "text-blue-400"
                  }
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-100 mb-1">
                  {title}
                </h2>
                <p className="text-sm text-slate-400">{message}</p>
              </div>
              <button
                onClick={onCancel}
                className="text-slate-400 hover:text-slate-200 transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="p-4 bg-slate-950/50 flex items-center gap-3 justify-end">
            {!isInfo && (
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all text-sm font-medium"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={isInfo ? onCancel : onConfirm}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all text-white ${
                isDangerous
                  ? "bg-red-600 hover:bg-red-700 border border-red-500"
                  : isInfo
                  ? "bg-blue-600 hover:bg-blue-700 border border-blue-500"
                  : "bg-blue-600 hover:bg-blue-700 border border-blue-500"
              }`}
            >
              {isInfo ? "OK" : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
