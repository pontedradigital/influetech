import React, { useState, useEffect } from 'react';
import { compressImage, validateImageFile } from '../utils/imageCompressor';

interface BugReport {
    id: string;
    title: string;
    description: string;
    images: string[];
    status: string;
    adminMessage?: string;
    createdAt: string;
    updatedAt: string;
}

const BugReportSection: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reports, setReports] = useState<BugReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/bug-reports', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setReports(data);
            } else {
                console.error('Failed to fetch reports:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (images.length + files.length > 3) {
            alert('Máximo de 3 imagens permitidas');
            return;
        }

        const validFiles: File[] = [];
        const previews: string[] = [];

        for (const file of files) {
            const validation = validateImageFile(file);
            if (!validation.valid) {
                alert(validation.error);
                continue;
            }

            try {
                const compressed = await compressImage(file, 1); // 1MB max
                validFiles.push(compressed);

                const reader = new FileReader();
                reader.onloadend = () => {
                    previews.push(reader.result as string);
                    if (previews.length === validFiles.length) {
                        setImages(prev => [...prev, ...validFiles]);
                        setImagePreviews(prev => [...prev, ...previews]);
                    }
                };
                reader.readAsDataURL(compressed);
            } catch (error) {
                console.error('Error compressing image:', error);
                alert('Erro ao processar imagem');
            }
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            alert('Preencha título e descrição');
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            images.forEach((image) => {
                formData.append('images', image);
            });

            console.log('Sending bug report...', { title, description, imageCount: images.length });

            const response = await fetch('http://localhost:3001/api/bug-reports', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Bug report created:', data);
                alert('Bug reportado com sucesso!');
                setIsModalOpen(false);
                setTitle('');
                setDescription('');
                setImages([]);
                setImagePreviews([]);
                fetchReports();
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                alert(`Erro ao enviar report: ${response.status}`);
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Erro ao enviar report. Verifique o console para mais detalhes.');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            'Acompanhando': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
            'Desenvolvendo': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
            'Declinado': 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
            'Adicionado Melhoria': 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700';
    };

    const getStatusIcon = (status: string) => {
        const icons = {
            'Acompanhando': '👀',
            'Desenvolvendo': '⚙️',
            'Declinado': '❌',
            'Adicionado Melhoria': '✅'
        };
        return icons[status as keyof typeof icons] || '📋';
    };

    return (
        <div id="bug-report-section" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">bug_report</span>
                        Reportar um BUG
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Encontrou algum problema? Nos ajude a melhorar!
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Novo Report
                </button>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Carregando reports...</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="material-symbols-outlined text-4xl text-gray-400">inbox</span>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Nenhum report enviado ainda</p>
                    </div>
                ) : (
                    reports.map((report) => (
                        <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white">{report.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{report.description}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-4 ${getStatusBadge(report.status)}`}>
                                    {getStatusIcon(report.status)} {report.status}
                                </span>
                            </div>

                            {report.adminMessage && (
                                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                                        Mensagem da Equipe:
                                    </p>
                                    <p className="text-sm text-blue-800 dark:text-blue-400">{report.adminMessage}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                <span>ID: {report.id.slice(0, 8)}</span>
                                <span>•</span>
                                <span>{new Date(report.createdAt).toLocaleDateString('pt-BR')}</span>
                                {report.images.length > 0 && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">image</span>
                                            {report.images.length} {report.images.length === 1 ? 'imagem' : 'imagens'}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reportar BUG</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Título <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value.slice(0, 150))}
                                    maxLength={150}
                                    placeholder="Descreva o problema em poucas palavras"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">{title.length}/150 caracteres</p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Descrição <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value.slice(0, 400))}
                                    maxLength={400}
                                    rows={5}
                                    placeholder="Descreva o problema em detalhes..."
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">{description.length}/400 caracteres</p>
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Imagens (opcional - máx 3)
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    multiple
                                    onChange={handleImageUpload}
                                    disabled={images.length >= 3}
                                    className="hidden"
                                    id="bug-image-upload"
                                />
                                <label
                                    htmlFor="bug-image-upload"
                                    className={`block w-full px-4 py-3 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${images.length >= 3
                                        ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-3xl text-gray-400">add_photo_alternate</span>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {images.length >= 3 ? 'Limite de 3 imagens atingido' : 'Clique para adicionar imagens'}
                                    </p>
                                </label>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Enviando...' : 'Enviar Report'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BugReportSection;
