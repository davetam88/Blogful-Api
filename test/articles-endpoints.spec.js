// 18.15 - Now we should have a passing test when running npm test! Let's add an .only to the top level describe block so that we're only running this test file whilst working on it.

const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')


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

  context('Given there are articles in the database', () => {
    const testArticles = [
      {
        id: 1,
        date_published: '2029-01-22T16:28:32.615Z',
        title: 'First test post!',
        style: 'How-to',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
      },
      {
        id: 2,
        date_published: '2100-05-22T16:28:32.615Z',
        title: 'Second test post!',
        style: 'News',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
      },
      {
        id: 3,
        date_published: '1919-12-22T16:28:32.615Z',
        title: 'Third test post!',
        style: 'Listicle',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
      },
      {
        id: 4,
        date_published: '1919-12-22T16:28:32.615Z',
        title: 'Fourth test post!',
        style: 'Story',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum molestiae accusamus veniam consectetur tempora, corporis obcaecati ad nisi asperiores tenetur, autem magnam. Iste, architecto obcaecati tenetur quidem voluptatum ipsa quam?'
      },
    ];

    // test 1  :  GET /articles all - work
    beforeEach('BEFOREEACH:  insert articles', () => {
      return db
        .into('blogful_articles')
        .insert(testArticles)
    })

    // test 2  :  GET /articles all - work
    it('GET /articles responds with 200 and all of the articles', () => {
      return supertest(app)
        .get('/articles')
        .expect(200, testArticles)
    })

    // test 3 : get /articles with ID
    it('GET /articles/:article_id responds with 200 and the specified article', () => {

      const articleId = 2
      const expectedArticle = testArticles[articleId - 1]

      return supertest(app)
        .get(`/articles/${articleId}`)
        .expect(2000, expectedArticle)
    })
  })
})
