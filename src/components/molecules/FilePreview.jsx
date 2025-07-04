import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { formatFileSize } from '@/utils/fileUtils'

const FilePreview = ({ 
  file, 
  onRemove, 
  onPause, 
  onResume, 
  onRetry, 
  showActions = true,
  className = '',
  ...props 
}) => {
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'Image'
    if (type.startsWith('video/')) return 'Video'
    if (type.startsWith('audio/')) return 'Music'
    if (type.includes('pdf')) return 'FileText'
    if (type.includes('word')) return 'FileText'
    if (type.includes('excel') || type.includes('spreadsheet')) return 'FileSpreadsheet'
    if (type.includes('zip') || type.includes('rar')) return 'Archive'
    return 'File'
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock'
      case 'uploading': return 'Loader2'
      case 'completed': return 'CheckCircle2'
      case 'failed': return 'XCircle'
      default: return 'File'
    }
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'default'
      case 'uploading': return 'primary'
      case 'completed': return 'success'
      case 'failed': return 'error'
      default: return 'default'
    }
  }
  
  const isImage = file.type.startsWith('image/')
  const canPause = file.status === 'uploading'
  const canResume = file.status === 'paused'
  const canRetry = file.status === 'failed'
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg shadow-elevation-1 p-4 hover-lift ${className}`}
      {...props}
    >
      <div className="flex items-start space-x-3">
        {/* File Icon/Preview */}
        <div className="flex-shrink-0">
          {isImage && file.preview ? (
            <img 
              src={file.preview} 
              alt={file.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-surface rounded-lg flex items-center justify-center">
              <ApperIcon 
                name={getFileIcon(file.type)} 
                size={24} 
                className="text-gray-500" 
              />
            </div>
          )}
        </div>
        
        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </h4>
            <Badge 
              variant={getStatusColor(file.status)}
              size="small"
              icon={getStatusIcon(file.status)}
            >
              {file.status}
            </Badge>
          </div>
          
          <p className="text-xs text-gray-500 mb-2">
            {formatFileSize(file.size)}
          </p>
          
          {/* Progress Bar */}
          {file.status === 'uploading' && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Uploading...</span>
                <span className="text-xs text-gray-500">
                  {file.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${file.progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-2 bg-gradient-primary rounded-full progress-bar"
                />
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {file.status === 'failed' && file.error && (
            <p className="text-xs text-error mb-2">{file.error}</p>
          )}
          
          {/* Actions */}
          {showActions && (
            <div className="flex items-center space-x-2">
              {canPause && (
                <Button
                  variant="ghost"
                  size="small"
                  icon="Pause"
                  onClick={() => onPause(file.id)}
                />
              )}
              {canResume && (
                <Button
                  variant="ghost"
                  size="small"
                  icon="Play"
                  onClick={() => onResume(file.id)}
                />
              )}
              {canRetry && (
                <Button
                  variant="ghost"
                  size="small"
                  icon="RefreshCw"
                  onClick={() => onRetry(file.id)}
                />
              )}
              <Button
                variant="ghost"
                size="small"
                icon="X"
                onClick={() => onRemove(file.id)}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default FilePreview