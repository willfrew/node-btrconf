module.exports = {
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
