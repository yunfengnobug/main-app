import { childApps, menuConfig } from './app.config'

/**
 * 微前端应用配置管理器（统一版本）
 */
class MicroAppConfigManager {
  /**
   * 获取所有子应用配置
   */
  getChildApps() {
    return childApps
  }

  /**
   * 根据名称获取子应用配置
   */
  getChildAppByName(name: string) {
    return childApps.find((app: any) => app.name === name)
  }

  /**
   * 根据路由路径获取子应用配置
   */
  getChildAppByRoute(path: string) {
    return childApps.find((app: any) => path.startsWith(app.routePrefix))
  }

  /**
   * 获取完整的菜单配置
   */
  getMenuConfig() {
    return menuConfig
  }

  /**
   * 获取所有菜单项（递归处理多级菜单）
   */
  getAllMenuItems() {
    return this.processMenuItems(menuConfig)
  }

  /**
   * 递归处理菜单项（添加图标映射，自动生成key和targetRoute）
   */
  private processMenuItems(items: any[]): any[] {
    return items.map((item) => {
      const processedItem = {
        ...item,
        // 自动生成key：使用path作为key，如果没有path则使用随机ID
        key: item.path || `group-${Math.random().toString(36).substr(2, 9)}`,
        children: item.children ? this.processMenuItems(item.children) : undefined,
      }

      // 如果是子应用页面且没有明确指定targetRoute，则自动推导
      if (item.type === 'micro' && item.appName && item.path && !item.targetRoute) {
        const routePrefix = `/${item.appName}`
        if (item.path.startsWith(routePrefix)) {
          // 从 /child-one/home 推导出 /home，从 /child-one/ 推导出 /
          let targetRoute = item.path.substring(routePrefix.length)
          // 处理各种情况：空字符串、单独的斜杠都映射为根路径
          if (!targetRoute || targetRoute === '' || targetRoute === '/') {
            targetRoute = '/'
          }
          processedItem.targetRoute = targetRoute
        }
      }

      return processedItem
    })
  }

  /**
   * 根据路径查找菜单项（递归搜索）
   */
  findMenuItemByPath(path: string): any {
    // 使用处理后的菜单数据，确保包含自动生成的targetRoute
    const processedMenuItems = this.processMenuItems(menuConfig)
    return this.searchMenuItems(processedMenuItems, path)
  }

  /**
   * 在菜单项中递归搜索指定路径
   */
  private searchMenuItems(items: any[], path: string): any {
    for (const item of items) {
      if (item.path === path) {
        return item
      }
      if (item.children) {
        const found = this.searchMenuItems(item.children, path)
        if (found) return found
      }
    }
    return null
  }

  /**
   * 根据菜单项获取页面信息
   */
  getPageInfo(path: string) {
    const menuItem = this.findMenuItemByPath(path)
    if (!menuItem) return null

    if (menuItem.type === 'main') {
      // 主应用页面
      return {
        type: 'main',
        path: menuItem.path,
      }
    } else if (menuItem.type === 'micro') {
      // 子应用页面
      const childApp = this.getChildAppByName(menuItem.appName)
      if (!childApp) return null

      // 修改：保持url固定为url，通过targetRoute传递路由信息
      const targetRoute = menuItem.targetRoute || '/'

      return {
        type: 'micro',
        appName: menuItem.appName,
        name: childApp.name,
        url: childApp.url, // 固定为url
        targetRoute: targetRoute, // 子应用内的目标路由路径
        iframe: childApp.iframe,
        keepAlive: childApp.keepAlive,
        // 移除重复的 url 和 childPath 字段
      }
    }

    return null
  }

  /**
   * 检查路径是否为子应用路由
   */
  isChildAppRoute(path: string) {
    const pageInfo = this.getPageInfo(path)
    return pageInfo?.type === 'micro'
  }

  /**
   * 根据路径获取子应用的URL（兼容旧版本API）
   */
  getChildAppUrl(path: string) {
    const pageInfo = this.getPageInfo(path)
    return pageInfo?.type === 'micro' ? pageInfo.url : null
  }

  /**
   * 获取当前子应用信息（兼容旧版本API）
   */
  getCurrentChildApp(path: string) {
    const pageInfo = this.getPageInfo(path)
    if (pageInfo?.type === 'micro') {
      return {
        name: pageInfo.name,
        url: pageInfo.url,
        targetRoute: pageInfo.targetRoute, // 新增：传递targetRoute信息
        iframe: pageInfo.iframe,
        keepAlive: pageInfo.keepAlive,
      }
    }
    return null
  }

  /**
   * 获取完整配置
   */
  getFullConfig() {
    return {
      childApps: this.getChildApps(),
      menuConfig: this.getMenuConfig(),
    }
  }
}

// 导出单例实例
export const microAppConfig = new MicroAppConfigManager()

// 导出原始配置
export { childApps, menuConfig } from './app.config'
