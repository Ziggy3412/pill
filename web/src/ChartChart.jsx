function ChartChart({ pills = [] }) {
    return (
        <div className="h-full p-6 pt-16">
            <div className="h-full rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold text-primary-dark">Pill Chart</div>
                        <div className="text-xs text-slate-500">Click a note to expand</div>
                    </div>
                    <div className="text-xs text-slate-500">
                        {pills.length} {pills.length === 1 ? 'pill' : 'pills'}
                    </div>
                </div>

                <div className="h-[calc(100%-56px)] overflow-auto">
                    {pills.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="text-sm font-semibold text-slate-700">No pills yet</div>
                            <div className="text-xs text-slate-500 mt-1">Click "Add" to create one.</div>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="text-xs text-slate-500 border-b border-slate-200">
                                    <th className="text-left font-medium px-4 py-3">Name</th>
                                    <th className="text-left font-medium px-4 py-3">Medication</th>
                                    <th className="text-left font-medium px-4 py-3">Dosage</th>
                                    <th className="text-left font-medium px-4 py-3">Time</th>
                                    <th className="text-left font-medium px-4 py-3">Urgency</th>
                                    <th className="text-left font-medium px-4 py-3">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pills.map((pill) => (
                                    <tr key={pill.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-xs text-slate-700">{pill.name}</td>
                                        <td className="px-4 py-3 text-xs text-slate-700">{pill.medication}</td>
                                        <td className="px-4 py-3 text-xs text-slate-700">{pill.dosage}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">
                                            {Array.isArray(pill.times) ? pill.times.join(', ') : pill.times}
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <span className="font-medium">{'★'.repeat(pill.urgency)}</span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{pill.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChartChart;
