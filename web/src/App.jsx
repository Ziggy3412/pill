import { useState, useEffect } from 'react'
import './App.css'
import SideBar from "./SideBar.jsx";
import AddChart from "./AddChart.jsx";
import ChartChart from "./ChartChart.jsx";
import PopupChart from "./PopupChart.jsx";
import { api } from './api';

function App() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('chart'); // 'home' | 'chart'
    const [pills, setPills] = useState([]);

    // Fetch existing pills from the backend on mount
    useEffect(() => {
        api.get('/api/pills')
            .then(setPills)
            .catch(() => {}); // fail silently — empty list is fine
    }, []);

    function handleSave(newPill) {
        setPills((prev) => [...prev, newPill]);
    }

    async function handleDelete(id) {
        await api.delete(`/api/pills/${id}`);
        setPills((prev) => prev.filter((p) => p.id !== id));
    }

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                <SideBar currentPage={currentPage} onNavigate={setCurrentPage} />

                <main className="relative flex-1 overflow-y-auto">
                    {currentPage === 'home' ? (
                        <div className="h-full min-h-full w-full bg-white" />
                    ) : (
                        <>
                            <AddChart changePopupState={setIsPopupOpen} />
                            <ChartChart pills={pills} onDelete={handleDelete} />
                        </>
                    )}
                </main>
            </div>

            {isPopupOpen && (
                <PopupChart
                    changePopupState={setIsPopupOpen}
                    onSave={handleSave}
                />
            )}
        </>
    );
}

export default App
