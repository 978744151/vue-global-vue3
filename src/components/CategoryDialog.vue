<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="500px" @close="handleClose">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
            <el-form-item label="上级分类">
                <el-tree-select check-strictly=true v-model="formData.parentId" :data="treeData"
                    :props="{ label: 'name', value: 'id' }" placeholder="请选择上级分类" clearable />
            </el-form-item>
            <el-form-item label="分类等级" prop="level">
                <el-input v-model="formData.grade" disabled />
            </el-form-item>
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入分类名称" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="formData.sort" :min="0" :max="999" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    type: String,
    treeData: Array,
    editData: Object
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const dialogTitle = computed(() => props.type === 'add' ? '新增分类' : '编辑分类')

const formRef = ref(null)
const formData = reactive({
    parentId: '',
    grade: 0,
    name: '',
    sort: 0,
    remark: '',
    "leafFlag": true,
    copyTemplateFlag: false
})

const rules = {
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}

const handleClose = () => {
    visible.value = false
    formRef.value?.resetFields()
}

const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate()
    emit('submit', formData)
    handleClose()
}

// 监听编辑数据变化
watch(() => props.editData, (newVal) => {
    if (newVal) {
        Object.assign(formData, newVal)
    }
}, { deep: true })
</script>