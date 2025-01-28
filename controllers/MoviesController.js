const connection = require("../data/db");


const index = (req, res, next) => {
    const filters = req.query;

    let sql = `SELECT * FROM movies`;

    let params = [];

    if (filters.search) {
        sql += `
        WHERE title LIKE ?;
        `;

        params.push(`%${filters.search}%`);

    };
    console.log(sql);
    
    connection.query(sql, params, (err, movies) => {
        if (err) {
            return next(new Error(err.message))
        } else {
            return res.status(200).json({
                status: "success",
                data: movies
            })
        };
    });

};

const show = (req, res, next) => {
    const slug = req.params.slug;
    console.log(slug);
    
    const sql = `SELECT * FROM movies WHERE slug = ?`;//prima query
    const reviewsSql = `
    SELECT reviews.* 
    FROM reviews
    JOIN movies
    ON movies.id = reviews.movie_id
    WHERE movies.slug = ?`;//seconda query

    connection.query(sql, [slug], (err, movies) => {
        if (err) {
            return next(new Error(err.message))
        };
        if (movies.length === 0) {
            return res.status(404).json({
                message: "film non trovato"
            })
        } else {
            connection.query(reviewsSql, [slug], (err, reviews) => {
                if (err) {
                    return next(new Error(err.message))
                };

                return res.status(200).json({
                    status: "success",
                    data: {
                        ...movies[0],
                        reviews
                    }
                })
            })
        }
    })

};

module.exports = {
    index,
    show
};