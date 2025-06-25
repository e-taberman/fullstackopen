const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v4: uuid } = require("uuid");
require("dotenv").config();
const url = process.env.MONGODB_URI;
const mongoose = require("mongoose");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Connection to MangoDB failed: ", error.message);
    process.exit(1);
  });

const typeDefs = `
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
    me: User
    allUsers: [User!]
  },
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  },
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  },
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  },
  type Token {
    value: String!
  },
  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]
    ): Book,
    editAuthor(name: String, setBornTo: Int): Author,
    createUser(
      username: String!
      favoriteGenre: String!
    ): User,
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return await Book.find({});
      }
      if (args.author && !args.genre) {
        return await Book.find({ author: args.author });
      }
      if (args.genre && !args.author) {
        return await Book.find({ genres: args.genre });
      }
      if (args.genre && args.author) {
        return await Book.find({ genres: args.genre, author: args.author });
      }
      return books;
    },

    allAuthors: async () => Author.find({}),
    allUsers: async () => User.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    name: (root) => root.name,
    born: (root) => root.born,
    id: (root) => root.id,
    bookCount: (root) => async (root) =>
      Book.find({ author: root.id }).countDocuments(),
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      try {
        let author = await Author.findOne({ name: args.author });
        if (!author) {
          author = new Author({ name: args.author });
        }
        await author.save();

        const book = new Book({ ...args, author });

        return await book.save();
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError(
            "Mongoose validation error: " + error.message,
            {
              extensions: { code: "BAD_USER_INPUT", invalidArgs: args },
            }
          );
        }
      }
    },
    editAuthor: async (root, args, context) => {
      try {
        if (!context.currentUser) {
          throw new GraphQLError("Unauthorized", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        const author = await Author.findOne({ name: args.name });

        if (!author) return null;

        author.born = args.setBornTo;

        return await author.save();
      } catch (error) {
        throw new GraphQLError("Mongoose validation error: " + error.message, {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args },
        });
      }
    },
    createUser: async (root, args) => {
      try {
        const user = await new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
        });

        return await user.save();
      } catch (error) {
        throw new GraphQLError("Creating user failed: " + error.message, {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Invalid username or password: ", {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
