const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  const { reviewId } = request.params;
  const review = await service.read(reviewId);
  if (review) {
    response.locals.review = review;
    return next();
  }
  const error = new Error("Review cannot be found.");
  error.status = 404;
  return next(error);
}

async function destroy(request, response) {
  const { reviewId } = request.params;
  await service.destroy(reviewId);
  response.sendStatus(204);
}

async function list(request, response) {
  // TODO: Write your code here

  response.json({  });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  const { reviewId } = request.params;
  const { data: { score, content } = {} } = request.body;

  const updatedReview = {
    ...response.locals.review,
    score,
    content,
    review_id: reviewId,
  };

  const data = await service.update(updatedReview);
  response.json({ data });
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
