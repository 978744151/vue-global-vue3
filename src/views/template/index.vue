<template>
    <div class="template-container">
        <!-- 顶部搜索区 -->
        <div class="search-bar">
            <el-input v-model="searchParams.name" placeholder="分类" style="width: 200px" />
            <el-select v-model="searchParams.status" placeholder="状态" style="width: 200px; margin: 0 10px">
                <el-option label="全部" value="0" />
                <el-option label="审核中" value="1" />
                <el-option label="已发布" value="2" />
            </el-select>
            <el-input v-model="searchParams.remark" placeholder="分类备注" style="width: 200px; margin-right: 10px" />
            <el-input v-model="searchParams.code" placeholder="模板code" style="width: 200px; margin-right: 10px" />
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>

        <div class="main-content">
            <!-- 左侧分类树 -->
            <div class="category-tree">
                <el-tree :data="treeData" :props="{ label: 'name' }" @node-click="handleNodeClick" draggable
                    :allow-drop="allowDrop" @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter"
                    @node-drag-leave="handleDragLeave" @node-drag-end="handleDragEnd" @node-drop="handleDrop">
                    <template #default="{ node, data }">
                        <div class="custom-tree-node">
                            <span>{{ node.label }}</span>
                            <el-dropdown :show-timeout="0" trigger="hover" @command="handleCommand($event, node)">
                                <span>...</span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item command="add" v-if="node.data.grade < 3">新增</el-dropdown-item>
                                        <el-dropdown-item command="edit">编辑</el-dropdown-item>
                                        <el-dropdown-item command="delete">删除</el-dropdown-item>
                                        <el-dropdown-item command="copy">复制</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </template>
                </el-tree>
            </div>

            <!-- 右侧内容区 -->
            <div class="content-area">
                <SvgEditor :templateInfo="templateInfo" :imageUrl="templateImage" :initialTextElements="textElements"
                    :canEdit="false" :fileName="templateCode" @update:textElements="textElements = $event"
                    @save="handleSvgSave" ref="svgEditor" />
            </div>
        </div>
        <CategoryDialog v-model="categoryDialogVisible" :type="dialogType" :tree-data="treeData" :edit-data="editData"
            @submit="handleCategorySubmit" />

    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import SvgEditor from '@/components/SvgContainer.vue'
import { getCategoryAll, getCategoryDetail, queryDrawingTemplateById, insertCaByCheck } from "@/api/shop";
import CategoryDialog from '@/components/CategoryDialog.vue'

// 添加状态管理
const categoryDialogVisible = ref(false)
const dialogType = ref('add')
const editData = ref(null)
const router = useRouter();

// 搜索参数
const searchParams = reactive({
    category: '',
    status: '',
    remark: '',
    code: ''
})

// 树形数据
const templateInfo = ref({})

const treeData = ref()
const templateName = ref('')
const templateCode = ref()
const templateImage = ref('')
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
    // { x: 50, y: 100, content: 'DK-1-2', color: '#000' },
    // { x: 50, y: 200, content: 'SC-1-2', color: '#000' }
])

// 计算编辑框位置
const editBoxStyle = computed(() => ({
    left: `${editing.position.x}px`,
    top: `${editing.position.y - 30}px`
}))


const handleDragStart = (node, ev) => {
    console.log('drag start', node)
}

const handleDragEnter = (draggingNode, dropNode, ev) => {
    console.log('tree drag enter: ', dropNode.label)
}

const handleDragLeave = (draggingNode, dropNode, ev) => {
    console.log('tree drag leave: ', dropNode.label)
}

const handleDragEnd = (draggingNode, dropNode, dropType, ev) => {
    console.log('tree drag end: ', dropNode && dropNode.label, dropType)
}

const handleDrop = (draggingNode, dropNode, dropType, ev) => {
    // 只允许同级排序
    if (dropType !== 'inner' && draggingNode.parent === dropNode.parent) {
        const parent = draggingNode.parent;
        const children = parent.data.children || parent.data;
        const draggingIndex = children.indexOf(draggingNode.data);
        const dropIndex = children.indexOf(dropNode.data);

        // 移除拖拽节点
        children.splice(draggingIndex, 1);
        // 在目标位置插入
        children.splice(dropIndex, 0, draggingNode.data);
    }
}

