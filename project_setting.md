# Project Settings

## Setting Up Babel 7

We need to add babel packages to our project with

```zsh
npm install @babel/core @babel/cli @babel/preset-env @babel/node
npm install nodemon
```

- @babel/core: babels general working
- @babel/cli: the usage of babel in the command line
- @babel/preset-env: the ability to use the newest JS features
- @babel/node: the usage of babel with node
- nodemon: reloads node for us automatically when one of our files is changed

```javascript
// .babelrc
{
  "presets": ["@babel/preset-env"]
}
```

- Add `nodemon --exec babel-node src/server.js` as the start script - This tells the nodemon package to watch for file changes, reload when it detects them and use babel-node to run the file src/server.js. We’ll use this while developing locally.

- Add `babel src —-out-dir dist` as the build script - This tells babel to compile the files from the src directory and place them in the dist directory.

- Add `node dist/server.js` as the serve script - This enables us to run our compiled code on a server, the reason we are not just using nodemon for this is it uses quite a bit more memory than just using node and adds some startup time to the process which is fine for some applications but can be a huge performance hit in others.

```javascript
//package.json
{
  "name": "graphql_basics",
  "version": "1.0.0",
  "description": "GraphQL Basics",
  "main": "src/server.js",
  "scripts": {
    "start": "nodemon --exec babel-node src/server.js",
    "build": "babel src —-out-dir dist",
    "serve": "node dist/server.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/kephin/GraphQL_Basics.git"
  },
  "keywords": [
    "graphql"
  ],
  "author": "kephin",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/kephin/GraphQL_Basics/issues"
  },
  "homepage": "https://github.com/kephin/GraphQL_Basics#readme",
  "dependencies": {
    "@babel/cli": "^7.2.3",
    "@babel/core": "^7.2.2",
    "@babel/node": "^7.2.2",
    "@babel/preset-env": "^7.2.3",
    "nodemon": "^1.18.9"
  }
}
```

## Setting Up .env

```javascript
//.env
NODE_PATH=src
```

---
References:

1. Will Willems: [Using babel 7 with node](https://hackernoon.com/using-babel-7-with-node-7e401bc28b04)
