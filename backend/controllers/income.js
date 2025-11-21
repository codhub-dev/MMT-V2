const { default: mongoose } = require("mongoose");
const Income = require("../models/income-model");
const moment = require("moment");
const ExcelJS = require("exceljs");
const TruckExpense = require("../models/truck-model");
const logger = require("../utils/logger");

// Controller to add a new income record
const addIncome = async (req, res) => {
  try {
    const { truckId, addedBy, date, amount, note } = req.body;

    const newIncome = new Income({
      truckId,
      addedBy,
      date,
      amount,
      note,
    });

    const savedIncome = await newIncome.save();

    logger.info(`Income added successfully`, {
      incomeId: savedIncome._id,
      truckId,
      addedBy,
      amount,
      date,
    });

    res.status(201).json(savedIncome);
  } catch (error) {
    console.error("Error adding income:", error);
    logger.error(`Failed to add income`, {
      error: error.message,
      stack: error.stack,
      body: req.body,
    });
    res.status(500).json({ message: "Failed to add income" });
  }
};

const getAllIncomesByTruckId = async (req, res) => {
  try {
    const { truckId, selectedDates } = req.query;

    if (!truckId) {
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
        query.date = {
          $eq: startDate,
        };
      } else {
        query.date = { $gte: startDate, $lte: endDate };
      }
    }

    // Fetch all incomes for the given truckId and date range
    const incomes = await Income.find(query).sort({ date: 1 });

    if (incomes.length === 0) {
      return res.status(404).json({
        message: "No incomes found for this truck in the given date range",
      });
    }

    const totalIncome = incomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );

    // Format the date
    const formattedIncomes = incomes.map((income, index) => {
      const date = new Date(income.date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      return {
        ...income.toObject(),
        date: formattedDate,
        key: index,
      };
    });

    res.status(200).json({
      expenses: formattedIncomes,
      totalIncome,
    });
  } catch (error) {
    console.error("Error retrieving incomes:", error);
    res.status(500).json({ message: "Failed to retrieve incomes" });
  }
};

const getAllIncomesByUserId = async (req, res) => {
  try {
    const { userId, selectedDates } = req.query;

    if (!userId) {
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
        query.date = {
          $eq: startDate,
        };
      } else {
        query.date = { $gte: startDate, $lte: endDate };
      }
    }

    // Fetch all incomes for the given userId and date range
    const incomes = await Income.find(query).sort({ date: 1 });

    if (incomes.length === 0) {
      return res.status(404).json({
        message: "No incomes found for this user in the given date range",
      });
    }

    // Find registration numbers for each truckId in the incomes
    const formattedIncomes = await Promise.all(
      incomes.map(async (income, index) => {
        const truck = await TruckExpense.findById(income.truckId);
        const registrationNo = truck ? truck.registrationNo : "Unknown";

        const date = new Date(income.date);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return {
          ...income.toObject(),
          date: formattedDate,
          registrationNo,
          key: index,
        };
      })
    );

    const totalIncome = incomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );

    res.status(200).json({
      expenses: formattedIncomes,
      totalIncome,
    });
  } catch (error) {
    console.error("Error retrieving incomes:", error);
    res.status(500).json({ message: "Failed to retrieve incomes" });
  }
};

const updateIncomeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { truckId, addedBy, date, amount, note } = req.body;

    // Validate the income ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid income ID" });
    }

    // Update the income
    const updatedIncome = await Income.findByIdAndUpdate(
      { _id: id },
      {
        truckId,
        addedBy,
        date,
        amount,
        note,
      },
      { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    logger.info(`Income updated successfully`, {
      incomeId: id,
      truckId,
      addedBy,
      amount,
    });

    res.status(200).json({
      message: "Income updated successfully",
      expense: updatedIncome,
    });
  } catch (error) {
    console.error("Error updating income:", error);
    logger.error(`Failed to update income`, {
      incomeId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Failed to update income", error: error.message });
  }
};

const deleteIncomeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Income ID" });
    }

    const deletedIncome = await Income.findByIdAndDelete(id);

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    logger.info(`Income deleted successfully`, {
      incomeId: id,
      truckId: deletedIncome.truckId,
      amount: deletedIncome.amount,
    });

    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error deleting income:", error);
    logger.error(`Failed to delete income`, {
      incomeId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Failed to delete income", error: error.message });
  }
};

const downloadIncomesExcel = async (req, res) => {
  try {
    const { truckId, selectedDates } = req.query;

    if (!truckId) {
      console.log("Truck ID is missing");
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

    const incomes = await Income.find(query).sort({ date: 1 });
    const truck = await TruckExpense.findById(truckId);

    if (incomes.length === 0) {
      return res.status(404).json({
        message: "No incomes found for this truck in the given date range",
      });
    }

    // Prepare data for Excel
    const data = incomes.map((income) => {
      const date = new Date(income.date);
      const formattedDate = date.toISOString().split("T")[0];

      return {
        Date: formattedDate,
        Amount: income.amount,
        Note: income.note || "",
      };
    });

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Incomes");

    // Add the merged header row
    worksheet.mergeCells("A1:C1");
    worksheet.getCell("A1").value = `${truck.registrationNo} - Incomes ( ${selectedDates[0]} - ${selectedDates[1]} )`;
    worksheet.getCell("A1").font = { bold: true };
    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000000" },
    };
    worksheet.getCell("A1").font.color = { argb: "FFFFFF" };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Add the headings
    const headings = ["Date", "Amount", "Note"];
    worksheet.addRow(headings).font = { bold: true };

    // Add the data
    data.forEach((row) => {
      worksheet.addRow([row.Date, row.Amount, row.Note]);
    });

    // Write the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    logger.info(`Income Excel downloaded`, {
      truckId,
      dateRange: selectedDates,
      recordCount: incomes.length,
    });

    // Set headers for the response
    res.setHeader("Content-Disposition", "attachment; filename=incomes.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    logger.error(`Failed to generate income Excel`, {
      truckId: req.query.truckId,
      error: error.message,
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Failed to generate Excel file", error: error.message });
  }
};

const downloadAllIncomesExcel = async (req, res) => {
  try {
    const { userId, selectedDates } = req.query;

    if (!userId) {
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

    const incomes = await Income.find(query).sort({ date: 1 });

    if (incomes.length === 0) {
      return res.status(404).json({
        message: "No incomes found for this user in the given date range",
      });
    }

    // Prepare data for Excel with registration number
    const data = await Promise.all(
      incomes.map(async (income) => {
        const date = new Date(income.date);
        const formattedDate = date.toISOString().split("T")[0];

        const truck = await TruckExpense.findById(income.truckId);
        const registrationNo = truck ? truck.registrationNo : "Unknown";

        return {
          Date: formattedDate,
          "Registration No": registrationNo,
          Amount: income.amount,
          Note: income.note || "",
        };
      })
    );

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Incomes");

    // Add the merged header row
    worksheet.mergeCells("A1:D1");
    worksheet.getCell("A1").value = `Incomes ( ${selectedDates[0]} - ${selectedDates[1]} )`;
    worksheet.getCell("A1").font = { bold: true };
    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000000" },
    };
    worksheet.getCell("A1").font.color = { argb: "FFFFFF" };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Add the headings
    const headings = ["Date", "Registration No", "Amount", "Note"];
    worksheet.addRow(headings).font = { bold: true };

    // Add the data
    data.forEach((row) => {
      worksheet.addRow([
        row.Date,
        row["Registration No"],
        row.Amount,
        row.Note,
      ]);
    });

    // Write the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    logger.info(`All incomes Excel downloaded`, {
      userId,
      dateRange: selectedDates,
      recordCount: incomes.length,
    });

    // Set headers for the response
    res.setHeader("Content-Disposition", "attachment; filename=incomes.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    logger.error(`Failed to generate all incomes Excel`, {
      userId: req.query.userId,
      error: error.message,
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Failed to generate Excel file", error: error.message });
  }
};

module.exports = {
  addIncome,
  getAllIncomesByTruckId,
  getAllIncomesByUserId,
  updateIncomeById,
  deleteIncomeById,
  downloadIncomesExcel,
  downloadAllIncomesExcel,
};