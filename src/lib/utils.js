// Simple utility functions

export function cn(...classes) {
    return classes.filter(Boolean).join(" ")
  }
  
  export function formatDate(date) {
    return new Date(date).toLocaleDateString()
  }
  
  export function formatTime(date) {
    return new Date(date).toLocaleTimeString()
  }
  
  export function formatDateTime(date) {
    return new Date(date).toLocaleString()
  }
  
  