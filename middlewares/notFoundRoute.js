const notFoundRoute = (req, res, next) => {
    res.statusCode = 404;
    return res.json({
        error: true,
        message: "pagina non trovata"
    })
};
module.exports = notFoundRoute;