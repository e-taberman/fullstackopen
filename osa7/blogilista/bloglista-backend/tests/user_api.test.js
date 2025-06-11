const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const api = supertest(app);

const newUser = {
  name: "Bird Boi",
  username: "bird123",
  password: "chirpchirp543",
};

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ name: "Dog Boi", username: "dog123", passwordHash });

  await user.save();
});

test("new user was added when everything is valid", async () => {
  await api
    .post("/api/users")
    .send(newUser)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");

  const response = await api.get("/api/users");
  assert.strictEqual(response.body.length, 2);
});

describe("good error message", async () => {
  test("when password is too short", async () => {
    const badPasswordUser = {
      name: "Bird Boi",
      username: "bird123",
      password: "ch",
    };

    const response = await api
      .post("/api/users")
      .send(badPasswordUser)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    assert.match(
      response.error.text,
      /password must be at least 3 characters long/,
    );
    assert.strictEqual(response.error.status, 400);
  });
  test("when username is too short", async () => {
    const badUserNameUser = {
      name: "Bird Boi",
      username: "b",
      password: "chafsfdsfsdf34",
    };

    const response = await api
      .post("/api/users")
      .send(badUserNameUser)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    assert.match(
      response.error.text,
      /shorter than the minimum allowed length/,
    );
    assert.strictEqual(response.error.status, 400);
  });
  test("when creating a non-unique user", async () => {
    const duplicateUser = {
      name: "Bird Boi",
      username: "dog123",
      password: "chafsfdsfsdf34",
    };

    const response = await api
      .post("/api/users")
      .send(duplicateUser)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    assert.match(response.error.text, /to be unique/);
    assert.strictEqual(response.status, 400);
    assert.match(response.body.error, /unique/i);
  });
});

after(async () => {
  await mongoose.connection.close();
});
