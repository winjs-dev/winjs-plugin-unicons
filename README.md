# winjs-plugin-example

Example plugin for WinJS.

<p>
  <a href="https://npmjs.com/package/winjs-plugin-example">
   <img src="https://img.shields.io/npm/v/winjs-plugin-example?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/winjs-plugin-example?minimal=true"><img src="https://img.shields.io/npm/dm/winjs-plugin-example.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

## Usage

Install:

```bash
npm add winjs-plugin-example -D
```

Add plugin to your `.winrc.ts`:

```ts
// .winrc.ts
export default {
  plugins: ['winjs-plugin-example'],
  // 开启配置
  example: {}
};
```

## Options

### foo

Some description.

- Type: `string`
- Default: `undefined`
- Example:

```js
export default {
  plugins: ['winjs-plugin-example'],
  // 开启配置
  example: {
    foo: 'bar'
  }
};
```

## License

[MIT](./LICENSE).
