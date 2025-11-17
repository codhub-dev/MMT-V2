const mongoose = require('mongoose');

const DriverProfileSchema = new mongoose.Schema({
    addedBy: {
        type: String,
        ref: 'User',
        required: [true, "User ID is required"],
    },
    name: {
        type: String,
        required: [true, "Driver name is required"],
        trim: true,
    },
    contact: {
        type: String,
        required: [true, "Contact number is required"],
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [18, "Driver must be at least 18 years old"],
        max: [70, "Driver cannot be older than 70 years"]
    },
    experience: {
        type: String,
        required: [true, "Experience is required"],
    },
    license: {
        type: String,
        required: [true, "License number is required"],
        unique: true,
        trim: true,
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ['Male', 'Female', 'Other'],
    },
    photo: {
        type: String,
        default: '/driver.png'
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
    updatedAt: {
        type: Date,
        default: () => new Date(),
    }
});

// Update the updatedAt field before saving
DriverProfileSchema.pre('findOneAndUpdate', function() {
    this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('DriverProfile', DriverProfileSchema);