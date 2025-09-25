/**
 * 微前端应用统一配置文件
 */

// 子应用微前端配置
// 子应用之间：name 不能重复，routePrefix 不能重复(推荐 /+name)，url如果和主应用存在跨域，请在子应用中添加允许跨域，以便于开发，vite 项目可忽略
// 注意：只有在此数组中的应用才会被启用，如需禁用某个应用，请将其注释掉
export const childApps = [
  {
    name: 'child-one',
    url: 'http://localhost:8001',
    iframe: true,
    routePrefix: '/child-one',
    keepAlive: true,
    preload: true, // 是否预加载此应用
    'router-mode': 'state',
  },
  {
    name: 'child-two',
    url: 'http://localhost:8002',
    iframe: true,
    routePrefix: '/child-two',
    keepAlive: true,
    preload: true, // 是否预加载此应用
    'router-mode': 'state',
  },
  // 子应用示例
  // {
  //   name: 'child-three',
  //   url: 'http://localhost:8003',
  //   iframe: true, // vite 项目必须设置为 true
  //   routePrefix: '/child-three',
  //   keepAlive: true,
  //   preload: false, // 不预加载此应用
  //   'router-mode': 'state',
  // },
]

// 统一菜单配置（简化版本：移除key字段，自动推导childPath）
export const menuConfig = [
  // 主应用页面
  {
    label: '主应用首页',
    path: '/home',
    icon: 'HomeOutlined',
    type: 'main', // 主应用页面
  },
  {
    label: '主应用关于',
    path: '/about',
    icon: 'InfoCircleOutlined',
    type: 'main', // 主应用页面
  },
  // 子应用1相关菜单
  {
    label: '子应用1',
    icon: 'VideoCameraOutlined',
    children: [
      {
        label: '首页',
        path: '/child-one/home',
        icon: 'HomeOutlined',
        type: 'micro', // 子应用页面
        appName: 'child-one',
        // childPath 将自动从 path 推导：/child-one/home -> /home，如果是 /child-one/ 则为 /
      },
      {
        label: '关于',
        path: '/child-one/about',
        icon: 'InfoCircleOutlined',
        type: 'micro', // 子应用页面
        appName: 'child-one',
        // childPath 将自动推导为 /about
      },
      {
        label: '用户管理',
        path: '/child-one/user',
        icon: 'UserOutlined',
        type: 'micro', // 子应用页面
        appName: 'child-one',
        // childPath 将自动推导为 /user
      },
    ],
  },

  // 子应用2相关菜单
  {
    label: '子应用2',
    icon: 'UploadOutlined',
    children: [
      {
        label: '首页',
        path: '/child-two/home',
        icon: 'HomeOutlined',
        type: 'micro', // 子应用页面
        appName: 'child-two',
        // childPath 将自动推导为 /
      },
      {
        label: '关于',
        path: '/child-two/about',
        icon: 'InfoCircleOutlined',
        type: 'micro', // 子应用页面
        appName: 'child-two',
        // childPath 将自动推导为 /about
      },
      // 多级菜单示例
      {
        label: '管理功能',
        icon: 'SettingOutlined',
        children: [
          {
            label: '用户管理',
            path: '/child-two/manage/user',
            icon: 'UserOutlined',
            type: 'micro', // 子应用页面
            appName: 'child-two',
            // childPath 将自动推导为 /manage/user
          },
          {
            label: '角色管理',
            path: '/child-two/manage/role',
            icon: 'TeamOutlined',
            type: 'micro', // 子应用页面
            appName: 'child-two',
            // childPath 将自动推导为 /manage/role
          },
        ],
      },
    ],
  },

  // 混合菜单示例：同一个菜单组下既有主应用页面也有子应用页面
  {
    label: '系统管理',
    icon: 'SettingOutlined',
    children: [
      {
        label: '系统设置',
        path: '/system/settings',
        icon: 'SettingOutlined',
        type: 'main', // 主应用页面
      },

      // 三级菜单示例
      {
        label: '高级功能',
        icon: 'ExperimentOutlined',
        children: [
          {
            label: '系统日志',
            path: '/system/logs',
            icon: 'FileTextOutlined',
            type: 'main', // 主应用页面
          },
          {
            label: '系统监控',
            path: '/child-two/monitor',
            icon: 'MonitorOutlined',
            type: 'micro', // 子应用页面
            appName: 'child-two',
            // childPath 将自动推导为 /monitor
          },
        ],
      },
    ],
  },
]
