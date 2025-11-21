const { default: mongoose } = require("mongoose");
const FuelExpense = require("../models/fuelExpense-model");
const moment = require("moment");
const ExcelJS = require("exceljs");
const TruckExpense = require("../models/truck-model");
const fs = require("fs");
const path = require("path");

// Controller to add a new fuel filling record
const addFuelExpense = async (req, res) => {
  try {
    const { truckId, addedBy, date, currentKM, litres, cost, note } = req.body;

    const newFuelExpense = new FuelExpense({
      truckId,
      addedBy,
      date,
      currentKM,
      litres,
      cost,
      note,
    });

    const savedFuelExpense = await newFuelExpense.save();
    res.status(201).json(savedFuelExpense);
  } catch (error) {
    console.error("Error adding fuel filling:", error);
    res.status(500).json({ message: "Failed to add fuel filling" });
  }
};

const getAllFuelExpensesByTruckId = async (req, res) => {
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
    const fuelExpenses = await FuelExpense.find(query).sort({ date: 1 });

    if (fuelExpenses.length === 0) {
      return res.status(404).json({
        message:
          "No fuel expenses found for this truck in the given date range",
      });
    }

    const totalExpense = fuelExpenses.reduce(
      (sum, expense) => sum + expense.cost,
      0
    );

    // Calculate mileage and range, and format the date
    const formattedFuelExpenses = fuelExpenses.map((expense, index) => {
      // Format the date to 'YYYY-MM-DD'
      // const date = new Date(expense.date);
      // const formattedDate = date.toISOString().split("T")[0];

      const date = new Date(expense.date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      const range =
        index > 0 ? expense.currentKM - fuelExpenses[index - 1].currentKM : 0;

      // Calculate range - Assuming range is not given and not calculated here
      // If you have a formula for range, apply it here. For now, I set it as the mileage.
      const mileage = range > 0 ? (range / expense.litres).toFixed(2) : 0; // Adjust this if you have a specific formula for range

      return {
        ...expense.toObject(),
        date: formattedDate,
        mileage,
        range,
        key: index,
      };
    });

    res.status(200).json({
      expenses: formattedFuelExpenses,
      totalExpense,
    });
  } catch (error) {
    console.error("Error retrieving fuel expenses:", error);
    res.status(500).json({ message: "Failed to retrieve fuel expenses" });
  }
};

const getAllFuelExpensesByUserId = async (req, res) => {
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
        // If startDate and endDate are the same, match that specific date
        query.date = {
          $eq: startDate,
        };
      } else {
        // Match the range between startDate and endDate
        query.date = { $gte: startDate, $lte: endDate };
      }
    }

    // Fetch all fuel expenses for the given userId and date range
    const fuelExpenses = await FuelExpense.find(query).sort({ date: 1 });

    if (fuelExpenses.length === 0) {
      return res.status(404).json({
        message: "No fuel expenses found for this user in the given date range",
      });
    }

    // Find registration numbers for each truckId in the fuel expenses
    const formattedFuelExpenses = await Promise.all(
      fuelExpenses.map(async (expense, index) => {
        const truck = await TruckExpense.findById(expense.truckId);
        const registrationNo = truck ? truck.registrationNo : "Unknown";

        const date = new Date(expense.date);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return {
          ...expense.toObject(),
          date: formattedDate,
          registrationNo,
          key: index,
        };
      })
    );

    const totalExpense = fuelExpenses.reduce(
      (sum, expense) => sum + expense.cost,
      0
    );

    res.status(200).json({
      expenses: formattedFuelExpenses,
      totalExpense,
    });
  } catch (error) {
    console.error("Error retrieving fuel expenses:", error);
    res.status(500).json({ message: "Failed to retrieve fuel expenses" });
  }
};

