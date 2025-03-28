<template>
    <div class="svg-container">
        <div class="svg-container-title">
            gb818全牙
        </div>
        <svg ref="svgElement" :width="svgSize.width" :height="svgSize.height" @mousedown="handleSvgMouseDown"
            @mousemove="handleSvgMouseMove" @mouseup="handleSvgMouseUp" :style="{
            transform: `scale(${svgSize.scale}) translate(${svgPan.translateX}px, ${svgPan.translateY}px)`,
            cursor: svgPan.isDragging ? 'grabbing' : 'grab'
        }">>
            <image ref="bgImage" :href="imageUrl" width="1000px" height="1000px" object-fit="contain" />
            <text v-for="(text, index) in textElements" :key="index" :x="text.x" :y="text.y" :fill="text.color"
                font-size="14" font-weight="700" @dblclick="startEdit(index)" style="user-select: none; cursor: move">
                {{ text.content }}
            </text>
        </svg>

        <div v-if="editing.index !== null" class="edit-box" :style="editBoxStyle">
            <input v-model="editing.text" @keyup.enter="saveEdit" />
            <button @click="saveEdit">保存</button>
        </div>

        <div class="svg-controls">
            <el-button @click="zoomIn">放大</el-button>
            <el-button @click="zoomOut">缩小</el-button>
            <el-button @click="resetZoom">重置</el-button>
            <el-button @click="toggleFullscreen">{{ isFullscreen ? '退出全屏' : '全屏' }}</el-button>
            <el-button @click="addText" v-if="canEdit">添加文本</el-button>
            <el-button @click="saveSVG">保存SVG</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
    imageUrl: {
        type: String,
        required: true
    },
    initialTextElements: {
        type: Array,
        default: () => []
    },
    canEdit: {
        type: Boolean,
        default: true
    },
    fileName: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['update:textElements', 'save'])

// SVG相关状态
const svgElement = ref(null)
const svgSize = reactive({
    width: 1000,
    height: 'calc(100vh - 117px)',
    scale: 1
})
// 添加画布拖动状态
const svgPan = reactive({
    isDragging: false,
    startX: 0,
    startY: 0,
    translateX: 0,
    translateY: 0
})

const isFullscreen = ref(false)

// 文本元素
const textElements = ref(props.initialTextElements)

// 拖拽相关状态
const dragging = reactive({
    isDragging: false,
    index: null,
    offsetX: 0,
    offsetY: 0
})

// 编辑相关状态
const editing = reactive({
    index: null,
    text: '',
    position: { x: 0, y: 0 }
})

// 计算编辑框位置
const editBoxStyle = computed(() => ({
    left: `${editing.position.x}px`,
    top: `${editing.position.y - 30}px`
}))
// 添加画布拖动方法
const handleSvgMouseDown = (event) => {
    // 如果点击的是文本元素，则执行原有的文本拖动逻辑
    const isTextElement = event.target.tagName === 'text';
    if (isTextElement) {
        startDrag(event);
        return;
    }

    svgPan.isDragging = true;
    svgPan.startX = event.clientX - svgPan.translateX;
    svgPan.startY = event.clientY - svgPan.translateY;
}

const handleSvgMouseMove = (event) => {
    if (dragging.isDragging) {
        doDrag(event);
        return;
    }

    if (svgPan.isDragging) {
        svgPan.translateX = event.clientX - svgPan.startX;
        svgPan.translateY = event.clientY - svgPan.startY;
    }
}

const handleSvgMouseUp = (event) => {
    endDrag();
    svgPan.isDragging = false;
}




