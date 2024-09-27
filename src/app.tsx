import React, { useState, useEffect, ReactNode } from 'react'
import './index.css'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Signin from './views/Signin'
import Profile from './views/Profile'
import { zorkin } from './lib'

export const routes = {
  signin: '/',
  signup: '/signup',
  profile: '/profile'
}
interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true)
      const isLoggedIn = await zorkin.getIsLoggedIn()
      setIsAuth(isLoggedIn)
      setIsLoading(false)
    }
    verifyAuth()
  }, [])

  if (isLoading) {
    return null
  }

  return isAuth ? children : <Navigate to={routes.signin} replace />
}

const router = createBrowserRouter([
  {
    path: routes.signin,
    element: <Signin />
  },
  {
    path: routes.profile,
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  }
])

export default function App(): JSX.Element {
  return (
    <RouterProvider router={router} />
  )
}
