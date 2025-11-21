const { default: mongoose } = require("mongoose");
const DefExpense = require("../models/defExpense-model");
// const Truck = require("../models/truck-model");
const moment = require("moment");
const ExcelJS = require("exceljs");
const TruckExpense = require("../models/truck-model");
const logger = require("../utils/logger");

// Controller to add a new def filling record
const addDefExpense = async (req, res) => {
  try {
    const { truckId, addedBy, date, currentKM, litres, cost, note } = req.body;

    logger.info("Adding new DEF expense", { truckId, addedBy, date, currentKM, litres, cost });

    const newDefExpense = new DefExpense({
      truckId,
      addedBy,
      date,
      currentKM,
      litres,
      cost,
      note,
    });

    const savedDefExpense = await newDefExpense.save();
    logger.info("DEF expense added successfully", { defExpenseId: savedDefExpense._id });
    res.status(201).json(savedDefExpense);
  } catch (error) {
    logger.error("Error adding def expenses", { error: error.message, stack: error.stack });
    console.error("Error adding def expenses:", error);
    res.status(500).json({ message: "Failed to add def expenses" });
  }
};

const updateDefExpenseByTruckId = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      truckId,
      addedBy,
      date,
      currentKM,
      litres,
      cost,
      note,
    } = req.body;
    const file = req.file;

    logger.info("Updating DEF expense", { id, truckId, addedBy });

    // Validate the fuel ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn("Invalid DEF expense ID", { id });
      return res.status(400).json({ message: "Invalid def expense ID" });
    }
    

    // Update the invoice URL if a new file is provided
    let invoiceURL = req.body.invoiceURL;
    if (file) {
      invoiceURL = await uploadInvoice(file);
    }

    // Update the def
    const updatedDef = await DefExpense.findByIdAndUpdate(
      { _id: id },
      {
        truckId,
        addedBy,
        date,
        currentKM,
        litres,
        cost,
        note,
      },
      { new: true } // Return the updated document
    );

    if (!updatedDef) {
      logger.warn("DEF expense not found for update", { id });
      return res.status(404).json({ message: "Def expense not found" });
    }

    // Fetch all defExpenses for the user after the update
    // const defExpenses = await getAllDefByTruckHelper(addedBy);

    logger.info("DEF expense updated successfully", { id });
    // Send the response with all defExpenses (including the updated one)
    res.status(200).json({
      message: "Def expense updated successfully",
      defExpense:updatedDef,
    });
  } catch (error) {
    logger.error("Error updating def expense", { error: error.message, stack: error.stack });
    console.error("Error updating def expense:", error);
    res
      .status(500)
      .json({ message: "Failed to update def expense", error: error.message });
  }
};

