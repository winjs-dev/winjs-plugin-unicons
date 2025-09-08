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
      schema({ zod }) {
        return (
          zod
            .object({
              include: zod.array(zod.string()).optional(),
              customCollections: zod.record(zod.any()).optional(),
              autoInstall: zod.boolean().optional(),
              defaultClass: zod.string().optional(),
              compiler: zod.string().optional(),
              // SVG 优化相关配置
              svgOptimization: zod
                .object({
                  level: zod
                    .enum(['none', 'minimal', 'balanced', 'aggressive'])
                    .optional(),
                  preserveOriginal: zod.boolean().optional(),
                  customConfig: zod.any().optional(),
                })
                .optional(),
            })
            // 通过 .passthrough()，schema 会：
            // ✅ 验证已定义的字段类型
            // ✅ 允许额外的未知参数通过验证
            // ✅ 保留这些额外参数供后续使用
            // 这样就能更好地支持 unplugin-icons 的各种配置选项，同时保持类型安全性。
            .passthrough()
        );
      },
    },
    enableBy: api.EnableBy.config,
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