// 拖拽方法
const startDrag = (event) => {
    if (!props.canEdit) return

    const rect = svgElement.value.getBoundingClientRect()
    // 考虑缩放因素计算鼠标位置
    const mouseX = (event.clientX - rect.left) / svgSize.scale - svgPan.translateX
    const mouseY = (event.clientY - rect.top) / svgSize.scale - svgPan.translateY

    textElements.value.forEach((text, index) => {
        const textWidth = getTextWidth(text.content)
        if (mouseX >= text.x && mouseX <= text.x + textWidth &&
            mouseY >= text.y - 20 && mouseY <= text.y) {
            dragging.isDragging = true
            dragging.index = index
            dragging.offsetX = mouseX - text.x
            dragging.offsetY = mouseY - text.y
        }
    })
}
const doDrag = (event) => {
    if (!dragging.isDragging) return

    const rect = svgElement.value.getBoundingClientRect()
    // 考虑缩放因素计算新位置
    const mouseX = (event.clientX - rect.left) / svgSize.scale - svgPan.translateX
    const mouseY = (event.clientY - rect.top) / svgSize.scale - svgPan.translateY

    textElements.value[dragging.index].x = mouseX - dragging.offsetX
    textElements.value[dragging.index].y = mouseY - dragging.offsetY
    emit('update:textElements', textElements.value)
}

const endDrag = () => {
    dragging.isDragging = false
    dragging.index = null
}

// 文本编辑方法
const startEdit = (index) => {
    if (!props.canEdit) return

    editing.index = index
    editing.text = textElements.value[index].content
    editing.position = {
        x: textElements.value[index].x,
        y: textElements.value[index].y
    }
}

const saveEdit = () => {
    if (editing.index !== null) {
        textElements.value[editing.index].content = editing.text
        editing.index = null
        emit('update:textElements', textElements.value)
    }
}

// 缩放方法
const zoomIn = () => {
    svgSize.scale = Math.min(svgSize.scale * 1.2, 3)
    updateSvgTransform()
}

const zoomOut = () => {
    svgSize.scale = Math.max(svgSize.scale / 1.2, 0.5)
    updateSvgTransform()
}

// 修改 resetZoom 方法，同时重置平移状态
const resetZoom = () => {
    svgSize.scale = 1;
    svgPan.translateX = 0;
    svgPan.translateY = 0;
    updateSvgTransform();
}
// 修改现有的 updateSvgTransform 方法
const updateSvgTransform = () => {
    if (svgElement.value) {
        svgElement.value.style.transform = `scale(${svgSize.scale}) translate(${svgPan.translateX}px, ${svgPan.translateY}px)`;
    }
}
// 全屏切换
const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
    if (isFullscreen.value) {
        svgSize.width = window.innerWidth
        svgSize.height = window.innerHeight
    } else {
        svgSize.width = 800
        svgSize.height = 'calc(100vh - 117px)'
    }
}

// 添加文本
const addText = () => {
    const content = prompt('请输入新文本:')
    if (content) {
        textElements.value.push({
            x: 30,
            y: 30,
            content,
            color: '#000'
        })
        emit('update:textElements', textElements.value)
    }
}

// 保存SVG
const saveSVG = () => {
    const svgData = new XMLSerializer().serializeToString(svgElement.value)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${props.fileName}.svg`
    link.click()
    emit('save')
}

// 工具函数
const getTextWidth = (text) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = '14px Arial'
    return ctx.measureText(text).width
}
</script>

<style scoped lang="scss">
.svg-container {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;

    &-title {
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #dcdfe6;
        padding-left: 20px;
        font-size: 16px;
        font-family: Source Han Sans CN, Source Han Sans CN-Regular;
        font-weight: 400;
        text-align: left;
        color: #323335;
        letter-spacing: 0.53px;
        position: inherit;
        z-index: 111;
    }
}

svg {
    flex: 1;
    background: #fff;
    transform-origin: center center;
}

.svg-controls {
    padding: 10px;
    display: flex;
    gap: 10px;
    background: #f5f7fa;
    border-top: 1px solid #dcdfe6;
    position: fixed;
    bottom: 0;
    z-index: 11;
    width: 100%;
}

.edit-box {
    position: absolute;
    background: rgba(255, 255, 255, 0.9);
    padding: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    gap: 5px;
}

.edit-box input {
    padding: 4px 8px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}

.edit-box button {
    padding: 4px 8px;
    background: #409eff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>