<template>
    <div class="template-detail">
        <!-- 顶部导航 -->
        <div class="header">
            <div class="breadcrumb">
                紧固件/螺钉/十字槽机螺钉/GB818十字槽机螺钉/GB818全牙
            </div>
            <div class="actions">
                <el-button @click="handleClose">关闭</el-button>
                <el-button type="primary">保存</el-button>
                <el-button type="primary">保存并审核</el-button>
            </div>
        </div>

        <div class="main-content">
            <!-- 图纸展示区 -->
            <div class="drawing-area">
                <SvgEditor :templateInfo="templateInfo" :imageUrl="templateImage" :isOnload="true"
                    :initialTextElements="textElements" :canEdit="canEdit" :fileName="templateCode" :canMove="false"
                    :isScreen="false" :isShowEdit="false" @update:textElements="textElements = $event"
                    @save="handleSvgSave" ref="svgEditor">
                    <template #extra-button>
                        <el-button size="small" @click="isSettingPanel = !isSettingPanel"
                            class="common-button">设置</el-button>
                    </template>
                </SvgEditor>

            </div>

            <!-- 右侧属性面板 -->
            <div class="properties-panel" v-show="isSettingPanel">
                <el-tabs>
                    <el-tab-pane label="图纸属性">
                        <div class="property-group">
                            <div class="flex justify-between w-full">
                                <el-button @click="showAttributeDialog" type="primary" link>新增</el-button>
                                <el-button type="primary" link>导入</el-button>
                            </div>
                            <el-table :data="data" style="width: 100%" class="mt-3">
                                <el-table-column prop="prop" label="商品分类" width="width">
                                </el-table-column>
                                <el-table-column prop="prop" label="属性名称" width="width">
                                </el-table-column>
                                <el-table-column prop="prop" label="项目代号" width="width">
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="发布版本">
                        <!-- 发布日志内容 -->
                    </el-tab-pane>
                    <el-tab-pane label="操作日志">
                        <!-- 修改日志内容 -->
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <AttributeDialog v-if="attributeDialogVisible" v-model="attributeDialogVisible"
            @confirm="handleAttributeConfirm" />

    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import SvgEditor from '@/components/SvgContainer.vue'
import { getCategoryDetail, updateGoodsDrawingTemplate } from "@/api/shop";
import AttributeDialog from '@/components/AttributeDialog.vue'
const router = useRouter();

// 模板基本信息
const templateName = ref('GB818全牙')
const templateCode = ref('GB818-001')
const templateImage = ref('http://gpyh-user-oss.gpyh.com/test/img/useravatar/4/d7198af7-0012-435a-a6c2-a3a0683d891c_DIN7971.svg')
const status = ref('reviewing') // reviewing, published
const createTime = ref('2023-12-20 10:00:00')
const updateTime = ref('2023-12-20 15:30:00')
const templateInfo = ref({})
const isSettingPanel = ref(true)
// 计算属性
const statusType = computed(() => status.value === 'reviewing' ? 'warning' : 'success')
const statusText = computed(() => status.value === 'reviewing' ? '审核中' : '已发布')
const canEdit = computed(() => status.value !== 'published')
const canSubmitApproval = computed(() => status.value !== 'published')

// 文本元素
const textElements = ref([

])
const attributeDialogVisible = ref(false)

const showAttributeDialog = () => {
    attributeDialogVisible.value = true
}

const handleAttributeConfirm = (selectedAttributes) => {
    console.log('选中的属性：', selectedAttributes)
    // 处理选中的属性
    updateGoodsDrawingTemplate({
        templateBo: {
            ...templateInfo.value,
            attrNames: selectedAttributes.map(e => {
                return {
                    attrName: e.name,
                    attrNameId: e.id
                }
            })
        }
    })
}
// 计算编辑框位置
const editBoxStyle = computed(() => ({
    left: `${editing.position.x}px`,
    top: `${editing.position.y - 30}px`
}))

const handleClose = () => {
    router.back()
}
const getDetail = () => {
    getCategoryDetail(
        2705
    ).then(res => {
        templateInfo.value = res.data.resultData.templateBo || {}
    })
}
onMounted(() => {
    getDetail()
})
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
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f7fa;
}

.header {
    height: 50px;
    background: #fff;
    border-bottom: 1px solid #dcdfe6;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.breadcrumb {
    font-size: 14px;
    color: #606266;
}

.actions {
    display: flex;
    gap: 10px;
}

.main-content {
    flex: 1;
    display: flex;
    padding: 16px;
    gap: 16px;
    min-height: 0;
}

.drawing-area {
    flex: 1;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.properties-panel {
    width: 401px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    right: 16px;
    height: 100%;
    z-index: 1111;
    padding-top: 6px;
}

.property-group {
    padding: 0 16px;
}

.property-item {
    display: flex;
    margin-bottom: 16px;
}

.property-item label {
    width: 80px;
    color: #606266;
    font-size: 14px;
}

.property-item span {
    flex: 1;
    color: #303133;
    font-size: 14px;
}

:deep(.el-tabs__header) {
    margin-bottom: 20px;
}
</style>