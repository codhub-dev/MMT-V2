// packages
const express = require("express");
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

// middleware handlers
const { error } = require("./utils/error");
const isAuthenticated = require("./middleware/isAuthenticated");
const isAdmin = require("./middleware/isAdmin");

// routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const trucksRoutes = require("./routes/trucks");
const incomeRoutes = require('./routes/income');
const fuelExpensesRoutes = require("./routes/fuelExpenses");
const defExpensesRoutes = require("./routes/defExpenses");
const otherExpensesRoutes = require("./routes/otherExpenses");
const totalExpensesRoutes = require("./routes/totalExpenses");
const calculateLoanRoutes = require("./routes/calculateLoan");
const driverProfilesRoutes = require("./routes/driverProfiles");
const alertsRoutes = require("./routes/alerts");
const metadata = require("./routes/metadata");
const healthRouter = require("./routes/health");

// express apps
const app = express();

const allowedOrigins = process.env.CORS_URLS ? process.env.CORS_URLS : [];

// middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, origin);
      } else {
          callback(new Error("Not allowed by CORS"));
      }
  }, // Allow specified domains
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specified headers
    credentials: true, // Allow credentials
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// routes
app.use("/api/v1/app/health", healthRouter);
app.use("/api/v1/app/auth", authRouter);
app.use("/api/v1/app/users", isAuthenticated, usersRouter);
app.use("/api/v1/app/admin", isAdmin, adminRouter);
app.use("/", indexRouter);
app.use("/api/v1/app/truck", isAuthenticated, trucksRoutes);
app.use('/api/income', incomeRoutes);
app.use("/api/v1/app/fuelExpenses", isAuthenticated, fuelExpensesRoutes);
app.use("/api/v1/app/defExpenses", isAuthenticated, defExpensesRoutes);
app.use("/api/v1/app/otherExpenses", isAuthenticated, otherExpensesRoutes);
app.use("/api/v1/app/totalExpenses", isAuthenticated, totalExpensesRoutes);
app.use("/api/v1/app/calculateLoan", isAuthenticated, calculateLoanRoutes);
app.use("/api/v1/app/driverProfiles", isAuthenticated, driverProfilesRoutes);
app.use("/api/v1/app/alerts", isAuthenticated, alertsRoutes);
app.use("/api/v1/app/metadata", isAuthenticated, metadata);

// error handler
app.use(error);

module.exports = app;
