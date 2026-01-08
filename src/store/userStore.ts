import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface UserState {
  user: UserProfile | null;
  projects: Project[];
  currentProjectId: string | null;

  // User actions
  setUser: (user: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;

  // Project actions
  createProject: (name: string, description?: string) => void;
  updateProjectName: (projectId: string, newName: string) => void;
  deleteProject: (projectId: string) => void;
  setCurrentProject: (projectId: string) => void;
  getProjects: () => Project[];
  getCurrentProject: () => Project | null;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  projects: [],
  currentProjectId: null,

  setUser: (user: UserProfile) => {
    set({ user });
    localStorage.setItem("telcoflow_user", JSON.stringify(user));
  },

  updateUserProfile: (updates: Partial<UserProfile>) => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, ...updates };
    set({ user: updated });
    localStorage.setItem("telcoflow_user", JSON.stringify(updated));
  },

  logout: () => {
    set({ user: null, projects: [], currentProjectId: null });
    localStorage.removeItem("telcoflow_user");
    localStorage.removeItem("telcoflow_projects");
  },

  createProject: (name: string, description?: string) => {
    const user = get().user;
    if (!user) return;

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
    };

    const projects = [...get().projects, newProject];
    set({ projects });
    localStorage.setItem("telcoflow_projects", JSON.stringify(projects));
  },

  updateProjectName: (projectId: string, newName: string) => {
    const projects = get().projects.map((p) =>
      p.id === projectId ? { ...p, name: newName, updatedAt: new Date() } : p
    );
    set({ projects });
    localStorage.setItem("telcoflow_projects", JSON.stringify(projects));
  },

  deleteProject: (projectId: string) => {
    const projects = get().projects.filter((p) => p.id !== projectId);
    const currentProjectId =
      get().currentProjectId === projectId ? null : get().currentProjectId;
    set({ projects, currentProjectId });
    localStorage.setItem("telcoflow_projects", JSON.stringify(projects));
  },

  setCurrentProject: (projectId: string) => {
    set({ currentProjectId: projectId });
    localStorage.setItem("telcoflow_currentProject", projectId);
  },

  getProjects: () => get().projects,

  getCurrentProject: () => {
    const projectId = get().currentProjectId;
    if (!projectId) return null;
    return get().projects.find((p) => p.id === projectId) || null;
  },
}));

// Initialize from localStorage
export const initializeUserStore = () => {
  try {
    const savedUser = localStorage.getItem("telcoflow_user");
    const savedProjects = localStorage.getItem("telcoflow_projects");
    const savedProjectId = localStorage.getItem("telcoflow_currentProject");

    if (savedUser) {
      useUserStore.setState({ user: JSON.parse(savedUser) });
    }
    if (savedProjects) {
      useUserStore.setState({ projects: JSON.parse(savedProjects) });
    }
    if (savedProjectId) {
      useUserStore.setState({ currentProjectId: savedProjectId });
    }
  } catch (error) {
    console.error("Failed to initialize user store:", error);
  }
};
