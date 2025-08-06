/**
 * optimizeSvg
 * @Author: liwb (lwbhtml@163.com)
 * @Date: 2024-12-09 17:51
 * @LastEditTime: 2024-12-09 17:51
 * @Description: optimizeSvg
 */
import { basename, extname } from 'node:path';
import { fsExtra } from '@winner-fed/utils';
import { optimize } from 'svgo';

const presetDefault = [
  {
    name: 'preset-default',
    params: {
      overrides: {
        removeViewBox: false,
      },
    },
  },
  'cleanupListOfValues',
  {
    name: 'removeAttrs',
    params: {
      attrs: '(fill|stroke|class)',
    },
  },
];

export default function optimizeSvg(files: string[]) {
  const optimizedSvgData = [];
  for (const filePath of files) {
    if (fsExtra.statSync(filePath).isFile() && extname(filePath) === '.svg') {
      const data = fsExtra.readFileSync(filePath, 'utf-8');
      // @ts-ignore
      const svgData = optimize(data, {
        path: filePath,
        // @ts-ignore
        plugins: presetDefault,
      });
      optimizedSvgData.push({
        fileName: basename(filePath),
        ...svgData,
      });
    }
  }
  return Promise.all(optimizedSvgData);
}
