import { useState, useEffect } from 'react';
import { projectsApi } from '../api/projects.api';
import type { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProjectModal } from '../components/projects/ProjectModal';
import { MemberManagementModal } from '../components/projects/MemberManagementModal';
import { Badge } from '../components/common/Badge';
import {
  Plus,
  Users,
  Search,
  ArrowRight,
  MoreHorizontal,
  Edit2,
  Trash2,
  Folder,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [managingMembersProject, setManagingMembersProject] = useState<Project | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectsApi.getProjects();
      setProjects(res.projects || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateOrUpdate = async (data: { name: string; description?: string }) => {
    if (editingProject) {
      const res = await projectsApi.updateProject(editingProject._id, data);
      setProjects((prev) =>
        prev.map((p) => (p._id === editingProject._id ? res.project : p))
      );
    } else {
      const res = await projectsApi.createProject(data);
      setProjects((prev) => [res.project, ...prev]);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Delete this project? All associated data will be removed.')) {
      return;
    }
    try {
      await projectsApi.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete project');
    }
  };

  const handleAddMember = async (projectId: string, userId: string) => {
    const res = await projectsApi.addMember(projectId, userId);
    setProjects((prev) =>
      prev.map((p) => (p._id === projectId ? res.project : p))
    );
    setManagingMembersProject(res.project);
  };

  const handleRemoveMember = async (projectId: string, userId: string) => {
    const res = await projectsApi.removeMember(projectId, userId);
    setProjects((prev) =>
      prev.map((p) => (p._id === projectId ? res.project : p))
    );
    setManagingMembersProject(res.project);
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Projects
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Workspaces and teams you are part of
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
          className="px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-3.5 h-3.5" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter projects..."
          className="w-full bg-[#10121a] border border-zinc-800 focus:border-zinc-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 transition-colors"
        />
      </div>

      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="md" label="Loading projects..." />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-[#12141d] border border-zinc-800/80 rounded-xl p-10 text-center space-y-3">
          <Folder className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-sm font-medium text-zinc-300">
            {searchTerm ? 'No matching projects' : 'No projects yet'}
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {searchTerm
              ? 'Try searching with another term.'
              : 'Create a project to organize tasks and invite teammates.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => {
                setEditingProject(null);
                setIsModalOpen(true);
              }}
              className="mt-1 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create project</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const isOwner = user?._id && project.owner === user._id;

            return (
              <div
                key={project._id}
                className="bg-[#12141d] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 flex flex-col justify-between space-y-3.5 group transition-all relative shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="role" value={isOwner ? 'owner' : 'member'} />

                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === project._id ? null : project._id)
                        }
                        className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuId === project._id && (
                        <div
                          className="absolute right-0 mt-1 w-40 bg-[#161822] border border-zinc-800 rounded-lg shadow-lg py-1 z-20"
                          onMouseLeave={() => setActiveMenuId(null)}
                        >
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              setManagingMembersProject(project);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
                          >
                            <Users className="w-3 h-3 text-zinc-400" />
                            <span>Members</span>
                          </button>

                          {isOwner && (
                            <>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setEditingProject(project);
                                  setIsModalOpen(true);
                                }}
                                className="w-full px-3 py-1.5 text-left text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
                              >
                                <Edit2 className="w-3 h-3 text-zinc-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleDelete(project._id);
                                }}
                                className="w-full px-3 py-1.5 text-left text-xs text-rose-300 hover:bg-zinc-800 flex items-center gap-2"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Link to={`/projects/${project._id}`} className="block group-hover:text-zinc-100">
                    <h3 className="font-semibold text-sm text-zinc-200 transition-colors truncate">
                      {project.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed min-h-[2rem]">
                    {project.description || 'No description.'}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between">
                  <button
                    onClick={() => setManagingMembersProject(project)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{project.members?.length || 1} members</span>
                  </button>

                  <Link
                    to={`/projects/${project._id}`}
                    className="flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialProject={editingProject}
      />

      <MemberManagementModal
        project={managingMembersProject}
        isOpen={!!managingMembersProject}
        onClose={() => setManagingMembersProject(null)}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />
    </div>
  );
}
