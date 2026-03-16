
import { useState } from 'react';

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

    return (
        <aside
            className={`flex flex-col border-r border-slate-200 bg-white overflow-hidden transition-[width] duration-200 ${
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

            <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 text-sm">
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

            <div className={`shrink-0 border-t border-slate-200 p-3 text-xs text-slate-400 ${isCollapsed ? 'hidden' : ''}`} id="current-time-label"></div>
        </aside>
    );
}
export default SideBar;