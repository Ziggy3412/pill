



function SideBar() {

    return(
        <aside className="w-64 border-r border-slate-200 p-4 flex flex-col gap-4 overflow-y-auto">
            <div>
                <h1 className="text-lg font-semibold text-primary-dark">Pillpal</h1>
                <p className="text-xs text-slate-500">Dashboard</p>
            </div>

            <nav className="flex flex-col gap-2 text-sm">
                <button
                    className="text-left rounded px-3 py-2 hover:bg-slate-50 border border-slate-200"
                    type="button"
                >
                    Pill Chart
                </button>
            </nav>

            <div className="mt-auto text-xs text-slate-400" id="current-time-label"></div>
        </aside>
    )


}
export default SideBar;