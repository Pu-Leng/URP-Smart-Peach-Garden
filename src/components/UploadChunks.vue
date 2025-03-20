<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import { UploadFilled } from '@element-plus/icons-vue'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

const file = ref(null)
const fileHash = ref('')
const uploadedChunks = ref(new Set())
const uploading = ref(false)
const error = ref('')
const chunkProgress = ref({})

// 使用element-plus优化UI
const uploadStatus = computed(() => {
  if (error.value) return 'exception'
  return uploading.value ? 'primary' : 'success'
})

const uploadButtonText = computed(() => {
  if (uploading.value) return `上传中 (${combinedProgress.value}%)`
  return file.value ? '开始上传' : '请先选择文件'
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 组合进度计算
const combinedProgress = computed(() => {
  const total = Object.values(chunkProgress.value).reduce((sum, p) => sum + p, 0)
  return Math.round((total / (file.value?.size || 1)) * 100)
})

// 生成文件哈希
const calculateFileHash = async () => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const wordArray = CryptoJS.lib.WordArray.create(e.target.result)
      const hash = CryptoJS.MD5(wordArray).toString()
      resolve(hash)
    }
    reader.readAsArrayBuffer(file.value)
  })
}

// 检查已上传的分块
const checkUploadedChunks = async () => {
  try {
    const { data } = await axios.get('/api/check', {
      params: { fileHash: fileHash.value }
    })
    uploadedChunks.value = new Set(data.uploadedChunks)
  } catch (err) {
    console.error('检查分块失败:', err)
  }
}

// 上传分块（带重试机制）
const uploadChunk = async (chunk, index) => {
  let retries = 0
  const formData = new FormData()
  formData.append('file', chunk)
  formData.append('chunkNumber', index)
  formData.append('fileHash', fileHash.value)
  
  while (retries < MAX_RETRIES) {
    try {
      await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          chunkProgress.value[index] = progressEvent.loaded
        }
      })
      uploadedChunks.value.add(index)
      return
    } catch (err) {
      if (retries === MAX_RETRIES - 1) throw err
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      retries++
    }
  }
}

// 开始上传流程
const startUpload = async () => {
  if (!file.value) return
  
  try {
    uploading.value = true
    error.value = ''
    
    // 计算文件哈希
    fileHash.value = await calculateFileHash()
    
    // 检查已上传分块
    await checkUploadedChunks()
    
    // 创建所有分片的上传任务
    const chunks = Math.ceil(file.value.size / CHUNK_SIZE)
    const uploadPromises = []
    
    for (let i = 0; i < chunks; i++) {
      if (uploadedChunks.value.has(i)) continue
      
      const chunk = file.value.slice(
        i * CHUNK_SIZE,
        (i + 1) * CHUNK_SIZE
      )
      
      uploadPromises.push(uploadChunk(chunk, i))
    }

    // 并行上传（限制并发数）
    const CONCURRENT_LIMIT = 3
    for (let i = 0; i < uploadPromises.length; i += CONCURRENT_LIMIT) {
      await Promise.all(uploadPromises.slice(i, i + CONCURRENT_LIMIT))
    }

    // 合并请求
    await axios.post('/api/merge', {
      fileName: file.value.name,
      fileHash: fileHash.value
    })

    alert('上传成功！')
  } catch (err) {
    error.value = `上传失败: ${err.message}`
  } finally {
    uploading.value = false
  }
}

// 文件选择处理
const handleFileSelect = (e) => {
  const selectedFile = e.target.files[0]
  if (!selectedFile) return
  
  file.value = selectedFile
  chunkProgress.value = {}
  uploadedChunks.value = new Set()
}
</script>

<template>
  <div class="compact-upload" >
    <el-card class="compact-card" shadow="never">

      <el-upload
        drag
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleFileSelect"
        class="compact-uploader"
      >
        <template #trigger>
          <el-icon class="compact-upload-icon"><upload-filled /></el-icon>
          <div class="el-upload__text">拖放文件或<em>点击上传</em></div>
          <div class="el-upload__tip">最大支持 5GB 文件</div>
        </template>
      </el-upload>

      <div v-if="file" class="compact-file-info">
        <el-descriptions :column="2" size="small" >
          <el-descriptions-item label="文件" label-class-name="compact-label">
            <span class="filename">{{ file.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="大小" label-class-name="compact-label">
            {{ formatFileSize(file.size) }}
          </el-descriptions-item>
          <el-descriptions-item label="哈希" span="2" label-class-name="compact-label">
            <el-text truncated class="hash-text">{{ fileHash }}</el-text>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="compact-progress">
        <el-progress 
          :percentage="combinedProgress" 
          :stroke-width="12"
          :status="uploadStatus"
          :show-text="false"
          class="slim-progress"
        />
        <div class="progress-stats">
          <el-text size="small" type="info">
            分块 {{ uploadedChunks.size }}/{{ totalChunks }}
          </el-text>
          <el-button 
            size="small" 
            type="primary" 
            :loading="uploading"
            @click="startUpload"
            class="compact-button"
          >
            {{ uploadButtonText }}
          </el-button>
        </div>
      </div>

      <el-alert 
        v-if="error"
        :title="error"
        type="error" 
        show-icon 
        class="compact-alert"
        :closable="false"
      />
    </el-card>
  </div>
</template>


<style scoped>
.compact-upload {
  width: 100%;
  /* height: 300px; */
  max-width: 560px;
  /* margin: 1rem auto; */
}

.compact-card {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  
  :deep(.el-card__header) {
    padding: 12px 16px;
    background-color: #f8f9fc;
  }
  
  :deep(.el-card__body) {
    padding: 16px;
  }
}

.compact-uploader {

  :deep(.el-upload-dragger) {
    padding: 24px 12px; 
    border-radius: 4px;
    
    .compact-upload-icon {
      font-size: 24px;
      margin-bottom: 6px;
    }
    
    .el-upload__text {
      font-size: 13px;
      margin-bottom: 2px;
      
      em {
        font-size: 13px;
      }
    }
    
    .el-upload__tip {
      font-size: 12px;
      color: #909399;
    }
  }
}

.compact-file-info {
  margin: 12px 0;
  
  :deep(.compact-label) {
    width: 60px;
    font-size: 12px !important;
  }
  
  .filename {
    font-size: 13px;
  }
  
  .hash-text {
    font-family: monospace;
    font-size: 12px;
  }
}

.compact-progress {
  margin-top: 16px;
  
  .slim-progress {
    margin-bottom: 8px;
  }
  
  .progress-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .compact-button {
      padding: 6px 14px;
      border-radius: 4px;
    }
  }
}

.compact-alert {
  margin-top: 12px;
  padding: 6px 12px;
  font-size: 12px;
  
  :deep(.el-alert__content) {
    padding: 0;
  }
  
  :deep(.el-alert__title) {
    font-size: 12px;
    line-height: 1.4;
  }
}
</style>