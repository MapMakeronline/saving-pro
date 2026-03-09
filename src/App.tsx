import { BrowserRouter } from 'react-router-dom'
import { useEffect } from 'react'
import Router from './Router'
import ToastContainer from './components/common/ToastContainer'
import ErrorBoundary from './components/common/ErrorBoundary'

function App() {
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
