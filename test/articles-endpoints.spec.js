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


  // for get /articles 
  describe(`GET /articles`, () => {
    context(`Given no articles`, () => {
      it(`GET /articles : responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/articles')
          .expect(200, [])
      })
    })

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

    // for get /articles with ID
    describe(`GET /articles/:article_id`, () => {
      context(`Given no articles`, () => {
        it(`responds with 404`, () => {
          const articleId = 123456
          return supertest(app)
            .get(`/articles/${articleId}`)
            .expect(404, { error: { message: `Article doesn't exist` } })
        })
      })
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

    // post section
    describe.only(`POST /articles`, () => {
      context('Given Post of an articles to the database', () => {
        it(`creates an article, responding with 201 and the new article`, function () {
          const newArticle = {
            title: 'Test new article',
            style: 'Listicle',
            content: 'Test new article content...'
          }
          return supertest(app)
            .post('/articles')
            .send(newArticle)
            .expect(201)
            .expect(res => {
              expect(res.body.title).to.eql(newArticle.title)
              expect(res.body.style).to.eql(newArticle.style)
              expect(res.body.content).to.eql(newArticle.content)
              expect(res.body).to.have.property('id')
              expect(res.headers.location).to.eql(`/articles/${res.body.id}`)
            })
            .then(postRes =>
              supertest(app)
                .get(`/articles/${postRes.body.id}`)
                .expect(postRes.body)
            )
        })
      })
    })

  })
})
