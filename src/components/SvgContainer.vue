<template>
    <div class="svg-container">

        <div class="flex w-full svg-container-header items-center ">
            <div class=" svg-container-title">
                gb818全牙
            </div>
            <div class="actions ml-3" v-if="isOnload">
                <!-- <el-button size="small">上传模板</el-button> -->
                <uploadComponents v-model="templateInfo.templateUrl" />

                <slot name="extra-button"></slot>
                <el-button size="small">预览图片</el-button>

                <!-- <el-button size="small">放大</el-button>
                <el-button size="small">缩小</el-button>
                <el-button size="small">重置</el-button>
                <el-button size="small">上传模板</el-button> -->
                <el-button @click="zoomIn" size="small">放大</el-button>
                <el-button @click="zoomOut" size="small">缩小</el-button>
                <el-button @click="resetZoom" size="small">重置</el-button>
            </div>
        </div>
        <svg ref="svgElement" :width="svgSize.width" :height="svgSize.height" @mousedown="handleSvgMouseDown"
            @mousemove="handleSvgMouseMove" @mouseup="handleSvgMouseUp" @wheel="handleWheel" :style="{
                transform: `scale(${svgSize.scale}) translate(${svgPan.translateX}px, ${svgPan.translateY}px)`,
                cursor: svgPan.isDragging ? 'grabbing' : 'grab', margin: '0 auto'
            }">>
            <image ref="bgImage" :href="templateInfo.templateInitialUrl" height="100%" object-fit="contain" />
            <text v-for="(text, index) in textElements" :key="index" :x="text.x" :y="text.y" :fill="text.color"
                font-size="14" font-weight="700" @dblclick="startEdit(index)" style="user-select: none; cursor: move">
                {{ text.content }}
            </text>
        </svg>

        <div v-if="editing.index !== null" class="edit-box" :style="editBoxStyle">
            <input v-model="editing.text" @keyup.enter="saveEdit" />
            <button @click="saveEdit">保存</button>
        </div>

        <div class="svg-controls" v-if="!isOnload">
            <el-button @click="zoomIn">放大</el-button>
            <el-button @click="zoomOut">缩小</el-button>
            <el-button @click="resetZoom">重置</el-button>
            <el-button @click="handleNext" v-if="isShowEdit">编辑</el-button>
            <el-button @click="toggleFullscreen" v-if="isScreen">{{ isFullscreen ? '退出全屏' : '全屏' }}</el-button>
            <!-- <el-button @click="addText" v-if="canEdit">添加文本</el-button> -->
            <el-button @click="saveSVG">保存SVG</el-button>
        </div>

        <!-- 添加全屏组件 -->
        <FullscreenSvg v-model="isFullscreen" :image-url="templateInfo.templateUrl" :text-elements="textElements" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineProps, defineEmits } from 'vue'
import FullscreenSvg from "./FullscreenSvg.vue";
import uploadComponents from '@/components/upload.vue';
import { template } from 'lodash';
const props = defineProps({
    imageUrl: {
        type: String,
        required: true
    },
    canMove: {
        type: Boolean,
        default: true
    },
    isScreen: {
        type: Boolean,
        default: true
    },
    initialTextElements: {
        type: Array,
        default: () => []
    },
    isOnload: {
        type: Boolean,
        default: false
    },
    canEdit: {
        type: Boolean,
        default: true
    },
    isShowEdit: {
        type: Boolean,
        default: true
    },
    fileName: {
        type: String,
        required: true
    },
    templateInfo: {
        type: Object,
    }
})

const emit = defineEmits(['update:textElements', 'save'])

const router = useRouter()
// SVG相关状态
// 计算 SVG 尺寸的函数
const calculateSvgSize = () => {
    // A4 纸张比例 210:297
    const A4_RATIO = 210 / 297
    // 获取容器宽度（考虑左侧边栏等布局）
    const containerWidth = window.innerWidth * 0.7 // 假设容器宽度为窗口的 70%
    const containerHeight = window.innerHeight - 100 // 减去头部和其他元素的高度

    let width, height

    // 根据容器尺寸计算合适的 SVG 尺寸
    if (containerWidth / containerHeight > A4_RATIO) {
        // 如果容器较宽，以高度为基准
        height = containerHeight
        width = height * A4_RATIO
    } else {
        // 如果容器较高，以宽度为基准
        width = containerWidth
        height = width / A4_RATIO
    }

    // 更新 SVG 尺寸
    svgSize.width = Math.min(width, 1920 * 0.7) // 限制最大宽度
    svgSize.height = Math.min(height, 1080 * 0.8) // 限制最大高度
}
const svgElement = ref(null)
const svgSize = reactive({
    width: 0,
    height: 0,
    scale: 1
})
const handleNext = () => {
    router.push(`/template/${props.templateInfo.goodsDrawingCategoryId}`)
}
// 监听窗口大小变化
onMounted(() => {
    calculateSvgSize()
    window.addEventListener('resize', calculateSvgSize)
})

onUnmounted(() => {
    window.removeEventListener('resize', calculateSvgSize)
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
// 添加鼠标滚轮缩放处理方法
const handleWheel = (event) => {
    event.preventDefault();

    const delta = event.deltaY;
    const rect = svgElement.value.getBoundingClientRect();

    // 计算鼠标在SVG中的相对位置
    const mouseX = (event.clientX - rect.left) / svgSize.scale;
    const mouseY = (event.clientY - rect.top) / svgSize.scale;

    // 根据滚轮方向确定缩放方向
    if (delta > 0) {
        // 向下滚动，缩小
        svgSize.scale = Math.max(svgSize.scale / 1.1, 0.5);
    } else {
        // 向上滚动，放大
        svgSize.scale = Math.min(svgSize.scale * 1.1, 3);
    }

    updateSvgTransform();
}

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
        if (!props.canMove) return
        svgPan.translateX = event.clientX - svgPan.startX;
        svgPan.translateY = event.clientY - svgPan.startY;
    }
}

const handleSvgMouseUp = (event) => {
    endDrag();
    svgPan.isDragging = false;
}


// 修改拖拽方法
const startDrag = (event) => {
    if (!props.canEdit) return

    const rect = svgElement.value.getBoundingClientRect()
    const scale = svgSize.scale

    // 计算实际的鼠标位置，考虑缩放和平移
    const mouseX = (event.clientX - rect.left) / scale - svgPan.translateX
    const mouseY = (event.clientY - rect.top) / scale - svgPan.translateY

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
    const scale = svgSize.scale

    // 计算新位置，考虑缩放和平移
    const mouseX = (event.clientX - rect.left) / scale - svgPan.translateX
    const mouseY = (event.clientY - rect.top) / scale - svgPan.translateY

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

    &-header {
        border-bottom: 1px solid #ebeef5;
        position: relative;
        z-index: 111;

        .el-button {
            color: #0065ff;
            background: #ebf3ff;
            border: 1px solid #accdff;
            border-radius: 4px;
        }
    }

    &-title {
        height: 45px;
        line-height: 45px;
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
    //background: #f5f7fa;
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