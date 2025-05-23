import { useEffect } from 'react'
import { useRouter } from 'next/router'

const ProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const router = useRouter()

    useEffect(() => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.replace('/login')
      }
    }, [router])

    return <WrappedComponent {...props} />
  }
}

export default ProtectedRoute
