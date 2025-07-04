import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Loading = ({ 
  size = 'medium', 
  text = 'Loading...', 
  showIcon = true,
  className = '',
  ...props 
}) => {
  const sizes = {
    small: 'h-32',
    medium: 'h-48',
    large: 'h-64',
  }
  
  const iconSizes = {
    small: 24,
    medium: 32,
    large: 40,
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center ${sizes[size]} ${className}`}
      {...props}
    >
      {showIcon && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="mb-4"
        >
          <ApperIcon 
            name="Loader2" 
            size={iconSizes[size]} 
            className="text-primary" 
          />
        </motion.div>
      )}
      
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-700">{text}</p>
        <div className="flex items-center justify-center space-x-1">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-primary rounded-full"
          />
        </div>
      </div>
      
      {/* Skeleton Content */}
      <div className="w-full max-w-md mt-8 space-y-4">
        <div className="animate-shimmer h-4 bg-gray-200 rounded"></div>
        <div className="animate-shimmer h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="animate-shimmer h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </motion.div>
  )
}

export default Loading