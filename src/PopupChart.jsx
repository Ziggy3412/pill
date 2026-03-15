import { useState } from 'react';

function PopupChart({ changePopupState }) {
    const [pillTimeEntries, setPillTimeEntries] = useState(0);
    const [urgency, setUrgency] = useState(0);
    const [urgencyError, setUrgencyError] = useState('');
    const [dosageError, setDosageError] = useState('');
    const [timeError, setTimeError] = useState('');

    function getStarColor(starIndex) {
        if (starIndex <= 2) return '#22c55e'; // green
        if (starIndex === 3) return '#eab308'; // yellow
        return '#ef4444'; // red (4 and 5)
    }

    function handleCloseButton() {
        changePopupState(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setUrgencyError('');
        setDosageError('');
        setTimeError('');

        const form = e.target;
        const dosage = form.elements['dosage']?.value?.trim();
        const hasValidTime = Array.from({ length: pillTimeEntries + 1 }, (_, i) => {
            const hour = form.elements[`time-hour-${i}`]?.value?.trim();
            const min = form.elements[`time-min-${i}`]?.value?.trim();
            return hour && min;
        }).some(Boolean);

        if (urgency === 0) {
            setUrgencyError('Please choose an urgency (1–5 stars) before saving.');
            return;
        }
        if (!dosage) {
            setDosageError('Dosage is required.');
            return;
        }
        if (!hasValidTime) {
            setTimeError('Please add at least one time (hour and minute).');
            return;
        }

        // All required fields valid; close popup (add save logic here if needed)
        changePopupState(false);
    }

    return (
        <div
        id="add-modal"
        className=" fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
    >
        <div className="w-full max-w-2xl rounded-xl bg-white border border-slate-200 shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 className="text-sm font-semibold text-primary-dark" id="modal-title">Add</h2>
                <button
                    id="close-add-modal"
                    className="rounded px-2 py-1 text-sm border border-slate-200 hover:bg-slate-50"
                    type="button"
                    onClick={handleCloseButton}
                >
                    ✕
                </button>
            </div>

            <div className="p-4">
                <form id="pill-form" className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-[11px] font-medium text-slate-700">Name</label>
                        <input
                            id="person-name"
                            type="text"
                            required
                            className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-slate-700">Medication</label>
                        <input
                            id="med-name"
                            type="text"
                            required
                            className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-slate-700">Dosage</label>
                        <input
                            id="dosage"
                            name="dosage"
                            type="text"
                            required
                            className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {dosageError && (
                            <p className="mt-1 text-[11px] text-red-600" role="alert">{dosageError}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-slate-700">Urgency</label>
                        <div className="mt-1 flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    className="p-0.5 rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                                    onClick={() => { setUrgency(value); setUrgencyError(''); }}
                                    aria-label={`Set urgency to ${value}`}
                                >
                                    {urgency >= value ? (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={getStarColor(value)} aria-hidden>
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                        {urgencyError && (
                            <p className="mt-1 text-[11px] text-red-600" role="alert">{urgencyError}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-medium text-slate-700">Time</label>
                            <button
                                type="button"
                                id="add-time-btn"
                                className="inline-flex items-center gap-1 rounded border border-primary bg-primary px-2 py-1 text-[11px] text-blue-600 hover:bg-primary-dark"
                                onClick={() => setPillTimeEntries(pillTimeEntries + 1)}
                            >
                                + Add time
                            </button>
                        </div>

                        <div id="time-inputs" className="mt-2 space-y-2">
                            {Array.from({ length: pillTimeEntries + 1 }, (_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-25 shrink-0">
                                        <label className="sr-only">Hours</label>
                                        <input
                                            name={`time-hour-${i}`}
                                            type="text"
                                            list="hh-list"
                                            placeholder="Hour"
                                            className="block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <span className="text-slate-400 text-xs">:</span>
                                    <div className="w-25 shrink-0">
                                        <label className="sr-only">Minutes</label>
                                        <input
                                            name={`time-min-${i}`}
                                            type="text"
                                            list="mm-list"
                                            placeholder="Min"
                                            className="block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {timeError && (
                            <p className="mt-1 text-[11px] text-red-600" role="alert">{timeError}</p>
                        )}

                        <datalist id="hh-list">
                            <option value="1"></option>
                            <option value="2"></option>
                            <option value="3"></option>
                            <option value="4"></option>
                            <option value="5"></option>
                            <option value="6"></option>
                            <option value="7"></option>
                            <option value="8"></option>
                            <option value="9"></option>
                            <option value="10"></option>
                            <option value="11"></option>
                            <option value="12"></option>
                        </datalist>

                        <datalist id="mm-list">
                            {Array.from({ length: 60 }, (_, i) => (
                                <option key={i} value={i.toString().padStart(2, '0')} />
                            ))}
                        </datalist>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-700">Notes</label>
                        <textarea
                            id="notes"
                            rows="4"
                            className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        ></textarea>
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between pt-1">
                        <label className="inline-flex items-center gap-1.5">
                            <input
                                id="enabled"
                                type="checkbox"
                                checked
                                className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <span className="text-[11px] text-body">Enable reminders</span>
                        </label>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded bg-primary px-3 py-1.5 text-[11px] font-medium text-purple-600 hover:bg-primary-dark"
                        >
                            Save
                        </button>
                    </div>

                    <p id="form-error" className="hidden md:col-span-2 text-[11px] text-red-600"></p>
                    <p id="form-success" className="hidden md:col-span-2 text-[11px] text-emerald-700"></p>
                </form>
            </div>
        </div>
    </div>
    )
}

export default PopupChart;