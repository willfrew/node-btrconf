var expect = require('chai').expect;

var btrconf = require('../');

describe('btrconf.load()', function() {
  
  var config;
  
  beforeEach(function() {
    delete process.env.NODE_ENV;
    config = {
      default: {
        hello: ', world!'
      },
      test: {
        hello: ', WORLD!',
        db: 'postgres://localhost:6432/testdb'
      },
      development: {
        db: 'postgres://localhost:5432/devdb'
      },
      production: {
        db: process.env.DB_URI
      }
    }
  });

  it('should return an Object', function() {
    expect(btrconf.load(config)).to.be.an('object');
  });

  it('should return `config.default` if conf[NODE_ENV] is not present', function() {
    process.env.NODE_ENV = 'other';
    expect(btrconf.load(config)).to.deep.equal(config.default);
  })

  it('should return `conf[NODE_ENV]` merged with `default`', function() {
    process.env.NODE_ENV = 'development';
    expect(btrconf.load(config)).to.deep.equal({
      hello: config.default.hello,
      db: config.development.db
    });
  });

  it('should overwrite properties of `defaults` with same-named properties in `conf[NODE_ENV]`', function() {
    process.env.NODE_ENV = 'test';
    expect(btrconf.load(config).hello).to.equal(config.test.hello);
  });

  it("should return `conf[NODE_ENV]` if it's an Array", function() {
    process.env.NODE_ENV = 'test';
    config.test = [1, 2, 4, 5];
    expect(btrconf.load(config)).to.equal(config.test);
  });

  it("should return `conf[NODE_ENV]` if it's a String", function() {
    process.env.NODE_ENV = 'test';
    config.test = '1234567';
    expect(btrconf.load(config)).to.equal(config.test);
  });

  it("should return `conf[NODE_ENV]` if it's a Number", function() {
    process.env.NODE_ENV = 'test';
    config.test = 123456;
    expect(btrconf.load(config)).to.equal(config.test);
  });

  it('should deep merge nested objects', function() {
    config = {
      default: {
        db: {
          client: 'pg'
        }
      },
      development: {
        db: {
          connection: 'postgres://db.example.com:5432/devdb'
        }
      }
    };
    process.env.NODE_ENV = 'development';
    expect(btrconf.load(config)).to.deep.equal({
      db: {
        client: config.default.db.client,
        connection: config.development.db.connection
      }
    })
  });

  it('should default to environment "development"', function() {
    config = {
      default: '12345',
      test: '67890',
      development: 'abcdef',
      production: 'uvwxyz'
    };
    expect(btrconf.load(config)).to.equal(config.development);
  });

  it('should require filenames', function() {
    var filename = './fixtures/simpleConf';
    expect(btrconf.load(filename)).to.deep.equal(btrconf.load(require(filename)));
  });

});
