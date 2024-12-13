import type { IApi } from 'win';

export default (api: IApi) => {
  api.modifyHTML(($) => {
    return $;
  });
};
