// secureauth-frontend/src/pages/dashboard.js

import { useEffect, useState } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import ReactMarkdown from 'react-markdown'

const Dashboard = () => {
  const [briefContent, setBriefContent] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        const res = await fetch('/brief.md')
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }
        const text = await res.text()
        setBriefContent(text)
      } catch (error) {
        setError('Failed to load project brief.')
      }
    }

    fetchBrief()
  }, [])

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (!briefContent) {
    return <p>Loading...</p>
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      <div className="prose max-w-none">
        <ReactMarkdown>{briefContent}</ReactMarkdown>
      </div>
    </div>
  )
}

export default ProtectedRoute(Dashboard)
