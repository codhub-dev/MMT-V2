const { default: mongoose } = require("mongoose");
const FuelExpense = require("../models/fuelExpense-model");
const DefExpense = require("../models/defExpense-model");
const OtherExpense = require("../models/otherExpense-model");
const moment = require("moment");
const ExcelJS = require("exceljs");
const TruckExpense = require("../models/truck-model");
const logger = require("../utils/logger");
const { getFullContext } = require("../utils/requestContext");

const getAllTotalExpensesByUserId = async (req, res) => {
  try {
    const { userId, selectedDates } = req.query;

    logger.info("Fetching total expenses by user ID", getFullContext(req, { userId, selectedDates }));

    if (!userId) {
      logger.warn("Get total expenses attempted without user ID", getFullContext(req));
      return res.status(400).json({ message: "User ID is required" });
    }

    const startDate = selectedDates
      ? moment.utc(selectedDates[0]).startOf("day").toDate()
      : null;
    const endDate = selectedDates
      ? moment.utc(selectedDates[1]).endOf("day").toDate()
      : null;

    const query = { addedBy: userId };

    if (startDate && endDate) {
      if (startDate.toDateString() === endDate.toDateString()) {
        query.date = { $eq: startDate };
      } else {
        query.date = { $gte: startDate, $lte: endDate };
      }
    }

    const fuelExpenses = (await FuelExpense.find(query).sort({ date: 1 })).map(
      (expense) => ({
        ...expense.toObject(),
        catalog: "Fuel Expense",
      })
    );

    const defExpenses = (await DefExpense.find(query).sort({ date: 1 })).map(
      (expense) => ({
        ...expense.toObject(),
        catalog: "Def Expense",
      })
    );

    const otherExpenses = (
      await OtherExpense.find(query).sort({ date: 1 })
    ).map((expense) => ({
      ...expense.toObject(),
      catalog: "Other Expense",
    }));

    const allExpenses = [...fuelExpenses, ...defExpenses, ...otherExpenses];

    if (allExpenses.length === 0) {
      logger.info(`No total expenses found for user ${userId}`, {
        userId,
        dateRange: selectedDates,
      });
      return res.status(404).json({
        message: "No expenses found for this user in the given date range",
      });
    }

    const formattedExpenses = await Promise.all(
      allExpenses.map(async (expense) => {
        const truck = await TruckExpense.findById(expense.truckId);
        const registrationNo = truck ? truck.registrationNo : "Unknown";

        const date = new Date(expense.date);
        const formattedDate = moment(date).format("DD-MM-YYYY");

        return {
          ...expense,
          date: formattedDate,
          registrationNo,
        };
      })
    );

    // Sort combined expenses by date
    formattedExpenses.sort(
      (a, b) =>
        new Date(a.date.split("-").reverse().join("-")) -
        new Date(b.date.split("-").reverse().join("-"))
    );

    const totalExpense = formattedExpenses.reduce(
      (sum, expense) => sum + expense.cost,
      0
    );

    logger.info(`Retrieved ${formattedExpenses.length} total expenses for user ${userId}`, {
      userId,
      count: formattedExpenses.length,
      totalExpense,
      dateRange: selectedDates,
    });

    res.status(200).json({
      expenses: formattedExpenses,
      totalExpense,
    });
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    logger.error(`Failed to retrieve total expenses: ${error.message}`, {
      userId: req.query.userId,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Failed to retrieve expenses" });
  }
};

const downloadAllTotalExpensesExcel = async (req, res) => {
  try {
    const { userId, selectedDates } = req.query;

    if (!userId) {
      console.log("User ID is missing");
      logger.warn("Total expenses Excel download attempted without user ID");
      return res.status(400).json({ message: "User ID is required" });
    }

    const startDate = selectedDates
      ? moment.utc(selectedDates[0]).startOf("day").toDate()
      : null;
    const endDate = selectedDates
      ? moment.utc(selectedDates[1]).endOf("day").toDate()
      : null;

    const query = { addedBy: userId };

    if (startDate && endDate) {
      if (startDate.toDateString() === endDate.toDateString()) {
        query.date = { $eq: startDate };
      } else {
        query.date = { $gte: startDate, $lte: endDate };
      }
    }

    const fuelExpenses = (await FuelExpense.find(query).sort({ date: 1 })).map(
      (expense) => ({
        ...expense.toObject(),
        catalog: "Fuel Expense",
      })
    );

    const defExpenses = (await DefExpense.find(query).sort({ date: 1 })).map(
      (expense) => ({
        ...expense.toObject(),
        catalog: "Def Expense",
      })
    );

    const otherExpenses = (
      await OtherExpense.find(query).sort({ date: 1 })
    ).map((expense) => ({
      ...expense.toObject(),
      catalog: "Other Expense",
    }));

    const allExpenses = [...fuelExpenses, ...defExpenses, ...otherExpenses];

    if (allExpenses.length === 0) {
      console.log("No expenses found for the given query");
      logger.info(`No total expenses found for Excel download - user ${userId}`, {
        userId,
        dateRange: selectedDates,
      });
      return res.status(404).json({
        message: "No expenses found for this user in the given date range",
      });
    }

    const formattedExpenses = await Promise.all(
      allExpenses.map(async (expense) => {
        const truck = await TruckExpense.findById(expense.truckId);
        const registrationNo = truck ? truck.registrationNo : "Unknown";

        const date = new Date(expense.date);
        const formattedDate = moment(date).format("DD-MM-YYYY");

        return {
          ...expense,
          date: formattedDate,
          registrationNo,
        };
      })
    );

    // Sort combined expenses by date
    formattedExpenses.sort(
      (a, b) =>
        new Date(a.date.split("-").reverse().join("-")) -
        new Date(b.date.split("-").reverse().join("-"))
    );

    const data = formattedExpenses.map((expense) => ({
      Date: expense.date,
      Registration: expense.registrationNo,
      Type: expense.catalog,
      Cost: expense.cost,
      Note: expense.note || "",
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Total Expenses");

    worksheet.mergeCells("A1:E1");
    worksheet.getCell(
      "A1"
    ).value = `Total Expenses ( ${selectedDates[0]} - ${selectedDates[1]} )`;
    worksheet.getCell("A1").font = { bold: true };
    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000000" },
    };
    worksheet.getCell("A1").font.color = { argb: "FFFFFF" };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    const headings = ["Date", "Registration", "Type", "Cost", "Note"];
    worksheet.addRow(headings).font = { bold: true };

    data.forEach((row) => {
      worksheet.addRow([
        row.Date,
        row.Registration,
        row.Type,
        row.Cost,
        row.Note,
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    logger.info(`Total expenses Excel downloaded for user ${userId}`, {
      userId,
      count: allExpenses.length,
      dateRange: selectedDates,
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=totalExpenses.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    logger.error(`Failed to generate total expenses Excel: ${error.message}`, {
      userId: req.query.userId,
      error: error.message,
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Failed to generate Excel file", error: error.message });
  }
};

const getAllTotalExpensesByTruckId = async (req, res) => {
  try {
    const { truckId, selectedDates } = req.query;

    if (!truckId) {
      return res.status(400).json({ message: "Truck ID is required" });
    }

    const startDate = selectedDates
      ? moment.utc(selectedDates[0]).startOf("day").toDate()
      : null;
    const endDate = selectedDates
      ? moment.utc(selectedDates[1]).endOf("day").toDate()
      : null;

    const query = { truckId };

    if (startDate && endDate) {
      if (startDate.toDateString() === endDate.toDateString()) {
        query.date = { $eq: startDate };
      } else {
        query.date = { $gte: startDate, $lte: endDate };
      }
    }

    const fuelExpenses = (await FuelExpense.find(query).sort({ date: 1 })).map(
      (expense) => ({
        ...expense.toObject(),
        catalog: "Fuel Expense",
      })
    );

    const defExpenses = (await DefExpense.find(query).sort({ date: 1 })).map(
      (expense) => ({
        ...expense.toObject(),
        catalog: "Def Expense",
      })
    );

    const otherExpenses = (
      await OtherExpense.find(query).sort({ date: 1 })
    ).map((expense) => ({
      ...expense.toObject(),
      catalog: "Other Expense",
    }));

    const allExpenses = [...fuelExpenses, ...defExpenses, ...otherExpenses];

    if (allExpenses.length === 0) {
      return res.status(404).json({
        message: "No expenses found for this truck in the given date range",
      });
    }

    const formattedExpenses = await Promise.all(
      allExpenses.map(async (expense) => {
        const truck = await TruckExpense.findById(expense.truckId);
        const registrationNo = truck ? truck.registrationNo : "Unknown";

        const date = new Date(expense.date);
        const formattedDate = moment(date).format("DD-MM-YYYY");

        return {
          ...expense,
          date: formattedDate,
          registrationNo,
        };
      })
    );

    // Sort combined expenses by date
    formattedExpenses.sort(
      (a, b) =>
        new Date(a.date.split("-").reverse().join("-")) -
        new Date(b.date.split("-").reverse().join("-"))
    );

    const totalExpense = formattedExpenses.reduce(
      (sum, expense) => sum + expense.cost,
      0
    );

    res.status(200).json({
      expenses: formattedExpenses,
      totalExpense,
    });
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    res.status(500).json({ message: "Failed to retrieve expenses" });
  }
};

module.exports = {
  getAllTotalExpensesByUserId,
  downloadAllTotalExpensesExcel,
  getAllTotalExpensesByTruckId,
};
