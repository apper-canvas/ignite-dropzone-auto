import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { validateFile } from '@/utils/fileUtils'

const DropZone = ({ 
  onFilesSelected, 
  accept = {},
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  disabled = false,
  className = '',
  ...props 
}) => {
  const [isDragActive, setIsDragActive] = useState(false)
  
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setIsDragActive(false)
    
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach(error => {
        if (error.code === 'file-too-large') {
          toast.error(`File "${file.name}" is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`)
        } else if (error.code === 'file-invalid-type') {
          toast.error(`File "${file.name}" has an invalid type.`)
        } else if (error.code === 'too-many-files') {
          toast.error(`Too many files. Maximum is ${maxFiles} files.`)
        } else {
          toast.error(`Error with file "${file.name}": ${error.message}`)
        }
      })
    })
    
    // Process accepted files
    if (acceptedFiles.length > 0) {
      const validFiles = []
      
      acceptedFiles.forEach(file => {
        const validation = validateFile(file, maxSize)
        if (validation.isValid) {
          validFiles.push(file)
        } else {
          toast.error(validation.error)
        }
      })
      
      if (validFiles.length > 0) {
        onFilesSelected(validFiles)
        toast.success(`${validFiles.length} file(s) added successfully!`)
      }
    }
  }, [onFilesSelected, maxSize, maxFiles])
  
  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    disabled,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })
  
  const getDragStyles = () => {
    if (isDragReject) return 'border-error bg-red-50'
    if (isDragActive) return 'border-primary bg-purple-50 scale-105'
    return 'border-gray-300 hover:border-primary hover:bg-gray-50'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${className}`}
      {...props}
    >
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${getDragStyles()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence>
          {isDragActive ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-4"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="Upload" size={32} className="text-white animate-bounce" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold font-display text-primary">
                  Drop files here!
                </h3>
                <p className="text-gray-600 mt-2">
                  Release to upload your files
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-4"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-surface rounded-full flex items-center justify-center">
                  <ApperIcon name="CloudUpload" size={32} className="text-gray-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold font-display text-gray-900">
                  Drag & drop files here
                </h3>
                <p className="text-gray-600 mt-2">
                  or click to browse your files
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Maximum file size: {maxSize / (1024 * 1024)}MB • Maximum files: {maxFiles}
                </p>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="medium"
                  icon="FolderOpen"
                  disabled={disabled}
                >
                  Browse Files
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Drag overlay */}
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary bg-opacity-5 rounded-xl flex items-center justify-center"
          >
            <div className="text-center">
              <ApperIcon name="Upload" size={48} className="text-primary mx-auto mb-4 animate-pulse" />
              <p className="text-lg font-semibold text-primary">
                Drop files to upload
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default DropZone