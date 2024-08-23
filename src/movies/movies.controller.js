const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  const { movieId } = request.params;
  const movie = await service.read(movieId);
  if (movie) {
    response.locals.movie = movie;
    return next();
  }
  const error = new Error("Movie cannot be found.");
  error.status = 404;
  return next(error);
}

async function read(request, response) {
  response.json({ data: response.locals.movie });
}

async function list(request, response) {
  const { is_showing } = request.query;
  const movies = await service.list(is_showing);
  response.json({ data: movies });
}

async function listTheaters(request, response) {
  const { movieId } = request.params;
  const theaters = await service.listTheaters(movieId);
  response.json({ data: theaters });
}

async function listReviews(request, response) {
  const { movieId } = request.params;
  const reviews = await service.listReviews(movieId);
  response.json({ data: reviews });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  listTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheaters)],
  listReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews)],
};
