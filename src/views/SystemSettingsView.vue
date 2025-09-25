<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('系统设置页面已加载 - 主应用')
})
</script>

<template>
  <div class="page-container">
    <h1>系统设置</h1>
    <p>这是主应用的系统设置页面</p>
    <div class="content">
      <p>路径: /system/settings</p>
      <p>类型: 主应用页面</p>
      <p>功能: 系统配置管理</p>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
}

.content {
  margin-top: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
