## Development

After cloning the repo and running `npm install`

```sh
node site.js    // generate the examples shown on index.html
npm start
```

Main page: `http://localhost:8080/`

## Deployment

Deploy steps:

- `npm run deploy`

Release steps **(do deploy first)**:

- `npm version major|minor|patch`
- `npm publish`
