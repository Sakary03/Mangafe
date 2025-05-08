import React, { useState, useEffect } from 'react';
import { Avatar, Button, Input, Tooltip, Popconfirm, App } from 'antd';
import { LikeOutlined, LikeFilled, MessageOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as userServices from '../../../libs/userService.ts';
import * as commentServices from '../../../libs/commentServices.ts';

// Initialize dayjs plugins
dayjs.extend(relativeTime);

interface CommentSectionProps {
  mangaId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ mangaId }) => {
  const { message: messageApi } = App.useApp();
  const [comments, setComments] = useState<commentServices.CommentItem[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<number>(0);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userLoggedInfo = await userServices.getMyInfo();
      setCurrentUserId(userLoggedInfo.userId ? userLoggedInfo.userId : 0);
      console.log("Current user logging in", userLoggedInfo);
    };

    fetchUserInfo();
  }, []);
  useEffect(() => {
    
    loadComments();
  }, [mangaId]);

  const loadComments = async () => {
    const commentList = await commentServices.getCommentsByManga(mangaId);
    console.log("Checking comments", commentList);
    setComments(commentList);
  };

  const handleLikeComment = async (commentId: number) => {
    const likeCommentResponse = commentServices.toggleLikeComment(commentId, currentUserId);
    console.log("Checking like comment response", likeCommentResponse);
    await loadComments()
    // In a real app, make API call to update likes
  };

  const handleSubmitComment =async () => {
    if (!commentText.trim()) {
      messageApi.warning('Please enter a comment');
      return;
    }
    
    setSubmitting(true);
    
    // Create new comment object
    const newComment: commentServices.CommentDTO = {
      content: commentText.trim(),
      userId: currentUserId,
      mangaId,
      replyTo: replyTo
    };
    
    const createCommentResponse = await commentServices.createComment(newComment);
    console.log("Checking create comment response", createCommentResponse);
    setCommentText('');
    setReplyTo(null);
    setSubmitting(false);
    messageApi.success(replyTo ? 'Reply posted successfully' : 'Comment posted successfully');
  };

  const handleUpdateComment =async () => {
    if (!commentText.trim() || !editingComment) {
      messageApi.warning('Please enter a comment');
      return;
    }
    
    setSubmitting(true);
  
    
    const updateComment = commentServices.updateComment(editingComment, commentText.trim());
    console.log("Checking update comment response", updateComment);
    await loadComments();
    setCommentText('');
    setEditingComment(null);
    setSubmitting(false);
    messageApi.success('Comment updated successfully');
    };

  const handleDeleteComment = (commentId: number): void => {
    // In a real app, make API call to delete/mark as deleted
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, isDeleted: true, content: "This comment has been deleted" };
      }
      return comment;
    });
    
    setComments(updatedComments);
    messageApi.success('Comment deleted successfully');
  };

  const handleReply = (commentId: number): void => {
    setReplyTo(commentId);
    setEditingComment(null);
    setCommentText('');
    // Scroll to comment form
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
      commentForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEdit = (comment: commentServices.CommentItem): void => {
    setEditingComment(comment.id);
    setReplyTo(null);
    setCommentText(comment.content);
    // Scroll to comment form
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
      commentForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cancelEdit = (): void => {
    setEditingComment(null);
    setReplyTo(null);
    setCommentText('');
  };

  // Filter top-level comments and replies
  const topLevelComments = comments.filter(comment => !comment.replyTo && !comment.isDeleted);
  
  const getReplies = (commentId: number): commentServices.CommentItem[] => {
    return comments.filter(comment => comment.replyTo === commentId && !comment.isDeleted);
  };

  const renderCommentActions = (comment: commentServices.CommentItem): React.ReactNode[] => {
    const hasLiked = comment.likes.some(like => like.userId === currentUserId);
    const actions: React.ReactNode[] = [
      <Tooltip key="like" title={hasLiked ? "Unlike" : "Like"}>
        <span onClick={() => handleLikeComment(comment.id)} className="flex items-center cursor-pointer">
          {hasLiked ? <LikeFilled className="text-blue-500" /> : <LikeOutlined />}
          <span className="ml-1">{comment.likes.length}</span>
        </span>
      </Tooltip>,
      <Tooltip key="reply" title="Reply">
        <span onClick={() => handleReply(comment.id)} className="flex items-center cursor-pointer">
          <MessageOutlined />
          <span className="ml-1">Reply</span>
        </span>
      </Tooltip>
    ];
    
    // Only show edit/delete if the user is the comment author
    if (comment.userId === currentUserId) {
      actions.push(
        <Tooltip key="edit" title="Edit">
          <span onClick={() => handleEdit(comment)} className="flex items-center cursor-pointer">
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
          <span className="flex items-center cursor-pointer text-red-500">
            <DeleteOutlined />
            <span className="ml-1">Delete</span>
          </span>
        </Popconfirm>
      );
    }
    
    return actions;
  };

  const CommentItem: React.FC<{ comment: commentServices.CommentItem }> = ({ comment }) => {
    const replies = getReplies(comment.id);
    const [user, setUser] = useState<userServices.UserResponse | null>(null);

    useEffect(() => {
      const fetchUser = async () => {
        const fetchedUser = await userServices.getUserById(comment.userId);
        setUser(fetchedUser);
        console.log("Checking user info", fetchedUser);
      };
      fetchUser();
    }, [comment.userId]);

    return (
      <div className="mb-4">
        <div className="flex">
          <div className="mr-3 flex-shrink-0">
            <Avatar src={user?.avatarUrl} alt={user?.userName} />
          </div>
          <div className="flex-grow">
            <div className="flex items-center">
              <span className="font-medium">{user?.userName}</span>
              <Tooltip title={dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                <span className="text-gray-400 text-sm ml-2">{dayjs(comment.createdAt).fromNow()}</span>
              </Tooltip>
              {comment.updatedAt && (
                <span className="text-gray-400 ml-2 text-xs">(edited {dayjs(comment.updatedAt).fromNow()})</span>
              )}
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg mt-2">
              <p className="m-0">{comment.content}</p>
            </div>
            
            <div className="mt-2 flex space-x-4">
              {renderCommentActions(comment)}
            </div>
          </div>
        </div>
        
        {/* Render replies */}
        {replies.length > 0 && (
          <div className="ml-12 mt-3">
            {replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-6">Comments</h2>
      
      {/* Render top-level comments */}
      <div className="mb-8">
        {topLevelComments.length > 0 ? (
          topLevelComments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            Be the first to comment!
          </div>
        )}
      </div>
      
      {/* Reply info */}
      {replyTo && (
        <div className="bg-blue-50 p-3 mb-4 rounded-lg flex justify-between items-center">
          <span>
            Replying to: 'khoa'
          </span>
          <Button type="text" onClick={() => setReplyTo(null)}>Cancel</Button>
        </div>
      )}
      
      {/* Edit info */}
      {editingComment && (
        <div className="bg-yellow-50 p-3 mb-4 rounded-lg flex justify-between items-center">
          <span>Editing your comment</span>
          <Button type="text" onClick={cancelEdit}>Cancel</Button>
        </div>
      )}
      
      {/* Comment form */}
      <div id="commentForm" className="mt-6">
        <div className="mb-4">
          <Input.TextArea 
            rows={4} 
            placeholder="Write your comment here..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full"
            status={commentText.trim() === '' && submitting ? 'error' : ''}
          />
        </div>
        <div className="flex justify-end">
          <Button 
            type="primary" 
            onClick={editingComment ? handleUpdateComment : handleSubmitComment}
            loading={submitting}
          >
            {editingComment ? 'Update Comment' : replyTo ? 'Post Reply' : 'Post Comment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// To use this component, wrap your application with App provider
// In your main app:
// import { App } from 'antd';
// 
// return (
//   <App>
//     <CommentSection mangaId={201} currentUserId={101} />
//   </App>
// );

export default CommentSection;