import { useEffect, useMemo, useState } from 'react'

const ACCESS_STORAGE_KEY = import.meta.env.VITE_ACCESS_STORAGE_KEY

function AccessGate({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [error, setError] = useState('')

  const allowedCodes = useMemo(() => {
    const envCodes =
      import.meta.env.VITE_ACCESS_CODES ?? import.meta.env.VITE_ACCESS_CODE ?? '1234'
    return new Set(
      String(envCodes)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    )
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(ACCESS_STORAGE_KEY)
    setIsAuthorized(stored === 'true')
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    if (allowedCodes.has(codeInput.trim())) {
      localStorage.setItem(ACCESS_STORAGE_KEY, 'true')
      setIsAuthorized(true)
    } else {
      setError('Incorrect code. Please try again.')
    }
  }

  if (isAuthorized) return children

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-primary-700 to-primary-900">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-80 shadow-xl border border-white/20">
        <h1 className="text-white text-xl font-semibold text-center mb-4">Enter Access Code</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={codeInput}
            onChange={(e) => {
              setCodeInput(e.target.value)
              if (error) setError('')
            }}
            placeholder="Code"
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/50"
          />
          {error ? (
            <div className="text-red-200 text-sm" role="alert">{error}</div>
          ) : null}
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-white text-primary-800 font-semibold hover:bg-white/90 transition"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}

export default AccessGate


