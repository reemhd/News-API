exports.handle404NonExistentPath = (req, res, next) => {
  res.status(404).send({message: 'Path not found'})
}

exports.handle400errors = (err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({message: 'Bad request'});
    }
    else if (err.code === '23503') {
      res.status(404).send({ message: "Article not found" });
    }
    else if (err.code === '23502') {
      res.status(400).send({message: 'Invalid request'})
    }
    else next(err);
}
exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
    } else next(err);
};


exports.handle500errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ ErrorMessage: "Internal Server Error" });
};