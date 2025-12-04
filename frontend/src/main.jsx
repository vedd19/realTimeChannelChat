import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login } from './pages/Login.jsx'
import { Register } from './pages/Register.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { SnackbarProvider } from 'notistack'
import UserContextProvider from './context/UserContextProvider.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { SocketProvider } from './context/SocketProvider.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element:
      <SocketProvider>
        <UserContextProvider>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </UserContextProvider>
      </SocketProvider>,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      }
    ],
  }
])

const root = createRoot(document.getElementById('root'));

root.render(
  <RouterProvider router={router} />

)

