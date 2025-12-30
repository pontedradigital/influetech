import React, { useState } from 'react';

interface CreatePostProps {
    onPost: (content: string) => void;
    error?: string | null;
}

const CreatePost = ({ onPost, error }: CreatePostProps) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onPost(content);
        setContent('');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_square</span>
                Compartilhe com a comunidade
            </h3>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="O que está acontecendo no mundo dos influenciadores?"
                    className="w-full h-32 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-black transition-all resize-none text-gray-900 dark:text-white mb-4"
                />
                <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                        Seja respeitoso e agregue valor à comunidade.
                    </div>
                    <button
                        type="submit"
                        disabled={!content.trim()}
                        className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <span>Publicar</span>
                        <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
