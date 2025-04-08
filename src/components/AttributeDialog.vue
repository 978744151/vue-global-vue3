<template>
    <el-dialog v-model="visible" title="新增属性" width="800px" @close="handleClose">
        <div class="dialog-content">
            <div class="search-area">
                <el-select v-model="searchForm.categoryId" placeholder="商品分类（仅限三级）" style="width: 200px">
                    <el-option label="全部" value="" />
                </el-select>
                <el-input v-model="searchForm.englishName" placeholder="项目代号" style="width: 200px; margin-left: 10px" />
                <el-button type="primary" @click="handleSearch" style="margin-left: 10px">查询</el-button>
                <el-button @click="handleReset">关闭</el-button>
            </div>

            <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="categoryName" label="商品分类名称" align="center" />
                <el-table-column prop="name" label="属性名称" align="center" />
                <el-table-column prop="englishName" label="项目代号" align="center" />
                <el-table-column prop="categoryName" label="属性分组" align="center" />
                <!-- <el-table-column prop="code" label="项目代号" align="center" /> -->
                <el-table-column prop="isRequired" label="是否检验" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.isRequired ? 'success' : 'info'">
                            {{ row.isRequired ? '是' : '否' }}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-area">
                <span>总共 {{ total }} 个项目</span>
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]" layout="sizes, prev, pager, next" :total="total"
                    @size-change="handleSizeChange" @current-change="handlePageChange" />
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { queryGoodsAttrList } from '@/api/shop'
import usePagination from '@/hooks/usePagination'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})




const searchForm = reactive({
    // englishName: '2633',
    categoryId: '6'
})

const selectedRows = ref([])
// 使用分页 Hook
const {
    currentPage,
    pageSize,
    total,
    loading,
    list: tableData,
    getList,
    handlePageChange,
    handleSizeChange
} = usePagination(
    (params) => queryGoodsAttrList({ ...params, ...searchForm }),
    { immediate: false }
)
// const getList = async () => {
//     const { data } = await queryGoodsAttrList({ pageNum: 1, pageSize: 10, ...searchForm })
//     console.log(data)
//     tableData.value = data.resultData.list
//     total.value = data.resultData.total
// }
const handleSearch = () => {
    // 实现搜索逻辑
    getList()
}

const handleReset = () => {
    searchForm.categoryId = ''
    searchForm.englishName = ''
}

const handleSelectionChange = (selection) => {
    selectedRows.value = selection
}


const handleClose = () => {
    visible.value = false
}

const handleConfirm = () => {
    emit('confirm', selectedRows.value)
    visible.value = false
}
onMounted(async () => {
    getList()
})
</script>

<style scoped>
.dialog-content {
    padding: 10px 0;
}

.search-area {
    margin-bottom: 20px;
}

.pagination-area {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

:deep(.el-dialog__body) {
    padding-top: 10px;
}
</style>
