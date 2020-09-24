## Development

After cloning the repo and running `npm install`

```sh
node site.js    // generate the examples shown on index.html
npm start
```

Main page: `http://localhost:8080/`

### Storybook

```sh
npm run storybook
```

## Deployment

Deploy steps:

- `npm run build`
- `git push origin master`
- `npm run deploy -- -- "Commit message"`

Release steps **(do deploy first)**:

- `npm version major|minor|patch`
- `npm publish`
