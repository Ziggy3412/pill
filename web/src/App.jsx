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

    return (
        <>
            <div className="flex h-full">
                <SideBar currentPage={currentPage} onNavigate={setCurrentPage} />

                <main className="relative flex-1">
                    {currentPage === 'home' ? (
                        <div className="h-full min-h-full w-full bg-white" />
                    ) : (
                        <>
                            <AddChart changePopupState={setIsPopupOpen} />
                            <ChartChart pills={pills} />
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
