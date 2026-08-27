import React, { useState, useEffect } from 'react';
import type { Comment } from '../../types';
import { commentsApi } from '../../api/comments.api';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Trash2, Edit2, Check, X } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface CommentSectionProps {
  taskId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ taskId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newContent, setNewContent] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await commentsApi.getComments(taskId);
      setComments(res.comments || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchComments();
    }
  }, [taskId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      await commentsApi.createComment(taskId, newContent.trim());
      setNewContent('');
      await fetchComments();
    } catch (err: any) {
      setError(err?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentsApi.deleteComment(taskId, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete comment');
    }
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    try {
      await commentsApi.updateComment(taskId, commentId, editContent.trim());
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, content: editContent.trim() } : c))
      );
      setEditingCommentId(null);
      setEditContent('');
    } catch (err: any) {
      alert(err?.message || 'Failed to update comment');
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
        <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
        <span>Comments ({comments.length})</span>
      </div>

      {error && (
        <div className="p-2.5 text-xs bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Add comment form */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Leave a comment or update..."
          className="flex-1 bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 transition-colors"
        />
        <button
          type="submit"
          disabled={submitting || !newContent.trim()}
          className="px-3.5 py-2 bg-zinc-100 hover:bg-white disabled:opacity-40 text-zinc-900 rounded-lg font-semibold text-xs transition-colors shrink-0"
        >
          {submitting ? <LoadingSpinner size="sm" /> : 'Post'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-2 pt-1">
        {loading ? (
          <div className="py-4 flex justify-center">
            <LoadingSpinner size="sm" label="Loading..." />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-xs text-zinc-400 py-3 text-center bg-zinc-900/30 rounded-lg border border-zinc-800/50">
            No comments yet.
          </p>
        ) : (
          comments.map((c) => {
            const commenterName =
              typeof c.userId === 'object' && c.userId !== null
                ? c.userId.name
                : 'User';
            const commenterId =
              typeof c.userId === 'object' && c.userId !== null
                ? c.userId._id
                : c.userId;

            const isAuthor =
              user?._id && commenterId && user._id.toString() === commenterId.toString();

            const isEditing = editingCommentId === c._id;

            return (
              <div
                key={c._id}
                className="bg-[#0e1017] border border-zinc-800/80 rounded-lg p-3 space-y-1.5 group transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-300 flex items-center justify-center">
                      {commenterName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-zinc-200">
                      {commenterName}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {new Date(c.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {isAuthor && !isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEdit(c)}
                        className="p-1 text-zinc-400 hover:text-zinc-200 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="p-1 text-zinc-400 hover:text-rose-400 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-600 rounded px-2.5 py-1 text-xs text-white outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(c._id)}
                      className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-300 leading-relaxed pl-7 break-words font-normal">
                    {c.content}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
