exports.handle500errors = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ErrorMessage: 'Internal Server Error'})
}