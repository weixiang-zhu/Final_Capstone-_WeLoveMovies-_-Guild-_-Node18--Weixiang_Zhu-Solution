const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
    return db("movies").select("*").where({ movie_id }).first();
}

async function listTheaters(movie_id) {
    return db("theaters")
        .join("movies_theaters", "theaters.theater_id", "movies_theaters.theater_id")
        .select("theaters.*", "movies_theaters.is_showing", "movies_theaters.movie_id")
        .where({ "movies_theaters.movie_id": movie_id, "movies_theaters.is_showing": true });
}

async function listReviews(movie_id) {
    const reviews = await db("reviews")
        .select("reviews.*", "critics.*")
        .join("critics", "reviews.critic_id", "critics.critic_id")
        .where({ "reviews.movie_id": movie_id });

    return reviews.map((review) => {
        return {
            review_id: review.review_id,
            content: review.content,
            score: review.score,
            created_at: review.created_at,
            updated_at: review.updated_at,
            critic_id: review.critic_id,
            movie_id: review.movie_id,
            critic: {
                critic_id: review.critic_id,
                preferred_name: review.preferred_name,
                surname: review.surname,
                organization_name: review.organization_name,
                created_at: review["critics.created_at"],
                updated_at: review["critics.updated_at"],
            },
        };
    });
}

module.exports = {
    list,
    read,
    listTheaters,
    listReviews,
};