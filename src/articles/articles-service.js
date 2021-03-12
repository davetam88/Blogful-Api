const ArticlesService = {
  insertArticle(db, data) {
    return db('blogful_articles')
      .insert(data)
      .returning('*')
      .then(rows => rows[0]);
  },

  getAllArticles(db) {
    return db('blogful_articles')
      .select('*');
  },

  getById(db, id) {
    return db('blogful_articles')
      .select('*')
      .where({ id })
      .first();
  },

  updateArticle(db, id, data) {
    return db('blogful_articles')
      .where({ id })
      .update(data);
  },

  deleteArticle(db, id) {
    return db('blogful_articles')
      .where({ id })
      .delete();
  },
};

module.exports = ArticlesService;


