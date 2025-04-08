<template>
    <el-drawer v-model="visible" size="100%" :with-header="false">
        <div class="fullscreen-svg-container">
            <svg ref="svgElement" :width="svgSize.width" :height="svgSize.height" @mousedown="handleSvgMouseDown"
                @mousemove="handleSvgMouseMove" @mouseup="handleSvgMouseUp" @wheel="handleWheel" :style="{
        transform: `scale(${svgSize.scale}) translate(${svgPan.translateX}px, ${svgPan.translateY}px)`,
        cursor: svgPan.isDragging ? 'grabbing' : 'grab'
    }">
                <image :href="imageUrl" width="1000px" height="1000px" object-fit="contain" />
                <text v-for="(text, index) in textElements" :key="index" :x="text.x" :y="text.y" :fill="text.color"
                    font-size="14" font-weight="700" style="user-select: none;">
                    {{ text.content }}
                </text>
            </svg>

            <div class="fullscreen-controls">
                <el-button @click="zoomIn">放大</el-button>
                <el-button @click="zoomOut">缩小</el-button>
                <el-button @click="resetZoom">重置</el-button>
                <el-button @click="close">关闭</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const props = defineProps({
    modelValue: Boolean,
    imageUrl: String,
    textElements: Array
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const svgElement = ref(null)
const svgSize = reactive({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 1
})

const svgPan = reactive({
    isDragging: false,
    startX: 0,
    startY: 0,
    translateX: 0,
    translateY: 0
})

onMounted(async () => {
   
})
// 这里复用原来的方法，但简化了一些功能
const handleSvgMouseDown = (event) => {
    svgPan.isDragging = true
    svgPan.startX = event.clientX - svgPan.translateX
    svgPan.startY = event.clientY - svgPan.translateY
}

const handleSvgMouseMove = (event) => {
    if (svgPan.isDragging) {
        svgPan.translateX = event.clientX - svgPan.startX
        svgPan.translateY = event.clientY - svgPan.startY
    }
}

const handleSvgMouseUp = () => {
    svgPan.isDragging = false
}

const handleWheel = (event) => {
    event.preventDefault()
    const delta = event.deltaY
    if (delta > 0) {
        svgSize.scale = Math.max(svgSize.scale / 1.1, 0.5)
    } else {
        svgSize.scale = Math.min(svgSize.scale * 1.1, 3)
    }
}

const close = () => {
    visible.value = false
}

const zoomIn = () => {
    svgSize.scale = Math.min(svgSize.scale * 1.2, 3)
}

const zoomOut = () => {
    svgSize.scale = Math.max(svgSize.scale / 1.2, 0.5)
}

const resetZoom = () => {
    svgSize.scale = 1
    svgPan.translateX = 0
    svgPan.translateY = 0
}
</script>

<style scoped lang="scss">
.fullscreen-svg-container {
    width: 100%;
    height: 100vh;
    position: relative;
    background: #fff;

    svg {
        width: 100%;
        height: 100%;
        transform-origin: center center;
    }
}

.fullscreen-controls {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>