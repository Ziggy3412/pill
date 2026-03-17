
import { useState } from 'react';
import { useAuth } from './context/AuthContext';

function HomeIcon({ className = 'w-5 h-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}

function CirclePlusIcon({ className = 'w-5 h-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
        </svg>
    );
}

function SideBar({ currentPage = 'chart', onNavigate }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const initials = user?.displayName
        ? user.displayName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    return (
        <aside
            className={`flex flex-col h-screen max-h-screen border-r border-slate-200 bg-white overflow-x-hidden transition-[width] duration-200 ${
                isCollapsed ? 'w-16' : 'w-64'
            }`}
        >
            <div className={`flex shrink-0 items-center border-b border-slate-200 p-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-semibold text-primary-dark">Pillpal</h1>
                        <p className="text-xs text-slate-500">Dashboard</p>
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => setIsCollapsed((c) => !c)}
                    className="shrink-0 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        {isCollapsed ? (
                            <path d="M9 18l6-6-6-6" />
                        ) : (
                            <path d="M15 18l-6-6 6-6" />
                        )}
                    </svg>
                </button>
            </div>

            <nav className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-1 text-sm">
                <button
                    title="Home"
                    type="button"
                    onClick={() => onNavigate?.('home')}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary border ${
                        currentPage === 'home'
                            ? 'border-slate-200 bg-slate-100 text-primary-dark'
                            : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-100'
                    }`}
                >
                    <span className="shrink-0 text-slate-600">
                        <HomeIcon />
                    </span>
                    {!isCollapsed && <span className="truncate">Home</span>}
                </button>
                <button
                    title="Pill Chart"
                    type="button"
                    onClick={() => onNavigate?.('chart')}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary border ${
                        currentPage === 'chart'
                            ? 'border-slate-200 bg-slate-100 text-primary-dark'
                            : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-100'
                    }`}
                >
                    <span className="shrink-0 text-slate-600">
                        <CirclePlusIcon />
                    </span>
                    {!isCollapsed && <span className="truncate">Pill Chart</span>}
                </button>
            </nav>

            {/* User profile */}
            <div className={`shrink-0 border-t border-slate-200 p-2 flex items-center gap-2 bg-slate-50 ${isCollapsed ? 'justify-center' : ''}`}>
                {/* Avatar */}
                {user?.photo ? (
                    <img src={user.photo} alt={user.displayName} className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-slate-200" />
                ) : (
                    <div className="h-9 w-9 shrink-0 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-semibold">
                        {initials}
                    </div>
                )}

                {!isCollapsed && (
                    <>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-slate-800">{user?.displayName ?? 'Guest'}</p>
                            <p className="truncate text-[11px] text-slate-400">{user?.email ?? ''}</p>
                        </div>
                        <button
                            type="button"
                            onClick={logout}
                            title="Sign out"
                            className="shrink-0 rounded p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </aside>
    );
}
export default SideBar;