const getAllFuelByTruckHelper = async (truckId) => {
  try {

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
    const fuelExpenses = await FuelExpense.find(query).sort({ date: 1 });

    if (fuelExpenses.length === 0) {
      return []
    }

    const totalExpense = fuelExpenses.reduce(
      (sum, expense) => sum + expense.cost,
      0
    );

    // Calculate mileage and range, and format the date
    const formattedFuelExpenses = fuelExpenses.map((expense, index) => {
      // Format the date to 'YYYY-MM-DD'
      // const date = new Date(expense.date);
      // const formattedDate = date.toISOString().split("T")[0];

      const date = new Date(expense.date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      const range =
        index > 0 ? expense.currentKM - fuelExpenses[index - 1].currentKM : 0;

      // Calculate range - Assuming range is not given and not calculated here
      // If you have a formula for range, apply it here. For now, I set it as the mileage.
      const mileage = range > 0 ? (range / expense.litres).toFixed(2) : 0; // Adjust this if you have a specific formula for range

      return {
        ...expense.toObject(),
        date: formattedDate,
        mileage,
        range,
        key: index,
      };
    });

    return({
      expenses: formattedFuelExpenses,
      totalExpense,
    })
  } catch (error) {
    console.error("Error retrieving fuel expenses:", error);
    return []
  }
}

const updateFuelExpenseByTruckId = async (req, res) => {
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

    // Validate the fuel ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid fuel expense ID" });
    }
    

    // Update the invoice URL if a new file is provided
    let invoiceURL = req.body.invoiceURL;
    if (file) {
      invoiceURL = await uploadInvoice(file);
    }

    // Update the fuel
    const updatedFuel = await FuelExpense.findByIdAndUpdate(
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

    if (!updatedFuel) {
      return res.status(404).json({ message: "Fuel expense not found" });
    }

    // Fetch all fuelExpenses for the user after the update
    // const fuelExpenses = await getAllFuelByTruckHelper(addedBy);

    // Send the response with all fuelExpenses (including the updated one)
    res.status(200).json({
      message: "Fuel expense updated successfully",
      fuelExpense:updatedFuel,
    });
  } catch (error) {
    console.error("Error updating fuel expense:", error);
    res
      .status(500)
      .json({ message: "Failed to update fuel expense", error: error.message });
  }
};


const deleteFuelExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Expense ID" });
    }

    const deletedTruck = await FuelExpense.findByIdAndDelete(id);

    if (!deletedTruck) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    console.error("Error deleting truck:", error);
    res
      .status(500)
      .json({ message: "Failed to delete Expense", error: error.message });
  }
};

const downloadFuelExpensesExcel = async (req, res) => {
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

    const fuelExpenses = await FuelExpense.find(query).sort({ date: 1 });
    const truck = await TruckExpense.findById(truckId);

    if (fuelExpenses.length === 0) {
      return res.status(404).json({
        message: "No fuel expenses found for this truck in the given date range",
      });
    }

    // Prepare data for Excel
    const data = fuelExpenses.map((expense, index) => {
      const date = new Date(expense.date);
      const formattedDate = date.toISOString().split("T")[0];
      const range = index > 0 ? expense.currentKM - fuelExpenses[index - 1].currentKM : 0;
      const mileage = range > 0 ? (range / expense.litres).toFixed(2) : 0;
      return {
        Date: formattedDate,
        "Current KM": expense.currentKM,
        Litres: expense.litres,
        Cost: expense.cost,
        Note: expense.note || "",
        Range: range,
        Mileage: mileage,
      };
    });

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Fuel Expenses");

    // Main Title
    worksheet.mergeCells("A1:G1");
    worksheet.getCell("A1").value = "Manage My Truck - Fuel Expenses";
    worksheet.getCell("A1").font = { size: 18, bold: true, color: { argb: "FFFFFF" } };
    worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0C4736" },
    };
    worksheet.getRow(1).height = 36;

    // Subtitle (Truck and Date Range)
    worksheet.mergeCells("A2:G2");
    worksheet.getCell("A2").value = `${truck.registrationNo} | ${selectedDates[0]} to ${selectedDates[1]}`;
    worksheet.getCell("A2").font = { size: 12, bold: true, color: { argb: "333333" } };
    worksheet.getCell("A2").alignment = { horizontal: "center", vertical: "middle" };

    // Column Headings
    const headings = [
      "Date",
      "Current KM",
      "Litres",
      "Cost",
      "Note",
      "Range",
      "Mileage",
    ];

    const headerRow = worksheet.addRow(headings);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF57A773" }
      };
    });
    headerRow.alignment = { horizontal: "center" };
    headerRow.height = 24;

    // Add Data Rows
    data.forEach((row) => {
      worksheet.addRow([
        row.Date,
        row["Current KM"],
        row.Litres,
        row.Cost,
        row.Note,
        row.Range,
        row.Mileage,
      ]);
    });

    // Set column widths
    worksheet.columns = [
      { width: 15 },
      { width: 15 },
      { width: 10 },
      { width: 10 },
      { width: 25 },
      { width: 10 },
      { width: 10 },
    ];

    // Add borders and center alignment to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        const existingFill = cell.fill;
        cell.border = {
          top: { style: "thin", color: { argb: "CCCCCC" } },
          left: { style: "thin", color: { argb: "CCCCCC" } },
          bottom: { style: "thin", color: { argb: "CCCCCC" } },
          right: { style: "thin", color: { argb: "CCCCCC" } },
        };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        if (existingFill) {
          cell.fill = existingFill;
        }
      });
    });

    // Write the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers for the response
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=fuelExpenses.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res
      .status(500)
      .json({ message: "Failed to generate Excel file", error: error.message });
  }
};

