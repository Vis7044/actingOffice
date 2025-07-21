import { type ReactNode } from 'react'
import { useAuth } from '../utils/useAuth'
import { Navigate } from 'react-router-dom'

const ProtectRoute = ({children}: {children: ReactNode}) => {
    // This component can be used to protect routes, e.g., by checking authentication status
    // and redirecting to a login page if the user is not authenticated.
    const {user} = useAuth()
    const token = localStorage.getItem('token') 
    if(!user || !token) {
        return <Navigate to={'/login'} replace /> 
    }
  return (
    <>
        {children}
    </>
  )
}

export default ProtectRoute