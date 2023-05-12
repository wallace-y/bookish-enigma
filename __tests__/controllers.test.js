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

describe("Not found tests", () => {
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
  it("Status 400, bad request - invalid ID", () => {
    return request(app)
      .get("/api/reviews/bananas/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request.");
      });
  });
  it("Status 404, resource not found - invalid ID", () => {
    return request(app)
      .get("/api/reviews/999999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Review not found.");
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
  it("has the correct number of keys - ie one for each endpoint available", () => {
    return request(app)
      .get("/api")
      .then((res) => {
        expect(Object.keys(res.body).length).toEqual(10);
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
  it("Response has the correct properties where there are no comments", () => {
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
            comment_count: 0,
          })
        );
      });
  });
  it("Response has the correct properties where there are are comments", () => {
    return request(app)
      .get("/api/reviews/2")
      .then((res) => {
        const review = res.body.review[0];
        expect(review).toEqual(
          expect.objectContaining({
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
            comment_count: 3,
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
  it("Sorts the response by created_at as default", () => {
    return request(app)
      .get("/api/reviews")
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("Sorts the response date, DESC if not specified", () => {
    return request(app)
      .get("/api/reviews?sort_by=created_at")
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("Sorts the response date, ASC if specified", () => {
    return request(app)
      .get("/api/reviews?sort_by=created_at&order=ASC")
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at");
        expect(res.body.reviews).toBeSorted({ ascending: true });
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
  it("400 - invalid order query", () => {
    return request(app)
      .get("/api/reviews?order=potato")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid order query.");
      });
  });
  it("404 - non-existent category", () => {
    return request(app)
      .get("/api/reviews?category=potato")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Category not found.");
      });
  });
  it("200 - accepts valid category query", () => {
    return request(app).get("/api/reviews?category=dexterity").expect(200);
  });
  it("200 - accepts valid category query, but there are no reviews so returns empty array", () => {
    return request(app)
      .get("/api/reviews?category=children's+games")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toEqual([]);
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  it("returns a status code of 200", () => {
    return request(app).get("/api/reviews/1/comments").expect(200);
  });
  it("content is JSON", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect("Content-Type", "application/json; charset=utf-8");
  });
  it("Returns a status code 200 - with an empty array (no comments)", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toEqual([]);
      });
  });
  it("Response has the correct properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .then((res) => {
        //get all reviews
        const comments = res.body.comments;
        if (comments.length > 0) {
          comments.forEach((comment) => {
            expect(comment.hasOwnProperty("comment_id")).toBe(true);
            expect(comment.hasOwnProperty("votes")).toBe(true);
            expect(comment.hasOwnProperty("created_at")).toBe(true);
            expect(comment.hasOwnProperty("author")).toBe(true);
            expect(comment.hasOwnProperty("body")).toBe(true);
            expect(comment.hasOwnProperty("review_id")).toBe(true);
          });
        }
      });
  });
  it("Response has the correct properties types", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .then((res) => {
        //get all reviews
        const comments = res.body.comments;
        if (comments.length > 0) {
          comments.forEach((comment) => {
            expect(typeof comment["comment_id"]).toBe("number");
            expect(typeof comment["votes"]).toBe("number");
            expect(typeof comment["created_at"]).toBe("string");
            expect(typeof comment["author"]).toBe("string");
            expect(typeof comment["body"]).toBe("string");
            expect(typeof comment["review_id"]).toBe("number");
          });
        }
      });
  });
  it("Should return the correct response shape and properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .then((res) => {
        const comments = res.body.comments;
        expect(comments).toEqual(
          expect.objectContaining([
            {
              comment_id: 1,
              votes: 16,
              created_at: "2017-11-22T12:43:33.389Z",
              author: "bainesface",
              body: "I loved this game too!",
              review_id: 2,
            },
            {
              comment_id: 4,
              votes: 16,
              created_at: "2017-11-22T12:36:03.389Z",
              author: "bainesface",
              body: "EPIC board game!",
              review_id: 2,
            },
            {
              comment_id: 5,
              votes: 13,
              created_at: "2021-01-18T10:24:05.410Z",
              author: "mallionaire",
              body: "Now this is a story all about how, board games turned my life upside down",
              review_id: 2,
            },
          ])
        );
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

describe("PATCH  /api/reviews/:review_id - update id", () => {
  const update = { inc_votes: 1 };
  it("Respond with a 202 - accepted update", () => {
    return request(app).patch("/api/reviews/1").send(update).expect(202);
  });
  it("Responds with content of the correct type", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send(update)
      .expect("Content-Type", "application/json; charset=utf-8");
  });
  it("Responds with an object of the correctly updated item", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send(update)
      .then((res) => {
        const review = res.body.review;
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
            votes: 2,
          })
        );
      });
  });
  it("DOES NOT update the DB when no parameters are provided", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send()
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request.");
      });
  });
  it("Gives a BAD REQUEST status and message when the update object is incomplete", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ theWrongThing: 1 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request.");
      });
  });
  it("Gives a resource not found status and message when the id is an invalid number", () => {
    return request(app)
      .patch("/api/reviews/999999")
      .send(update)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Resource not found.");
      });
  });
  it("Gives a resource not found status and message when the id is not a number", () => {
    return request(app)
      .patch("/api/reviews/bananas")
      .send(update)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request.");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("😊 responds with a 204 message", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  it("😭 Status 400, bad request - invalid ID", () => {
    return request(app)
      .delete("/api/comments/bananas")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request.");
      });
  });
  it("😭 Status: 404, responds with an error message when passed an invalid path", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Comment not found.");
      });
  });
});

describe("GET /api/users", () => {
  it("responds with a status code 200", () => {
    return request(app).get("/api/users").expect(200);
  });
  it("content is JSON", () => {
    return request(app)
      .get("/api/users")
      .expect("Content-Type", "application/json; charset=utf-8");
  });
  it("object has properties slug and description", () => {
    return request(app)
      .get("/api/users")
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining([
            {
              username: "mallionaire",
              name: "haz",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            },
            {
              username: "philippaclaire9",
              name: "philippa",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
            },
            {
              username: "bainesface",
              name: "sarah",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
            },
            {
              username: "dav3rid",
              name: "dave",
              avatar_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            },
          ])
        );
      });
  });
  it("object has properties with correct var type", () => {
    return request(app)
      .get("/api/users")
      .then((res) => {
        res.body.forEach((user) => {
          expect(typeof user.username).toEqual("string");
          expect(typeof user.name).toEqual("string");
          expect(typeof user.avatar_url).toEqual("string");
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  it("responds with a status code 200", () => {
    return request(app).get("/api/users/mallionaire").expect(200);
  });
  it("content is JSON", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect("Content-Type", "application/json; charset=utf-8");
  });
  it("object has properties slug and description", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .then((res) => {
        expect(res.body.user).toEqual(
          expect.objectContaining({
            username: "mallionaire",
            name: "haz",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          })
        );
      });
  });
  it("responds with a status code 404 where username doesn't exists", () => {
    return request(app)
      .get("/api/users/notAusername")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("User not found.");
      });
  });
});
