<template>

  <el-config-provider namespace="el">
    <RouterView id="router-container" v-slot="{ Component }">
      <keep-alive :include="include">
        <component :is="Component" :key="$route.name" />
      </keep-alive>
    </RouterView>
  </el-config-provider>
</template>
<script lang="ts" setup>
const include = ref(['g-home', 'menus', 'main-base'])
</script>
<style scoped lang="scss"></style>
