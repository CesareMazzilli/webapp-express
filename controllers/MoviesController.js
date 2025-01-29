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

    const sql = `SELECT * FROM movies WHERE slug = ?`;
    const reviewsSql = `
    SELECT reviews.* 
    FROM reviews
    JOIN movies
    ON movies.id = reviews.movie_id
    WHERE movies.slug = ?`;

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

const storeReview = (req, res, next) => {
    const movieId = req.params.id;
    const { name, vote, text } = req.body;

    if (isNaN(vote) || vote < 0 || vote > 5) {
        return res.status(400).json({
            status: "fail",
            message: "Il voto inserito deve essere tra 0 e 5"

        })
    };
    if (name.length <= 3) {
        return res.status(400).json({
            status: "fail",
            message: "Il nome deve essere più lungo di 3 caratteri"

        })
    };
    if (text && text.length > 0 && text.length < 5) {
        return res.status(400).json({
            status: "fail",
            message: "Il testo deve essere lungo almeno 6 caratteri"

        })
    };

    const movieSql = `
    SELECT * 
    FROM movies
    WHERE id = ?
    `;

    connection.query(movieSql, [movieId], (err, results) => {
        if (err) {
            return next(new Error("Errore interno del server"));
        }
        if (results.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Film non trovato",
            });
        }

        const sql = `
        INSERT INTO reviews(movie_id, name, vote, text)
        VALUES (?, ?, ?, ?);
      `;

        connection.query(sql, [movieId, name, vote, text], (err, results) => {
            if (err) {
                return next(new Error(err.message));
            }

            res.status(201).json({
                status: "success",
                message: "Recensione aggiunta",
            });
        });
    });


};
const store = (req, res, next) => {
   
    const imageName = req.file.filename;
    const { title, author, genre, abstract } = req.body;
    const slug = slugify(title, {
        lower: true,
        strict: true,
    });

    const sql = `
      INSERT INTO books(slug, title, director, genre, release_year, abstract, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(sql, [slug, title, author, genre, release_year, abstract, imageName], (err, results) => {
        if (err) {
            next(new Error(err.message));
        }

        return res.status(201).json({
            status: "success",
            message: "Il film è stato salvato",
        });
    })


};

module.exports = {
    index,
    show,
    storeReview,
    store
};