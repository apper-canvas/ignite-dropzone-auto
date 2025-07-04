import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <ApperIcon name="Upload" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-gradient">
                DropZone
              </h1>
              <p className="text-sm text-gray-500">
                File Upload Utility
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <ApperIcon name="Shield" size={16} />
              <span>Secure Upload</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <ApperIcon name="Zap" size={16} />
              <span>Fast Transfer</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header