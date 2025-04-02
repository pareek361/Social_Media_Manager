"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { CalendarDays, FileImage, Home, Menu, Moon, Sun, Users, X } from "lucide-react"
import { useTheme } from "./theme-provider"

function Layout({ children }) {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed right-5 top-4  z-50 md:hidden bg-gray-200 dark:bg-gray-800 p-2 rounded-md shadow-md"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-[250px] border-r bg-gray-50 dark:bg-gray-800 z-40 transition-transform duration-300 ease-in-out ${
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Social Media</h1>
          <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  location.pathname === "/" ? "bg-blue-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  location.pathname === "/calendar"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <CalendarDays className="h-5 w-5" />
                Calendar
              </Link>
            </li>
            <li>
              <Link
                to="/accounts"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  location.pathname === "/accounts"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Users className="h-5 w-5" />
                Social Accounts
              </Link>
            </li>
            <li>
              <Link
                to="/media"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  location.pathname === "/media" ? "bg-blue-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <FileImage className="h-5 w-5" />
                Media
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isMobile ? "ml-0" : "ml-[250px]"}`}>{children}</div>
    </div>
  )
}

export default Layout

