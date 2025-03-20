<template>
  <div class="container">
    <!-- 已选择对象显示框 -->
    <div class="selected-box">
      {{ selectedGarden || "平谷地区" }}
    </div>

    <!-- 搜索容器 -->
    <div class="search-container">
      <input
        v-model="searchQuery"
        class="search-input"
        placeholder="搜索桃园名称"
        @input="handleSearch"
      />
      <!-- 搜索结果下拉列表 -->
      <ul v-if="isDropdownOpen" class="dropdown-list">
        <li
          v-for="result in searchResults"
          :key="result.gid"
          class="dropdown-item"
          @click="selectGarden(result)"
        >
          {{ result.garden_name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getSearchResult } from '@/api/raster.js'


// 已选择的对象
const selectedGarden = ref('平谷地区');
// 搜索关键词
const searchQuery = ref('');
// 搜索结果列表
const searchResults = ref([]);
// 控制下拉框显示
const isDropdownOpen = ref(false);
// 防抖定时器
let debounceTimer = null;

// 搜索处理函数
const handleSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    if (!searchQuery.value.trim()) {
      searchResults.value = [];
      isDropdownOpen.value = false;
      return;
    }
    
    try {
      const response = await getSearchResult(searchQuery.value);
      console.log(response);
      
      searchResults.value = response.data.results;
      isDropdownOpen.value = response.data.results.length > 0;
    } catch (error) {
      console.error('搜索失败:', error);
      isDropdownOpen.value = false;
    }
  }, 300); // 300毫秒防抖
};

// 选择桃园
const selectGarden = (garden) => {
  selectedGarden.value = garden.garden_name;
  searchQuery.value = '';
  isDropdownOpen.value = false;
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 400px;
  margin: 20px;
}

.selected-box {
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  min-height: 18px;
  background-color: #f5f7fa;
}

.search-container {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #409eff;
}

.dropdown-list {
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
  padding: 0;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  z-index: 1000;
}

.dropdown-item {
  padding: 12px;
  list-style: none;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
}
</style>