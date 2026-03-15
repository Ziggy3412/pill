import { useState, useRef, useEffect } from 'react';

const HOUR_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

function filterHourOptions(value) {
    if (!value) return HOUR_OPTIONS;
    return HOUR_OPTIONS.filter((opt) => opt.startsWith(value));
}

function filterMinuteOptions(value) {
    if (!value) return MINUTE_OPTIONS;
    return MINUTE_OPTIONS.filter(
        (opt) => opt.startsWith(value) || (value.length === 1 && opt === '0' + value)
    );
}

function TimeDropdown({ name, placeholder, options, filterOptions, value, onChange, inputClassName }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openUp, setOpenUp] = useState(false);
    const containerRef = useRef(null);
    const listRef = useRef(null);

    const filtered = filterOptions(value);

    useEffect(() => {
        if (!isOpen || !containerRef.current || !listRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const listHeight = listRef.current.getBoundingClientRect().height;
        const spaceBelow = window.innerHeight - rect.bottom;
        setOpenUp(spaceBelow < listHeight && rect.top > spaceBelow);
    }, [isOpen, filtered.length]);

    useEffect(() => {
        if (!isOpen) return;
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsOpen(true)}
                onClick={() => setIsOpen(true)}
                placeholder={placeholder}
                autoComplete="off"
                className={inputClassName}
            />
            {isOpen && (
                <ul
                    ref={listRef}
                    className={`absolute left-0 right-0 z-50 max-h-32 overflow-auto rounded border border-slate-300 bg-white py-0.5 shadow-lg text-xs ${
                        openUp ? 'bottom-full mb-1' : 'top-full mt-1'
                    }`}
                    style={{ minWidth: 'var(--input-width, 5rem)' }}
                >
                    {filtered.length ? (
                        filtered.map((opt) => (
                            <li key={opt}>
                                <button
                                    type="button"
                                    className="w-full px-2.5 py-1.5 text-left text-slate-700 hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                    }}
                                >
                                    {opt}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="px-2.5 py-1.5 text-slate-500">No match</li>
                    )}
                </ul>
            )}
        </div>
    );
}

function PopupChart({ changePopupState }) {
    const [pillTimeEntries, setPillTimeEntries] = useState(0);
    const [urgency, setUrgency] = useState(0);
    const [urgencyError, setUrgencyError] = useState('');
    const [dosageError, setDosageError] = useState('');
    const [timeError, setTimeError] = useState('');
    const [timeValues, setTimeValues] = useState({});

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
            const hour = timeValues[`time-hour-${i}`]?.trim();
            const min = timeValues[`time-min-${i}`]?.trim();
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

    function removeTimeEntry(index) {
        const total = pillTimeEntries + 1;
        if (total <= 1) return;
        setPillTimeEntries((n) => n - 1);
        setTimeValues((prev) => {
            const next = { ...prev };
            for (let j = index; j < total - 1; j++) {
                next[`time-hour-${j}`] = prev[`time-hour-${j + 1}`] ?? '';
                next[`time-min-${j}`] = prev[`time-min-${j + 1}`] ?? '';
            }
            delete next[`time-hour-${total - 1}`];
            delete next[`time-min-${total - 1}`];
            return next;
        });
    }

    return (
        <div
        id="add-modal"
        className=" fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
    >
        <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl bg-white border border-slate-200 shadow-lg">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 p-4">
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

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
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
                                    <div className="w-20 shrink-0">
                                        <label className="sr-only">Hours</label>
                                        <TimeDropdown
                                            name={`time-hour-${i}`}
                                            placeholder="Hour"
                                            options={HOUR_OPTIONS}
                                            filterOptions={filterHourOptions}
                                            value={timeValues[`time-hour-${i}`] ?? ''}
                                            onChange={(v) => setTimeValues((prev) => ({ ...prev, [`time-hour-${i}`]: v }))}
                                            inputClassName="block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <span className="text-slate-400 text-xs">:</span>
                                    <div className="w-20 shrink-0">
                                        <label className="sr-only">Minutes</label>
                                        <TimeDropdown
                                            name={`time-min-${i}`}
                                            placeholder="Min"
                                            options={MINUTE_OPTIONS}
                                            filterOptions={filterMinuteOptions}
                                            value={timeValues[`time-min-${i}`] ?? ''}
                                            onChange={(v) => setTimeValues((prev) => ({ ...prev, [`time-min-${i}`]: v }))}
                                            inputClassName="block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    {pillTimeEntries > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTimeEntry(i)}
                                            className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary"
                                            aria-label={`Remove time ${i + 1}`}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {timeError && (
                            <p className="mt-1 text-[11px] text-red-600" role="alert">{timeError}</p>
                        )}
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