# tailwind-rn-cli

> This readme is automatically generated by [create-pastel-app](https://github.com/vadimdemedes/create-pastel-app)

this repo is a fork of the excellent tailwind-rn package (https://github.com/vadimdemedes/tailwind-rn) that incorporates a CLI to build out styles based on tailwind configs

## Example 
For example, use in your package.json to generate styles based on a config file
```json
{
  "scripts": {
    "build:styles": "tailwind-rn-cli --config tailwind.config.js --output styles"
  }
}
```

This will generate a few files that can be found in the output dir: 
- styles.css -> tailwind css
- styles.json -> rn mappings of styles.css 
- tailwind.js -> the same function as `tailwind-rn` to map classnames to rn styles


## Install

```bash
$ yarn add tailwind-rn-cli
```


## CLI

```
$ tailwind-rn-cli --help
tailwind-rn-cli --output ./styles --config tailwind.config.js [--logErrors]
```


## Development

There are 2 available commands:

- `npm run dev` - Start development mode and recompile on change
- `npm run build` - Build a final distributable for npm
