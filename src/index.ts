import type { IApi } from '@winner-fed/winjs';

export default (api: IApi) => {
  api.describe({
    key: 'example',
    enableBy: api.EnableBy.config,
    config: {
      schema({ zod }) {
        return zod.object({
          foo: zod.string(),
        });
      },
    },
  });

  api.modifyConfig((memo) => {
    memo.foo = api.userConfig.example.foo;
    return memo;
  });
};
