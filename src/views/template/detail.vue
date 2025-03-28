<template>
    <div class="template-detail">
        <div class="header">
            <h2>{{ templateName }}</h2>
            <div class="actions">
                <el-button @click="handleSubmitApproval" type="primary" v-if="canSubmitApproval">提交审批</el-button>
                <el-button @click="$router.back()">返回</el-button>
            </div>
        </div>

        <div class="main-content">
            <SvgEditor :imageUrl="templateImage" :initialTextElements="textElements" :canEdit="canEdit"
                :fileName="templateCode" @update:textElements="textElements = $event" @save="handleSvgSave"
                ref="svgEditor" />
        </div>

        <div class="template-info">
            <h3>模板信息</h3>
            <el-descriptions :column="1" border>
                <el-descriptions-item label="模板编码">{{ templateCode }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                    <el-tag :type="statusType">{{ statusText }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ createTime }}</el-descriptions-item>
                <el-descriptions-item label="最后修改时间">{{ updateTime }}</el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import SvgEditor from '@/components/SvgContainer.vue'
// 模板基本信息
const templateName = ref('GB818全牙')
const templateCode = ref('GB818-001')
const templateImage = ref('http://gpyh-user-oss.gpyh.com/test/img/useravatar/4/d7198af7-0012-435a-a6c2-a3a0683d891c_DIN7971.svg')
const status = ref('reviewing') // reviewing, published
const createTime = ref('2023-12-20 10:00:00')
const updateTime = ref('2023-12-20 15:30:00')

// 计算属性
const statusType = computed(() => status.value === 'reviewing' ? 'warning' : 'success')
const statusText = computed(() => status.value === 'reviewing' ? '审核中' : '已发布')
const canEdit = computed(() => status.value !== 'published')
const canSubmitApproval = computed(() => status.value !== 'published')

// 文本元素
const textElements = ref([
    { x: 50, y: 100, content: 'DK-1-2', color: '#000' },
    { x: 50, y: 200, content: 'SC-1-2', color: '#000' }
])

// 计算编辑框位置
const editBoxStyle = computed(() => ({
    left: `${editing.position.x}px`,
    top: `${editing.position.y - 30}px`
}))

// 拖拽方法
const startDrag = (event) => {
    if (!canEdit.value) return

    const rect = svgElement.value.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

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
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    textElements.value[dragging.index].x = mouseX - dragging.offsetX
    textElements.value[dragging.index].y = mouseY - dragging.offsetY
}

const endDrag = () => {
    dragging.isDragging = false
    dragging.index = null
}

// 文本编辑方法
const startEdit = (index) => {
    if (!canEdit.value) return

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

const resetZoom = () => {
    svgSize.scale = 1
    updateSvgTransform()
}

const updateSvgTransform = () => {
    if (svgElement.value) {
        svgElement.value.style.transform = `scale(${svgSize.scale})`
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
        svgSize.height = 600
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
    }
}

// 保存SVG
const saveSVG = () => {
    const svgData = new XMLSerializer().serializeToString(svgElement.value)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${templateCode.value}.svg`
    link.click()
}

// 提交审批
const handleSubmitApproval = () => {
    // TODO: 实现提交审批逻辑
    status.value = 'reviewing'
}

// 工具函数
const getTextWidth = (text) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = '14px Arial'
    return ctx.measureText(text).width
}
</script>

<style scoped>
.template-detail {
    padding: 20px;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.main-content {
    flex: 1;
    display: flex;
    gap: 20px;
    background: #fff;
    border-radius: 4px;
    /* padding: 20px; */
    overflow: hidden;
}

.svg-container {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
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
}

.template-info {
    width: 300px;
    border-left: 1px solid #dcdfe6;
    padding-left: 20px;
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