import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Index from './pages/Index'
import Entry from './pages/Entry'
import Exit from './pages/Exit'
import Admin from './pages/Admin'
import Settings from './pages/Settings'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/entry",
    element: <Entry />,
  },
  {
    path: "/exit", 
    element: <Exit />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
    <Sonner />
  </StrictMode>,
)