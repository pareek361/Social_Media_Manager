/**
 * Media Library Page Component
 * This component provides a complete interface for managing media files in the application.
 * Features include:
 * - Uploading new media files
 * - Viewing existing media with previews
 * - Filtering media by type (images/videos)
 * - Searching media by name
 * - Deleting media files
 * - Responsive grid layout
 */

"use client"

import { useState, useEffect } from "react"
import { Search, Upload, X, Image, Trash2 } from "lucide-react"
import { fetchMedia, uploadMedia, deleteMedia } from "../lib/api"
import { useToast, CustomToastContainer } from "../components/ui/toast"

function MediaPage() {
  // State Management
  // media: Array of all media items from the API
  // searchTerm: Current search filter text
  // uploadedFiles: Array of files selected for upload
  // uploadPreviewUrls: Array of temporary URLs for previewing selected files
  // activeTab: Current filter tab ('all', 'images', or 'videos')
  // loading: Loading state indicator
  const [media, setMedia] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploadPreviewUrls, setUploadPreviewUrls] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const { toasts, showToast } = useToast()

  /**
   * Effect hook to fetch media data when component mounts
   * Handles error cases and loading states
   */
  useEffect(() => {
    try {
      const data = fetchMedia()
      if (Array.isArray(data)) {
        setMedia(data)
      } else {
        console.error("Expected media to be an array but got:", data)
        setMedia([])
      }
    } catch (error) {
      console.error("Error fetching media:", error)
      showToast("Failed to load media files", "error")
      setMedia([])
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Handle search input changes
   * Updates the search term state which is used to filter media items
   * @param {Event} e - Input change event
   */
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  /**
   * Filter media items based on search term and active tab
   * @returns {Array} Filtered array of media items
   */
  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType =
      activeTab === "all" ||
      (activeTab === "images" && item.type === "image") ||
      (activeTab === "videos" && item.type === "video")
    return matchesSearch && matchesType
  })

  /**
   * Handle file selection for upload
   * Creates preview URLs for immediate display of selected files
   * @param {Event} e - File input change event
   */
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setUploadedFiles([...uploadedFiles, ...filesArray])

      // Create preview URLs for immediate display
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))
      setUploadPreviewUrls([...uploadPreviewUrls, ...newPreviewUrls])
    }
  }

  /**
   * Remove a file from the upload queue
   * Cleans up object URLs to prevent memory leaks
   * @param {number} index - Index of file to remove
   */
  const removeUploadFile = (index) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)

    // Clean up object URL to prevent memory leaks
    const newPreviewUrls = [...uploadPreviewUrls]
    URL.revokeObjectURL(newPreviewUrls[index])
    newPreviewUrls.splice(index, 1)
    setUploadPreviewUrls(newPreviewUrls)
  }

  /**
   * Upload selected files to the media library
   * Handles the upload process and updates the media state
   * Cleans up temporary URLs after successful upload
   */
  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      showToast("Please select files to upload", "error")
      return
    }

    try {
      const newMediaItems = await uploadMedia(uploadedFiles)

      setMedia([...newMediaItems, ...media])
      setUploadedFiles([])
      
      // Clean up all object URLs
      uploadPreviewUrls.forEach(url => URL.revokeObjectURL(url))
      setUploadPreviewUrls([])

      showToast(`${newMediaItems.length} files uploaded successfully`, "success")
    } catch (error) {
      console.error("Error uploading files:", error)
      showToast("Failed to upload files", "error")
    }
  }

  /**
   * Delete a media item from the library
   * Updates the media state after successful deletion
   * @param {number} id - ID of media item to delete
   */
  const handleDeleteMedia = (id) => {
    try {
      deleteMedia(id)
      setMedia(media.filter((item) => item.id !== id))
      showToast("File removed from your library", "success")
    } catch (error) {
      console.error("Error deleting media:", error)
      showToast("Failed to delete media file", "error")
    }
  }

  // Render the component
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Media Library</h1>

      {/* Tabs and search section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Media
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "images"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("images")}
          >
            Images
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "videos"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search media..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 sm:w-[300px]"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-content">
          {/* Upload section */}
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-medium">Upload New Media</h2>
            <div className="grid gap-4">
              {/* Preview grid for selected files */}
              <div className="flex flex-wrap gap-4">
                {uploadPreviewUrls.map((url, index) => (
                  <div key={index} className="relative h-24 w-24">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      className="h-full w-full rounded-md object-cover"
                    />
                    <button
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                      onClick={() => removeUploadFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {/* Upload button */}
                <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="mt-1 text-xs text-gray-500">Upload</span>
                  </div>
                  <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />
                </label>
              </div>
              {/* Upload button for selected files */}
              {uploadedFiles.length > 0 && (
                <button onClick={handleUpload} className="btn btn-primary w-full sm:w-auto">
                  Upload {uploadedFiles.length} Files
                </button>
              )}
            </div>
          </div>

          {/* Media display section */}
          <h2 className="mb-4 text-lg font-medium">Your Media</h2>
          {loading ? (
            <div className="py-8 text-center">Loading media files...</div>
          ) : filteredMedia.length > 0 ? (
            // Media Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-[20vh] bg-gray-100 dark:bg-gray-700">
                    {item.type === "image" ? (
                      <img
                        src={item.persistentUrl || item.url}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <video
                        src={item.persistentUrl || item.url}
                        className="w-full h-full object-contain"
                        controls
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.size} • {item.date}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMedia(item.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete media"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            // Empty state message
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 py-12 text-center">
              <Image className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-1 text-lg font-medium">No media found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? "Try a different search term" : "Upload some files to get started"}
              </p>
            </div>
          )}
        </div>
      </div>
      <CustomToastContainer 
        toasts={toasts}
        onClose={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
      />
    </div>
  )
}

export default MediaPage

