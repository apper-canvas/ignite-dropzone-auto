import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { uploadService } from '@/services/api/uploadService'
import { createFileObject, validateFile } from '@/utils/fileUtils'

export const useFileUpload = (options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    maxFiles = 10,
    allowedTypes = {},
    onUploadStart = () => {},
    onUploadProgress = () => {},
    onUploadComplete = () => {},
    onUploadError = () => {},
  } = options
  
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const addFiles = useCallback((newFiles) => {
    const validFiles = []
    
    newFiles.forEach(file => {
      const validation = validateFile(file, maxSize)
      if (validation.isValid) {
        validFiles.push(createFileObject(file))
      } else {
        toast.error(`${file.name}: ${validation.error}`)
      }
    })
    
    if (validFiles.length > 0) {
      setFiles(prev => {
        const combined = [...prev, ...validFiles]
        if (combined.length > maxFiles) {
          toast.warning(`Maximum ${maxFiles} files allowed`)
          return combined.slice(0, maxFiles)
        }
        return combined
      })
      
      toast.success(`${validFiles.length} file(s) added`)
    }
  }, [maxSize, maxFiles])
  
  const removeFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }, [])
  
  const clearFiles = useCallback(() => {
    setFiles([])
  }, [])
  
  const updateFileStatus = useCallback((fileId, status, progress = 0, error = null) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status, progress, error } : f
    ))
  }, [])
  
  const uploadFile = useCallback(async (file) => {
    try {
      updateFileStatus(file.id, 'uploading', 0)
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id && f.status === 'uploading') {
            const newProgress = Math.min(f.progress + Math.random() * 10, 95)
            return { ...f, progress: newProgress }
          }
          return f
        }))
      }, 200)
      
      const result = await uploadService.uploadFile(file)
      
      clearInterval(progressInterval)
      updateFileStatus(file.id, 'completed', 100)
      
      onUploadComplete(file, result)
      
      return result
    } catch (error) {
      updateFileStatus(file.id, 'failed', 0, error.message)
      onUploadError(file, error)
      throw error
    }
  }, [updateFileStatus, onUploadComplete, onUploadError])
  
  const uploadAllFiles = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    
    if (pendingFiles.length === 0) {
      toast.warning('No files to upload')
      return
    }
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      onUploadStart(pendingFiles)
      
      const results = []
      for (let i = 0; i < pendingFiles.length; i++) {
        const file = pendingFiles[i]
        
        try {
          const result = await uploadFile(file)
          results.push(result)
          
          // Update overall progress
          setUploadProgress(((i + 1) / pendingFiles.length) * 100)
          onUploadProgress(((i + 1) / pendingFiles.length) * 100)
          
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error)
        }
      }
      
      toast.success(`${results.length} file(s) uploaded successfully`)
      
    } catch (error) {
      console.error('Upload batch failed:', error)
      toast.error('Upload batch failed')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [files, uploadFile, onUploadStart, onUploadProgress])
  
  const retryFile = useCallback(async (fileId) => {
    const file = files.find(f => f.id === fileId)
    if (file) {
      try {
        await uploadFile(file)
      } catch (error) {
        console.error('Retry failed:', error)
      }
    }
  }, [files, uploadFile])
  
  const getStats = useCallback(() => {
    const pending = files.filter(f => f.status === 'pending').length
    const uploading = files.filter(f => f.status === 'uploading').length
    const completed = files.filter(f => f.status === 'completed').length
    const failed = files.filter(f => f.status === 'failed').length
    
    return {
      total: files.length,
      pending,
      uploading,
      completed,
      failed,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      completedSize: files.filter(f => f.status === 'completed').reduce((sum, f) => sum + f.size, 0),
    }
  }, [files])
  
  return {
    files,
    isUploading,
    uploadProgress,
    addFiles,
    removeFile,
    clearFiles,
    uploadFile,
    uploadAllFiles,
    retryFile,
    getStats,
  }
}