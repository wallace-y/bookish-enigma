const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("GET /api/items", () => {
  it("responds with an object containing all items", () => {
    return request(app).get("/api/categories");
  });
  it("responds with a status code 200", () => {
    return request(app).get("/api/categories").expect(200);
  });
  it("content is JSON", () => {
    return request(app)
      .get("/api/categories")
      .expect("Content-Type", "application/json; charset=utf-8");
  });
  it("object has properties slug and description", () => {
    return request(app)
      .get("/api/categories")
      .then((res) => {
        expect(res.body[0].hasOwnProperty("slug")).toBe(true);
        expect(res.body[0].hasOwnProperty("description")).toBe(true);
      });
  });
  it("object has properties slug and description with correct var type", () => {
    return request(app)
      .get("/api/categories")
      .then((res) => {
        expect(typeof res.body[0]["slug"]).toBe("string");
        expect(typeof res.body[0]["description"]).toBe("string");
      });
  });
});

describe("Not found test", () => {
  it("Status: 404, responds with an error message when passed an invalid path", () => {
    return request(app)
      .get("/api/notAnEndpoint")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Page not found.");
      });
  });
  it("Status 400, bad request - invalid ID", () => {
    return request(app)
      .get("/api/reviews/bananas")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request.");
      });
  });
  it("Status 404, resource not found - invalid ID", () => {
    return request(app)
      .get("/api/reviews/999999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Resource not found.");
      });
  });
});

describe("GET /api - return ALL api endpoints", () => {
  it("returns a status code of 200", () => {
    return request(app).get("/api").expect(200);
  });
  it("content is JSON", () => {
    return request(app)
      .get("/api")
      .expect("Content-Type", "application/json; charset=utf-8");
  });
  it("body of response is as expected", () => {
    // test the contents of the file
    return request(app)
      .get("/api")
      .then((res) => {
        expect(res.body).toEqual({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/categories": {
            description: "serves an array of all categories",
            queries: [],
            exampleResponse: {
              categories: [
                {
                  description:
                    "Players attempt to uncover each other's hidden role",
                  slug: "Social deduction",
                },
              ],
            },
          },
          "GET /api/reviews/:review_id": {
            description: "serves an object of a single array",
            queries: [],
            exampleResponse: {
              review: [
                {
                  review_id: "1",
                  title: "Agricola",
                  category: "euro game",
                  designer: "Uwe Rosenberg",
                  owner: "mallionaire",
                  review_body: "Farmyard fun!",
                  review_img_url:
                    "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
                  created_at: "2021-01-18T10:00:20.514Z",
                  votes: "1",
                },
              ],
            },
          },
          "GET /api/reviews": {
            description: "serves an array of all reviews",
            queries: [],
            exampleResponse: {
              categories: [
                {
                  review_id: 13,
                  owner: "mallionaire",
                  title: "Settlers of Catan: Don't Settle For Less",
                  category: "social deduction",
                  review_img_url:
                    "https://images.pexels.com/photos/1153929/pexels-photo-1153929.jpeg?w=700&h=700",
                  created_at: "1970-01-10T02:08:38.400Z",
                  votes: 16,
                  designer: "Klaus Teuber",
                  comment_count: 0,
                },
              ],
            },
          },
          "POST /api/reviews/:review_id/comments": {
            description: "posts a new comment to a specified review",
            queries: [],
            exampleResponse: {
              comment: [
                {
                  comment_id: 7,
                  body: "I need more beans...",
                  review_id: 1,
                  author: "mallionaire",
                  votes: 0,
                  created_at: "2023-05-11T08:58:37.498Z",
                },
              ],
            },
          },
        });
      });
  });
  it("has the correct number of keys - ie one for each endpoint available", () => {
    return request(app)
      .get("/api")
      .then((res) => {
        expect(Object.keys(res.body).length).toEqual(5);
      });
  });
});

