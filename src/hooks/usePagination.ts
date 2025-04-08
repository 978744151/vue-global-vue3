import { ref, reactive } from 'vue'

interface PaginationOptions {
    pageSize?: number
    immediate?: boolean
}

export default function usePagination(fetchData: Function, options: PaginationOptions = {}) {
    const currentPage = ref(1)
    const pageSize = ref(options.pageSize || 10)
    const total = ref(0)
    const loading = ref(false)
    const list = ref([])

    const queryParams = reactive({
        pageNum: currentPage.value,
        pageSize: pageSize.value
    })

    const getList = async (params = {}) => {
        loading.value = true
        try {
            const { data } = await fetchData({
                ...queryParams,
                ...params
            })
            list.value = data.resultData.list
            total.value = data.resultData.total
        } catch (error) {
            console.error('获取数据失败:', error)
        } finally {
            loading.value = false
        }
    }

    const handlePageChange = (page: number) => {
        currentPage.value = page
        queryParams.pageNum = page
        getList()
    }

    const handleSizeChange = (size: number) => {
        pageSize.value = size
        queryParams.pageSize = size
        currentPage.value = 1
        queryParams.pageNum = 1
        getList()
    }

    const refresh = () => {
        getList()
    }

    const reset = () => {
        currentPage.value = 1
        queryParams.pageNum = 1
        getList()
    }

    if (options.immediate !== false) {
        getList()
    }

    return {
        currentPage,
        pageSize,
        total,
        loading,
        list,
        getList,
        handlePageChange,
        handleSizeChange,
        refresh,
        reset
    }
}