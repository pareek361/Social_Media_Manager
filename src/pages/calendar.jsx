"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { Edit, Trash2 } from "lucide-react"
import { fetchPosts, deletePost } from "../lib/api"

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [scheduledPosts, setScheduledPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [datesWithPosts, setDatesWithPosts] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    try {
      const posts = fetchPosts("scheduled")
      if (Array.isArray(posts)) {
        setScheduledPosts(posts)

        // Extract dates that have posts
        const dates = posts.map((post) => {
          const postDate = new Date(post.date)
          return `${postDate.getFullYear()}-${postDate.getMonth()}-${postDate.getDate()}`
        })
        setDatesWithPosts([...new Set(dates)])
      } else {
        console.error("Expected posts to be an array but got:", posts)
        setScheduledPosts([])
        setDatesWithPosts([])
      }
    } catch (error) {
      console.error("Error fetching scheduled posts:", error)
      alert("Failed to load scheduled posts")
      setScheduledPosts([])
      setDatesWithPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Get posts for the selected date
  const postsForSelectedDate = scheduledPosts.filter((post) => {
    if (!post.date) return false

    const postDate = new Date(post.date)
    return (
      selectedDate &&
      postDate.getDate() === selectedDate.getDate() &&
      postDate.getMonth() === selectedDate.getMonth() &&
      postDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  const handleDeletePost = (id) => {
    try {
      deletePost(id)
      setScheduledPosts(scheduledPosts.filter((post) => post.id !== id))
      alert("The scheduled post has been deleted successfully")
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post")
    }
  }

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Array to hold all days
    const days = []

    // Add previous month days to fill first week
    const firstDayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.
    for (let i = firstDayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i)
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        hasPost: isDayWithPost(prevDate),
      })
    }

    // Add current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
        hasPost: isDayWithPost(date),
      })
    }

    // Add next month days to fill last week
    const lastDayOfWeek = lastDay.getDay()
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        hasPost: isDayWithPost(nextDate),
      })
    }

    return days
  }

  // Check if a day has posts
  const isDayWithPost = (day) => {
    const dayString = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`
    return datesWithPosts.includes(dayString)
  }

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Content Calendar</h1>

      <div className="grid gap-6 md:grid-cols-[350px_1fr]">
        <div>
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="card-title">Calendar</h2>
              <div className="flex space-x-1">
                <button onClick={prevMonth} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button onClick={nextMonth} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="text-center mb-4">
                <h3 className="font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    className={`
                      h-10 w-10 rounded-full flex items-center justify-center text-sm
                      ${!day.isCurrentMonth ? "text-gray-400 dark:text-gray-600" : ""}
                      ${day.hasPost ? "font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : ""}
                      ${
                        selectedDate &&
                        day.date.getDate() === selectedDate.getDate() &&
                        day.date.getMonth() === selectedDate.getMonth() &&
                        day.date.getFullYear() === selectedDate.getFullYear()
                          ? "bg-blue-500 text-white dark:bg-blue-600"
                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      }
                    `}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                {selectedDate
                  ? `Scheduled Posts for ${format(selectedDate, "MMMM d, yyyy")}`
                  : "Select a date to view scheduled posts"}
              </h2>
            </div>
            <div className="card-content ">
              {loading ? (
                <div className="py-8 text-center">Loading scheduled posts...</div>
              ) : postsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {postsForSelectedDate.map((post) => (
                    <div key={post.id} className="card">
                      <div className="card-content">
                        <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          {post.date && format(new Date(post.date), "h:mm a")} •{" "}
                          {post.platforms && post.platforms.join(", ")}
                        </div>
                        <p className="mb-2">{post.content}</p>
                        <div className="flex justify-end space-x-2">
                          <Link to={`/edit/${post.id}`}>
                            <button className="btn btn-outline btn-sm">
                              <Edit className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </button>
                          </Link>
                          <button className="btn btn-destructive btn-sm" onClick={() => handleDeletePost(post.id)}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="mb-4 text-gray-500 dark:text-gray-400">No posts scheduled for this date</p>
                  <Link to="/create">
                    <button className="btn btn-primary">Create New Post</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage

