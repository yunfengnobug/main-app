# 微前端应用配置说明

## 概述

本配置系统将子应用的配置从业务代码中分离出来，提供了简化的配置管理方式。使用any类型，无强类型检查，所有配置集中在一个文件中。

## 配置文件结构

```
src/config/
├── index.ts           # 配置管理器主入口
├── app.config.ts      # 统一配置文件（主应用+子应用）
└── README.md          # 本说明文档
```

## 配置说明

所有配置都在 `app.config.ts` 文件中，现在采用统一的菜单配置结构：

- `childApps`: 子应用微前端配置数组（只包含微前端相关配置）
- `menuConfig`: 统一菜单配置数组（支持任意级别菜单，混合主应用和子应用页面）

## 子应用微前端配置结构

每个子应用微前端配置包含以下字段（只保留实际使用的字段）：

```javascript
{
  name: 'child-one',           // 子应用名称，子应用之间名称不能重复
  url: 'http://localhost:8001',  // 子应用基础URL，如果和主应用存在跨域，请在子应用中添加允许跨域，以便于开发，vite 项目可忽略
  iframe: true,                // 是否使用iframe模式，vite 应用必须设置为 true
  routePrefix: '/child-one',   // 路由前缀，子应用之间名称不能重复，推荐 /+name
  keepAlive: true,             // 是否启用keep-alive缓存，提高性能
  preload: true,               // 是否预加载此应用，设置为 true 会在应用启动时预加载

  // micro-app 组件的额外属性（会自动传递给 micro-app 组件）
  'disable-memory-router': false, // 是否禁用虚拟路由系统
  'disable-patch-request': false, // 是否禁用请求拦截
  'inline': false,             // 是否使用内联模式
  'destroy': false,            // 是否在卸载时销毁
  // 可以添加任何 micro-app 支持的属性...
}
```

**动态属性绑定**：

- 除了 `routePrefix`、`url`、`preload` 等配置管理相关的字段外，其他所有字段都会自动传递给 `micro-app` 组件
- 使用扩展运算符 `...microAppAttributes` 实现动态绑定
- `name` 和 `url` 会被自动计算，无需在配置中指定
- 新增任何 micro-app 支持的属性都会自动生效，无需修改模板代码

## 统一菜单配置结构（简化版）

新的菜单配置支持任意级别的菜单嵌套，每个菜单项可以独立指定是主应用页面还是子应用页面。
**优化特性**：

- 🚀 **自动生成key**：使用 `path` 作为 `key`，无需手动指定
- 🔄 **自动推导childPath**：从 `path` 自动推导出 `childPath`，减少配置冗余

### 主应用页面配置

```javascript
{
  label: '主应用首页',          // 菜单显示名称
  path: '/home',               // 路由路径（自动作为key使用）
  icon: 'HomeOutlined',        // 图标名称
  type: 'main',                // 页面类型：主应用页面
}
```

### 子应用页面配置

```javascript
{
  label: '首页',               // 菜单显示名称
  path: '/child-one/home',     // 主应用中的路由路径（自动作为key使用）
  icon: 'HomeOutlined',        // 图标名称
  type: 'micro',               // 页面类型：子应用页面
  appName: 'child-one',        // 对应的子应用名称
  // childPath 将自动从 path 推导：/child-one/home -> /home
}
```

**childPath自动推导规则**：

- `/child-one/home` → `childPath: '/home'`
- `/child-one/about` → `childPath: '/about'`
- `/child-one/` → `childPath: '/'`
- `/child-two/manage/user` → `childPath: '/manage/user'`

### 多级菜单配置

```javascript
{
  label: '系统管理',           // 菜单组无需path，自动生成随机key
  icon: 'SettingOutlined',
  children: [                  // 支持任意级别嵌套
    {
      label: '系统设置',
      path: '/system/settings', // 主应用页面，path自动作为key
      icon: 'SettingOutlined',
      type: 'main',            // 主应用页面
    },
    {
      label: '用户中心',
      path: '/child-one/user',  // 子应用页面，path自动作为key
      icon: 'UserOutlined',
      type: 'micro',           // 子应用页面
      appName: 'child-one',
      // childPath 自动推导：/child-one/user -> /user
    },
    {
      label: '高级功能',        // 菜单组无需path，自动生成随机key
      icon: 'ExperimentOutlined',
      children: [              // 三级菜单
        {
          label: '系统日志',
          path: '/system/logs', // path自动作为key
          icon: 'FileTextOutlined',
          type: 'main',        // 主应用页面
        },
        {
          label: '系统监控',
          path: '/child-two/monitor', // path自动作为key
          icon: 'MonitorOutlined',
          type: 'micro',       // 子应用页面
          appName: 'child-two',
          // childPath 自动推导：/child-two/monitor -> /monitor
        },
      ],
    },
  ],
}
```

## 使用方式

### 1. 添加新的子应用

需要在两个地方添加配置：

**1) 在 `childApps` 数组中添加微前端配置：**

```javascript
{
  name: 'new-app', // 子应用名称，子应用之间名称不能重复
  url: 'http://localhost:8004',
  iframe: true, // vite 项目必须设置为 true
  routePrefix: '/new-app', // 菜单项的路由前缀，子应用之间名称不能重复，推荐 /+name
  keepAlive: true,
  preload: true, // 是否预加载此应用
}
```

**2) 在 `menuConfig` 数组中添加菜单配置：**

```javascript
// 在 menuConfig 数组中添加新的子应用菜单配置
{
  label: '新应用',
  icon: 'AppstoreOutlined',
  children: [
    {
      label: '首页',
      path: '/new-app/home',
      icon: 'HomeOutlined',
      type: 'micro',
      appName: 'new-app',
      // targetRoute 将自动推导为 /home
    },
    {
      label: '关于',
      path: '/new-app/about',
      icon: 'InfoCircleOutlined',
      type: 'micro',
      appName: 'new-app',
      // targetRoute 将自动推导为 /about
    },
    // 支持二级菜单
    {
      label: '管理功能',
      icon: 'SettingOutlined',
      children: [
        {
          label: '用户管理',
          path: '/new-app/admin/user',
          icon: 'UserOutlined',
          type: 'micro',
          appName: 'new-app',
          // targetRoute 将自动推导为 /admin/user
        }
      ]
    }
  ]
}
```

### 2. 修改子应用配置

直接编辑 `app.config.ts` 文件中对应的配置项。

### 3. 配置预加载

在子应用配置中设置 `preload` 字段：

- `preload: true` - 预加载此应用
- `preload: false` - 不预加载此应用

### 4. 临时禁用子应用

在 `childApps` 数组中将对应的配置项注释掉即可。

### 5. 修改菜单

在 `menuConfig` 数组中添加、修改或删除菜单项。

## 配置管理器 API

```javascript
// 获取所有启用的子应用微前端配置
microAppConfig.getChildApps()

// 根据名称获取子应用配置
microAppConfig.getChildAppByName('child-one')

// 根据路由获取子应用配置
microAppConfig.getChildAppByRoute('/child-one/home')

// 获取需要预加载的子应用配置
microAppConfig.getPreloadApps()

// 获取完整的菜单配置
microAppConfig.getMenuConfig()

// 获取所有菜单项（递归处理多级菜单）
microAppConfig.getAllMenuItems()

// 获取子应用URL
microAppConfig.getChildAppUrl('/child-one/home')

// 检查是否为子应用路由
microAppConfig.isChildAppRoute('/child-one/home')

// 获取完整配置
microAppConfig.getFullConfig()
```

## 配置分离的优势

1. **职责分离**：微前端配置和路由配置各司其职，结构更清晰
2. **易于维护**：修改路由不影响微前端配置，修改微前端配置不影响路由
3. **更好的扩展性**：可以独立管理不同类型的配置
4. **灵活性更强**：可以为同一个子应用配置多个路由，或者动态调整路由
5. **分组管理**：子应用路由按应用分组，便于管理和查找
6. **支持多级菜单**：支持二级菜单结构，可以构建更复杂的导航结构
7. **层次清晰**：每个子应用的菜单结构独立，层次分明

## 注意事项

1. 修改配置后需要重启开发服务器
2. 确保子应用的端口号不冲突
3. 路由前缀必须唯一
4. 图标名称需要在 `layout.vue` 中的 `iconMap` 中定义
5. 子应用路由配置中的 `appName` 必须与对应的子应用 `name` 一致
