<template>
  <div class="app-main"  id="amis-container">
    <RouterView v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="routes.name" />
      </keep-alive>
    </RouterView>
  </div>
</template>

<script setup>

const routes = useRoute();
const router = useRouter();

try {
  // 与基座进行数据交互 
  window.microApp.addDataListener((dataListener) => {
    console.log('dataListener', dataListener)
    if (!dataListener.current) return;
    const { name, path } = dataListener?.current;
    const { latestView, type, tagView } = dataListener;
    if (type === "navigate") {
      console.log('path', path)
      router.push(`${path}`);
    } 
  }, true);
} catch (error) { }
// resetRouter()
</script>

<style lang="scss">
.app-main {
  /* 50= navbar  50  */
  height: calc(100vh - 83px);
  width: 100%;
  position: relative;
  overflow: hidden;
  // padding: 0 10px;
  background: #e8ebf3;

  .el-form .el-form-item {
    .el-select__wrapper {
      min-height: 36px;
      // background: #ffffff;
      border-radius: 4px;
    }

    .el-form-item__label {
      font-size: 14px;
      font-family: 'Microsoft YaHei';
      font-weight: Regular;
      text-align: left;
      color: #303133;
    }

    .el-input__inner {
      font-size: 14px;
      font-family: 'Microsoft YaHei';
      height: 32px;
    }
  }

  .el-tabs__nav-wrap:after {
    height: 1px;
  }

  .el-table__header-wrapper {
    // height: 40px;
    // background: #f4f8ff;
  }

  .el-tabs__nav-wrap {
    padding-left: 30px;
  }

  .avue-crud .el-table th.el-table__cell {
    background: #f4f8ff;
    height: 40px;
    font-size: 13px;
    font-family: 'Microsoft YaHei';
    font-weight: Regular;
    text-align: center;
    color: #76849e;
  }

  .avue-crud .el-table--default th .cell {
    color: #76849e;
    font-weight: 400;
    font-size: 14px;
  }

  .avue-crud .el-table--default td .cell {
    color: #303133;
    font-weight: 400;
  }

  .app-role-page .custom-tree-node {
    color: #323335;
  }

  .el-table th.el-table__cell {
    background: #f4f8ff;
    height: 40px;
    font-size: 13px;
    font-family: 'Microsoft YaHei';
    font-weight: Regular;
    text-align: center;
    color: #76849e;
  }

  .el-table--default th .cell {
    color: #76849e;
    font-weight: 400;
    font-size: 14px;
  }

  .el-table--default td .cell {
    color: #303133;
    font-weight: 400;
  }

  .avue-form {
    &__menu {
      text-align: left !important;
      width: 200px;
    }
  }

  .el-dialog {
    .avue-form {
      &__menu {
        text-align: center !important;
        width: 200px;
      }
    }
  }
}
</style>
