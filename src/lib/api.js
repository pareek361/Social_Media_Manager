/**
 * Social Media Manager API Module
 * This module provides a simple JSON-based API for managing social media posts, accounts, and media.
 * It uses localStorage for data persistence, making it suitable for client-side only applications.
 */

/**
 * Helper function to retrieve data from localStorage with fallback to default data
 * @param {string} key - The localStorage key to retrieve data from
 * @param {any} defaultData - Default data to return if key doesn't exist
 * @returns {any} - The parsed data or default data
 */
const getLocalData = (key, defaultData) => {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : defaultData
    } catch (error) {
      console.error(`Error getting data from localStorage for key ${key}:`, error)
      return defaultData
    }
  }
  
  /**
   * Helper function to save data to localStorage
   * @param {string} key - The localStorage key to save data to
   * @param {any} data - The data to save
   * @returns {any} - The saved data
   */
  const saveLocalData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return data
    } catch (error) {
      console.error(`Error saving data to localStorage for key ${key}:`, error)
      return data
    }
  }
  
  /**
   * Initial Posts Data Structure
   * Contains sample posts with different types (draft, scheduled, published)
   * Each post has:
   * - id: Unique identifier
   * - content: Post text content
   * - platforms: Array of social media platforms
   * - type: Post status (draft/scheduled/publish)
   * - createdAt: Timestamp of creation
   * - date: Scheduled date (for scheduled posts)
   * - publishedAt: Publication timestamp (for published posts)
   */
  const initialPosts = [
    {
      id: 1,
      content: "Working on our new product launch. Can't wait to share more details!",
      platforms: ["Twitter", "LinkedIn"],
      type: "draft",
      createdAt: "2023-04-01T10:00:00.000Z",
    },
    {
      id: 2,
      content: "Here's a sneak peek at what we've been working on for the past few months.",
      platforms: ["Instagram"],
      type: "draft",
      createdAt: "2023-04-02T14:30:00.000Z",
    },
    {
      id: 3,
      content: "Customer satisfaction is our top priority. Here's how we're improving our support system.",
      platforms: ["Facebook", "LinkedIn"],
      type: "draft",
      createdAt: "2023-04-03T09:15:00.000Z",
    },
    {
      id: 4,
      content: "Draft of our monthly newsletter content. Need to add more details about the upcoming webinar.",
      platforms: ["Twitter"],
      type: "draft",
      createdAt: "2023-04-04T16:45:00.000Z",
    },
    {
      id: 5,
      content:
        "Excited to announce our new partnership with @acmecorp! Together we'll be launching an innovative solution next month.",
      platforms: ["Twitter", "LinkedIn"],
      date: "2023-04-15T12:00:00.000Z",
      type: "scheduled",
      createdAt: "2023-04-05T11:30:00.000Z",
    },
    {
      id: 6,
      content:
        "Join us for a live webinar on 'Industry Trends for 2023' with our CEO and special guests from leading companies.",
      platforms: ["Facebook", "LinkedIn"],
      date: "2023-04-20T14:30:00.000Z",
      type: "scheduled",
      createdAt: "2023-04-06T13:20:00.000Z",
    },
    {
      id: 7,
      content: "Flash sale this weekend! Use code SPRING25 for 25% off all products. Limited time only!",
      platforms: ["Instagram", "Facebook"],
      date: "2023-04-10T09:00:00.000Z",
      type: "scheduled",
      createdAt: "2023-04-07T10:10:00.000Z",
    },
    {
      id: 8,
      content: "We're hiring! Check out our careers page for exciting opportunities to join our growing team.",
      platforms: ["LinkedIn"],
      date: "2023-04-25T10:00:00.000Z",
      type: "scheduled",
      createdAt: "2023-04-08T15:45:00.000Z",
    },
    {
      id: 9,
      content: "Just launched our new website! Check it out and let us know what you think.",
      platforms: ["Twitter", "Facebook", "LinkedIn"],
      type: "publish",
      publishedAt: "2023-04-01T09:00:00.000Z",
      createdAt: "2023-04-01T08:30:00.000Z",
    },
    {
      id: 10,
      content: "Thank you to everyone who attended our webinar yesterday. The recording is now available on our website.",
      platforms: ["LinkedIn", "Twitter"],
      type: "publish",
      publishedAt: "2023-04-02T14:00:00.000Z",
      createdAt: "2023-04-02T13:45:00.000Z",
    },
    {
      id: 11,
      content: "Our CEO was featured in Tech Today magazine this month discussing the future of our industry.",
      platforms: ["LinkedIn", "Facebook"],
      type: "publish",
      publishedAt: "2023-04-03T11:30:00.000Z",
      createdAt: "2023-04-03T10:15:00.000Z",
    },
  ]
  
  /**
   * Initial Accounts Data Structure
   * Contains sample social media accounts
   * Each account has:
   * - id: Unique identifier
   * - name: Display name
   * - platform: Social media platform name
   * - username: Platform username
   * - connected: Connection status
   */
  const initialAccounts = [
    {
      id: 1,
      name: "Main Twitter",
      platform: "twitter",
      username: "@companyname",
      connected: true,
    },
    {
      id: 2,
      name: "Facebook Page",
      platform: "facebook",
      username: "Company Official",
      connected: true,
    },
    {
      id: 3,
      name: "Instagram Business",
      platform: "instagram",
      username: "@company_official",
      connected: true,
    },
  ]
  
  /**
   * Initial Media Data Structure
   * Contains sample media items with persistent URLs
   * Each media item has:
   * - id: Unique identifier
   * - name: File name
   * - type: Media type (image/video)
   * - url: Temporary URL for current session
   * - persistentUrl: Base64 data URL that persists across sessions
   * - size: File size in MB
   * - date: Upload date
   */
  const initialMedia = [
    {
      id: 1,
      name: "pexels-polina-kovaleva-6788528.jpg",
      type: "image",
      url: "/images/pexels-polina-kovaleva-6788528.jpg",
      size: "2.2 MB",
      date: "2024-04-02",
      persistentUrl: "/images/pexels-polina-kovaleva-6788528.jpg"
    },
    {
      id: 2,
      name: "pexels-alexant-7004697.jpg",
      type: "image",
      url: "/images/pexels-alexant-7004697.jpg",
      size: "2.8 MB",
      date: "2024-04-02",
      persistentUrl: "/images/pexels-alexant-7004697.jpg"
    },
    {
      id: 3,
      name: "pexels-alexasfotos-31405148.jpg",
      type: "image",
      url: "/images/pexels-alexasfotos-31405148.jpg",
      size: "0.3 MB",
      date: "2024-04-02",
      persistentUrl: "/images/pexels-alexasfotos-31405148.jpg"
    },
    {
      id: 4,
      name: "pexels-dmitry-demidov-515774-3852577.jpg",
      type: "image",
      url: "/images/pexels-dmitry-demidov-515774-3852577.jpg",
      size: "4.2 MB",
      date: "2024-04-02",
      persistentUrl: "/images/pexels-dmitry-demidov-515774-3852577.jpg"
    },
    {
      id: 5,
      name: "3694915-uhd_2160_3840_30fps.mp4",
      type: "video",
      url: "/images/3694915-uhd_2160_3840_30fps.mp4",
      size: "111 MB",
      date: "2024-04-02",
      persistentUrl: "/images/3694915-uhd_2160_3840_30fps.mp4"
    },
    {
      id: 6,
      name: "7565895-hd_1080_1920_25fps.mp4",
      type: "video",
      url: "/images/7565895-hd_1080_1920_25fps.mp4",
      size: "34 MB",
      date: "2024-04-02",
      persistentUrl: "/images/7565895-hd_1080_1920_25fps.mp4"
    },
    {
      id: 7,
      name: "6548176-hd_1920_1080_24fps.mp4",
      type: "video",
      url: "/images/6548176-hd_1920_1080_24fps.mp4",
      size: "67 MB",
      date: "2024-04-02",
      persistentUrl: "/images/6548176-hd_1920_1080_24fps.mp4"
    }
  ]
  
  /**
   * Initialize application data in localStorage if not exists
   * This ensures the app has some initial data to work with
   */
  if (!localStorage.getItem("posts")) {
    localStorage.setItem("posts", JSON.stringify(initialPosts))
  }
  
  if (!localStorage.getItem("accounts")) {
    localStorage.setItem("accounts", JSON.stringify(initialAccounts))
  }
  
  if (!localStorage.getItem("media")) {
    localStorage.setItem("media", JSON.stringify(initialMedia))
  }
  
  /**
   * Stats API
   * Retrieves and calculates various statistics about posts and accounts
   * @returns {Object} Statistics including total posts, drafts, scheduled posts, published posts, and connected accounts
   */
  export const fetchStats = () => {
    try {
      const posts = getLocalData("posts", initialPosts)
  
      const totalPosts = posts.length
      const drafts = posts.filter((post) => post.type === "draft").length
      const scheduled = posts.filter((post) => post.type === "scheduled").length
      const published = posts.filter((post) => post.type === "publish").length
      const accounts = getLocalData("accounts", initialAccounts).length
  
      return {
        totalPosts,
        drafts,
        scheduled,
        published,
        connectedAccounts: accounts,
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      return {
        totalPosts: 0,
        drafts: 0,
        scheduled: 0,
        published: 0,
        connectedAccounts: 0,
      }
    }
  }
  
  /**
   * Posts API
   * Various functions for managing social media posts
   */
  
  /**
   * Fetch posts of a specific type (draft/scheduled/published)
   * @param {string} type - Post type to filter by
   * @returns {Array} Filtered posts array
   */
  export const fetchPosts = (type) => {
    try {
      const posts = getLocalData("posts", initialPosts)
      return Array.isArray(posts) ? posts.filter((post) => post.type === type) : []
    } catch (error) {
      console.error(`Error fetching ${type} posts:`, error)
      return []
    }
  }
  
  /**
   * Fetch all posts regardless of type
   * @returns {Array} All posts array
   */
  export const fetchAllPosts = () => {
    try {
      return getLocalData("posts", initialPosts) || []
    } catch (error) {
      console.error("Error fetching all posts:", error)
      return []
    }
  }
  
  /**
   * Fetch a specific post by ID
   * @param {number|string} id - Post ID to fetch
   * @returns {Object|null} Post object or null if not found
   */
  export const fetchPostById = (id) => {
    try {
      const posts = getLocalData("posts", initialPosts)
      return posts.find((post) => post.id === Number.parseInt(id)) || null
    } catch (error) {
      console.error(`Error fetching post with id ${id}:`, error)
      return null
    }
  }
  
  /**
   * Create a new post
   * @param {Object} postData - Post data including content, platforms, type, etc.
   * @returns {Object|null} Created post object or null if creation failed
   */
  export const createPost = async (postData) => {
    try {
      const posts = getLocalData("posts", initialPosts)
      const newId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1
  
      // Handle media files if present
      let mediaUrls = []
      if (postData.media && postData.media.length > 0) {
        // Convert files to data URLs for persistence
        mediaUrls = await Promise.all(
          postData.media.map(async (file) => {
            if (typeof file === 'string' && file.startsWith('data:')) {
              return file // Already a data URL
            }
            return await fileToDataUrl(file)
          })
        )
      }
  
      const newPost = {
        id: newId,
        content: postData.content,
        platforms: postData.platforms || [],
        type: postData.type,
        createdAt: new Date().toISOString(),
        ...(postData.type === "scheduled" && { date: postData.scheduledDate }),
        ...(postData.type === "publish" && { publishedAt: new Date().toISOString() }),
        ...(mediaUrls.length > 0 && { mediaUrls }), // Store persistent URLs
      }
  
      const updatedPosts = [...posts, newPost]
      saveLocalData("posts", updatedPosts)
  
      return newPost
    } catch (error) {
      console.error("Error creating post:", error)
      return null
    }
  }
  
  /**
   * Update an existing post
   * @param {number|string} id - Post ID to update
   * @param {Object} postData - Updated post data
   * @returns {Object|null} Updated post object or null if update failed
   */
  export const updatePost = async (id, postData) => {
    try {
      const posts = getLocalData("posts", initialPosts)
      const postIndex = posts.findIndex((post) => post.id === Number.parseInt(id))
  
      if (postIndex === -1) {
        throw new Error("Post not found")
      }
  
      // Handle media files if present
      let mediaUrls = []
      if (postData.media && postData.media.length > 0) {
        // Convert files to data URLs for persistence
        mediaUrls = await Promise.all(
          postData.media.map(async (file) => {
            if (typeof file === 'string' && file.startsWith('data:')) {
              return file // Already a data URL
            }
            return await fileToDataUrl(file)
          })
        )
      }
  
      const updatedPost = {
        ...posts[postIndex],
        content: postData.content,
        platforms: postData.platforms || [],
        type: postData.type,
        ...(postData.type === "scheduled" && { date: postData.scheduledDate }),
        ...(postData.type === "publish" && { publishedAt: new Date().toISOString() }),
        ...(mediaUrls.length > 0 && { mediaUrls }), // Store persistent URLs
      }
  
      posts[postIndex] = updatedPost
      saveLocalData("posts", posts)
  
      return updatedPost
    } catch (error) {
      console.error(`Error updating post with id ${id}:`, error)
      return null
    }
  }
  
  /**
   * Delete a post
   * @param {number|string} id - Post ID to delete
   * @returns {Object} Success status object
   */
  export const deletePost = (id) => {
    try {
      const posts = getLocalData("posts", initialPosts)
      const updatedPosts = posts.filter((post) => post.id !== Number.parseInt(id))
      saveLocalData("posts", updatedPosts)
      return { success: true }
    } catch (error) {
      console.error(`Error deleting post with id ${id}:`, error)
      return { success: false }
    }
  }
  
  /**
   * Accounts API
   * Functions for managing social media accounts
   */
  
  /**
   * Fetch all connected social media accounts
   * @returns {Array} Array of social media accounts
   */
  export const fetchSocialAccounts = () => {
    try {
      return getLocalData("accounts", initialAccounts) || []
    } catch (error) {
      console.error("Error fetching social accounts:", error)
      return []
    }
  }
  
  /**
   * Connect a new social media account
   * @param {Object} accountData - Account data including name, platform, username
   * @returns {Object|null} Created account object or null if creation failed
   */
  export const connectSocialAccount = (accountData) => {
    try {
      const accounts = getLocalData("accounts", initialAccounts)
      const newId = accounts.length > 0 ? Math.max(...accounts.map((a) => a.id)) + 1 : 1
  
      const newAccount = {
        id: newId,
        name: accountData.name,
        platform: accountData.platform,
        username: accountData.username,
        connected: true,
      }
  
      const updatedAccounts = [...accounts, newAccount]
      saveLocalData("accounts", updatedAccounts)
  
      return newAccount
    } catch (error) {
      console.error("Error connecting social account:", error)
      return null
    }
  }
  
  /**
   * Disconnect a social media account
   * @param {number|string} id - Account ID to disconnect
   * @returns {Object} Success status object
   */
  export const disconnectSocialAccount = (id) => {
    try {
      const accounts = getLocalData("accounts", initialAccounts)
      const updatedAccounts = accounts.filter((account) => account.id !== Number.parseInt(id))
      saveLocalData("accounts", updatedAccounts)
      return { success: true }
    } catch (error) {
      console.error(`Error disconnecting account with id ${id}:`, error)
      return { success: false }
    }
  }
  
  /**
   * Media API
   * Functions for managing media files
   */
  
  /**
   * Fetch all media items
   * @returns {Array} Array of media items
   */
  export const fetchMedia = () => {
    try {
      return getLocalData("media", initialMedia) || []
    } catch (error) {
      console.error("Error fetching media:", error)
      return []
    }
  }
  
  /**
   * Convert a file to a base64 data URL that persists across sessions
   * This is used to store media files in localStorage
   * @param {File} file - The file to convert
   * @returns {Promise<string>} Promise that resolves to a data URL
   */
  const fileToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  /**
   * Upload media files and store them persistently
   * Creates both temporary URLs for immediate display and persistent data URLs for storage
   * @param {File[]} files - Array of files to upload
   * @returns {Promise<Array>} Promise that resolves to array of new media items
   */
  export const uploadMedia = async (files) => {
    try {
      const media = getLocalData("media", initialMedia);
      const newId = media.length > 0 ? Math.max(...media.map((m) => m.id)) + 1 : 1;
  
      // Process files sequentially to avoid overwhelming the browser
      const newMedia = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImage = file.type.startsWith("image/");
        const fileSize = (file.size / (1024 * 1024)).toFixed(1);
        
        // Create a temporary URL for immediate display
        const objectUrl = URL.createObjectURL(file);
        
        // Create a persistent data URL that will survive page refreshes
        const persistentUrl = await fileToDataUrl(file);
  
        newMedia.push({
          id: newId + i,
          name: file.name,
          type: isImage ? "image" : "video",
          url: objectUrl, // Temporary URL for current session
          persistentUrl: persistentUrl, // Persistent URL that survives refreshes
          size: `${fileSize} MB`,
          date: new Date().toISOString().split("T")[0],
        });
      }
  
      const updatedMedia = [...newMedia, ...media];
      saveLocalData("media", updatedMedia);
  
      return newMedia;
    } catch (error) {
      console.error("Error uploading media:", error);
      return [];
    }
  };
  
  /**
   * Delete a media item by ID
   * @param {number|string} id - ID of media to delete
   * @returns {Object} Success status object
   */
  export const deleteMedia = (id) => {
    try {
      const media = getLocalData("media", initialMedia);
      const updatedMedia = media.filter((item) => item.id !== Number.parseInt(id));
      saveLocalData("media", updatedMedia);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting media with id ${id}:`, error);
      return { success: false };
    }
  };
  
  