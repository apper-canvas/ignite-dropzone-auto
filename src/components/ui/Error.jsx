import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Error = ({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry = null,
  showRetry = true,
  icon = 'AlertCircle',
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center min-h-[24rem] p-8 text-center ${className}`}
      {...props}
    >
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={icon} size={32} className="text-error" />
      </motion.div>
      
      {/* Error Content */}
      <div className="space-y-4 max-w-md">
        <h3 className="text-xl font-semibold font-display text-gray-900">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {message}
        </p>
      </div>
      
      {/* Action Button */}
      {showRetry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Button
            variant="primary"
            size="medium"
            icon="RefreshCw"
            onClick={onRetry}
          >
            Try Again
          </Button>
        </motion.div>
      )}
      
      {/* Additional Help */}
      <div className="mt-8 text-sm text-gray-500">
        <p>If the problem persists, please check your connection or contact support.</p>
      </div>
    </motion.div>
  )
}

export default Error