const getAllDefExpensesByTruckId = async (req, res) => {
  try {
    const { truckId, selectedDates } = req.query;

    logger.info("Fetching DEF expenses by truck ID", { truckId, selectedDates });

    if (!truckId) {
      logger.warn("Truck ID is missing in request");
      return res.status(400).json({ message: "Truck ID is required" });
    }

    // Ensure the dates are in UTC and set the time to 00:00:00 to avoid time zone issues
    const startDate = selectedDates
      ? moment.utc(selectedDates[0]).startOf("day").toDate()
      : null;
    const endDate = selectedDates
      ? moment.utc(selectedDates[1]).endOf("day").toDate()
      : null;

    // Build the query filter
    const query = { truckId };

    if (startDate && endDate) {
      if (startDate.toDateString() === endDate.toDateString()) {
        // If startDate and endDate are the same, match that specific date
        query.date = {
          $eq: startDate,
        };
      } else {
        // Match the range between startDate and endDate
        query.date = { $gte: startDate, $lte: endDate };
      }
    }

    // Fetch all fuel expenses for the given truckId and date range
    const defExpenses = await DefExpense.find(query).sort({ date: 1 });

    if (defExpenses.length === 0) {
      logger.info("No DEF expenses found for truck", { truckId, selectedDates });
      return res.status(404).json({
        message: "No def expenses found for this truck in the given date range",
      });
    }

    const totalExpense = defExpenses.reduce(
      (sum, expense) => sum + expense.cost,
      0
    );

    const formattedDefExpenses = defExpenses.map((expense, index) => {
      // Format the date to 'YYYY-MM-DD'
      // const date = new Date(expense.date);
      // const formattedDate = date.toISOString().split("T")[0];

      const date = new Date(expense.date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      // Calculate mileage
      const range =
        index > 0 ? expense.currentKM - defExpenses[index - 1].currentKM : 0;

      return {
        ...expense.toObject(), // Convert Mongoose document to plain object
        date: formattedDate,
        range,
        key: index,
      };
    });
    logger.info("DEF expenses retrieved successfully", { truckId, count: defExpenses.length, totalExpense });
    res.status(200).json({
      expenses: formattedDefExpenses,
      totalExpense,
    });
  } catch (error) {
    logger.error("Error retrieving def expenses", { error: error.message, stack: error.stack });
    console.error("Error retrieving def expenses:", error);
    res.status(500).json({ message: "Failed to retrieve def expenses" });
  }
};

const getAllDefExpensesByUserId = async (req, res) => {
  try {
    const { userId, selectedDates } = req.query;

    logger.info("Fetching DEF expenses by user ID", { userId, selectedDates });

    if (!userId) {
      logger.warn("User ID is missing in request");
      return res.status(400).json({ message: "User ID is required" });
    }

    // Ensure the dates are in UTC and set the time to 00:00:00 to avoid time zone issues
    const startDate = selectedDates
      ? moment.utc(selectedDates[0]).startOf("day").toDate()
      : null;
    const endDate = selectedDates
      ? moment.utc(selectedDates[1]).endOf("day").toDate()
      : null;

    // Build the query filter
    const query = { addedBy: userId };

    if (startDate && endDate) {
      if (startDate.toDateString() === endDate.toDateString()) {
        // If startDate and endDate are the same, match that specific date
        query.date = { $eq: startDate };
      } else {
        // Match the range between startDate and endDate
        query.date = { $gte: startDate, $lte: endDate };
      }
    }

    // Fetch all DEF expenses for the given userId and date range
    const defExpenses = await DefExpense.find(query).sort({ date: 1 });

    if (defExpenses.length === 0) {
      logger.info("No DEF expenses found for user", { userId, selectedDates });
      return res.status(404).json({
        message: "No DEF expenses found for this user in the given date range",
      });
    }

    const totalExpense = defExpenses.reduce(
      (sum, expense) => sum + expense.cost,
      0
    );

    // Format the DEF expenses and include the truck's registration number
    const formattedDefExpenses = await Promise.all(
      defExpenses.map(async (expense, index) => {
        const truck = await TruckExpense.findById(expense.truckId);
        const registrationNo = truck ? truck.registrationNo : "Unknown";

        const date = new Date(expense.date);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return {
          ...expense.toObject(), // Convert Mongoose document to plain object
          date: formattedDate,
          registrationNo,
          key: index,
        };
      })
    );

    logger.info("DEF expenses retrieved successfully by user ID", { userId, count: defExpenses.length, totalExpense });
    res.status(200).json({
      expenses: formattedDefExpenses,
      totalExpense,
    });
  } catch (error) {
    logger.error("Error retrieving DEF expenses", { error: error.message, stack: error.stack });
    console.error("Error retrieving DEF expenses:", error);
    res.status(500).json({ message: "Failed to retrieve DEF expenses" });
  }
};


const deleteDefExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info("Deleting DEF expense", { id });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn("Invalid DEF expense ID for deletion", { id });
      return res.status(400).json({ message: "Invalid Expense ID" });
    }

    const deletedTruck = await DefExpense.findByIdAndDelete(id);

    if (!deletedTruck) {
      logger.warn("DEF expense not found for deletion", { id });
      return res.status(404).json({ message: "Expense not found" });
    }

    logger.info("DEF expense deleted successfully", { id });
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    logger.error("Error deleting DEF expense", { error: error.message, stack: error.stack });
    console.error("Error deleting truck:", error);
    res
      .status(500)
      .json({ message: "Failed to delete Expense", error: error.message });
  }
};

const downloadDefExpensesExcel = async (req, res) => {
  try {
    const { truckId, selectedDates } = req.query;

    logger.info("Downloading DEF expenses Excel", { truckId, selectedDates });

    if (!truckId) {
      logger.warn("Truck ID is missing for Excel download");
      console.log("Truck ID is missing");
      return res.status(400).json({ message: "Truck ID is required" });
    }

    // Ensure the dates are in UTC and set the time to 00:00:00 to avoid time zone issues
    const startDate = selectedDates
      ? moment.utc(selectedDates[0]).startOf("day").toDate()
      : null;
    const endDate = selectedDates
      ? moment.utc(selectedDates[1]).endOf("day").toDate()
      : null;

    // Build the query filter
    const query = { truckId };

    if (startDate && endDate) {
      if (startDate.toDateString() === endDate.toDateString()) {
        // If startDate and endDate are the same, match that specific date
        query.date = { $eq: startDate };
      } else {
        // Match the range between startDate and endDate
        query.date = { $gte: startDate, $lte: endDate };
      }
    }

    console.log("Query:", query);

    // Fetch all DEF expenses for the given truckId and date range
    const defExpenses = await DefExpense.find(query).sort({ date: 1 });
    const truck = await TruckExpense.findById(truckId);

    if (defExpenses.length === 0) {
      logger.info("No DEF expenses found for Excel download", { truckId, selectedDates });
      console.log("No expenses found for the given query");
      return res.status(404).json({
        message: "No DEF expenses found for this truck in the given date range",
      });
    }

    // Prepare data for Excel
    const data = defExpenses.map((expense, index) => {
      const date = new Date(expense.date);
      const formattedDate = date.toISOString().split("T")[0];

      const range =
        index > 0 ? expense.currentKM - defExpenses[index - 1].currentKM : 0;

      return {
        Date: formattedDate,
        "Current KM": expense.currentKM,
        Litres: expense.litres,
        Cost: expense.cost,
        Range: range,
        Note: expense.note || "",
      };
    });

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DEF Expenses");

    // Add the merged header row
    worksheet.mergeCells("A1:F1");
    worksheet.getCell(
      "A1"
    ).value = `${truck.registrationNo} - DEF Expenses ( ${selectedDates[0]} - ${selectedDates[1]} )`;
    worksheet.getCell("A1").font = { bold: true, color: { argb: "FFFFFF" } }; // White font color
    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000000" }, // Black background
    };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Add the headings
    const headings = ["Date", "Current KM", "Litres", "Cost", "Range", "Note"];
    worksheet.addRow(headings).font = { bold: true };

    // Add the data
    data.forEach((row) => {
      worksheet.addRow([
        row.Date,
        row["Current KM"],
        row.Litres,
        row.Cost,
        row.Range,
        row.Note,
      ]);
    });

    // Write the workbook to a buffer

    const buffer = await workbook.xlsx.writeBuffer();

    logger.info("DEF expenses Excel generated successfully", { truckId, recordCount: defExpenses.length });
    // Set headers for the response
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=defExpenses.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    logger.error("Error generating Excel file", { error: error.message, stack: error.stack });
    console.error("Error generating Excel file:", error);
    res
      .status(500)
      .json({ message: "Failed to generate Excel file", error: error.message });
  }
};

