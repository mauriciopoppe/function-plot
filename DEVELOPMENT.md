## Development

After cloning the repo and running `npm install`

```sh
node site.js    // generate the examples shown on index.html
npm start
```

Main page: `http://localhost:8080/`
Sandbox page: `http://localhost:8080/playground.html`

## Tests

This project is tested with unit tests and image snapshot tests.

```sh
npm run test
```

## Deployment

Website deployment steps:

- `npm run build`
- Choose a location to release to:
  - Deploy master: `./node_modules/.bin/gh-pages --dist site --dest master`
  - Deploy a tag: `./node_modules/.bin/gh-pages --dist site --dest <tag>`

Release steps:

- `npm run build`
- `np major|minor|patch`
