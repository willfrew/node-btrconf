# `btrconf` [![Build Status](https://travis-ci.org/willfrew/node-btrconf.svg)](https://travis-ci.org/willfrew/node-btrconf)
_Better (read: simpler) node.js config loader._

While there are other node.js config loaders out there, they force you to split
your config into separate files. A default config file and then another per
environment.
For a small application (or microservice) it's often overkill to have your
config spread across 3-5 different files.

`btrconf` is of the opinion that, for small projects, one config file is
not just sufficient, but better.
If you find your config file getting too large, split it into multiple files
by configuration type (eg. database config, external service auth, etc.).

## Usage

`btrconf` uses the `NODE_ENV` environment variable to determine which config
it should load (_default_: `'development'`).

Given a config file `./config.js`:
```javascript
var env = process.env;
module.exports = {
  default: {
    port: env.PORT || 8080,
    errors: env.DISPLAY_ERRORS || true,
    db: {
      client: 'pg'
    }
  },
  test: {
    db: {
      connection: 'postgres://localhost:5432/testdb'
    }
  },
  development: {
    db: {
      connection: 'postgres://localhost:5432/devdb'
    }
  },
  production: {
    db: {
      connection: env.DB_URI,
    },
    errors: false
  }
}
```

You might have a `server.js` that looks something like:
```javascript
var btrconf = require('btrconf');
var express = require('express');
var knex = require('knex');

var config = btrconf.load('./config');
var db = knex(config.db);
var server = express();

/* Set up your routes, etc. */

server.listen(config.port);
```

## Caveats
Hey, we said it was better, not perfect ;)

### Requiring `btrconf` from multiple files.
Since we're requiring files relative to your module, from all the way down in
your `node_modules/`, we use `module.parent.filename` to determine the name of
the file you are requiring `btrconf` from.
We then load the specified config file relative to your that file.

This means that if you `require('btrconf')` from multiple files,
`module.parent.filename` will refer to the first file to require `btrconf`.
In this case, you can pass an absolute filename using:
```javascript
var config = btrconf.load(require.resolve('./config'));
```

Due to the above, `btrconf` is currently not suitable for use in other npm
modules, sorry!

