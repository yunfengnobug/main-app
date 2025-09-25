<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  SettingOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  MonitorOutlined,
} from '@ant-design/icons-vue'
import { microAppConfig } from '../config'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)
const selectedKeys = ref(['main-home'])
const openKeys = ref<string[]>([])

// 图标映射
const iconMap = {
  HomeOutlined,
  InfoCircleOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  MonitorOutlined,
}

// 获取菜单数据结构
const menuData = computed(() => {
  const items = microAppConfig.getAllMenuItems()
  return items.map((item: any) => ({
    ...item,
    icon: iconMap[item.icon as keyof typeof iconMap] || HomeOutlined,
  }))
})

// 判断当前是否为子应用路由
const isChildApp = computed(() => {
  return microAppConfig.isChildAppRoute(route.path)
})

// 获取当前子应用配置和URL
const currentChildApp = computed(() => {
  const path = route.path
  return microAppConfig.getCurrentChildApp(path)
})

// 动态生成micro-app组件的所有属性
const microAppProps = computed(() => {
  if (!currentChildApp.value || !currentChildApp.value.name) return {}

  // 获取完整的子应用配置
  const childAppConfig = microAppConfig.getChildAppByName(currentChildApp.value.name)
  if (!childAppConfig) return {}

  // 使用扩展运算符合并所有配置，同时过滤掉不需要的属性
  const { routePrefix, preload, ...microAppAttributes } = childAppConfig

  const props = {
    ...microAppAttributes,
    // 通过data属性传递targetRoute信息
    data: {
      targetRoute: currentChildApp.value.targetRoute || '/',
    },
  }
  return props
})

// 处理菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  // 递归查找菜单项
  const findMenuItemByKey = (items: any[], targetKey: string): any => {
    for (const item of items) {
      if (item.key === targetKey) {
        return item
      }
      if (item.children) {
        const found = findMenuItemByKey(item.children, targetKey)
        if (found) return found
      }
    }
    return null
  }

  const menuItem = findMenuItemByKey(menuData.value, key)
  if (menuItem?.path) {
    console.log(menuItem.path)
    router.push(menuItem.path)
  }
}

// 根据当前路由设置选中的菜单项和展开的菜单组
const updateSelectedKeys = () => {
  const currentPath = route.path

  // 递归查找菜单项和其父级路径
  const findMenuItemAndParents = (
    items: any[],
    targetPath: string,
    parents: string[] = [],
  ): { item: any; parents: string[] } | null => {
    for (const item of items) {
      if (item.path === targetPath) {
        return { item, parents }
      }
      if (item.children) {
        const result = findMenuItemAndParents(item.children, targetPath, [...parents, item.key])
        if (result) return result
      }
    }
    return null
  }

  const result = findMenuItemAndParents(menuData.value, currentPath)
  if (result) {
    selectedKeys.value = [result.item.key]
    openKeys.value = result.parents
  }
}

// 监听路由变化
router.afterEach(() => {
  updateSelectedKeys()
})

// 初始化选中状态
updateSelectedKeys()
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        <h3 v-if="!collapsed" style="color: white; text-align: center; padding: 16px 0; margin: 0">
          主应用
        </h3>
        <div
          v-else
          style="height: 64px; display: flex; align-items: center; justify-content: center"
        >
          <UserOutlined style="color: white; font-size: 20px" />
        </div>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        theme="dark"
        mode="inline"
        @click="handleMenuClick"
      >
        <!-- 一级菜单项 -->
        <a-menu-item
          v-for="item in menuData.filter((item) => !item.children && item.path)"
          :key="item.key"
        >
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </a-menu-item>

        <!-- 一级菜单组 -->
        <a-sub-menu v-for="item in menuData.filter((item) => item.children)" :key="item.key">
          <template #title>
            <component :is="item.icon" />
            <span>{{ item.label }}</span>
          </template>

          <!-- 二级菜单项 -->
          <a-menu-item
            v-for="child in item.children.filter((child: any) => !child.children && child.path)"
            :key="child.key"
          >
            <component :is="child.icon" />
            <span>{{ child.label }}</span>
          </a-menu-item>

          <!-- 二级菜单组 -->
          <a-sub-menu
            v-for="child in item.children.filter((child: any) => child.children)"
            :key="child.key"
          >
            <template #title>
              <component :is="child.icon" />
              <span>{{ child.label }}</span>
            </template>

            <!-- 三级菜单项 -->
            <a-menu-item
              v-for="grandChild in child.children.filter((gc: any) => gc.path)"
              :key="grandChild.key"
            >
              <component :is="grandChild.icon" />
              <span>{{ grandChild.label }}</span>
            </a-menu-item>
          </a-sub-menu>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header
        style="background: #fff; padding: 0 24px; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08)"
      >
        <div style="display: flex; align-items: center; height: 100%">
          <h2 style="margin: 0; color: #1890ff">微前端主应用</h2>
        </div>
      </a-layout-header>

      <a-layout-content style="margin: 24px 16px 0; overflow: initial">
        <div style="padding: 24px; background: #fff; min-height: 360px; border-radius: 6px">
          <!-- 如果是子应用路由，渲染micro-app，否则渲染router-view -->
          <micro-app
            v-if="isChildApp && currentChildApp"
            v-bind="microAppProps"
            style="width: 100%; height: 100%; min-height: 500px"
            :key="currentChildApp.name"
          ></micro-app>
          <router-view v-else />
        </div>
      </a-layout-content>

      <a-layout-footer style="text-align: center">
        Micro App ©2025 Created by Vue3 + Ant Design Vue
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style lang="scss" scoped>
.logo {
  background: rgba(255, 255, 255, 0.1);
  margin: 16px;
  border-radius: 6px;
}

:deep(.ant-layout-sider-collapsed) .logo h3 {
  display: none;
}

:deep(.ant-menu-item) {
  display: flex !important;
  align-items: center;
}

:deep(.ant-menu-item .anticon) {
  margin-right: 10px;
}

:deep(.ant-layout-sider-collapsed) .ant-menu-item .anticon {
  margin-right: 0;
}
</style>
