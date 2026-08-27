import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Project } from '../../types';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Shield, User as UserIcon } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface MemberManagementModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (projectId: string, email: string) => Promise<void>;
  onRemoveMember: (projectId: string, userId: string) => Promise<void>;
}

export const MemberManagementModal: React.FC<MemberManagementModalProps> = ({
  project,
  isOpen,
  onClose,
  onAddMember,
  onRemoveMember,
}) => {
  const { user } = useAuth();
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!project) return null;

  const isOwner = user?._id && project.owner === user._id;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await onAddMember(project._id, newMemberEmail.trim());
      setNewMemberEmail('');
    } catch (err: any) {
      setError(err?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      setError(null);
      await onRemoveMember(project._id, userId);
    } catch (err: any) {
      setError(err?.message || 'Failed to remove member');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Project Members — ${project.name}`} maxWidth="md">
      <div className="space-y-4">
        {error && (
          <div className="p-2.5 text-xs bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Member Form (Only Owner) */}
        {isOwner ? (
          <form onSubmit={handleAdd} className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Invite by email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="teammate@work.com"
                className="flex-1 bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !newMemberEmail.trim()}
                className="px-3.5 py-2 bg-zinc-100 hover:bg-white disabled:opacity-40 text-zinc-900 rounded-lg font-semibold text-xs transition-colors shrink-0"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Invite'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs text-zinc-400 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>Only the project owner can manage members.</span>
          </div>
        )}

        {/* Members List */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Team ({project.members?.length || 0})
          </div>

          <div className="divide-y divide-zinc-800/60 border border-zinc-800/80 rounded-lg bg-[#0d0f15] overflow-hidden">
            {project.members?.map((member) => {
              const memberUser = typeof member.user === 'object' ? member.user : null;
              const memberId = typeof member.user === 'object' ? member.user._id : member.user;
              const isProjectOwnerMember = memberId === project.owner || member.role === 'owner';

              return (
                <div key={memberId} className="p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-200">
                      {memberUser?.name ? (
                        memberUser.name.charAt(0).toUpperCase()
                      ) : (
                        <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-zinc-200">
                        {memberUser?.name || 'Member'}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        {memberUser?.email || memberId}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="role" value={member.role} />

                    {isOwner && !isProjectOwnerMember && (
                      <button
                        onClick={() => handleRemove(memberId as string)}
                        className="p-1 text-zinc-400 hover:text-rose-400 rounded transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
