import React, { useState, useEffect } from 'react';
import { ScheduledPost, Task, Alert, Product } from '../types';

interface BazarEvent {
    id: string;
    title: string;
    description?: string;
    date: string;
    location?: string;
    productIds: string;
    status: string;
}

export default function Agenda() {
    const [view, setView] = useState<'calendar' | 'list'>('calendar');
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [bazarEvents, setBazarEvents] = useState<BazarEvent[]>([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [postsRes, tasksRes, alertsRes, productsRes, bazaresRes] = await Promise.all([
                fetch('/api/scheduled-posts'),
                fetch('/api/tasks'),
                fetch('/api/alerts'),
                fetch('/api/products'),
                fetch('/api/bazares')
            ]);

            setScheduledPosts(await postsRes.json());
            setTasks(await tasksRes.json());
            setAlerts(await alertsRes.json());
            setProducts(await productsRes.json());
            setBazarEvents(await bazaresRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const generateAlerts = async () => {
        try {
            await fetch('/api/alerts/generate', { method: 'POST' });
            fetchData();
        } catch (error) {
            console.error('Error generating alerts:', error);
        }
    };

    const unreadAlerts = alerts.filter(a => !a.isRead);
    const pendingTasks = tasks.filter(t => t.status !== 'DONE');
    const upcomingPosts = scheduledPosts.filter(p => p.status === 'SCHEDULED');

    // Calendar logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const getEventsForDate = (date: Date | null) => {
        if (!date) return { posts: [], tasks: [], bazares: [] };

        // Compare using local date strings (YYYY-MM-DD) to avoid UTC shifts
        const dateStr = date.toLocaleDateString('sv'); // 'sv' locale format is YYYY-MM-DD

        const posts = scheduledPosts.filter(p => new Date(p.scheduledFor).toLocaleDateString('sv') === dateStr);
        const taskList = tasks.filter(t => t.dueDate && new Date(t.dueDate).toLocaleDateString('sv') === dateStr);
        const bazares = bazarEvents.filter(b => new Date(b.date).toLocaleDateString('sv') === dateStr);

        return { posts, tasks: taskList, bazares };
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">📅 Agenda</h1>
                    <p className="text-gray-500">Organize seus posts, tarefas e produtos de forma visual</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={generateAlerts}
                        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                        title="Gerar alertas automáticos"
                    >
                        <span className="material-symbols-outlined">notifications_active</span>
                        Gerar Alertas
                    </button>
                    <button
                        onClick={() => setShowPostModal(true)}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        Novo Post
                    </button>
                    <button
                        onClick={() => setShowTaskModal(true)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined">task_alt</span>
                        Nova Tarefa
                    </button>
                </div>
            </div>

            {/* Alerts Banner */}
            {unreadAlerts.length > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800 animate-in slide-in-from-top duration-500">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-2xl animate-pulse">notifications_active</span>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                🔔 {unreadAlerts.length} {unreadAlerts.length === 1 ? 'Alerta Pendente' : 'Alertas Pendentes'}
                            </h3>
                            <div className="space-y-2">
                                {unreadAlerts.slice(0, 3).map(alert => (
                                    <div key={alert.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{alert.title}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{alert.message}</p>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                await fetch(`/api/alerts/${alert.id}/read`, { method: 'PATCH' });
                                                fetchData();
                                            }}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Posts Agendados</p>
                            <p className="text-3xl font-black mt-1">{upcomingPosts.length}</p>
                        </div>
                        <span className="material-symbols-outlined text-5xl opacity-20">photo_camera</span>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Tarefas Pendentes</p>
                            <p className="text-3xl font-black mt-1">{pendingTasks.length}</p>
                        </div>
                        <span className="material-symbols-outlined text-5xl opacity-20">task_alt</span>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Alertas Ativos</p>
                            <p className="text-3xl font-black mt-1">{unreadAlerts.length}</p>
                        </div>
                        <span className="material-symbols-outlined text-5xl opacity-20">notifications</span>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Produtos Ativos</p>
                            <p className="text-3xl font-black mt-1">{products.length}</p>
                        </div>
                        <span className="material-symbols-outlined text-5xl opacity-20">inventory_2</span>
                    </div>
                </div>
            </div>

            {/* View Selector */}
            <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 w-fit shadow-sm">
                {(['calendar', 'list'] as const).map(v => (
                    <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${view === v
                            ? 'bg-primary text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">{v === 'calendar' ? 'calendar_month' : 'list'}</span>
                        {v === 'calendar' ? 'Calendário' : 'Lista'}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            {view === 'calendar' ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                    {/* ... Calendar Header ... */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button
                                onClick={() => setCurrentMonth(new Date())}
                                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-medium transition-colors"
                            >
                                Hoje
                            </button>
                            <button
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Weekday headers */}
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                            <div key={day} className="text-center font-bold text-gray-600 dark:text-gray-400 text-sm py-2">
                                {day}
                            </div>
                        ))}

                        {/* Calendar days */}
                        {getDaysInMonth(currentMonth).map((date, index) => {
                            const events = getEventsForDate(date);
                            const hasEvents = events.posts.length > 0 || events.tasks.length > 0 || events.bazares.length > 0;

                            return (
                                <div
                                    key={index}
                                    className={`min-h-[100px] p-2 rounded-lg border transition-all ${date
                                        ? isToday(date)
                                            ? 'bg-primary/10 border-primary shadow-lg'
                                            : hasEvents
                                                ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 hover:shadow-md cursor-pointer'
                                                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                                        : 'bg-transparent border-transparent'
                                        }`}
                                    onClick={() => date && setSelectedDate(date)}
                                >
                                    {date && (
                                        <>
                                            <div className={`text-sm font-bold mb-1 ${isToday(date) ? 'text-primary' : 'text-gray-900 dark:text-white'
                                                }`}>
                                                {date.getDate()}
                                            </div>
                                            <div className="space-y-1">
                                                {events.posts.slice(0, 1).map(post => (
                                                    <div
                                                        key={post.id}
                                                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded truncate cursor-pointer hover:bg-blue-600 transition-colors"
                                                        title={post.title}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedEvent({ ...post, type: 'post' });
                                                            setShowDetailModal(true);
                                                        }}
                                                    >
                                                        📸 {post.title}
                                                    </div>
                                                ))}
                                                {events.tasks.slice(0, 1).map(task => (
                                                    <div
                                                        key={task.id}
                                                        className="text-xs bg-purple-500 text-white px-2 py-1 rounded truncate cursor-pointer hover:bg-purple-600 transition-colors"
                                                        title={task.title}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedEvent({ ...task, type: 'task' });
                                                            setShowDetailModal(true);
                                                        }}
                                                    >
                                                        ✅ {task.title}
                                                    </div>
                                                ))}
                                                {events.bazares.slice(0, 1).map(bazar => (
                                                    <div
                                                        key={bazar.id}
                                                        className="text-xs bg-green-500 text-white px-2 py-1 rounded truncate cursor-pointer hover:bg-green-600 transition-colors"
                                                        title={bazar.title}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedEvent({ ...bazar, type: 'bazar' });
                                                            setShowDetailModal(true);
                                                        }}
                                                    >
                                                        🛍️ {bazar.title}
                                                    </div>
                                                ))}
                                                {(events.posts.length + events.tasks.length + events.bazares.length) > 3 && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                        +{events.posts.length + events.tasks.length + events.bazares.length - 3} mais
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {/* Legend part is fine */}
                    <div className="flex gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Post Agendado</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-500 rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tarefa</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Bazar</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-primary rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Hoje</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📋 Timeline</h2>
                    <div className="space-y-4">
                        {scheduledPosts.length === 0 && tasks.length === 0 && bazarEvents.length === 0 ? (
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">event_busy</span>
                                <p className="text-gray-500">Nenhum item agendado</p>
                            </div>
                        ) : (
                            <>
                                {scheduledPosts.map(post => (
                                    <div
                                        key={post.id}
                                        className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => {
                                            setSelectedEvent({ ...post, type: 'post' });
                                            setShowDetailModal(true);
                                        }}
                                    >
                                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-3xl">photo_camera</span>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{post.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                📅 {new Date(post.scheduledFor).toLocaleString('pt-BR')}
                                            </p>
                                            {post.caption && (
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{post.caption}</p>
                                            )}
                                            <div className="flex gap-2 mt-2">
                                                {JSON.parse(post.platforms).map((platform: string) => (
                                                    <span key={platform} className="text-xs px-2 py-1 bg-blue-600 text-white rounded font-medium">
                                                        {platform}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold h-fit ${post.status === 'PUBLISHED' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                            }`}>
                                            {post.status === 'PUBLISHED' ? '✓ Publicado' : '⏰ Agendado'}
                                        </span>
                                    </div>
                                ))}
                                {tasks.map(task => (
                                    <div
                                        key={task.id}
                                        className="flex gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => {
                                            setSelectedEvent({ ...task, type: 'task' });
                                            setShowDetailModal(true);
                                        }}
                                    >
                                        <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-3xl">task_alt</span>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{task.title}</h3>
                                            {task.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                                            )}
                                            <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>📂 {task.category}</span>
                                                {task.dueDate && (
                                                    <span>📅 Vence: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold h-fit ${task.priority === 'HIGH' ? 'bg-red-500 text-white' :
                                            task.priority === 'MEDIUM' ? 'bg-yellow-500 text-white' :
                                                'bg-green-500 text-white'
                                            }`}>
                                            {task.priority === 'HIGH' ? '🔴 Alta' : task.priority === 'MEDIUM' ? '🟡 Média' : '🟢 Baixa'}
                                        </span>
                                    </div>
                                ))}
                                {bazarEvents.map(bazar => (
                                    <div
                                        key={bazar.id}
                                        className="flex gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => {
                                            setSelectedEvent({ ...bazar, type: 'bazar' });
                                            setShowDetailModal(true);
                                        }}
                                    >
                                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">storefront</span>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{bazar.title}</h3>
                                            {bazar.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{bazar.description}</p>
                                            )}
                                            <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>📅 {new Date(bazar.date).toLocaleDateString('pt-BR')}</span>
                                                {bazar.location && (
                                                    <span>📍 {bazar.location}</span>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold h-fit ${bazar.status === 'COMPLETED' ? 'bg-green-500 text-white' :
                                            bazar.status === 'CANCELLED' ? 'bg-red-500 text-white' :
                                                'bg-blue-500 text-white'
                                            }`}>
                                            {bazar.status === 'COMPLETED' ? '✓ Realizado' :
                                                bazar.status === 'CANCELLED' ? '✕ Cancelado' :
                                                    '🚀 Planejado'}
                                        </span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )
            }

            {/* Modals */}
            {
                showDetailModal && selectedEvent && (
                    <AgendamentoDetailModal
                        event={selectedEvent}
                        onClose={() => {
                            setShowDetailModal(false);
                            setSelectedEvent(null);
                        }}
                        onEdit={() => {
                            setShowDetailModal(false);
                            setShowEditModal(true);
                        }}
                        onDelete={async () => {
                            if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

                            const endpoint = selectedEvent.type === 'post' ? '/api/scheduled-posts' :
                                selectedEvent.type === 'task' ? '/api/tasks' :
                                    '/api/bazares';

                            try {
                                await fetch(`${endpoint}/${selectedEvent.id}`, { method: 'DELETE' });
                                setShowDetailModal(false);
                                setSelectedEvent(null);
                                fetchData();
                            } catch (error) {
                                console.error('Error deleting:', error);
                                alert('Erro ao excluir agendamento');
                            }
                        }}
                        onComplete={async () => {
                            if (!confirm(selectedEvent.type === 'post' ? 'Deseja marcar este post como publicado?' : 'Deseja marcar esta tarefa como concluída?')) return;

                            const endpoint = selectedEvent.type === 'post'
                                ? `/api/scheduled-posts/${selectedEvent.id}/publish`
                                : `/api/tasks/${selectedEvent.id}/complete`;

                            const method = selectedEvent.type === 'post' ? 'POST' : 'PATCH';

                            try {
                                await fetch(endpoint, { method });
                                setShowDetailModal(false);
                                setSelectedEvent(null);
                                fetchData();
                            } catch (error) {
                                console.error('Error completing:', error);
                                alert('Erro ao concluir item');
                            }
                        }}
                        products={products}
                    />
                )
            }
            {
                showEditModal && selectedEvent && selectedEvent.type === 'post' && (
                    <EditPostModal
                        post={selectedEvent}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedEvent(null);
                            fetchData();
                        }}
                        products={products}
                    />
                )
            }
            {
                showEditModal && selectedEvent && selectedEvent.type === 'task' && (
                    <EditTaskModal
                        task={selectedEvent}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedEvent(null);
                            fetchData();
                        }}
                    />
                )
            }
            {showPostModal && <NewPostModal onClose={() => { setShowPostModal(false); fetchData(); }} products={products} />}
            {showTaskModal && <NewTaskModal onClose={() => { setShowTaskModal(false); fetchData(); }} />}
        </div >
    );
}

// Modal Components (mantidos iguais ao anterior)
function NewPostModal({ onClose, products }: { onClose: () => void; products: Product[] }) {
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [productId, setProductId] = useState('');
    const [scheduledFor, setScheduledFor] = useState('');
    const [platforms, setPlatforms] = useState<string[]>([]);

    const getUserId = () => {
        try {
            const u = localStorage.getItem('user');
            return u ? JSON.parse(u).id : null;
        } catch { return null; }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/scheduled-posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    caption,
                    productId: productId || null,
                    scheduledFor,
                    platforms: JSON.stringify(platforms),
                    userId: getUserId()
                })
            });
            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1A202C] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-primary/10 to-blue-500/10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined">photo_camera</span>
                        Novo Post Agendado
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Título *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                            placeholder="Ex: Review do Produto X"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Produto (opcional)</label>
                        <select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                        >
                            <option value="">Nenhum produto</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Caption</label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none resize-none transition-shadow"
                            placeholder="Descrição do post..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Data e Hora *</label>
                        <input
                            type="datetime-local"
                            value={scheduledFor}
                            onChange={(e) => setScheduledFor(e.target.value)}
                            required
                            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Plataformas *</label>
                        <div className="flex flex-wrap gap-2">
                            {['Instagram', 'TikTok', 'YouTube'].map(platform => (
                                <label key={platform} className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all ${platforms.includes(platform)
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}>
                                    <input
                                        type="checkbox"
                                        checked={platforms.includes(platform)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setPlatforms([...platforms, platform]);
                                            } else {
                                                setPlatforms(platforms.filter(p => p !== platform));
                                            }
                                        }}
                                        className="rounded"
                                    />
                                    <span className="text-sm font-medium">{platform}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 font-bold text-white bg-primary hover:bg-primary-600 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            📅 Agendar Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function NewTaskModal({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'CONTENT' | 'EDITING' | 'RESPOND' | 'OTHER'>('CONTENT');
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
    const [dueDate, setDueDate] = useState('');

    const getUserId = () => {
        try {
            const u = localStorage.getItem('user');
            return u ? JSON.parse(u).id : null;
        } catch { return null; }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    priority,
                    dueDate: dueDate || null,
                    userId: getUserId()
                })
            });
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1A202C] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined">task_alt</span>
                        Nova Tarefa
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Título *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                            placeholder="Ex: Editar vídeo do TikTok"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Descrição</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none resize-none transition-shadow"
                            placeholder="Detalhes da tarefa..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Categoria</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as any)}
                                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                            >
                                <option value="CONTENT">🎬 Conteúdo</option>
                                <option value="EDITING">✂️ Edição</option>
                                <option value="RESPOND">💬 Responder</option>
                                <option value="OTHER">📋 Outros</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Prioridade</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                            >
                                <option value="LOW">🟢 Baixa</option>
                                <option value="MEDIUM">🟡 Média</option>
                                <option value="HIGH">🔴 Alta</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Deadline</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                        >
                            ✅ Criar Tarefa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Modal de Detalhes do Agendamento
function AgendamentoDetailModal({ event, onClose, onEdit, onDelete, onComplete, products }: {
    event: any;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onComplete: () => void;
    products: Product[];
}) {
    const getEventIcon = () => {
        if (event.type === 'post') return 'photo_camera';
        if (event.type === 'task') return 'task_alt';
        return 'shopping_bag';
    };

    const color = event.type === 'post' ? 'blue' : event.type === 'task' ? 'purple' : 'green';
    const linkedProducts = event.productIds ?
        products.filter(p => JSON.parse(event.productIds || '[]').includes(p.id)) :
        event.productId ? products.filter(p => p.id === event.productId) : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1A202C] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className={`p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-${color}-500/10 to-${color}-600/10`}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined">{getEventIcon()}</span>
                        {event.type === 'post'
                            ? (event.status === 'PUBLISHED' ? 'Post Publicado' : 'Post Agendado')
                            : event.type === 'task'
                                ? (event.status === 'DONE' ? 'Tarefa Concluída' : 'Tarefa')
                                : 'Bazar'
                        }
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{event.title}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            {event.type === 'post' ? 'Data de Publicação' : event.type === 'task' ? 'Deadline' : 'Data do Bazar'}
                        </label>
                        <p className="text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">calendar_today</span>
                            {event.type === 'post' && new Date(event.scheduledFor).toLocaleString('pt-BR')}
                            {event.type === 'task' && event.dueDate && new Date(event.dueDate).toLocaleDateString('pt-BR')}
                            {event.type === 'bazar' && new Date(event.date).toLocaleDateString('pt-BR')}
                        </p>
                    </div>
                    {(event.caption || event.description) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                {event.type === 'post' ? 'Caption' : 'Descrição'}
                            </label>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {event.caption || event.description}
                            </p>
                        </div>
                    )}
                    {linkedProducts.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Produtos Vinculados ({linkedProducts.length})
                            </label>
                            <div className="space-y-2">
                                {linkedProducts.map(product => (
                                    <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <span className="material-symbols-outlined text-primary">inventory_2</span>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                                            <p className="text-sm text-gray-500">R$ {product.price?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-between gap-3">
                    <button
                        onClick={onDelete}
                        className="px-6 py-2.5 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">delete</span>
                        Excluir
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Fechar
                        </button>
                        {event.type !== 'bazar' && (
                            <button
                                onClick={onEdit}
                                className={`px-6 py-2.5 font-bold text-white rounded-lg shadow-lg transition-all active:scale-95 flex items-center gap-2 ${event.type === 'post' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' :
                                    'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                                    }`}
                            >
                                <span className="material-symbols-outlined">edit</span>
                                Editar
                            </button>
                        )}
                        {event.type !== 'bazar' && (event.status !== 'DONE' && event.status !== 'PUBLISHED') && (
                            <button
                                onClick={onComplete}
                                className={`px-6 py-2.5 font-bold text-white rounded-lg shadow-lg transition-all active:scale-95 flex items-center gap-2 ${event.type === 'post' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' :
                                    'bg-green-600 hover:bg-green-700 shadow-green-500/20'
                                    }`}
                            >
                                <span className="material-symbols-outlined">check_circle</span>
                                {event.type === 'post' ? 'Publicar' : 'Concluir'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Modal de Edição de Post
function EditPostModal({ post, onClose, products }: { post: any; onClose: () => void; products: Product[] }) {
    const [title, setTitle] = useState(post.title || '');
    const [caption, setCaption] = useState(post.caption || '');
    const [productId, setProductId] = useState(post.productId || '');
    const [scheduledFor, setScheduledFor] = useState(post.scheduledFor ? post.scheduledFor.slice(0, 16) : '');
    const [platforms, setPlatforms] = useState<string[]>(post.platforms ? JSON.parse(post.platforms) : []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`/api/scheduled-posts/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    caption,
                    productId: productId || null,
                    scheduledFor,
                    platforms: JSON.stringify(platforms)
                })
            });
            onClose();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1A202C] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-blue-600/10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined">edit</span>
                        Editar Post
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Título *</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Caption</label>
                        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Data e Hora *</label>
                        <input type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} required
                            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                            Cancelar
                        </button>
                        <button type="submit" className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/20">
                            💾 Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Modal de Edição de Tarefa
function EditTaskModal({ task, onClose }: { task: any; onClose: () => void }) {
    const [title, setTitle] = useState(task.title || '');
    const [description, setDescription] = useState(task.description || '');
    const [category, setCategory] = useState<'CONTENT' | 'EDITING' | 'RESPOND' | 'OTHER'>(task.category || 'CONTENT');
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>(task.priority || 'MEDIUM');
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, category, priority, dueDate: dueDate || null })
            });
            onClose();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1A202C] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined">edit</span>
                        Editar Tarefa
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Título *</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Descrição</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Deadline</label>
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                            className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                            Cancelar
                        </button>
                        <button type="submit" className="px-6 py-2.5 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg shadow-purple-500/20">
                            💾 Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
