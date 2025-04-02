"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import DraftsList from "../components/drafts-list"
import { fetchStats, fetchAllPosts, fetchPosts } from "../lib/api"

function HomePage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    drafts: 0,
    scheduled: 0,
    published: 0,
    connectedAccounts: 0,
  })
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [allPosts, setAllPosts] = useState([])
  const [publishedPosts, setPublishedPosts] = useState([])

  useEffect(() => {
    // Fetch stats and all posts
    try {
      const statsData = fetchStats()
      setStats(statsData)

      const postsData = fetchAllPosts()
      setAllPosts(postsData)

      const publishedData = fetchPosts("publish")
      setPublishedPosts(publishedData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="p-4 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/create">
          <button className="btn btn-primary w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </button>
        </Link>
      </header>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Total Posts</h2>
            <p className="card-description">Across all platforms</p>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalPosts}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Scheduled</h2>
            <p className="card-description">Posts waiting to be published</p>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">{loading ? "..." : stats.scheduled}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Drafts</h2>
            <p className="card-description">Unpublished posts</p>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">{loading ? "..." : stats.drafts}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Published</h2>
            <p className="card-description">Posts already published</p>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">{loading ? "..." : stats.published}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div className="flex">
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "all"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Posts
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "published"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("published")}
            >
              Published
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "drafts"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("drafts")}
            >
              Drafts
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "scheduled"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("scheduled")}
            >
              Scheduled
            </button>
          </div>
        </div>
        <div className="p-4">
          {activeTab === "all" && (
            <div className="space-y-4">
              {loading ? (
                <div className="py-8 text-center">Loading posts...</div>
              ) : allPosts.length > 0 ? (
                allPosts.map((post) => (
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
                        {post.type === "scheduled" &&
                          post.date &&
                          `Scheduled for: ${new Date(post.date).toLocaleString()}`}
                        {post.type === "draft" && "Draft"}
                        {post.type === "publish" &&
                          post.publishedAt &&
                          `Published: ${new Date(post.publishedAt).toLocaleString()}`}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/edit/${post.id}`}>
                          <button className="btn btn-outline btn-sm">Edit</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 py-12 text-center">
                  <h3 className="mb-1 text-lg font-medium">No posts found</h3>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Create your first post to get started</p>
                  <Link to="/create">
                    <button className="btn btn-primary">Create New Post</button>
                  </Link>
                </div>
              )}
            </div>
          )}
          {activeTab === "published" && (
            <div className="space-y-4">
              {loading ? (
                <div className="py-8 text-center">Loading published posts...</div>
              ) : publishedPosts.length > 0 ? (
                publishedPosts.map((post) => (
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
                        {post.publishedAt && `Published: ${new Date(post.publishedAt).toLocaleString()}`}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/edit/${post.id}`}>
                          <button className="btn btn-outline btn-sm">Edit</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 py-12 text-center">
                  <h3 className="mb-1 text-lg font-medium">No published posts found</h3>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Publish a post to see it here</p>
                  <Link to="/create">
                    <button className="btn btn-primary">Create New Post</button>
                  </Link>
                </div>
              )}
            </div>
          )}
          {activeTab === "drafts" && <DraftsList type="draft" />}
          {activeTab === "scheduled" && <DraftsList type="scheduled" />}
        </div>
      </div>
    </div>
  )
}

export default HomePage

