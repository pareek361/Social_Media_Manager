"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Twitter, Facebook, Instagram, Linkedin } from "lucide-react"
import { fetchSocialAccounts, connectSocialAccount, disconnectSocialAccount } from "../lib/api"

function AccountsPage() {
  const [accounts, setAccounts] = useState([])
  const [newAccount, setNewAccount] = useState({ name: "", platform: "twitter", username: "", password: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const data = fetchSocialAccounts()
      setAccounts(data)
    } catch (error) {
      console.error("Error fetching accounts:", error)
      alert("Failed to load social accounts")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewAccount((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlatformChange = (platform) => {
    setNewAccount((prev) => ({ ...prev, platform }))
  }

  const handleAddAccount = () => {
    // Validate inputs
    if (!newAccount.name || !newAccount.username || !newAccount.password) {
      alert("Please fill in all fields")
      return
    }

    try {
      const newAccountData = connectSocialAccount(newAccount)
      setAccounts([...accounts, newAccountData])

      // Reset form and close dialog
      setNewAccount({ name: "", platform: "twitter", username: "", password: "" })
      setIsDialogOpen(false)

      alert("Social account connected successfully")
    } catch (error) {
      console.error("Error connecting account:", error)
      alert("Failed to connect social account")
    }
  }

  const handleDeleteAccount = (id) => {
    try {
      disconnectSocialAccount(id)
      setAccounts(accounts.filter((account) => account.id !== id))
      alert("The social account has been disconnected")
    } catch (error) {
      console.error("Error disconnecting account:", error)
      alert("Failed to disconnect account")
    }
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-5 w-5 text-blue-400" />
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-500" />
      case "linkedin":
        return <Linkedin className="h-5 w-5 text-blue-700" />
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Connected Social Accounts</h1>
        <button className="btn btn-primary" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center">Loading accounts...</div>
      ) : (
        <div className="grid gap-4">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <div key={account.id} className="card">
                <div className="card-header flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(account.platform)}
                    <h2 className="card-title">{account.name}</h2>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="card-content">
                  <p className="text-gray-500 dark:text-gray-400">{account.username}</p>
                </div>
                <div className="card-footer">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {account.connected ? (
                      <span className="flex items-center text-green-500 dark:text-green-400">
                        <span className="mr-2 h-2 w-2 rounded-full bg-green-500 dark:bg-green-400"></span>
                        Connected
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500 dark:text-red-400">
                        <span className="mr-2 h-2 w-2 rounded-full bg-red-500 dark:bg-red-400"></span>
                        Disconnected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 py-12 text-center">
              <h3 className="mb-1 text-lg font-medium">No accounts connected</h3>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Connect your social media accounts to start posting
              </p>
              <button className="btn btn-primary" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Account Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Connect a Social Media Account</h3>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g., Company Twitter"
                    value={newAccount.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Platform</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md ${
                        newAccount.platform === "twitter"
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handlePlatformChange("twitter")}
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </button>
                    <button
                      type="button"
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md ${
                        newAccount.platform === "facebook"
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handlePlatformChange("facebook")}
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </button>
                    <button
                      type="button"
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md ${
                        newAccount.platform === "instagram"
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handlePlatformChange("instagram")}
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </button>
                    <button
                      type="button"
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md ${
                        newAccount.platform === "linkedin"
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handlePlatformChange("linkedin")}
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Your username or email"
                    value={newAccount.username}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Your password"
                    value={newAccount.password}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
              <button className="btn btn-outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddAccount}>
                Connect Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountsPage

