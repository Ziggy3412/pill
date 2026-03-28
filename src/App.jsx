import { useState } from 'react'
import SideBar from './SideBar.jsx'
import AddChart from './AddChart.jsx'
import ChartChart from './ChartChart.jsx'
import PopupChart from './PopupChart.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AuthModal from './components/AuthModal.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { usePills } from './hooks/usePills.js'

export default function App() {
  const { user, login } = useAuth()
  const { pills, addPill, deletePill, refresh } = usePills()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [authModal, setAuthModal] = useState(null)
  const [currentPage, setCurrentPage] = useState('chart')

  function handleAddClick() {
    if (!user) {
      setAuthModal('login')
      return
    }
    setIsPopupOpen(true)
  }

  async function handleLogin(credential) {
    await login(credential)
    setTimeout(refresh, 100)
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <SideBar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onOpenAuth={(mode) => setAuthModal(mode)}
        />

        <main className="relative flex-1 overflow-y-auto">
          {currentPage === 'home' ? (
            <Dashboard />
          ) : (
            <>
              <AddChart changePopupState={handleAddClick} />
              <ChartChart pills={pills} onDelete={deletePill} />
            </>
          )}
        </main>
      </div>

      {isPopupOpen && (
        <PopupChart changePopupState={setIsPopupOpen} onSave={addPill} />
      )}

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal(authModal === 'login' ? 'signup' : 'login')}
          onLogin={async (credential) => {
            await handleLogin(credential)
            setAuthModal(null)
          }}
        />
      )}
    </>
  )
}
