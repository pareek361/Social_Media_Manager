/**
 * Edit Post Page Component
 * This component provides an interface for editing existing social media posts.
 * Features include:
 * - Editing post content
 * - Managing media attachments
 * - Selecting social media platforms
 * - Scheduling posts
 * - Preview functionality
 * - Responsive design
 */

"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronLeft, Image, X, Calendar } from "lucide-react"
import { format } from "date-fns"
import { fetchPostById, fetchSocialAccounts, updatePost } from "../lib/api"

function EditPostPage() {
  // Router hooks for navigation and parameter handling
  const navigate = useNavigate()
  const { id } = useParams()

  // State Management
  // post: The current post being edited
  // content: Post text content
  // date: Selected date for scheduled posts
  // time: Selected time for scheduled posts
  // selectedAccounts: Array of selected social media account IDs
  // selectedMedia: Array of selected media files
  // mediaPreviewUrls: Array of temporary URLs for media previews
  // postType: Current post type (draft/scheduled/publish)
  // accounts: Array of available social media accounts
  // loading: Loading state indicator
  // showPreview: Preview mode toggle
  const [post, setPost] = useState(null)
  const [content, setContent] = useState("")
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState("12:00")
  const [selectedAccounts, setSelectedAccounts] = useState([])
  const [selectedMedia, setSelectedMedia] = useState([])
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState([])
  const [postType, setPostType] = useState("draft")
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  // Get current date and time for min values
  const now = new Date()
  const currentDate = now.toISOString().split('T')[0]
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

  // Function to get minimum time based on selected date
  const getMinTime = (selectedDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selected = new Date(selectedDate)
    selected.setHours(0, 0, 0, 0)
    
    // If selected date is today, use current time
    if (selected.getTime() === today.getTime()) {
      return currentTime
    }
    // If selected date is in the future, allow any time
    return "00:00"
  }

  // Handle date change
  const handleDateChange = (e) => {
    const newDate = e.target.value
    setDate(newDate)
    
    // If the selected time is before current time and date is today, reset time
    if (newDate === currentDate && time < currentTime) {
      setTime(currentTime)
    }
  }

  /**
   * Effect hook to load post data and accounts when component mounts
   * Handles error cases and loading states
   */
  useEffect(() => {
    try {
      // Fetch post data
      const postData = fetchPostById(id)
      if (!postData) {
        alert("Post not found")
        navigate("/")
        return
      }

      setPost(postData)
      setContent(postData.content)
      setPostType(postData.type)

      // Set scheduled date and time if applicable
      if (postData.type === "scheduled" && postData.date) {
        const scheduledDate = new Date(postData.date)
        setDate(scheduledDate)
        setTime(
          `${String(scheduledDate.getHours()).padStart(2, "0")}:${String(scheduledDate.getMinutes()).padStart(2, "0")}`,
        )
      }

      // Fetch and set social accounts
      const accountsData = fetchSocialAccounts()
      if (Array.isArray(accountsData)) {
        setAccounts(accountsData)

        // Set selected accounts based on platforms
        if (Array.isArray(postData.platforms)) {
          const accountIds = accountsData
            .filter((account) => postData.platforms.includes(account.name))
            .map((account) => account.id)
          setSelectedAccounts(accountIds)
        }
      } else {
        console.error("Expected accounts to be an array but got:", accountsData)
        setAccounts([])
      }

      // Handle media if exists
      if (postData.mediaUrls && Array.isArray(postData.mediaUrls) && postData.mediaUrls.length > 0) {
        setMediaPreviewUrls(postData.mediaUrls)
      }
    } catch (error) {
      console.error("Error loading post:", error)
      alert("Failed to load post data")
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  /**
   * Handle media file selection for upload
   * Creates preview URLs for immediate display
   * @param {Event} e - File input change event
   */
  const handleMediaChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedMedia([...selectedMedia, ...filesArray])

      // Create preview URLs for immediate display
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))
      setMediaPreviewUrls([...mediaPreviewUrls, ...newPreviewUrls])
    }
  }

  /**
   * Remove a media item from the selection
   * Cleans up object URLs to prevent memory leaks
   * @param {number} index - Index of media to remove
   */
  const removeMedia = (index) => {
    const newMedia = [...selectedMedia]
    newMedia.splice(index, 1)
    setSelectedMedia(newMedia)

    // Clean up object URL to prevent memory leaks
    const newPreviewUrls = [...mediaPreviewUrls]
    if (newPreviewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(newPreviewUrls[index])
    }
    newPreviewUrls.splice(index, 1)
    setMediaPreviewUrls(newPreviewUrls)
  }

  /**
   * Toggle the selection of a social account
   * @param {number} accountId - ID of account to toggle
   */
  const handleAccountToggle = (accountId) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId],
    )
  }

  /**
   * Submit the post update form
   * Validates input and handles the update process
   */
  const handleSubmit = async () => {
    if (content.trim() === "") {
      alert("Post content cannot be empty")
      return
    }

    if (selectedAccounts.length === 0) {
      alert("Please select at least one social account")
      return
    }

    try {
      // Get platform names instead of IDs for better display
      const platforms = selectedAccounts
        .map((id) => {
          const account = accounts.find((a) => a.id === id)
          return account ? account.name : ""
        })
        .filter(Boolean)

      // Create post data with media files
      const postData = {
        content,
        platforms,
        type: postType,
        media: selectedMedia, // Pass the actual files for conversion to data URLs
      }

      // Handle scheduled posts
      if (postType === "scheduled") {
        const scheduledDate = new Date(date)
        const [hours, minutes] = time.split(":")
        scheduledDate.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10))
        postData.scheduledDate = scheduledDate.toISOString()
      }

      // Update the post (this will handle media conversion)
      await updatePost(id, postData)

      // Clean up object URLs to prevent memory leaks
      mediaPreviewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })

      alert(
        postType === "scheduled"
          ? "Post updated and scheduled successfully"
          : postType === "publish"
            ? "Post updated and published successfully"
            : "Draft updated successfully",
      )

      // Navigate back to home
      navigate("/")
    } catch (error) {
      console.error("Error updating post:", error)
      alert("Failed to update post. Please try again.")
    }
  }

  /**
   * Toggle preview mode
   */
  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading post...</p>
        </div>
      </div>
    )
  }

  // Render the component
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center">
        <button onClick={() => navigate("/")} className="btn btn-outline mr-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Edit Post</h1>
      </div>

      <div className="grid gap-6">
        {/* Content editor */}
        <div className="card">
          <div className="card-content">
            <textarea
              placeholder="What's on your mind?"
              className="w-full min-h-[150px] resize-none text-lg p-2 bg-transparent border-none focus:outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        {/* Media section */}
        <div className="card">
          <div className="card-content">
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-medium">Media</h3>
              <div className="flex flex-wrap gap-4">
                {/* Media preview grid */}
                {mediaPreviewUrls.map((url, index) => (
                  <div key={index} className="relative h-24 w-24">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      className="h-full w-full rounded-md object-cover"
                    />
                    <button
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {/* Upload button */}
                <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600">
                  <Image className="h-8 w-8 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleMediaChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Social accounts section */}
        <div className="card">
          <div className="card-content">
            <h3 className="mb-2 text-lg font-medium">Social Accounts</h3>
            <div className="space-y-2">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`account-${account.id}`}
                    checked={selectedAccounts.includes(account.id)}
                    onChange={() => handleAccountToggle(account.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor={`account-${account.id}`} className="text-sm">
                    {account.name} ({account.username})
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Post options section */}
        <div className="card">
          <div className="card-content">
            <h3 className="mb-4 text-lg font-medium">Post Options</h3>
            <div className="space-y-4">
              {/* Post type selection */}
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="draft"
                  name="postType"
                  value="draft"
                  checked={postType === "draft"}
                  onChange={() => setPostType("draft")}
                  className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="draft">Save as Draft</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="publish"
                  name="postType"
                  value="publish"
                  checked={postType === "publish"}
                  onChange={() => setPostType("publish")}
                  className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="publish">Publish Now</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="scheduled"
                  name="postType"
                  value="scheduled"
                  checked={postType === "scheduled"}
                  onChange={() => setPostType("scheduled")}
                  className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="scheduled">Schedule for Later</label>
              </div>
            </div>

            {/* Schedule options */}
            {postType === "scheduled" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    min={currentDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:[color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    min={getMinTime(date)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:[color-scheme:dark]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <button className="btn btn-outline" onClick={togglePreview}>
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn btn-outline" onClick={() => navigate("/")}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Update Post
            </button>
          </div>
        </div>

        {/* Preview section */}
        {showPreview && (
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">Post Preview</h3>
            </div>
            <div className="card-content">
              <div className="mb-4 p-4 border rounded-md bg-white dark:bg-gray-800">
                <p className="mb-4">{content || "Your post content will appear here"}</p>

                {/* Media preview */}
                {mediaPreviewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mediaPreviewUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url || "/placeholder.svg"}
                        alt={`Media ${index}`}
                        className="h-20 w-20 object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}

                {/* Platform tags */}
                <div className="flex flex-wrap gap-1">
                  {selectedAccounts.map((id) => {
                    const account = accounts.find((a) => a.id === id)
                    return account ? (
                      <span
                        key={id}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium dark:bg-gray-700"
                      >
                        {account.name}
                      </span>
                    ) : null
                  })}
                </div>

                {/* Schedule info */}
                {postType === "scheduled" && (
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="inline-block mr-1 h-4 w-4" />
                    Scheduled for: {format(date, "PPP")} at {time}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditPostPage

