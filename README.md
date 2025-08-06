# @winner-fed/plugin-unicons

🎨 基于 [unplugin-icons](https://github.com/unplugin/unplugin-icons) 的图标解决方案，提供强大的图标管理和使用体验。

## ✨ 特性

- 📦 **开箱即用** - 零配置即可使用数万个图标
- 🎯 **多框架支持** - 支持 Vue2、Vue3 等主流框架
- 🛠️ **多打包工具** - 支持 Vite、Webpack、Rspack
- 🔧 **自动导入** - 自动导入图标组件，无需手动注册
- 📁 **本地图标** - 支持本地 SVG 图标自动优化和导入
- 🎨 **自定义图标集** - 支持自定义图标集合
- ⚡ **按需加载** - 仅打包使用的图标，优化包体积
- 🎪 **SVG 优化** - 自动优化 SVG 图标，移除冗余代码

## 📦 安装

```bash
npm install @winner-fed/plugin-unicons
# 或者
yarn add @winner-fed/plugin-unicons
# 或者
pnpm add @winner-fed/plugin-unicons
```

## 🚀 使用

### 基础使用

1. **在配置文件中启用插件**

```javascript
// win.config.js
export default {
  plugins: [
    '@winner-fed/plugin-unicons'
  ]
}
```

2. **在组件中使用图标**

```vue
<template>
  <div>
    <!-- 使用在线图标库 -->
    <icon-mdi-home />
    <icon-heroicons-outline-menu-alt-2 />
    <icon-ri-apps-2-line />
    
    <!-- 使用本地自定义图标 -->
    <icon-win-custom-logo />
    
    <!-- 作为组件使用 -->
    <IconMdiHome />
    <IconWinCustomLogo />
  </div>
</template>

<script setup>
import IconMdiHome from '~icons/mdi/home'
import IconWinCustomLogo from '~icons/win/custom-logo'
</script>
```

### 本地图标

将 SVG 图标文件放置在 `src/icons` 目录下，插件会自动：

1. 读取并优化 SVG 文件
2. 转换为可用的图标组件
3. 支持自动导入和按需加载

```
src/
├── icons/
│   ├── logo.svg
│   ├── arrow.svg
│   └── custom-icon.svg
```

使用方式：

```vue
<template>
  <div>
    <!-- 本地图标会自动添加 win 前缀 -->
    <icon-win-logo />
    <icon-win-arrow />
    <icon-win-custom-icon />
  </div>
</template>
```

## ⚙️ 配置

### 基础配置

```javascript
// win.config.js
export default {
  plugins: [
    '@winner-fed/plugin-unicons'
  ],
  unIcons: {
    // 自定义图标目录
    include: [
      'src/assets/icons'
    ],
    // 自定义图标集合
    customCollections: {
      'my-icons': {
        'custom-icon': '<svg>...</svg>'
      }
    },
    // 自动安装
    autoInstall: true,
    // 默认样式类名
    defaultClass: 'unicons-win',
    // 编译器类型
    compiler: 'vue3',
    
    // 以下是 unplugin-icons 支持的其他配置
    scale: 1.2,
    iconifyApiEndpoint: 'https://api.iconify.design',
    transform(svg, collection, icon) {
      // 自定义图标转换逻辑
      return svg
    }
  }
}
```

### 配置选项

#### 插件专有配置

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `include` | `string[]` | `['src/icons']` | 自定义图标目录，会与默认的 `src/icons` 目录合并 |
| `customCollections` | `object` | `{}` | 自定义图标集合 |
| `autoInstall` | `boolean` | `true` | 自动安装图标组件 |
| `defaultClass` | `string` | `'unicons-win'` | 默认样式类名 |
| `compiler` | `string` | 自动检测 | 编译器类型，支持 `vue2`、`vue3` 等 |

#### 扩展配置

本插件基于 [unplugin-icons](https://github.com/unplugin/unplugin-icons)，因此支持所有 unplugin-icons 的配置选项：

- `scale` - 图标缩放比例
- `transform` - 自定义图标转换函数
- `iconifyApiEndpoint` - Iconify API 端点
- `jsx` - JSX 模式配置
- 以及其他 unplugin-icons 支持的配置项

> 💡 **提示**: 所有传入的配置都会被传递给 unplugin-icons，让你能够使用其完整功能。

## 🎯 图标命名规则

### 在线图标库

格式：`icon-{collection}-{name}`

- `icon-mdi-home` → Material Design Icons 的 home 图标
- `icon-heroicons-outline-menu` → Heroicons 的 outline menu 图标
- `icon-ri-apps-2-line` → Remix Icons 的 apps-2-line 图标

### 本地图标

格式：`icon-win-{name}`

- `src/icons/logo.svg` → `icon-win-logo`
- `src/icons/my-icon.svg` → `icon-win-my-icon`

文件名会自动转换为驼峰命名：
- `custom-icon.svg` → `customIcon`
- `user_profile.svg` → `userProfile`

## 🎨 样式定制

插件自动注入基础样式：

```css
.unicons-win {
  width: 1em;
  height: 1em;
  fill: currentColor;
  stroke: none;
  display: inline-block;
  vertical-align: middle;
}
```

### 自定义样式

```vue
<template>
  <icon-mdi-home class="my-icon" />
</template>

<style>
.my-icon {
  font-size: 24px;
  color: #1890ff;
}
</style>
```

### 通过查询参数自定义

```vue
<script setup>
import LargeIcon from '~icons/mdi/home?width=2em&height=2em'
import ColoredIcon from '~icons/mdi/home?color=red'
</script>
```

## 🔧 高级用法

### 动态图标

```vue
<template>
  <component :is="iconComponent" />
</template>

<script setup>
import { computed } from 'vue'

const iconName = ref('home')
const iconComponent = computed(() => {
  return () => import(`~icons/mdi/${iconName.value}`)
})
</script>
```

### 获取原始 SVG

```vue
<script setup>
import RawIcon from '~icons/mdi/home?raw'
// RawIcon 是 SVG 字符串
</script>
```

### 高级配置示例

```javascript
// win.config.js
export default {
  unIcons: {
    // 自定义图标转换
    transform(svg, collection, icon) {
      // 为所有图标添加样式
      return svg.replace('<svg', '<svg class="custom-icon"')
    },
    
    // 缩放所有图标
    scale: 1.5,
    
    // 自定义图标集合
    customCollections: {
      'brand': {
        'logo': '<svg viewBox="0 0 24 24">...</svg>',
        'mark': () => import('./assets/mark.svg?raw')
      }
    },
    
    // JSX 模式（适用于 React）
    jsx: 'react',
    
    // 自定义 Iconify API 端点
    iconifyApiEndpoint: 'https://api.iconify.design'
  }
}
```

## 📋 支持的图标库

插件支持 [Iconify](https://iconify.design/) 提供的所有图标库：

- **Material Design Icons** (`mdi`) - 7,000+ 图标
- **Heroicons** (`heroicons`) - 460+ 图标
- **Remix Icons** (`ri`) - 2,500+ 图标
- **Feather Icons** (`feather`) - 280+ 图标
- **Ant Design Icons** (`ant-design`) - 800+ 图标
- **Carbon Icons** (`carbon`) - 2,000+ 图标
- **Tabler Icons** (`tabler`) - 4,000+ 图标
- **Font Awesome** (`fa`, `fa-solid`, `fa-regular`, `fa-brands`) - 2,000+ 图标

更多图标库请访问：https://icon-sets.iconify.design/

## 🔍 常见问题

### Q: 如何查找可用的图标？

A: 访问 [Iconify](https://icon-sets.iconify.design/) 浏览所有可用图标，或者在 [icones.netlify.app](https://icones.netlify.app/) 搜索。

### Q: 本地图标不显示？

A: 请检查：
1. SVG 文件是否放在 `src/icons` 目录下
2. 文件名是否符合规范（仅包含字母、数字、连字符、下划线）
3. SVG 文件是否有效

### Q: 如何优化包体积？

A: 插件默认按需加载，只会打包使用的图标。避免使用 `import * from '~icons/*'` 这样的全量导入。

### Q: 支持 TypeScript 吗？

A: 完全支持！插件会自动生成类型定义。

### Q: 如何自定义图标颜色？

A: 使用 CSS 的 `color` 属性：
```vue
<icon-mdi-home style="color: red" />
```

### Q: 如何使用 unplugin-icons 的其他配置？

A: 插件支持 unplugin-icons 的所有配置选项，直接在 `unIcons` 配置中添加即可：
```javascript
export default {
  unIcons: {
    // 任何 unplugin-icons 支持的配置
    transform: (svg) => svg.replace('currentColor', '#ff0000'),
    scale: 2,
    jsx: 'react'
  }
}
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
