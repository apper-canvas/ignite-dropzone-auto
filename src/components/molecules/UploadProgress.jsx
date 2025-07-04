import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import ProgressBar from '@/components/atoms/ProgressBar'

const UploadProgress = ({ 
  totalFiles = 0,
  completedFiles = 0,
  failedFiles = 0,
  totalSize = 0,
  uploadedSize = 0,
  uploadSpeed = 0,
  className = '',
  ...props 
}) => {
  const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0
  const sizeProgress = totalSize > 0 ? (uploadedSize / totalSize) * 100 : 0
  
  const formatSpeed = (bytesPerSecond) => {
    if (bytesPerSecond === 0) return '0 B/s'
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s']
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(1024))
    return `${(bytesPerSecond / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }
  
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-elevation-1 p-6 ${className}`}
      {...props}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold font-display text-gray-900">
            Upload Progress
          </h3>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Upload" size={20} className="text-primary" />
            <span className="text-sm text-gray-500">
              {formatSpeed(uploadSpeed)}
            </span>
          </div>
        </div>
        
        {/* Overall Progress */}
        <div>
          <ProgressBar
            value={overallProgress}
            max={100}
            variant="primary"
            size="medium"
            showLabel={true}
            label="Files"
          />
        </div>
        
        {/* Size Progress */}
        <div>
          <ProgressBar
            value={sizeProgress}
            max={100}
            variant="success"
            size="medium"
            showLabel={true}
            label="Data"
          />
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">
              {totalFiles}
            </div>
            <div className="text-sm text-gray-500">Total Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {completedFiles}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-error">
              {failedFiles}
            </div>
            <div className="text-sm text-gray-500">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-info">
              {formatSize(totalSize)}
            </div>
            <div className="text-sm text-gray-500">Total Size</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default UploadProgress