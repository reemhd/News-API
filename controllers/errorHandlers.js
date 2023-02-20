
exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.message) {
        // console.log(err);
        res.status(err.status).send({ message: err.message });
    } else next(err);
};

exports.handle500errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ ErrorMessage: "Internal Server Error" });
};