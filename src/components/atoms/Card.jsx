import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'medium',
  shadow = 'elevation-1',
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-xl transition-all duration-200'
  
  const paddings = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
    none: '',
  }
  
  const shadows = {
    none: '',
    'elevation-1': 'shadow-elevation-1',
    'elevation-2': 'shadow-elevation-2',
    'elevation-3': 'shadow-elevation-3',
  }
  
  const hoverStyles = hover ? 'hover-lift cursor-pointer' : ''
  
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)' } : {}}
      className={`${baseStyles} ${paddings[padding]} ${shadows[shadow]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card