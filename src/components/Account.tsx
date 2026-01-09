import React, { useRef, useState } from "react";
import { Plus, Settings, Trash2, Upload, X, AlertCircle } from "lucide-react";
import { useUserStore } from "../store/userStore";
import { useFlowStore } from "../store/flowStore";

interface AccountProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConfirmDialog?: (
    title: string,
    message: string,
    onConfirm: () => void,
    isDangerous?: boolean,
    isInfo?: boolean
  ) => void;
}

const Account: React.FC<AccountProps> = ({ isOpen, onClose, onOpenConfirmDialog }) => {
  const {
    user,
    updateUserProfile,
    projects,
    currentProjectId,
    setCurrentProject,
    createProject,
    deleteProject,
  } = useUserStore();
  const { clearFlow } = useFlowStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

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

  const handleSaveName = () => {
    if (newName.trim()) {
      updateUserProfile({ name: newName });
      setEditName(false);
    }
  };

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName);
      setNewProjectName("");
      setShowNewProject(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
          {/* Header */}
          <div className="p-6 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-100">
              Account Settings
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Profile Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <Settings size={20} />
                Profile
              </h3>

              {/* Profile Image */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-slate-700">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
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

              {/* Name Edit */}
              <div className="space-y-2">
                <label className="block text-sm text-slate-400">
                  Full Name
                </label>
                {editName ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditName(false);
                        setNewName(user.name);
                      }}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-100">{user.name}</span>
                    <button
                      onClick={() => setEditName(true)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm text-slate-400">Email</label>
                <p className="text-slate-100">{user.email}</p>
              </div>

              {/* Member Since */}
              <div className="space-y-2">
                <label className="block text-sm text-slate-400">
                  Member Since
                </label>
                <p className="text-slate-100">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-100">
                  My Projects
                </h3>
                <button
                  onClick={() => setShowNewProject(!showNewProject)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2 transition-colors text-sm"
                >
                  <Plus size={16} />
                  New Project
                </button>
              </div>

              {/* New Project Form */}
              {showNewProject && (
                <div className="bg-slate-900/50 border border-slate-700 rounded p-4 space-y-2">
                  <input
                    type="text"
                    placeholder="Project name..."
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleCreateProject()
                    }
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateProject}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowNewProject(false);
                        setNewProjectName("");
                      }}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Projects List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {projects.length === 0 ? (
                  <p className="text-slate-400 text-sm">No projects yet</p>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className={`p-3 rounded border transition-all cursor-pointer ${
                        currentProjectId === project.id
                          ? "bg-blue-900/30 border-blue-500"
                          : "bg-slate-900/30 border-slate-700 hover:border-slate-600"
                      }`}
                      onClick={() => setCurrentProject(project.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-100 font-medium">
                            {project.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(project.id);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-950/50 border-t border-slate-700 flex justify-between items-center">
            <button
              onClick={() => {
                onOpenConfirmDialog?.(
                  "Reset All Data",
                  "Are you sure you want to clear the canvas and reset all flow data? This action cannot be undone.",
                  () => {
                    clearFlow();
                    localStorage.removeItem("telcoflow_saved");
                  },
                  true,
                  false
                );
              }}
              className="px-3 py-2 text-red-400 hover:text-red-300 transition-colors text-sm flex items-center gap-2 border border-red-900 hover:border-red-700 rounded"
            >
              <AlertCircle size={16} />
              Reset Canvas
            </button>
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
