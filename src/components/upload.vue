<template>
    <el-upload class="avatar-uploader" action="http://192.168.2.67:8304/file/upload" :show-file-list="false"
        :on-success="handleAvatarSuccess" :headers="{ Authorization: Authorization }" :data="{ fileTypeCode: '001' }">
        <!-- <el-image v-if="modelValue" :src="modelValue" class="avatar" fit="contain" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
        <el-button size="small">上传模板</el-button>
    </el-upload>

</template>

<script>
import Cookies from "js-cookie";

export default {
    name: "config-actBanner",
    props: ['modelValue'],
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    //   emits: ['update:modelValue'],
    data() {
        return {
            imageUrl: '',
            Authorization: Cookies.get(import.meta.env.VITE_TOKEN),
        }
    },
    mounted() {
        this.imageUrl = this.modelValue
    },
    methods: {
        handleAvatarSuccess(response) {
            console.log('response', response)
            this.imageUrl = encodeURI(response.resultData)
            this.$emit('update:modelValue', response.resultData);
        },

    }
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
    display: inline-block;
    margin-right: 12px;

    .el-button {
        color: #0065ff;
        background: #ebf3ff;
        border: 1px solid #accdff;
        border-radius: 4px;
    }
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
}

.avatar {
    width: 60px;
    height: 60px;
    display: block;
}
</style>