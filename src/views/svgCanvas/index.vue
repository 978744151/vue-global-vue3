
<template>
    <div class="svg-container">
        <!-- 新增分类列表侧边栏 -->
        <div class="category-list">
            <div v-for="category in categories" :key="category.id" class="category-item"
                :class="{ active: selectedCategoryId === category.id }" @click="selectCategory(category.id)">
                <div class="color-tag" :style="{ backgroundColor: category.color }"></div>
                {{ category.name }}
            </div>
        </div>

        <div class="main-content">
            <svg ref="svgElement" :width="svgSize.width" :height="svgSize.height" @mousedown="startDrag"
                @mousemove="doDrag" @mouseup="endDrag">
                <image ref="bgImage" :href="backgroundImage" width="1000px" height="1000px"  object-fit="contain" />
                <text v-for="(text, index) in textElements" :key="index" :x="text.x" :y="text.y" :fill="text.color"
                    font-size="14" font-weight="700" @dblclick="startEdit(index)"
                    style="user-select: none; cursor: move">
                    {{ text.content }}
                </text>
            </svg>

            <div v-if="editing.index !== null" class="edit-box" :style="editBoxStyle">
                <input v-model="editing.text" @keyup.enter="saveEdit" />
                <button @click="saveEdit">保存</button>
            </div>


        </div>
        <el-button @click="addText">添加文本</el-button>
        <el-button @click="saveSVG">保存SVG</el-button>
    </div>

</template>

<script setup lang="ts">
// 新增分类相关数据
const categories = ref([
    { id: 2, name: '图2', color: '#409EFF', image: 'http://gpyh-user-oss.gpyh.com/test/img/useravatar/4/d7198af7-0012-435a-a6c2-a3a0683d891c_DIN7971.svg' },
    { id: 4, name: '图4', color: '#409EFF', image: "http://gpyh-user-oss.gpyh.com/test/img/useravatar/2/0d2d0aa7-7e8d-486a-a35a-88503557df06_GB2672.svg"
},
    { id: 5, name: '图5', color: '#409EFF', image: "http://gpyh-user-oss.gpyh.com/test/img/useravatar/1/e1d9e00b-85ab-4fa4-bc09-26ce3fced3e1_GB9074.8.svg"
},
    { id: 6, name: '图6', color: '#409EFF', image: 'http://p.lsbzk.com/lsbzk/product-image/13/327982/230908132903-3217564-0a1d5c11-3d7e-4794-a9c6-780d61876540.jpg' },
    { id: 7, name: '图4', color: '#409EFF', image: 'http://p1.gpyh.com/image/FHY/FHY104971.jpg' },
    // { id: 4, name: '图4', color: '#F56C6C', image: '' },
]);
const backgroundImage = ref(categories.value[0].image);

const selectedCategoryId = ref(1);

// 分类选择方法
const selectCategory = (id) => {
    selectedCategoryId.value = id;
    backgroundImage.value = categories.value.find(category => category.id === id).image;
    // 这里可以添加分类切换后的逻辑
};

// 响应式状态
const svgElement = ref(null);
const svgSize = reactive({ width: 1000, height: 1000 });
const bgImage = ref(null);
const textElements = ref([
    { x: 50, y: 100, content: 'DK-1-2', color: '#000' },
    { x: 50, y: 200, content: 'SC-1-2', color: '#000' },
    { x: 50, y: 300, content: 'QW-1-2', color: '#000' },
    { x: 50, y: 400, content: 'DS-1-2', color: '#000' },
    { x: 50, y: 500, content: '!XX-1-2', color: '#000' }
]);

// 拖拽相关状态
const dragging = reactive({
    isDragging: false,
    index: null,
    offsetX: 0,
    offsetY: 0
});

// 编辑相关状态
const editing = reactive({
    index: null,
    text: '',
    position: { x: 0, y: 0 }
});

// 计算编辑框位置
const editBoxStyle = computed(() => ({
    left: `${editing.position.x}px`,
    top: `${editing.position.y - 30}px`
}));

// 拖拽逻辑
const startDrag = (event) => {
    const rect = svgElement.value.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    textElements.value.forEach((text, index) => {
        const textWidth = getTextWidth(text.content);
        if (mouseX >= text.x && mouseX <= text.x + textWidth &&
            mouseY >= text.y - 20 && mouseY <= text.y) {
            dragging.isDragging = true;
            dragging.index = index;
            dragging.offsetX = mouseX - text.x;
            dragging.offsetY = mouseY - text.y;
        }
    });
};

const doDrag = (event) => {
    if (!dragging.isDragging) return;

    const rect = svgElement.value.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    textElements.value[dragging.index].x = mouseX - dragging.offsetX;
    textElements.value[dragging.index].y = mouseY - dragging.offsetY;
};

const endDrag = () => {
    dragging.isDragging = false;
    dragging.index = null;
};

// 文本编辑逻辑
const startEdit = (index) => {
    editing.index = index;
    editing.text = textElements.value[index].content;
    editing.position = {
        x: textElements.value[index].x,
        y: textElements.value[index].y
    };
};

const saveEdit = () => {
    if (editing.index !== null) {
        textElements.value[editing.index].content = editing.text;
        editing.index = null;
    }
};

// 添加新文本
const addText = () => {
    const content = prompt('请输入新文本:');
    if (content) {
        textElements.value.push({
            // x: Math.random() * (svgSize.width - 100),
            // y: Math.random() * (svgSize.height - 100),
            x: 30,
            y: 30,
            content,
            color: `#000`
        });
    }
};

// 保存SVG
const saveSVG = () => {
    const svgData = new XMLSerializer().serializeToString(svgElement.value);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vue_svg_image.svg';
    link.click();
};

// 工具函数
const getTextWidth = (text) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '20px Arial';
    return ctx.measureText(text).width;
};


</script>

<style scoped>
svg {
    border: 1px solid #000;
}

/* input[type="text"] {
    position: absolute;
    font-size: 14px;
    font-family: Arial;
    padding: 5px;
    border: none;
    background: rgba(255, 255, 255, 0.7);
} */

.edit-box {
    position: absolute;
    background: rgba(255, 255, 255, 0.9);
    padding: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 新增布局样式 */
.svg-container {
    display: flex;
    height: 100%;
    background: #fff;
    padding: 10px;
    overflow: scroll;
}

.category-list {
    width: 200px;
    background: #f5f7fa;
    border-right: 1px solid #ebeef5;
    padding: 15px;
}

.category-item {
    padding: 12px;
    margin: 8px 0;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.3s;
}

.category-item:hover {
    background-color: #ebf5ff;
}

.color-tag {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 10px;
}

.active {
    background-color: #ecf5ff;
    color: #409EFF;
    font-weight: 500;
}
</style>