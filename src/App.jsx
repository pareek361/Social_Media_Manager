import { Routes, Route } from "react-router-dom"

import HomePage from "./pages/home"
import CreatePostPage from "./pages/create-post"
import EditPostPage from "./pages/edit-post"
import CalendarPage from "./pages/calendar"
import AccountsPage from "./pages/accounts"
import MediaPage from "./pages/media"
import { Toaster } from "./components/ui/toaster"
import Layout from "./components/Layout"

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/create"
          element={
            <Layout>
              <CreatePostPage />
            </Layout>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <Layout>
              <EditPostPage />
            </Layout>
          }
        />
        <Route
          path="/calendar"
          element={
            <Layout>
              <CalendarPage />
            </Layout>
          }
        />
        <Route
          path="/accounts"
          element={
            <Layout>
              <AccountsPage />
            </Layout>
          }
        />
        <Route
          path="/media"
          element={
            <Layout>
              <MediaPage />
            </Layout>
          }
        />
      </Routes>
      <Toaster />
    </>
  )
}

export default App

