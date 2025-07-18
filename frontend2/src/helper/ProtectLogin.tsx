import React, { type ReactNode } from 'react'
import { useAuth } from '../utils/useAuth'
import { Navigate } from 'react-router-dom'

export const ProtectLogin = ({children}:{children:ReactNode}) => {
    const {user} = useAuth()
    if(user) {
        return <Navigate to={'/client'} replace/>
    }
  return (
    children
  )
}