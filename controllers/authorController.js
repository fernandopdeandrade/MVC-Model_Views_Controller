const Author = require('../models/Author');

const listAuthors = (_req, res) => {
  Author.getAll()
    .then((authors) => {
      return res.status(200).render('authors/index', { authors });
    })
    .catch((err) => {
      console.log(err);
    });
}

const showAuthor = (req, res) => {
  const { id } = req.params;

  Author.findById(id)
    .then((author) => {
      if (!author) return res.status(404).render('404');

      return res.status(200).render('authors/show', { author });
    })
    .catch((err) => {
      console.log(err);
    });
}

const newAuthor = (req, res) => {
  return res.render('authors/new', { message: null })
}

const createAuthor = (req, res) => {
  const { firstName, middleName, lastName, birthday, nationality } = req.body;

  if (!Author.isValid(firstName, middleName, lastName)) {
    res.render('authors/new', { message: 'Dados inválidos' });
  }
  
  Author.create(firstName, middleName, lastName, birthday, nationality)
    .then((author) => {
      res.redirect(`/authors/${author.id}`);
    })
    .catch((err) => {
      console.log(err);
    });
}

const editAuthor = (req, res) => {
  const { id } = req.params;

  Author.findById(id)
    .then((author) => {
      res.status(200).render('authors/edit', { author });
    })
    .catch((err) => {
      console.log(err);
    });
}

const updateAuthor = (req, res) => {
  const { id } = req.params;
  const { firstName, middleName, lastName, birthday, nationality } = req.body;

    Author.update(id, firstName, middleName, lastName, birthday, nationality)
      .then(() => {
        res.redirect(`/authors/${id}`);
      })
      .catch((err) => {
        console.log(err);
      });
}

const selectDeleteAuthor = (req, res) => {
  deleteAuthor(req, res);
}

const deleteAuthor = (req, res) => {
  const { id } = req.params;

  Author.exclude(Number(id))
    .then(() => {
      res.redirect('/authors');
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  listAuthors,
  showAuthor,
  newAuthor,
  createAuthor,
  editAuthor,
  updateAuthor,
  selectDeleteAuthor,
  deleteAuthor,
}