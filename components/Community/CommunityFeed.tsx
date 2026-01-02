import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { CommunityService } from '../../services/CommunityService';

const CommunityFeed = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            const data = await CommunityService.getPosts();
            setPosts(data);
            setError(null);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePost = async (content: string) => {
        try {
            await CommunityService.createPost(content);
            fetchPosts(); // Reload feed
            setError(null);
        } catch (error: any) {
            console.error('Failed to create post', error);
            setError(error.message || 'Erro ao criar post');
        }
    };

    const handleReact = async (postId: string, type: 'LIKE' | 'HYPE') => {
        // Optimistic update
        setPosts(currentPosts => currentPosts.map(post => {
            if (post.id === postId) {
                const isType = type === 'LIKE' ? 'isLiked' : 'isHyped';
                const countField = type === 'LIKE' ? 'likesCount' : 'hypesCount';
                const isActive = post[isType];

                return {
                    ...post,
                    [isType]: !isActive,
                    [countField]: isActive ? post[countField] - 1 : post[countField] + 1
                };
            }
            return post;
        }));

        try {
            await CommunityService.reactToPost(postId, type);
        } catch (error) {
            console.error('Failed to react', error);
            fetchPosts(); // Revert on error
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await CommunityService.deletePost(postId);
            // Optimistic removal
            setPosts(currentPosts => currentPosts.filter(p => p.id !== postId));
        } catch (error) {
            console.error('Failed to delete post', error);
            alert('Erro ao excluir post. Tente novamente.');
        }
    };

    const handleComment = (postId: string) => {
        alert('Funcionalidade de comentários em detalhes será implementada na próxima iteração.');
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (isLoading) return <div className="text-center py-20 text-gray-500">Carregando feed...</div>;

    const currentUserId = localStorage.getItem('userId') || '';

    return (
        <div className="max-w-3xl mx-auto">
            <CreatePost onPost={handleCreatePost} error={error} />

            <div className="space-y-4">
                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={currentUserId}
                        onReact={handleReact}
                        onComment={handleComment}
                        onDelete={handleDeletePost}
                    />
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-20 text-gray-500 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <span className="material-symbols-outlined text-4xl mb-4 text-gray-300">forum</span>
                        <p>Ainda não há posts aqui. Seja o primeiro a compartilhar algo!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityFeed;
