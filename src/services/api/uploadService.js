import mockData from '@/services/mockData/uploadHistory.json'

class UploadService {
  constructor() {
    this.uploadHistory = [...mockData]
  }
  
  // Simulate API delay
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // Upload a single file
  async uploadFile(file) {
    await this.delay(Math.random() * 1000 + 500) // 500-1500ms delay
    
    // Simulate upload failure for demo purposes (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Network error occurred during upload')
    }
    
    const uploadedFile = {
      Id: this.getNextId(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'completed',
      progress: 100,
      uploadedAt: new Date().toISOString(),
      url: `https://example.com/uploads/${file.name}`,
      error: null
    }
    
    this.uploadHistory.push(uploadedFile)
    return uploadedFile
  }
  
  // Get upload history
  async getUploadHistory() {
    await this.delay()
    return [...this.uploadHistory]
  }
  
  // Get upload by ID
  async getUploadById(id) {
    await this.delay()
    const upload = this.uploadHistory.find(item => item.Id === parseInt(id))
    if (!upload) {
      throw new Error('Upload not found')
    }
    return { ...upload }
  }
  
  // Delete upload record
  async deleteUpload(id) {
    await this.delay()
    const index = this.uploadHistory.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Upload not found')
    }
    
    const deleted = this.uploadHistory.splice(index, 1)[0]
    return { ...deleted }
  }
  
  // Clear all upload history
  async clearHistory() {
    await this.delay()
    this.uploadHistory = []
    return { message: 'Upload history cleared' }
}
  
  // Cancel a file upload
  async cancelUpload(fileId) {
    await this.delay(200)
    
    // Find the upload in history
    const upload = this.uploadHistory.find(item => item.Id === parseInt(fileId))
    if (upload) {
      upload.status = 'cancelled'
      upload.error = 'Upload cancelled by user'
      upload.progress = 0
    }
    
    return { message: 'Upload cancelled successfully' }
  }
  
  // Clear completed uploads
  async clearCompleted() {
    await this.delay(200)
    
    this.uploadHistory = this.uploadHistory.filter(item => item.status !== 'completed')
    return { message: 'Completed uploads cleared successfully' }
  }
  
  // Get upload statistics
  async getUploadStats() {
    await this.delay()
    const stats = {
      total: this.uploadHistory.length,
      completed: this.uploadHistory.filter(item => item.status === 'completed').length,
      failed: this.uploadHistory.filter(item => item.status === 'failed').length,
      totalSize: this.uploadHistory.reduce((sum, item) => sum + item.size, 0),
    }
    return stats
  }
  
  // Helper method to get next ID
  getNextId() {
    if (this.uploadHistory.length === 0) return 1
    return Math.max(...this.uploadHistory.map(item => item.Id)) + 1
  }
}

export const uploadService = new UploadService()