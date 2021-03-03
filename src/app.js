require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const ArticlesService = require('./articles-service')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

// GET /articles endpoint vai  ArticlesService
app.get('/articles', (req, res, next) => {
  const knexInstance = req.app.get('db')
  ArticlesService.getAllArticles(knexInstance)
    .then(articles => {
      res.json(articles)
    })
    .catch(next)
})

app.get('/articles/:article_id', (req, res, next) => {
  const knexInstance = req.app.get('db')
  ArticlesService.getById(knexInstance, req.params.article_id)
    .then(article => {
      if (!article)
      {
        return res.status(404).json({
          error: { message: `Article doesn't exist` }
        })
      }
      // replace next line with code 1 below if there is date issue with window OS.
      res.json(article)
    })
    .catch(next)
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (process.env.NODE_ENV === 'production')
  {
    response = { error: { message: 'server error' } }
  } else
  {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app

// code 1 
// res.json({
//   id: article.id,
//   title: article.title,
//   style: article.style,
//   content: article.content,
//   date_published: new Date(article.date_published),
// })
