


function ChartChart () {

    return (
        <div className="h-full p-6 pt-16">
            <div className="h-full rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold text-primary-dark">Pill Chart</div>
                        <div className="text-xs text-slate-500">Click a note to expand</div>
                    </div>
                    <div className="text-xs text-slate-500" id="pill-count-label"></div>
                </div>

                <div className="h-[calc(100%-56px)] overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-white z-10">
                        <tr className="text-xs text-slate-500 border-b border-slate-200">
                            <th className="text-left font-medium px-4 py-3">Name</th>
                            <th className="text-left font-medium px-4 py-3">Medication</th>
                            <th className="text-left font-medium px-4 py-3">Dosage</th>
                            <th className="text-left font-medium px-4 py-3">Time</th>
                            <th className="text-left font-medium px-4 py-3">Urgency</th>
                            <th className="text-left font-medium px-4 py-3">Taken?</th>
                            <th className="text-left font-medium px-4 py-3">Notes</th>
                        </tr>
                        </thead>
                        <tbody id="pill-table-body" className="divide-y divide-slate-100"></tbody>
                    </table>

                    <div id="empty-state" className="hidden p-10 text-center">
                        <div className="text-sm font-semibold text-slate-700">No pills yet</div>
                        <div className="text-xs text-slate-500 mt-1">Click “Add” to create one.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ChartChart;