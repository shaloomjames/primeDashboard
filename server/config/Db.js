// const mongoose = require("mongoose");

// const ConnectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MongoDB_Connection_String,);
//     console.log(
//       `server is connected to ${conn.connection.db.databaseName} database`
//     );
//   } catch (error) {
//     console.log(`Db Connection Error ${error}`);
//   }
// };

// module.exports = ConnectDB;

const mongoose = require("mongoose");

// Function to connect to MongoDB with retry logic
const ConnectDB = async () => {
  const uri = process.env.MongoDB_Connection_String;
  const options = {
    maxPoolSize: 10,              // Increase connection pool size
    serverSelectionTimeoutMS: 5000, // Timeout for server selection (5 seconds)
    socketTimeoutMS: 45000,       // Timeout for socket inactivity (45 seconds)
    connectTimeoutMS: 10000,      // Timeout for initial connection (10 seconds)
    // Optional: Enable auto-reconnect (enabled by default in newer Mongoose versions)
    // bufferCommands: false,     // Disable buffering if connection drops (optional)
  };

  let retries = 5; // Number of retry attempts
  let delay = 2000; // Initial delay between retries (2 seconds)

  while (retries > 0) {
    try {
      console.log("Attempting to connect to MongoDB...");
      const conn = await mongoose.connect(uri, options);
      console.log(
        `Server connected to ${conn.connection.db.databaseName} database`
      );
      // Log connection details for debugging
      console.log(`Connected to MongoDB at ${conn.connection.host}:${conn.connection.port}`);
      return; // Exit the function on successful connection
    } catch (error) {
      console.error(`DB Connection Error: ${error.message}`);
      retries -= 1;
      if (retries === 0) {
        console.error("All retry attempts failed. Exiting...");
        process.exit(1); // Exit the app if all retries fail
      }
      console.log(`Retrying connection (${retries} attempts left)...`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
      delay *= 2; // Exponential backoff (2s, 4s, 8s, etc.)
    }
  }
};

// Handle connection events for debugging
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose disconnected from DB");
});

mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err.message}`);
});

module.exports = ConnectDB;