const downloadAllDefExpensesExcel = async (req, res) => {
  try {
    const { userId, selectedDates } = req.query;

    logger.info("Downloading all DEF expenses Excel by user ID", { userId, selectedDates });

    if (!userId) {
      logger.warn("User ID is missing for Excel download");
      console.log("User ID is missing");
      return res.status(400).json({ message: "User ID is required" });
    }

    // Ensure the dates are in UTC and set the time to 00:00:00 to avoid time zone issues
    const startDate = selectedDates
      ? moment.utc(selectedDates[0]).startOf("day").toDate()
      : null;
    const endDate = selectedDates
      ? moment.utc(selectedDates[1]).endOf("day").toDate()
      : null;

    // Build the query filter
    const query = { addedBy: userId };

    if (startDate && endDate) {
      if (startDate.toDateString() === endDate.toDateString()) {
        // If startDate and endDate are the same, match that specific date
        query.date = { $eq: startDate };
      } else {
        // Match the range between startDate and endDate
        query.date = { $gte: startDate, $lte: endDate };
      }
    }

    // Fetch all DEF expenses for the given userId and date range
    const defExpenses = await DefExpense.find(query).sort({ date: 1 });

    if (defExpenses.length === 0) {
      logger.info("No DEF expenses found for Excel download", { userId, selectedDates });
      console.log("No expenses found for the given query");
      return res.status(404).json({
        message: "No DEF expenses found for this user in the given date range",
      });
    }

    // Prepare data for Excel with registration numbers
    const data = await Promise.all(
      defExpenses.map(async (expense) => {
        const truck = await TruckExpense.findById(expense.truckId);
        const registrationNo = truck ? truck.registrationNo : "Unknown";

        const date = new Date(expense.date);
        const formattedDate = date.toISOString().split("T")[0];

        return {
          Date: formattedDate,
          "Registration No": registrationNo,
          "Current KM": expense.currentKM,
          Litres: expense.litres,
          Cost: expense.cost,
          Note: expense.note || "",
        };
      })
    );

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DEF Expenses");

    // Add the merged header row
    worksheet.mergeCells("A1:F1");
    worksheet.getCell(
      "A1"
    ).value = `DEF Expenses ( ${selectedDates[0]} - ${selectedDates[1]} )`;
    worksheet.getCell("A1").font = { bold: true, color: { argb: "FFFFFF" } }; // White font color
    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000000" }, // Black background
    };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Add the headings
    const headings = ["Date", "Registration No", "Current KM", "Litres", "Cost", "Note"];
    worksheet.addRow(headings).font = { bold: true };

    // Add the data
    data.forEach((row) => {
      worksheet.addRow([
        row.Date,
        row["Registration No"],
        row["Current KM"],
        row.Litres,
        row.Cost,
        row.Note,
      ]);
    });

    // Write the workbook to a buffer

    const buffer = await workbook.xlsx.writeBuffer();

    logger.info("All DEF expenses Excel generated successfully", { userId, recordCount: defExpenses.length });
    // Set headers for the response
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=defExpenses.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    logger.error("Error generating Excel file", { error: error.message, stack: error.stack });
    console.error("Error generating Excel file:", error);
    res
      .status(500)
      .json({ message: "Failed to generate Excel file", error: error.message });
  }
};


module.exports = {
  addDefExpense,
  getAllDefExpensesByTruckId,
  updateDefExpenseByTruckId,
  deleteDefExpenseById,
  downloadDefExpensesExcel,
  getAllDefExpensesByUserId,
  downloadAllDefExpensesExcel,
};
