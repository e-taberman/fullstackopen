const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

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
    genreBooks: async (root, args) => {
      if (!args.genre) {
        return Book.find({});
      }
      return Book.find({ genres: args.genre });
    },
  },
  Author: {
    name: (root) => root.name,
    born: (root) => root.born,
    id: (root) => root.id,
    bookCount: async (root) => {
      return Book.find({ author: root.id }).countDocuments();
    },
  },
  Book: {
    author: async (root) => {
      return (
        (await Author.findOne({ name: root.author })) ||
        (await Author.findById(root.author))
      );
    },
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

        await book.save();
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError(
            "Mongoose validation error: " + error.message,
            {
              extensions: { code: "BAD_USER_INPUT", invalidArgs: args },
            }
          );
        }
        pubsub.publish("PERSON_ADDED", { personAdded: person });

        return book;
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
