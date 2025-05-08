import api from './api';

export interface CommentDTO {
  content: string;
  userId: number;
  mangaId: number;
  replyTo?: number | null;
}
export interface CommentLike {
    id: number;
    commentId: number;
    userId: number;
    likedAt: string;
}
export interface CommentItem {
  id: number;
  content: string;
  userId: number;
  mangaId: number;
  replyTo?: number | null;
  createdAt: string;
  likes: CommentLike[];
  isDeleted: boolean;
  updatedAt: string;
}

// Create comment
export const createComment = async (payload: CommentDTO) => {
  const response = await api.post('/comments', payload);
  return response.data;
};

// Get all comments for a manga
export const getCommentsByManga = async (mangaId: number) => {
  const response = await api.get(`/comments/manga/${mangaId}`);
  return response.data;
};

// Update comment content
export const updateComment = async (commentId: number, newContent: string) => {
  const response = await api.put(`/comments/${commentId}`, newContent, {
    headers: { 'Content-Type': 'text/plain' }
  });
  return response.data;
};

// Delete (soft delete) a comment
export const deleteComment = async (commentId: number) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

// Toggle like/unlike a comment by user
export const toggleLikeComment = async (commentId: number, userId: number) => {
  const response = await api.post(`/comments/${commentId}/like`, null, {
    params: { userId }
  });
  return response.data;
};

// Get like count
export const getCommentLikeCount = async (commentId: number) => {
  const response = await api.get(`/comments/${commentId}/likes/count`);
  return response.data;
};
