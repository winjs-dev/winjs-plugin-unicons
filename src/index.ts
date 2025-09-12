/**
 * plugin-unicons
 * @Author: liwb (lwbhtml@163.com)
 * @Date: 2024-12-09 17:51
 * @LastEditTime: 2025-8-6 10:51
 * @Description: plugin-unicons
 */
import fs from 'node:fs';
import { basename, join } from 'node:path';
import { deepmerge, lodash, reduceConfigs, winPath } from '@winner-fed/utils';
import type { IApi } from '@winner-fed/winjs';
import IconsResolver from 'unplugin-icons/resolver';
import RspackIcons from 'unplugin-icons/rspack';
import ViteIcons from 'unplugin-icons/vite';
import WebpackIcons from 'unplugin-icons/webpack';
import optimizeSvg from './optimizeSvg';

export default (api: IApi) => {
  api.describe({
    key: 'unIcons',
    config: {
      schema({ zod }: { zod: any }) {
        return zod
          .object({
            include: zod
              .array(zod.string())
              .describe('额外的图标目录路径列表。数组元素为绝对路径或相对于项目根目录的路径，如 ["src/assets/icons", "/path/to/custom/icons"]。这些目录中的 SVG 文件将与默认的 src/icons 目录一起被扫描和处理。插件会递归遍历目录，收集所有 .svg 文件进行优化和转换。')
              .optional(),
            customCollections: zod
              .record(zod.any())
              .describe('自定义图标集合配置。键为集合名称，值为图标数据对象或配置选项。用于扩展默认的图标集合，支持在线图标库（如 iconify）或自定义图标数据。配置后可通过 icon-{集合名}:{图标名} 的方式使用图标。')
              .optional(),
            autoInstall: zod
              .boolean()
              .describe('是否自动安装缺失的图标集合。设为 true 时，当使用在线图标（如 iconify 图标）时会自动下载并安装对应的图标集合。设为 false 时需要手动安装图标集合。默认为 true，确保开箱即用的体验。')
              .optional(),
            defaultClass: zod
              .string()
              .describe('图标组件的默认 CSS 类名。用于设置所有生成的图标组件的默认样式类，控制图标的基础样式（如大小、颜色等）。默认为 "unicons-win"，插件会自动添加对应的全局样式。')
              .optional(),
            compiler: zod
              .string()
              .describe('图标编译器类型。用于指定生成图标组件的目标框架，支持 "vue2"、"vue3" 等。插件会根据项目的 Vue 版本自动检测并设置合适的编译器，通常无需手动配置。')
              .optional(),
            svgOptimization: zod
              .object({
                level: zod
                  .enum(['none', 'minimal', 'balanced', 'aggressive'])
                  .describe('SVG 优化级别。"none" 不进行任何优化保持原始状态；"minimal" 最小优化仅做基础清理保留重要属性；"balanced" 平衡优化适度处理保留样式相关属性（推荐）；"aggressive" 激进优化最大程度压缩体积但可能影响复杂图标。默认为 "balanced"。')
                  .optional(),
                preserveOriginal: zod
                  .boolean()
                  .describe('是否保留原始 SVG 文件。设为 true 时会在优化后保留原始文件的备份，便于对比和回滚。设为 false 时仅保留优化后的文件。默认为 false 以节省存储空间。')
                  .optional(),
                customConfig: zod
                  .any()
                  .describe('自定义 SVGO 配置对象。用于覆盖默认的优化配置，支持完全自定义的 SVGO 选项。配置格式遵循 SVGO 标准，可精确控制 SVG 优化行为。当提供此配置时，level 配置将被忽略。')
                  .optional()
              })
              .describe('SVG 优化配置选项。基于 SVGO 提供多级优化策略，在保证图标质量的前提下减少文件体积。支持从无优化到激进优化的多种级别，满足不同项目需求。')
              .optional()
          })
          .describe('Unicons 图标插件配置。基于 unplugin-icons 提供完整的图标解决方案，支持本地 SVG 图标和在线图标集合。自动扫描处理 src/icons 目录下的 SVG 文件，提供多级 SVG 优化、自动导入、Vue2/Vue3 兼容等功能。支持 Webpack、Vite、Rspack 构建工具。')
          // 通过 .passthrough()，schema 会：
          // ✅ 验证已定义的字段类型
          // ✅ 允许额外的未知参数通过验证
          // ✅ 保留这些额外参数供后续使用
          // 这样就能更好地支持 unplugin-icons 的各种配置选项，同时保持类型安全性。
          .passthrough();
      }
    },
    enableBy: api.EnableBy.config
  });

  const unIconsConfig = api.userConfig?.unIcons || {};
  const customCollections = unIconsConfig.customCollections || {};
  const customCollectionsKeys = Object.keys(customCollections);
  const iconsResolverConfig = {
    resolvers: [
      IconsResolver({
        prefix: 'icon',
        customCollections: ['win', ...customCollectionsKeys],
      }),
    ],
  };

  const unImports = iconsResolverConfig;
  const unComponents = iconsResolverConfig;

  const iconsPath = [
    join(api.paths.absSrcPath, 'icons'),
    ...(unIconsConfig.include || []),
    ...(api.userConfig?.icons?.include || []),
  ];

  const localIcons: string[] = [];

  for (const iconPath of iconsPath) {
    if (fs.existsSync(iconPath)) {
      localIcons.push(
        ...readIconsFromDir(iconPath).filter((file) => file.endsWith('.svg')),
      );
    }
  }

  api.modifyWebpackConfig(async (memo) => {
    const unpluginIconsConfig = await getUnpluginIconsConfig(api, localIcons);

    memo.plugins ||= [];

    memo.plugins.push(WebpackIcons(unpluginIconsConfig));

    return memo;
  });

  api.modifyRspackConfig(async (memo) => {
    const unpluginIconsConfig = await getUnpluginIconsConfig(api, localIcons);

    memo.plugins ||= [];

    memo.plugins.push(RspackIcons(unpluginIconsConfig));

    return memo;
  });

  api.modifyViteConfig(async (memo) => {
    const unpluginIconsConfig = await getUnpluginIconsConfig(api, localIcons);

    memo.plugins ||= [];

    memo.plugins.push(ViteIcons(unpluginIconsConfig));

    return memo;
  });

  // 添加 svg-icon 的全局样式
  api.addHTMLStyles(() => {
    return `
.unicons-win {
  width: 1em;
  height: 1em;
  /* 设置图标颜色与文本颜色一致 */
  fill: currentColor;
  /* 确保图标没有边框，除非图标本身的设计需要边框 */
  stroke: none;
  display: inline-block;
  vertical-align: middle;
}
`;
  });

  api.userConfig.autoImport = deepmerge(
    {
      unImports,
      unComponents,
    },
    api.userConfig.autoImport || {},
  );
};

