# `btrconf`
Better (read: simpler) node.js config loader.

Writing JSON / YAML config files can be annoying and inflexible.
For many projects, simple Javascript config files are sufficient.
For this reason, `btrconf` assists you in loading environment-aware, Javascript
config files in a straightforward way.

## Usage
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

This means that if you `require('btrconf')` from multiple files (unlikely but
possible), `module.parent.filename` will be incorrect in all but one.
In this case, you can pass an absolute filename using:
```javascript
var config = btrconf.load(require.resolve('./config'));
```

Due to the above, `btrconf` is not suitable for use in other npm modules, sorry!