// 阻止非同级拖拽
const allowDrop = (draggingNode, dropNode, type) => {
    // 只允许前后排序，不允许成为子节点
    if (type === 'inner') {
        return false;
    }
    // 确保是同级节点
    return draggingNode.parent === dropNode.parent;
}


const updateSvgTransform = () => {
    if (svgElement.value) {
        svgElement.value.style.transform = `scale(${svgSize.scale})`
    }
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
// 表格数据
const tableData = ref([
    {
        name: 'GB818全牙',
        code: 'GB818-001',
        status: 'reviewing'
    }
])

// 方法
const handleSearch = () => {
    // 实现搜索逻辑
    getList()
}

const handleAdd = () => {
    // 实现新增逻辑
}

const handleOtherManage = () => {
    // 实现其他管理逻辑
}

const handleNodeClick = (node) => {
    console.log('handleNodeClick', node)
    // 实现节点点击逻辑
    getCategoryDetail(
        node.id
    ).then(res => {
        const { templateInitialUrl, name, } = res.data.resultData.templateBo
        templateImage.value = templateInitialUrl
        templateName.value = name
        templateCode.value = res.data.resultData.templateBo.templateCode
        templateInfo.value = res.data.resultData.templateBo
    })
}

// 添加右键菜单相关状态
const contextMenu = reactive({
    visible: false,
    x: 0,
    y: 0,
    currentNode: null
})

// 计算右键菜单位置
const contextMenuStyle = computed(() => ({
    position: 'fixed',
    zIndex: 999,
    left: contextMenu.x + 'px',
    top: contextMenu.y + 'px'
}))

// 处理右键点击
const handleContextMenu = (event: MouseEvent, node) => {
    console.log('context menu', event, node)
    event.preventDefault()
    contextMenu.visible = true
    contextMenu.x = event.clientX
    contextMenu.y = event.clientY
    contextMenu.currentNode = node
}
const handleCategorySubmit = (formData) => {
    console.log('提交的数据：', formData)
    // 这里处理提交逻辑
    if (dialogType.value === 'add') {
        // 处理新增
        insertCaByCheck(formData).then(res => {
            console.log('新增成功')
            categoryDialogVisible.value = false
            getList()

        })
        console.log('新增')
    } else {
        // 处理编辑
    }
}
// 处理菜单命令
const handleCommand = (command: string, node) => {

    console.log('command', command, node)
    switch (command) {
        case 'add':
            dialogType.value = 'add'
            editData.value = { grade: node.level + 1, parentId: node.data.id }
            categoryDialogVisible.value = true
            break
        case 'edit':
            dialogType.value = 'edit'
            console.log('编辑', node.id)
            editData.value = node.data
            categoryDialogVisible.value = true
            break
        // ... 其他 case 保持不变
    }
    contextMenu.visible = false
}

const getList = async () => {
    const { data } = await getCategoryAll(searchParams)
    treeData.value = data.resultData
}
// 添加点击其他区域关闭菜单
onMounted(async () => {
    document.addEventListener('click', () => {
        contextMenu.visible = false
    })
    getList()
})

onUnmounted(() => {
    document.removeEventListener('click', () => {
        contextMenu.visible = false
    })
})
</script>

<style scoped>
.template-container {
    /* padding: 20px; */
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.search-bar {
    padding: 16px;
    background: #fff;
    border-radius: 4px;
}

.main-content {
    flex: 1;
    display: flex;
    /* gap: 16px; */
    background: #fff;
    border-radius: 4px;
    /* padding: 16px; */
    border-top: 1px solid #e6e6e6;
}

.category-tree {
    width: 420px;
    border: 1px solid #e6e6e6;
    border-top: none;
    border-right: none;

    .el-tree {
        height: calc(100vh - 80px);
        overflow-y: auto;
    }
}

.tree-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px 16px;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 16px;
}

.content-area {
    flex: 1;
    overflow: auto;
    border: 1px solid #dcdfe6;
    overflow: hidden;
    border-top: none;
}

.custom-tree-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-right: 12px;
}

.node-actions {
    /* display: none; */
}

.custom-tree-node:hover .node-actions {
    /* display: flex;
    gap: 8px; */
}

:deep(.el-tree-node__content) {
    height: 32px;
}

:deep(.el-tree-node__content:hover) {
    background-color: #f5f7fa;
}

.context-menu {
    position: fixed;
    z-index: 9999;
}

/* 移除原有的 node-actions 相关样式 */
</style>