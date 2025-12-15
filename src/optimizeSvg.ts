/**
 * optimizeSvg
 * @Author: liwb (lwbhtml@163.com)
 * @Date: 2024-12-09 17:51
 * @LastEditTime: 2025-9-8 10:30
 * @Description: 优化 SVG 文件，提供多级优化策略以保证原始性
 */
import { basename, extname } from 'node:path';
import { fsExtra } from '@winner-fed/utils';
import { type Config, optimize } from 'svgo';

// 优化级别定义
export type OptimizationLevel = 'none' | 'minimal' | 'balanced' | 'aggressive';

// 不同优化级别的配置
const optimizationConfigs: Record<OptimizationLevel, Config> = {
  // 不进行任何优化，保持原始状态
  none: {
    plugins: [],
  },

  // 最小优化：只做基础清理，保留所有重要属性
  minimal: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // 保留重要属性
            removeViewBox: false,
            removeUselessStrokeAndFill: false,
            convertColors: false,
            cleanupIds: false,
          },
        },
      } as any,
      // 单独添加基础清理插件
      'removeComments',
      'removeMetadata',
      'removeEditorsNSData',
    ],
  },

  // 平衡优化：适度优化，保留样式相关属性
  balanced: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            // 保留 fill 和 stroke 以维持原始样式
            removeUselessStrokeAndFill: false,
          },
        },
      } as any,
      'cleanupListOfValues',
      // 适度清理属性，但保留 class 用于样式控制
      {
        name: 'removeAttrs',
        params: {
          attrs: ['data-*', 'xml:*'],
        },
      },
    ],
  },

  // 激进优化：最大程度优化，可能改变原始外观
  aggressive: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      } as any,
      'cleanupListOfValues',
      {
        name: 'removeAttrs',
        params: {
          attrs: '(fill|stroke|class)',
        },
      },
    ],
  },
};

export interface OptimizeSvgOptions {
  /** 优化级别 */
  level?: OptimizationLevel;
  /** 自定义 SVGO 配置，会与级别配置合并 */
  customConfig?: Config;
  /** 是否保留原始文件信息（用于调试） */
  preserveOriginal?: boolean;
}

export default function optimizeSvg(
  files: string[],
  options: OptimizeSvgOptions = {},
) {
  const {
    level = 'balanced',
    customConfig,
    preserveOriginal = false,
  } = options;

  const optimizedSvgData = [];

  for (const filePath of files) {
    if (fsExtra.statSync(filePath).isFile() && extname(filePath) === '.svg') {
      const originalData = fsExtra.readFileSync(filePath, 'utf-8');

      // 如果选择不优化，直接返回原始数据
      if (level === 'none') {
        optimizedSvgData.push({
          fileName: basename(filePath),
          data: originalData,
          originalData: preserveOriginal ? originalData : undefined,
        });
        continue;
      }

      // 获取优化配置
      let config = optimizationConfigs[level];

      // 合并自定义配置
      if (customConfig) {
        config = {
          ...config,
          plugins: [...(config.plugins || []), ...(customConfig.plugins || [])],
        };
      }

      try {
        const svgData = optimize(originalData, {
          path: filePath,
          ...config,
        });

        optimizedSvgData.push({
          fileName: basename(filePath),
          data: svgData.data,
          originalData: preserveOriginal ? originalData : undefined,
          info: (svgData as any).info, // SVGO 类型定义可能不完整，使用 any 绕过
        });
      } catch (error) {
        // 如果优化失败，回退到原始数据
        console.warn(`SVG 优化失败，使用原始文件: ${filePath}`, error);
        optimizedSvgData.push({
          fileName: basename(filePath),
          data: originalData,
          originalData: preserveOriginal ? originalData : undefined,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  return Promise.resolve(optimizedSvgData);
}
