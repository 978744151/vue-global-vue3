<template>
    <div class="template-container">
        <!-- 顶部搜索区 -->
        <div class="search-bar">
            <el-input v-model="searchParams.category" placeholder="分类" style="width: 200px" />
            <el-select v-model="searchParams.status" placeholder="状态" style="width: 200px; margin: 0 10px">
                <el-option label="全部" value="" />
                <el-option label="审核中" value="reviewing" />
                <el-option label="已发布" value="published" />
            </el-select>
            <el-input v-model="searchParams.remark" placeholder="分类备注" style="width: 200px; margin-right: 10px" />
            <el-input v-model="searchParams.code" placeholder="模板code" style="width: 200px; margin-right: 10px" />
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>

        <div class="main-content">
            <!-- 左侧分类树 -->
            <div class="category-tree">

                <el-tree :data="treeData" :props="{ label: 'name' }" @node-click="handleNodeClick">
                    <template #default="{ node, data }">
                        <div class="custom-tree-node">
                            <span>{{ node.label }}</span>
                            <div class="node-actions" v-if="data.showActions">
                                <el-button link type="primary" size="small">新增</el-button>
                                <el-button link type="primary" size="small">编辑</el-button>
                                <el-button link type="primary" size="small">上移</el-button>
                                <el-button link type="primary" size="small">下移</el-button>
                                <el-button link type="primary" size="small">删除</el-button>
                                <el-button link type="primary" size="small">复制</el-button>
                            </div>
                        </div>
                    </template>
                </el-tree>
            </div>

            <!-- 右侧内容区 -->
            <div class="content-area">
                <SvgEditor :imageUrl="templateImage" :initialTextElements="textElements" :canEdit="canEdit"
                    :fileName="templateCode" @update:textElements="textElements = $event" @save="handleSvgSave"
                    ref="svgEditor" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import SvgEditor from '@/components/SvgContainer.vue'
// 搜索参数
const searchParams = reactive({
    category: '',
    status: '',
    remark: '',
    code: ''
})

// 树形数据
const treeData = ref([
    {
        name: '紧固件',
        children: [
            { name: '螺栓' },
            { name: '螺母' },
            { name: '垫圈' },
            { name: '组合螺丝' },
            { name: '铆钉类' },
            {
                name: '螺钉',
                children: [
                    { name: '一字槽机螺钉' },
                    { name: '内六角机螺钉' },
                    { name: '十字槽机螺钉' },
                    { name: 'GB818十字槽机螺钉' },
                    { name: 'GB818全牙' },
                    { name: 'GB818反牙' },
                ]
            },
            { name: '工具' }
        ]
    }
])
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
}

const handleAdd = () => {
    // 实现新增逻辑
}

const handleOtherManage = () => {
    // 实现其他管理逻辑
}

const handleNodeClick = (data) => {
    // 实现节点点击逻辑
}
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
}

.node-actions {
    display: none;
}

.custom-tree-node:hover .node-actions {
    display: flex;
    gap: 8px;
}

:deep(.el-tree-node__content) {
    height: 32px;
}

:deep(.el-tree-node__content:hover) {
    background-color: #f5f7fa;
}
</style>