function readIconsFromDir(dir: string) {
  const icons: string[] = [];

  const collect = (p: string) => {
    if (fs.statSync(p).isDirectory()) {
      const files = fs.readdirSync(p);
      for (const name of files) {
        collect(join(p, name));
      }
    } else {
      const prunePath = winPath(p);
      icons.push(prunePath);
    }
  };
  collect(dir);

  return icons;
}

async function getUnpluginIconsConfig(api: IApi, localIcons: string[]) {
  let frameworkCompiler: string = api.appData.framework || 'vue2';
  // 2.7 也是 vue3
  const vueVersion = api.appData.vue?.version;
  const isVue2 = vueVersion.startsWith('2.6.');
  if (api.appData.framework === 'vue' && !isVue2) {
    frameworkCompiler = 'vue3';
  }

  const iconDatas: Record<string, string> = {};

  // 获取 SVG 优化配置
  const svgOptimizationConfig = api.userConfig?.unIcons?.svgOptimization || {};
  const optimizeSvgDatas = await optimizeSvg(localIcons, {
    level: svgOptimizationConfig.level || 'balanced',
    preserveOriginal: svgOptimizationConfig.preserveOriginal || false,
    customConfig: svgOptimizationConfig.customConfig,
  });

  for (const { fileName, data } of optimizeSvgDatas) {
    // FIXED by liwb 2023-06-16 13:58:04
    // 处理文件名含有转换中划线时，转换异常
    // 为了防止文件名含有其他字符，这里一律转换为驼峰
    // https://lodash.shujuwajue.com/string/camelcase
    const formatFileName = lodash.camelCase(fileName.replace('.svg', ''));
    const iconName = basename(formatFileName, '.svg');

    iconDatas[iconName] = data;
  }

  const initialIcons = {
    autoInstall: true,
    compiler: frameworkCompiler,
    defaultClass: 'unicons-win',
    customCollections: {
      win: {
        ...iconDatas,
      },
    },
  };

  const userIcons = api.userConfig?.unIcons || {};

  const unIcons = reduceConfigs({
    initial: initialIcons,
    config: userIcons,
    mergeFn: deepmerge,
  });

  return unIcons;
}
