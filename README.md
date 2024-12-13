# @winner-fed/plugin-unicons

WinJS 提供的有关 icons 统一解决方案，以 [unplugin-icons](https://github.com/unplugin/unplugin-icons) 作为底层解析工具。适配多种构建工具，如 webpack, rspack, vite 等和前端框架，如 vue2，vue等。插件本身也内置了 [Resolver](https://github.com/unplugin/unplugin-icons/tree/main?tab=readme-ov-file#use-with-resolver) 功能，可自动引入所需的 svg 图标。

<p>
  <a href="https://npmjs.com/package/@winner-fed/plugin-unicons">
   <img src="https://img.shields.io/npm/v/@winner-fed/plugin-unicons?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/@winner-fed/plugin-unicons?minimal=true"><img src="https://img.shields.io/npm/dm/@winner-fed/plugin-unicons.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

## Usage

Install:

```bash
npm add @winner-fed/plugin-unicons -D
```

Add plugin to your `.winrc.ts`:

```ts
// .winrc.ts
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-unicons'],
  unIcons: {
    include: [],
    // 支持 unplugin-icons 配置参数，如
    customCollections: {
      ...
    }
  }
});
```

## 配置

### include
- **类型**：`Array<string>`
- **默认值**：`[]`

用于额外需要使用此方案解析的 svg 文件。注意需要使用**绝对路径**，并且会被插件内置的 svgo 压缩。

### 支持 unplugin-icons 扩展配置
- 继承了 [unplugin-icons](https://github.com/unplugin/unplugin-icons)插件的[配置参数](https://github.com/unplugin/unplugin-icons/blob/main/src/types.ts)

## 注意
- 在使用本地图标时，根据[unplugin-icons](https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#name-conversion)的命名规则，默认使用 `icon` 作为前缀(prefix)，`win` 作为集合（collection）。默认解析 `src/icons` 下的 svg 图标，如 `icon-win-dog`

## License

[MIT](./LICENSE).
