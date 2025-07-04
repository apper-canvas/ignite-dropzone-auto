import { motion } from 'framer-motion'

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  variant = 'primary',
  size = 'medium',
  showLabel = true,
  label = null,
  className = '',
  ...props 
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const variants = {
    primary: 'bg-gradient-primary',
    success: 'bg-gradient-success',
    warning: 'bg-gradient-to-r from-warning to-yellow-600',
    error: 'bg-gradient-to-r from-error to-red-600',
  }
  
  const sizes = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4',
  }
  
  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || 'Progress'}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`${sizes[size]} ${variants[variant]} progress-bar rounded-full`}
        />
      </div>
    </div>
  )
}

export default ProgressBar