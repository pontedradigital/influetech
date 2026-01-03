import React, { useState, useEffect } from 'react';

interface BugReport {
    id: string;
    userId: string;
    title: string;
    description: string;
    images: string[];
    status: string;
    adminMessage?: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const AdminBugReports: React.FC = () => {
    const [reports, setReports] = useState<BugReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState<BugReport | null>(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [adminMessage, setAdminMessage] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/bug-reports/admin/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setReports(data);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (reportId: string, status: string, message?: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/bug-reports/admin/${reportId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status, adminMessage: message || null })
            });

            if (response.ok) {
                fetchReports();
                setSelectedReport(null);
                setAdminMessage('');
                setSelectedStatus('');
                alert('Status atualizado com sucesso!');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erro ao atualizar status');
        }
    };

    const deleteReport = async (reportId: string) => {
        if (!confirm('Tem certeza que deseja deletar este report? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/bug-reports/admin/${reportId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                fetchReports();
                setSelectedReport(null);
                alert('Report deletado com sucesso!');
            } else {
                alert('Erro ao deletar report');
            }
        } catch (error) {
            console.error('Error deleting report:', error);
            alert('Erro ao deletar report');
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

    const filteredReports = statusFilter === 'all'
        ? reports
        : reports.filter(r => r.status === statusFilter);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#111621] p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-red-500">bug_report</span>
                        Gerenciar Reports de BUG
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Visualize e gerencie todos os reports enviados pelos usuários
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Filtrar por Status:
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                        >
                            <option value="all">Todos</option>
                            <option value="Acompanhando">Acompanhando</option>
                            <option value="Desenvolvendo">Desenvolvendo</option>
                            <option value="Declinado">Declinado</option>
                            <option value="Adicionado Melhoria">Adicionado Melhoria</option>
                        </select>
                        <span className="text-sm text-gray-500">
                            {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'}
                        </span>
                    </div>
                </div>

                {/* Reports Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                            <p className="text-gray-500">Carregando reports...</p>
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">inbox</span>
                            <p className="text-gray-500 mt-4">Nenhum report encontrado</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            ID / Usuário
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Título
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Data
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 font-mono">{report.id.slice(0, 8)}</p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{report.user.name}</p>
                                                    <p className="text-xs text-gray-500">{report.user.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{report.description}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusBadge(report.status)}`}>
                                                    {getStatusIcon(report.status)} {report.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedReport(report);
                                                        setSelectedStatus(report.status);
                                                        setAdminMessage(report.adminMessage || '');
                                                    }}
                                                    className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    Ver Detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detalhes do Report</h2>
                            <button
                                onClick={() => {
                                    setSelectedReport(null);
                                    setAdminMessage('');
                                    setSelectedStatus('');
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* User Info */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Informações do Usuário</h3>
                                <p className="text-sm"><strong>Nome:</strong> {selectedReport.user.name}</p>
                                <p className="text-sm"><strong>Email:</strong> {selectedReport.user.email}</p>
                                <p className="text-sm"><strong>ID:</strong> {selectedReport.id}</p>
                                <p className="text-sm"><strong>Data:</strong> {new Date(selectedReport.createdAt).toLocaleString('pt-BR')}</p>
                            </div>

                            {/* Report Content */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{selectedReport.title}</h3>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedReport.description}</p>
                            </div>

                            {/* Images */}
                            {selectedReport.images.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Imagens Anexadas</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {selectedReport.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={`http://localhost:3001${img}`}
                                                alt={`Screenshot ${idx + 1}`}
                                                className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Status Update */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Atualizar Status</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Novo Status
                                        </label>
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                                        >
                                            <option value="Acompanhando">👀 Acompanhando</option>
                                            <option value="Desenvolvendo">⚙️ Desenvolvendo</option>
                                            <option value="Declinado">❌ Declinado</option>
                                            <option value="Adicionado Melhoria">✅ Adicionado Melhoria</option>
                                        </select>
                                    </div>

                                    {(selectedStatus === 'Declinado' || selectedStatus === 'Adicionado Melhoria') && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Mensagem para o Usuário {selectedStatus === 'Declinado' ? '(Motivo)' : '(Descrição da Melhoria)'}
                                            </label>
                                            <textarea
                                                value={adminMessage}
                                                onChange={(e) => setAdminMessage(e.target.value)}
                                                rows={4}
                                                placeholder={selectedStatus === 'Declinado'
                                                    ? 'Explique o motivo da recusa...'
                                                    : 'Descreva a melhoria implementada...'}
                                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                                            />
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => updateStatus(selectedReport.id, selectedStatus, adminMessage)}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                                        >
                                            Atualizar Status
                                        </button>
                                        <button
                                            onClick={() => deleteReport(selectedReport.id)}
                                            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                            Deletar
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedReport(null);
                                                setAdminMessage('');
                                                setSelectedStatus('');
                                            }}
                                            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBugReports;
