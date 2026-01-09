import React, { useRef } from "react";
import { Upload, X } from "lucide-react";
import { useUserStore } from "../store/userStore";

interface AccountProps {
  isOpen: boolean;
  onClose: () => void;
}

const Account: React.FC<AccountProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      updateUserProfile({ profileImage: imageData });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col pointer-events-auto">
          {/* Header */}
          <div className="p-6 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-100">Profile</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-slate-700">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Upload size={16} />
                Upload Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadImage}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-950/50 border-t border-slate-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;

