import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const UploadStats = ({ 
  totalUploads = 0,
  successfulUploads = 0,
  failedUploads = 0,
  totalSize = 0,
  className = '',
  ...props 
}) => {
  const successRate = totalUploads > 0 ? (successfulUploads / totalUploads) * 100 : 0
  
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }
  
  const stats = [
    {
      label: 'Total Files',
      value: totalUploads,
      icon: 'Files',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      label: 'Successful',
      value: successfulUploads,
      icon: 'CheckCircle2',
      color: 'text-success',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Failed',
      value: failedUploads,
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Success Rate',
      value: `${Math.round(successRate)}%`,
      icon: 'TrendingUp',
      color: 'text-info',
      bgColor: 'bg-blue-50',
    },
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-elevation-1 p-6 ${className}`}
      {...props}
    >
      <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
        Upload Statistics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-lg p-4 text-center`}
          >
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${stat.color} mb-2`}>
              <ApperIcon name={stat.icon} size={20} />
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>
      
      <div className="bg-gradient-surface rounded-lg p-4 text-center">
        <div className="text-lg font-semibold text-gradient mb-1">
          {formatSize(totalSize)}
        </div>
        <div className="text-sm text-gray-500">Total Data Uploaded</div>
      </div>
    </motion.div>
  )
}

export default UploadStats