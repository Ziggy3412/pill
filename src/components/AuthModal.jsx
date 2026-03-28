import { createPortal } from 'react-dom'
import { GoogleLogin } from '@react-oauth/google'

export default function AuthModal({ mode, onClose, onSwitch, onLogin }) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl p-8 w-[340px] shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-black text-center text-slate-900 tracking-wide mb-6">
          {mode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
        </h2>

        <GoogleLogin
          onSuccess={async (res) => {
            await onLogin(res.credential)
          }}
          onError={() => {}}
          size="large"
          text={mode === 'login' ? 'signin_with' : 'signup_with'}
          shape="rectangular"
          width="280"
        />

        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1 border-slate-200" />
          <span className="text-slate-400 text-xs font-medium tracking-widest">OR</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        <p className="text-center text-sm text-slate-500">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={onSwitch} className="text-blue-600 font-semibold hover:underline">
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>,
    document.body,
  )
}