const downloadAllFuelExpensesExcel = async (req, res) => {
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

    const fuelExpenses = await FuelExpense.find(query).sort({ date: 1 });

    if (fuelExpenses.length === 0) {
      return res.status(404).json({
        message: "No fuel expenses found for this user in the given date range",
      });
    }

    // Prepare data for Excel with registration number
    const data = await Promise.all(
      fuelExpenses.map(async (expense, index) => {
        const date = new Date(expense.date);
        const formattedDate = date.toISOString().split("T")[0];

        const truck = await TruckExpense.findById(expense.truckId);
        const registrationNo = truck ? truck.registrationNo : "Unknown";

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
    const worksheet = workbook.addWorksheet("Fuel Expenses");

    // Main Title
    worksheet.mergeCells("A1:F1");
    worksheet.getCell("A1").value = "Manage My Truck - All Fuel Expenses";
    worksheet.getCell("A1").font = { size: 18, bold: true, color: { argb: "FFFFFF" } };
    worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0C4736" },
    };
    worksheet.getRow(1).height = 36;

    // Subtitle (Date Range)
    worksheet.mergeCells("A2:F2");
    worksheet.getCell("A2").value = `Date Range: ${selectedDates[0]} to ${selectedDates[1]}`;
    worksheet.getCell("A2").font = { size: 12, bold: true, color: { argb: "333333" } };
    worksheet.getCell("A2").alignment = { horizontal: "center", vertical: "middle" };
    

    // Column Headings
    const headings = [
      "Date",
      "Registration No",
      "Current KM",
      "Litres",
      "Cost",
      "Note",
    ];
    const headerRow = worksheet.addRow(headings);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF57A773" }
      };
    });
    headerRow.alignment = { horizontal: "center" };
    headerRow.height = 24;

    // Add Data Rows
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

    // Set column widths
    worksheet.columns = [
      { width: 15 },
      { width: 20 },
      { width: 15 },
      { width: 10 },
      { width: 10 },
      { width: 25 },
    ];

    // Add borders and center alignment to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        const existingFill = cell.fill;
        cell.border = {
          top: { style: "thin", color: { argb: "CCCCCC" } },
          left: { style: "thin", color: { argb: "CCCCCC" } },
          bottom: { style: "thin", color: { argb: "CCCCCC" } },
          right: { style: "thin", color: { argb: "CCCCCC" } },
        };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        if (existingFill) {
          cell.fill = existingFill;
        }
      });
    });

    // Write the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers for the response
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=fuelExpenses.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({ message: "Failed to generate Excel file", error: error.message });
  }
};

module.exports = {
  addFuelExpense,
  getAllFuelExpensesByTruckId,
  updateFuelExpenseByTruckId,
  deleteFuelExpenseById,
  downloadFuelExpensesExcel,
  getAllFuelExpensesByUserId,
  downloadAllFuelExpensesExcel,
};
