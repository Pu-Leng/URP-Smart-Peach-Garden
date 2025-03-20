<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  interval: {
    type: Number,
    default: 3000
  }
})

const currentIndex = ref(0)
let autoPlayTimer = null

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`
}))

const startAutoPlay = () => {
  autoPlayTimer = setInterval(() => {
    nextSlide()
  }, props.interval)
}

const pauseAutoPlay = () => {
  clearInterval(autoPlayTimer)
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.items.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  pauseAutoPlay()
})
</script>

<template>
  <div class="carousel-container" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
    <div class="carousel-track" :style="trackStyle">
      <div 
        v-for="(item, index) in items"
        :key="index"
        class="carousel-item"
        :class="{ 'active': currentIndex === index }"
      >
        <img :src="item.image" :alt="item.alt" class="carousel-image" />
      </div>
    </div>

    <!-- 导航按钮 -->
    <button class="carousel-btn prev" @click="prevSlide">&lt;</button>
    <button class="carousel-btn next" @click="nextSlide">&gt;</button>

    <!-- 指示器 -->
    <div class="indicators">
      <span 
        v-for="(item, index) in items"
        :key="index"
        class="indicator"
        :class="{ 'active': currentIndex === index }"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}

.carousel-item {
  flex: 0 0 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.carousel-item.active {
  opacity: 1;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s ease;
}

.indicator.active {
  background: rgba(255, 255, 255, 0.9);
}
</style>