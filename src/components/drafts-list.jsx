"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { fetchPosts, deletePost } from "../lib/api"

function DraftsList({ type }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(null)

  useEffect(() => {
    try {
      const data = fetchPosts(type)
      setPosts(data)
    } catch (error) {
      console.error(`Error fetching ${type}s:`, error)
    } finally {
      setLoading(false)
    }
  }, [type])

  const handleDelete = (id) => {
    try {
      deletePost(id)
      setPosts(posts.filter((post) => post.id !== id))
      alert(`The ${type} has been deleted successfully`)
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post")
    }
  }

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id)
  }

  if (loading) {
    return <div className="py-8 text-center">Loading {type}s...</div>
  }

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="card">
            <div className="card-content">
              <p className="mb-2">{post.content}</p>
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.mediaUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url || "/placeholder.svg"}
                      alt={`Media ${index}`}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1 mb-2">
                {post.platforms &&
                  post.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-gray-700"
                    >
                      {platform}
                    </span>
                  ))}
              </div>
            </div>
            <div className="card-footer flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {type === "scheduled" && post.date && `Scheduled for: ${new Date(post.date).toLocaleString()}`}
                {type === "draft" && "Draft"}
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/edit/${post.id}`}>
                  <button className="btn btn-outline btn-sm">
                    <Edit className="mr-2 h-3.5 w-3.5" />
                    Edit
                  </button>
                </Link>
                <div className="relative">
                  <button className="btn btn-outline btn-sm btn-icon" onClick={() => toggleDropdown(post.id)}>
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {dropdownOpen === post.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 py-12 text-center">
          <h3 className="mb-1 text-lg font-medium">No {type}s found</h3>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {type === "draft"
              ? "Create a draft to save your ideas for later"
              : "Schedule posts to be published automatically"}
          </p>
          <Link to="/create">
            <button className="btn btn-primary">Create New Post</button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default DraftsList

