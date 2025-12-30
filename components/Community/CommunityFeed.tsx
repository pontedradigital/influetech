import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import CreatePost from './CreatePost';

// Mock User ID for now, similar to Networking page
const CURRENT_USER_ID = '327aa8c1-7c26-41c2-95d7-b375c25eb896';

const CommunityFeed = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/community/posts?userId=${CURRENT_USER_ID}`);
            if (!res.ok) throw new Error(`Erro ${res.status}: Backend pode estar desatualizado.`);

            const data = await res.json();
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
            const res = await fetch('http://localhost:3001/api/community/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: CURRENT_USER_ID, content })
            });

            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error('Endpoint não encontrado. REINICIE O BACKEND no terminal para corrigir.');
                }
                throw new Error('Falha ao criar post');
            }

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
            await fetch(`http://localhost:3001/api/community/posts/${postId}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: CURRENT_USER_ID, type })
            });
        } catch (error) {
            console.error('Failed to react', error);
            fetchPosts(); // Revert on error
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            const res = await fetch(`http://localhost:3001/api/community/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: CURRENT_USER_ID }) // Pass userId for validation
            });

            if (!res.ok) throw new Error('Falha ao excluir post');

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

    return (
        <div className="max-w-3xl mx-auto">
            <CreatePost onPost={handleCreatePost} error={error} />

            <div className="space-y-4">
                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={CURRENT_USER_ID}
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
