import React, { useState } from 'react';

interface Post {
    id: string;
    userId: string;
    userName: string;
    userNiche: string;
    content: string;
    likesCount: number;
    hypesCount: number;
    commentsCount: number;
    isLiked: boolean;
    isHyped: boolean;
    createdAt: string;
}

interface PostCardProps {
    post: Post;
    currentUserId: string;
    onReact: (postId: string, type: 'LIKE' | 'HYPE') => void;
    onComment: (postId: string) => void;
    onDelete: (postId: string) => void;
}

const PostCard = ({ post, currentUserId, onReact, onComment, onDelete }: PostCardProps) => {
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    const [isHypeAnimating, setIsHypeAnimating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleLike = () => {
        setIsLikeAnimating(true);
        onReact(post.id, 'LIKE');
        setTimeout(() => setIsLikeAnimating(false), 500);
    };

    const handleHype = () => {
        setIsHypeAnimating(true);
        onReact(post.id, 'HYPE');
        setTimeout(() => setIsHypeAnimating(false), 500);
    };

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir este post?')) {
            setIsDeleting(true);
            onDelete(post.id);
        }
    };

    const isOwner = post.userId === currentUserId;

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all mb-4 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {post.userName.charAt(0)}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{post.userName}</h3>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {post.userNiche}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            {isOwner && (
                                <button
                                    onClick={handleDelete}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                    title="Excluir post"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </p>

                    <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                        {/* HYPE Button */}
                        <button
                            onClick={handleHype}
                            className={`flex items-center gap-2 text-sm font-bold transition-all ${post.isHyped ? 'text-orange-500 scale-105' : 'text-gray-400 hover:text-orange-500'}`}
                        >
                            <span className={`material-symbols-outlined text-xl ${isHypeAnimating ? 'animate-bounce' : ''}`}>
                                local_fire_department
                            </span>
                            <span>{post.hypesCount} HYPE</span>
                        </button>

                        {/* LIKE Button */}
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 text-sm font-bold transition-all ${post.isLiked ? 'text-red-500 scale-105' : 'text-gray-400 hover:text-red-500'}`}
                        >
                            <span className={`material-symbols-outlined text-xl ${isLikeAnimating ? 'animate-bounce' : ''}`}>
                                favorite
                            </span>
                            <span>{post.likesCount} Curtidas</span>
                        </button>

                        {/* COMMENT Button */}
                        <button
                            onClick={() => onComment(post.id)}
                            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-500 transition-all"
                        >
                            <span className="material-symbols-outlined text-xl">chat_bubble</span>
                            <span>{post.commentsCount} Comentários</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