describe("GET /api/reviews/:id - get review by ID", () => {
  it("returns a status code of 200", () => {
    return request(app).get("/api/reviews/1").expect(200);
  });
  it("is correctly formatted as JSON", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect("Content-Type", "application/json; charset=utf-8");
  });
  it("Response has the correct properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .then((res) => {
        const review = res.body.review[0];
        expect(review).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: "Agricola",
            category: "euro game",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_body: "Farmyard fun!",
            review_img_url:
              "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 1,
          })
        );
      });
  });
});

describe("GET /api/reviews - get ALL reviews", () => {
  it("returns a status code of 200", () => {
    return request(app).get("/api/reviews").expect(200);
  });
  it("content is JSON", () => {
    return request(app)
      .get("/api/reviews")
      .expect("Content-Type", "application/json; charset=utf-8");
  });
  it("Response has the correct properties", () => {
    return request(app)
      .get("/api/reviews")
      .then((res) => {
        //get all reviews
        const review = res.body.reviews;
        review.forEach((review) => {
          expect(review.hasOwnProperty("owner")).toBe(true);
          expect(review.hasOwnProperty("title")).toBe(true);
          expect(review.hasOwnProperty("review_id")).toBe(true);
          expect(review.hasOwnProperty("category")).toBe(true);
          expect(review.hasOwnProperty("review_img_url")).toBe(true);
          expect(review.hasOwnProperty("created_at")).toBe(true);
          expect(review.hasOwnProperty("votes")).toBe(true);
          expect(review.hasOwnProperty("designer")).toBe(true);
          expect(review.hasOwnProperty("comment_count")).toBe(true);
          expect(review.hasOwnProperty("review_body")).toBe(false);
        });
      });
  });
  it("Response has the correct properties TYPES", () => {
    return request(app)
      .get("/api/reviews")
      .then((res) => {
        //get all reviews
        const review = res.body.reviews;
        review.forEach((review) => {
          expect(typeof review["owner"]).toBe("string");
          expect(typeof review["title"]).toBe("string");
          expect(typeof review["review_id"]).toBe("number");
          expect(typeof review["category"]).toBe("string");
          expect(typeof review["review_img_url"]).toBe("string");
          expect(typeof review["created_at"]).toBe("string");
          expect(typeof review["votes"]).toBe("number");
          expect(typeof review["designer"]).toBe("string");
          expect(typeof review["comment_count"]).toBe("number");
        });
      });
  });
  it("Sorts the response by review_id as a default", () => {
    return request(app)
      .get("/api/reviews")
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("review_id");
      });
  });
  it("Sorts the response by a given input (date), DESC", () => {
    return request(app)
      .get("/api/reviews?sort_by=created_at")
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at");
        expect(res.body.reviews).toBeSorted({ descending: true });
      });
  });
  it("400 - invalid sort query", () => {
    return request(app)
      .get("/api/reviews?sort_by=potato")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid sort query.");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  const newComment = {
    username: "mallionaire",
    body: "I need more beans...",
  };
  it("returns a status code of 201", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201);
  });
  it("is correctly formatted as JSON", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect("Content-Type", "application/json; charset=utf-8");
  });
  it("its responds with the comment object", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .then((res) => {
        const comment = res.body.comment.rows[0];
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: 7,
            body: "I need more beans...",
            review_id: 1,
            author: "mallionaire",
            votes: 0,
          })
        );

        expect(res.body.comment.rows[0].hasOwnProperty("created_at")).toBe(
          true
        );
      });
  });
  it("missing username: handles a malformed body as a 400 error", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ body: "I need more beans..." })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Malformed body.");
      });
  });
  it("missing body: handles a malformed body as a 400 error", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "mallionaire" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Malformed body.");
      });
  });
  it("Status 400, bad request - invalid ID", () => {
    return request(app)
      .post("/api/reviews/bananas/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request.");
      });
  });
  it("Status: 404, responds with an error message when passed an invalid path", () => {
    return request(app)
      .post("/api/reviews/999999/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Resource not found.");
      });
  });
  it("Status: 404. Username is valid but doesn't exist.", () => {
    const thisIsANewComment = {
      username: "potatoMan",
      body: "What is taters???",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(thisIsANewComment)
      .expect((res) => {
        expect(res.body.msg).toBe("Resource not found.");
      });
  });
});
