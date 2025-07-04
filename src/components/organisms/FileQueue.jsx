import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import FilePreview from '@/components/molecules/FilePreview'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import Empty from '@/components/ui/Empty'

const FileQueue = ({ 
  files = [], 
  onRemoveFile, 
  onPauseFile, 
  onResumeFile, 
  onRetryFile,
  onClearAll,
  onStartUpload,
  isUploading = false,
  className = '',
  ...props 
}) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  
  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(files.map(file => file.id))
    }
  }
  
  const handleSelectFile = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }
  
  const handleBulkAction = (action) => {
    if (selectedFiles.length === 0) {
      toast.warning('Please select files first.')
      return
    }
    
    selectedFiles.forEach(fileId => {
      const file = files.find(f => f.id === fileId)
      if (file) {
        switch (action) {
          case 'remove':
            onRemoveFile(fileId)
            break
          case 'pause':
            if (file.status === 'uploading') {
              onPauseFile(fileId)
            }
            break
          case 'resume':
            if (file.status === 'paused') {
              onResumeFile(fileId)
            }
            break
          case 'retry':
            if (file.status === 'failed') {
              onRetryFile(fileId)
            }
            break
        }
      }
    })
    
    setSelectedFiles([])
  }
  
  const pendingFiles = files.filter(f => f.status === 'pending')
  const uploadingFiles = files.filter(f => f.status === 'uploading')
  const completedFiles = files.filter(f => f.status === 'completed')
  const failedFiles = files.filter(f => f.status === 'failed')
  
  if (files.length === 0) {
    return (
      <Empty
        icon="Files"
        title="No files in queue"
        description="Start by dragging and dropping files into the upload area above."
        className={className}
      />
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${className}`}
      {...props}
    >
      {/* Queue Header */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold font-display text-gray-900">
              Upload Queue
            </h3>
            <p className="text-sm text-gray-500">
              {files.length} file(s) • {completedFiles.length} completed • {failedFiles.length} failed
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="small"
              icon="Square"
              onClick={handleSelectAll}
            >
              {selectedFiles.length === files.length ? 'Deselect All' : 'Select All'}
            </Button>
            {pendingFiles.length > 0 && (
              <Button
                variant="success"
                size="small"
                icon="Play"
                onClick={onStartUpload}
                disabled={isUploading}
                loading={isUploading}
              >
                Start Upload
              </Button>
            )}
          </div>
        </div>
        
        {/* Bulk Actions */}
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center space-x-2 pt-4 border-t"
          >
            <span className="text-sm text-gray-500">
              {selectedFiles.length} selected:
            </span>
            <Button
              variant="ghost"
              size="small"
              icon="Trash2"
              onClick={() => handleBulkAction('remove')}
            >
              Remove
            </Button>
            <Button
              variant="ghost"
              size="small"
              icon="Pause"
              onClick={() => handleBulkAction('pause')}
            >
              Pause
            </Button>
            <Button
              variant="ghost"
              size="small"
              icon="Play"
              onClick={() => handleBulkAction('resume')}
            >
              Resume
            </Button>
            <Button
              variant="ghost"
              size="small"
              icon="RefreshCw"
              onClick={() => handleBulkAction('retry')}
            >
              Retry
            </Button>
          </motion.div>
        )}
      </Card>
      
      {/* File Lists */}
      <div className="space-y-6">
        {/* Uploading Files */}
        {uploadingFiles.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
              Uploading ({uploadingFiles.length})
            </h4>
            <div className="grid gap-4">
              <AnimatePresence>
                {uploadingFiles.map(file => (
                  <FilePreview
                    key={file.id}
                    file={file}
                    onRemove={onRemoveFile}
                    onPause={onPauseFile}
                    onResume={onResumeFile}
                    onRetry={onRetryFile}
                    showActions={true}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
        
        {/* Pending Files */}
        {pendingFiles.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <ApperIcon name="Clock" size={16} className="mr-2" />
              Pending ({pendingFiles.length})
            </h4>
            <div className="grid gap-4">
              <AnimatePresence>
                {pendingFiles.map(file => (
                  <FilePreview
                    key={file.id}
                    file={file}
                    onRemove={onRemoveFile}
                    onPause={onPauseFile}
                    onResume={onResumeFile}
                    onRetry={onRetryFile}
                    showActions={true}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
        
        {/* Completed Files */}
        {completedFiles.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <ApperIcon name="CheckCircle2" size={16} className="text-success mr-2" />
              Completed ({completedFiles.length})
            </h4>
            <div className="grid gap-4">
              <AnimatePresence>
                {completedFiles.map(file => (
                  <FilePreview
                    key={file.id}
                    file={file}
                    onRemove={onRemoveFile}
                    onPause={onPauseFile}
                    onResume={onResumeFile}
                    onRetry={onRetryFile}
                    showActions={true}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
        
        {/* Failed Files */}
        {failedFiles.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <ApperIcon name="XCircle" size={16} className="text-error mr-2" />
              Failed ({failedFiles.length})
            </h4>
            <div className="grid gap-4">
              <AnimatePresence>
                {failedFiles.map(file => (
                  <FilePreview
                    key={file.id}
                    file={file}
                    onRemove={onRemoveFile}
                    onPause={onPauseFile}
                    onResume={onResumeFile}
                    onRetry={onRetryFile}
                    showActions={true}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
      
      {/* Queue Actions */}
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Manage your upload queue
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="small"
            icon="Trash2"
            onClick={onClearAll}
          >
            Clear All
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default FileQueue