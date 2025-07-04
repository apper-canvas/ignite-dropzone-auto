import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DropZone from '@/components/organisms/DropZone'
import FileQueue from '@/components/organisms/FileQueue'
import UploadProgress from '@/components/molecules/UploadProgress'
import UploadStats from '@/components/molecules/UploadStats'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { uploadService } from '@/services/api/uploadService'
import { generateFileId, createFileObject } from '@/utils/fileUtils'

const FileUploader = () => {
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStats, setUploadStats] = useState({
    totalUploads: 0,
    successfulUploads: 0,
    failedUploads: 0,
    totalSize: 0,
  })
  const [config, setConfig] = useState({
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.ogg'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.csv', '.json', '.xml'],
      'application/zip': ['.zip', '.rar', '.7z'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxConcurrent: 3,
    autoRetry: true,
  })
  
  // Load upload history on component mount
  useEffect(() => {
    loadUploadHistory()
  }, [])
  
  const loadUploadHistory = async () => {
    try {
      const history = await uploadService.getUploadHistory()
      const stats = {
        totalUploads: history.length,
        successfulUploads: history.filter(f => f.status === 'completed').length,
        failedUploads: history.filter(f => f.status === 'failed').length,
        totalSize: history.reduce((sum, f) => sum + f.size, 0),
      }
      setUploadStats(stats)
    } catch (error) {
      console.error('Error loading upload history:', error)
    }
  }
  
  const handleFilesSelected = (selectedFiles) => {
    const newFiles = selectedFiles.map(file => createFileObject(file))
    setFiles(prev => [...prev, ...newFiles])
  }
  
  const handleRemoveFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }
  
  const handlePauseFile = (fileId) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'paused' } : f
    ))
    toast.info('File upload paused')
  }
  
  const handleResumeFile = (fileId) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'uploading' } : f
    ))
    toast.info('File upload resumed')
  }
  
  const handleRetryFile = async (fileId) => {
    const file = files.find(f => f.id === fileId)
    if (file) {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'uploading', progress: 0, error: null } : f
      ))
      
      try {
        await uploadSingleFile(file)
      } catch (error) {
        console.error('Error retrying file upload:', error)
      }
    }
  }
  
const handleClearAll = () => {
    setFiles([])
    toast.info('Upload queue cleared')
  }
  
  const handleCancelAll = async () => {
    const activeFiles = files.filter(f => f.status === 'uploading' || f.status === 'pending')
    
    if (activeFiles.length === 0) {
      toast.warning('No active uploads to cancel')
      return
    }
    
    try {
      // Cancel all uploading files
      await Promise.all(
        activeFiles.map(file => uploadService.cancelUpload(file.id))
      )
      
      // Update file states to cancelled
      setFiles(prev => prev.map(f => 
        (f.status === 'uploading' || f.status === 'pending') 
          ? { ...f, status: 'cancelled', error: 'Upload cancelled by user' }
          : f
      ))
      
      toast.success(`${activeFiles.length} upload(s) cancelled`)
    } catch (error) {
      toast.error('Error cancelling uploads')
    }
  }
  
  const handleClearCompleted = async () => {
    const completedFiles = files.filter(f => f.status === 'completed')
    
    if (completedFiles.length === 0) {
      toast.warning('No completed uploads to clear')
      return
    }
    
    try {
      // Clear completed files from service
      await uploadService.clearCompleted()
      
      // Remove completed files from state
      setFiles(prev => prev.filter(f => f.status !== 'completed'))
      
      toast.success(`${completedFiles.length} completed upload(s) cleared`)
    } catch (error) {
      toast.error('Error clearing completed uploads')
    }
  }
  const uploadSingleFile = async (file) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
      ))
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id && f.status === 'uploading') {
            const newProgress = Math.min(f.progress + Math.random() * 10, 95)
            return { ...f, progress: newProgress }
          }
          return f
        }))
      }, 200)
      
      // Simulate API call
      await uploadService.uploadFile(file)
      
      clearInterval(progressInterval)
      
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { 
          ...f, 
          status: 'completed', 
          progress: 100,
          uploadedAt: new Date().toISOString(),
          url: `https://example.com/uploads/${file.name}`,
        } : f
      ))
      
      toast.success(`"${file.name}" uploaded successfully!`)
      
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { 
          ...f, 
          status: 'failed', 
          error: error.message || 'Upload failed',
        } : f
      ))
      
      toast.error(`Failed to upload "${file.name}": ${error.message}`)
    }
  }
  
  const handleStartUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    
    if (pendingFiles.length === 0) {
      toast.warning('No files to upload')
      return
    }
    
    setIsUploading(true)
    
    try {
      // Upload files with concurrency limit
      const uploadPromises = pendingFiles.slice(0, config.maxConcurrent).map(file => 
        uploadSingleFile(file)
      )
      
      await Promise.allSettled(uploadPromises)
      
      // Update stats
      loadUploadHistory()
      
    } catch (error) {
      console.error('Error during batch upload:', error)
      toast.error('Some files failed to upload')
    } finally {
      setIsUploading(false)
    }
  }
  
  const getCurrentProgress = () => {
    const uploadingFiles = files.filter(f => f.status === 'uploading')
    const completedFiles = files.filter(f => f.status === 'completed')
    const failedFiles = files.filter(f => f.status === 'failed')
    
    const totalSize = files.reduce((sum, f) => sum + f.size, 0)
    const uploadedSize = completedFiles.reduce((sum, f) => sum + f.size, 0)
    
    return {
      totalFiles: files.length,
      completedFiles: completedFiles.length,
      failedFiles: failedFiles.length,
      totalSize,
      uploadedSize,
      uploadSpeed: 0, // Would calculate from actual upload data
    }
  }
  
  const progress = getCurrentProgress()
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-display text-gradient">
          File Upload Center
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Drag and drop your files or click to browse. Upload multiple files with real-time progress tracking.
        </p>
      </div>
      
      {/* Upload Configuration */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold font-display text-gray-900">
              Upload Settings
            </h3>
            <p className="text-sm text-gray-500">
              Current limits and supported formats
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <ApperIcon name="HardDrive" size={16} />
              <span>Max: {config.maxFileSize / (1024 * 1024)}MB</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Files" size={16} />
              <span>Concurrent: {config.maxConcurrent}</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Drop Zone */}
      <DropZone
        onFilesSelected={handleFilesSelected}
        accept={config.allowedTypes}
        maxSize={config.maxFileSize}
        maxFiles={10}
        disabled={isUploading}
      />
      
      {/* Progress Overview */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UploadProgress {...progress} />
          <UploadStats {...uploadStats} />
        </div>
      )}
      
      {/* File Queue */}
<FileQueue
        files={files}
        onRemoveFile={handleRemoveFile}
        onPauseFile={handlePauseFile}
        onResumeFile={handleResumeFile}
        onRetryFile={handleRetryFile}
        onClearAll={handleClearAll}
        onCancelAll={handleCancelAll}
        onClearCompleted={handleClearCompleted}
        onStartUpload={handleStartUpload}
        isUploading={isUploading}
      />
    </motion.div>
  )
}

export default FileUploader