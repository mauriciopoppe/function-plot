## Development

After cloning the repo and running `npm install`

```sh
node site.js    // generate the examples shown on index.html
npm start
```

Main page: `http://localhost:9966/`
Development page: `http://localhost:9966/playground.html`

Deploy steps:

- `npm run build` (make sure to commit the dist files after this command)
- `git push origin master`
- `npm run deploy -- -- "Commit message"`

Release steps (do deploy first):

- `npm version major|minor|patch`
- `npm publish`

