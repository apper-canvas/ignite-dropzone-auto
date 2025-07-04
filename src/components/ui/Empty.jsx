import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = 'No data available',
  description = 'Get started by adding your first item.',
  icon = 'Inbox',
  actionText = 'Get Started',
  onAction = null,
  showAction = false,
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
      {/* Empty State Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-16 h-16 bg-gradient-surface rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={icon} size={32} className="text-gray-400" />
      </motion.div>
      
      {/* Empty State Content */}
      <div className="space-y-4 max-w-md">
        <h3 className="text-xl font-semibold font-display text-gray-900">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Action Button */}
      {showAction && onAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Button
            variant="primary"
            size="medium"
            icon="Plus"
            onClick={onAction}
          >
            {actionText}
          </Button>
        </motion.div>
      )}
      
      {/* Decorative Elements */}
      <div className="mt-8 flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </motion.div>
  )
}

export default Empty