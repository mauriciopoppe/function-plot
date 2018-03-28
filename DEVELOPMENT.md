## Development

**Requires Node 6!**

After cloning the repo and running `npm install`

```sh
node site.js    // generate the examples shown on index.html
npm start
```

Main page: `http://localhost:9966/site`, development page: `http://localhost:9966/site/playground.html`

Deploy steps:

- `npm run dist` (make sure to commit the dist files after this command)
- `npm version major|minor|patch`
- `git push origin master`
- `npm run deploy`
- `npm publish`

