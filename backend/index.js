import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"


// routes import
import todoRoutes from "./routes/todo.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
// app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",  // timro frontend origin
  credentials: true,                 // cookies/credentials allow garna
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, { useUnifiedTopology: true });
    console.log("✅ MongoDB connected...");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// Routes
app.use("/todo", todoRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Todo API is running...");
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
