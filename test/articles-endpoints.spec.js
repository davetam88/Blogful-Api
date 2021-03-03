const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeArticlesArray } = require('./articles.fixtures')

describe.only('Articles Endpoints', function () {

  before('BEFORE: make knex instance', () => {

    // TEST_DB_URL = "postgresql://dunder_mifflin@localhost/blogful-test"
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })

    app.set('db', db)
  })


  after('AFTER: disconnect from db', () => db.destroy())

  before('BEFORE: clean the table', () => {
    db('blogful_articles').truncate()
  })

  afterEach('cleanup', () => db('blogful_articles').truncate())

  // get /articles 
  describe(`GET /articles`, () => {
    context('Given there are articles in the database', () => {
      const testArticles = makeArticlesArray()

      beforeEach('GET /articles : insert articles', () => {
        return db
          .into('blogful_articles')
          .insert(testArticles)
      })

      it('GET /articles : responds with 200 and all of the articles', () => {
        return supertest(app)
          .get('/articles')
          .expect(200, testArticles)
      })
    })

    // get /articles with ID
    describe(`GET /articles/:article_id`, () => {
      context('Given there are articles in the database', () => {
        const testArticles = makeArticlesArray()

        beforeEach('GET /articles(ID) : insert articles', () => {
          return db
            .into('blogful_articles')
            .insert(testArticles)
        })

        it('GET /articles(ID) : responds with 200 and the specified article', () => {
          const articleId = 2
          const expectedArticle = testArticles[articleId - 1]
          return supertest(app)
            .get(`/articles/${articleId}`)
            .expect(200, expectedArticle)
        })
      })
    })
  })
})
