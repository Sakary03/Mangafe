import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Button, Tooltip, Popconfirm, App, Spin } from 'antd';
import {
  LikeOutlined,
  LikeFilled,
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as userServices from '../../../libs/userService';
import * as commentServices from '../../../libs/commentServices';

// Initialize dayjs plugins
dayjs.extend(relativeTime);

interface CommentSectionProps {
  mangaId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ mangaId }) => {
  const { message: messageApi } = App.useApp();
  const [comments, setComments] = useState<commentServices.CommentItem[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyToUser, setReplyToUser] = useState<string>('');
  const [replyContent, setReplyContent] = useState<string>('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [currentUser, setCurrentUser] =
    useState<userServices.UserResponse | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const usersCache = useRef<Map<number, userServices.UserResponse>>(new Map());
  const inlineReplyFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userLoggedInfo = await userServices.getMyInfo();

        const isUserLoggedIn = Boolean(userLoggedInfo && userLoggedInfo.userID);
        setIsLoggedIn(isUserLoggedIn);

        if (isUserLoggedIn) {
          setCurrentUserId(userLoggedInfo.userID || 0);
          setCurrentUser(userLoggedInfo);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        setIsLoggedIn(false);
      }
    };

    fetchUserInfo();
  }, [messageApi]);

  // Load comments
  useEffect(() => {
    loadComments();
  }, [mangaId]);

  // Focus on comment input when replying or editing
  useEffect(() => {
    if (
      (replyTo !== null || editingComment !== null) &&
      commentInputRef.current
    ) {
      commentInputRef.current.focus();
    }
  }, [replyTo, editingComment]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentList = await commentServices.getCommentsByManga(mangaId);
      setComments(commentList);
    } catch (error) {
      console.error('Error loading comments:', error);
      messageApi.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const checkUserLoggedIn = (): boolean => {
    if (!isLoggedIn) {
      messageApi.error({
        content: 'Please log in to perform this action',
        icon: <LoginOutlined style={{ color: '#ff4d4f' }} />,
      });
      return false;
    }
    return true;
  };

  const handleLikeComment = async (commentId: number) => {
    if (!checkUserLoggedIn()) return;

    try {
      await commentServices.toggleLikeComment(commentId, currentUserId);
      await loadComments();
    } catch (error) {
      console.error('Error toggling like:', error);
      messageApi.error('Failed to like/unlike comment');
    }
  };

  // Direct input handling through inline onChange handlers

  const handleSubmitComment = async () => {
    if (!checkUserLoggedIn()) return;

    if (!commentText.trim()) {
      messageApi.warning('Please enter a comment');
      return;
    }

    try {
      setSubmitting(true);

      const newComment: commentServices.CommentDTO = {
        content: commentText.trim(),
        userId: currentUserId,
        mangaId,
        replyTo: replyTo,
      };

      await commentServices.createComment(newComment);
      await loadComments();

      setCommentText('');
      setReplyTo(null);
      setReplyToUser('');
      setReplyContent('');
      messageApi.success(
        replyTo ? 'Reply posted successfully' : 'Comment posted successfully',
      );
    } catch (error) {
      console.error('Error posting comment:', error);
      messageApi.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async () => {
    if (!checkUserLoggedIn()) return;

    if (!commentText.trim() || !editingComment) {
      messageApi.warning('Please enter a comment');
      return;
    }

    try {
      setSubmitting(true);
      await commentServices.updateComment(editingComment, commentText.trim());
      await loadComments();

      setCommentText('');
      setEditingComment(null);
      messageApi.success('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      messageApi.error('Failed to update comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!checkUserLoggedIn()) return;

    try {
      await commentServices.deleteComment(commentId);
      await loadComments();
      messageApi.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      messageApi.error('Failed to delete comment');
    }
  };

  const handleReply = async (comment: commentServices.CommentItem) => {
    if (!checkUserLoggedIn()) return;

    setReplyTo(comment.id);
    setEditingComment(null);
    setCommentText('');
    setReplyContent(comment.content);

    // Get the username for the reply prompt
    try {
      let user: userServices.UserResponse;

      if (usersCache.current.has(comment.userId)) {
        user = usersCache.current.get(comment.userId)!;
      } else {
        user = await userServices.getUserById(comment.userId);
        usersCache.current.set(comment.userId, user);
      }

      setReplyToUser(user.userName || 'user');
    } catch (error) {
      console.error('Error fetching user for reply:', error);
      setReplyToUser('user');
    }
  };

  const handleEdit = (comment: commentServices.CommentItem) => {
    if (!checkUserLoggedIn()) return;

    setEditingComment(comment.id);
    setReplyTo(null);
    setReplyToUser('');
    setReplyContent('');
    setCommentText(comment.content);

    // Scroll to comment form
    scrollToCommentForm();
  };

  const scrollToCommentForm = () => {
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
      commentForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const cancelAction = () => {
    setEditingComment(null);
    setReplyTo(null);
    setReplyToUser('');
    setReplyContent('');
    setCommentText('');
  };

  // Filter top-level comments and replies
  const topLevelComments = comments.filter(
    comment => !comment.replyTo && !comment.isDeleted,
  );

  const getReplies = (commentId: number) => {
    return comments.filter(
      comment => comment.replyTo === commentId && !comment.isDeleted,
    );
  };

  const fetchUser = async (userId: number) => {
    if (usersCache.current.has(userId)) {
      return usersCache.current.get(userId)!;
    }

    try {
      const user = await userServices.getUserById(userId);
      usersCache.current.set(userId, user);
      return user;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      return null;
    }
  };

  const renderCommentActions = (comment: commentServices.CommentItem) => {
    const hasLiked = comment.likes.some(like => like.userId === currentUserId);

    const actions: React.ReactNode[] = [
      <Tooltip
        key="like"
        title={isLoggedIn ? (hasLiked ? 'Unlike' : 'Like') : 'Log in to like'}
      >
        <span
          onClick={() => handleLikeComment(comment.id)}
          className={`flex items-center cursor-pointer transition-colors ${
            isLoggedIn ? 'hover:text-blue-500' : 'opacity-70'
          }`}
        >
          {hasLiked ? (
            <LikeFilled className="text-blue-500" />
          ) : (
            <LikeOutlined />
          )}
          <span className="ml-1">{comment.likes.length}</span>
        </span>
      </Tooltip>,
      <Tooltip key="reply" title={isLoggedIn ? 'Reply' : 'Log in to reply'}>
        <span
          onClick={() => handleReply(comment)}
          className={`flex items-center cursor-pointer transition-colors ${
            isLoggedIn ? 'hover:text-blue-500' : 'opacity-70'
          }`}
        >
          <MessageOutlined />
          <span className="ml-1">Reply</span>
        </span>
      </Tooltip>,
    ];

    // Only show edit/delete if the user is the comment author
    if (comment.userId === currentUserId) {
      actions.push(
        <Tooltip key="edit" title="Edit">
          <span
            onClick={() => handleEdit(comment)}
            className="flex items-center cursor-pointer hover:text-blue-500 transition-colors"
          >
            <EditOutlined />
            <span className="ml-1">Edit</span>
          </span>
        </Tooltip>,
        <Popconfirm
          key="delete"
          title="Delete comment"
          description="Are you sure you want to delete this comment?"
          onConfirm={() => handleDeleteComment(comment.id)}
          okText="Yes"
          cancelText="No"
        >
          <span className="flex items-center cursor-pointer text-red-500 hover:text-red-700 transition-colors">
            <DeleteOutlined />
            <span className="ml-1">Delete</span>
          </span>
        </Popconfirm>,
      );
    }

    return actions;
  };

  const renderInlineReplyForm = (comment: commentServices.CommentItem) => {
    if (replyTo !== comment.id) return null;

    return (
      <div
        ref={inlineReplyFormRef}
        className="mt-4 ml-8 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fadeIn"
      >
        <div className="mb-3 p-2 bg-white rounded flex items-start border-l-4 border-blue-400">
          <InfoCircleOutlined className="mr-2 mt-1 text-blue-500" />
          <div className="flex-1">
            <div className="mb-1">
              <span className="font-medium">Replying to </span>
              <span className="text-blue-600">{replyToUser}</span>
            </div>
            <div className="text-gray-600 text-sm pl-2 border-l-2 border-gray-200 italic">
              {replyContent.length > 100
                ? `${replyContent.substring(0, 100)}...`
                : replyContent}
            </div>
          </div>
          <Button
            type="text"
            icon={<CloseCircleOutlined />}
            onClick={cancelAction}
            size="small"
            className="text-gray-500 hover:text-red-500"
          />
        </div>

        <div className="flex">
          <div className="mr-3 flex-shrink-0 mt-1">
            <Avatar
              src={currentUser?.avatarUrl}
              alt={currentUser?.userName}
              className="border border-blue-200"
            >
              {currentUser?.userName?.[0]?.toUpperCase() || '?'}
            </Avatar>
          </div>

          <div className="flex-grow">
            <textarea
              rows={3}
              placeholder={`Write your reply to ${replyToUser}...`}
              value={commentText}
              onInput={e =>
                setCommentText((e.target as HTMLTextAreaElement).value)
              }
              ref={commentInputRef}
              autoFocus
              className="w-full rounded-lg mb-2 p-2 border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <Button onClick={cancelAction}>Cancel</Button>
              <Button
                type="primary"
                onClick={handleSubmitComment}
                loading={submitting}
                icon={<SendOutlined />}
                className="flex items-center"
              >
                Post Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Effect to scroll to inline reply form when it appears
  useEffect(() => {
    if (replyTo && inlineReplyFormRef.current) {
      setTimeout(() => {
        inlineReplyFormRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [replyTo]);

  const CommentItem: React.FC<{
    comment: commentServices.CommentItem;
    level?: number;
  }> = ({ comment, level = 0 }) => {
    const replies = getReplies(comment.id);
    const [user, setUser] = useState<userServices.UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const getUserInfo = async () => {
        setIsLoading(true);
        console.log('Fetching user info for comment:', comment);
        const fetchedUser = await fetchUser(comment.userId);
        setUser(fetchedUser);
        setIsLoading(false);
      };

      getUserInfo();
    }, [comment, comment.userId]);

    if (isLoading) {
      return (
        <div className="flex items-center space-x-2 py-4">
          <Spin size="small" />
          <span className="text-gray-400">Loading comment...</span>
        </div>
      );
    }

    const isDeepNested = level >= 3;

    return (
      <div
        className={`mb-4 ${level > 0 ? 'pl-4 border-l-2 border-gray-100' : ''}`}
        id={`comment-${comment.id}`}
      >
        <div className="flex">
          <div className="mr-3 flex-shrink-0">
            <Avatar
              src={user?.avatarUrl}
              alt={user?.userName}
              className="border border-gray-200"
            >
              {user?.userName?.[0]?.toUpperCase() || '?'}
            </Avatar>
          </div>
          <div className="flex-grow">
            <div className="flex items-center">
              <span className="font-medium text-gray-900">
                {user?.userName || 'Unknown User'}
              </span>
              <Tooltip
                title={dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              >
                <span className="text-gray-400 text-sm ml-2">
                  {dayjs(comment.createdAt).fromNow()}
                </span>
              </Tooltip>
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                <span className="text-gray-400 ml-2 text-xs">(edited)</span>
              )}
            </div>

            <div className="mt-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <p className="m-0 whitespace-pre-line">{comment.content}</p>
            </div>

            <div className="mt-2 flex space-x-6">
              {renderCommentActions(comment)}
            </div>
          </div>
        </div>

        {/* Inline reply form */}
        {renderInlineReplyForm(comment)}

        {/* Render replies */}
        {replies.length > 0 && (
          <div className={`mt-3 ${isDeepNested ? 'ml-4' : 'ml-8'}`}>
            {replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        Comments
        {loading && <Spin size="small" className="ml-3" />}
      </h2>

      {/* Render top-level comments */}
      <div className="mb-8">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : topLevelComments.length > 0 ? (
          topLevelComments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
            <p className="text-lg">Be the first to comment!</p>
            <p className="text-sm">Share your thoughts about this manga.</p>
          </div>
        )}
      </div>

      {/* Main comment form - only for new top-level comments, not for replies */}
      {!replyTo && (
        <div id="commentForm" className="mt-8 bg-gray-50 p-4 rounded-lg">
          {/* Edit info */}
          {editingComment && (
            <div className="bg-yellow-50 p-3 mb-4 rounded-lg flex justify-between items-center">
              <span className="font-medium">Editing your comment</span>
              <Button
                type="text"
                onClick={cancelAction}
                icon={<CloseCircleOutlined />}
                className="hover:text-red-500"
              >
                Cancel
              </Button>
            </div>
          )}

          {!isLoggedIn ? (
            <div className="text-center py-4">
              <p className="mb-3 text-gray-600">
                <LoginOutlined className="mr-2" />
                Please log in to post comments
              </p>
              <Button type="primary">Log In</Button>
            </div>
          ) : (
            <div className="flex">
              {/* Current User Avatar */}
              <div className="mr-3 flex-shrink-0 mt-1">
                <Avatar
                  src={currentUser?.avatar}
                  alt={currentUser?.userName}
                  className="border border-gray-200"
                >
                  {currentUser?.userName?.[0]?.toUpperCase() || '?'}
                </Avatar>
              </div>

              <div className="flex-grow">
                <div className="mb-3">
                  <textarea
                    rows={4}
                    placeholder="Write your comment here..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    className="w-full rounded-lg p-2 border border-gray-300 focus:border-blue-500 focus:outline-none"
                    ref={
                      commentInputRef as React.RefObject<HTMLTextAreaElement>
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="primary"
                    onClick={
                      editingComment ? handleUpdateComment : handleSubmitComment
                    }
                    loading={submitting}
                    icon={<SendOutlined />}
                    className="flex items-center"
                  >
                    {editingComment ? 'Update Comment' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;