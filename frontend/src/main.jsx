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

const router = createBrowserRouter([
  {
    path: '/',
    element:
      <UserContextProvider>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </UserContextProvider>,
    children: [{
      path: '/',
      element: <App />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    }
    ],
  }
])

const root = createRoot(document.getElementById('root'));

root.render(
  <RouterProvider router={router} />

)

