// Generate unique file ID
export const generateFileId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Format file size to human readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Validate file
export const validateFile = (file, maxSize = 10 * 1024 * 1024) => {
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${formatFileSize(maxSize)} limit`
    }
  }
  
  // Check file type (basic validation)
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'application/zip',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'video/mp4', 'audio/mpeg'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not supported'
    }
  }
  
  return { isValid: true }
}

// Create file object for upload
export const createFileObject = (file) => {
  return {
    id: generateFileId(),
    name: file.name,
    size: file.size,
    type: file.type,
    status: 'pending',
    progress: 0,
    uploadedAt: null,
    url: null,
    error: null,
    file: file, // Keep reference to original file
    preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
  }
}

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// Get file icon based on type
export const getFileIcon = (type) => {
  if (type.startsWith('image/')) return 'Image'
  if (type.startsWith('video/')) return 'Video'
  if (type.startsWith('audio/')) return 'Music'
  if (type.includes('pdf')) return 'FileText'
  if (type.includes('word')) return 'FileText'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'FileSpreadsheet'
  if (type.includes('zip') || type.includes('rar')) return 'Archive'
  return 'File'
}

// Check if file is image
export const isImageFile = (file) => {
  return file.type.startsWith('image/')
}

// Check if file is video
export const isVideoFile = (file) => {
  return file.type.startsWith('video/')
}

// Check if file is audio
export const isAudioFile = (file) => {
  return file.type.startsWith('audio/')
}

// Calculate upload progress
export const calculateProgress = (loaded, total) => {
  return Math.round((loaded / total) * 100)
}

// Format upload speed
export const formatUploadSpeed = (bytesPerSecond) => {
  if (bytesPerSecond === 0) return '0 B/s'
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s']
  const i = Math.floor(Math.log(bytesPerSecond) / Math.log(1024))
  return `${(bytesPerSecond / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

// Calculate estimated time remaining
export const calculateTimeRemaining = (loaded, total, speed) => {
  if (speed === 0) return 'Unknown'
  const remaining = (total - loaded) / speed
  
  if (remaining < 60) return `${Math.round(remaining)}s`
  if (remaining < 3600) return `${Math.round(remaining / 60)}m`
  return `${Math.round(remaining / 3600)}h`
}

// Create download link
export const createDownloadLink = (file, filename = null) => {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || file.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Check if browser supports drag and drop
export const supportsDragAndDrop = () => {
  const div = document.createElement('div')
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 
         'FormData' in window && 'FileReader' in window
}