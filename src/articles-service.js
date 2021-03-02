const ArticlesService = {
  getAllArticles() {
    return 'all the articles!!'
  }
}
module.exports = ArticlesService

  // << < final solution for dependency cycle : Making knex instance an argument of every method on the service object