/**
 * Backend Schema Definitions
 * These would be Mongoose schemas for MongoDB Atlas when using a Node.js/Express backend.
 * Currently used as TypeScript type definitions for the frontend.
 * 
 * To use with Express + Mongoose:
 * 
 * const mongoose = require('mongoose');
 * 
 * const AppointmentSchema = new mongoose.Schema({
 *   patientName: { type: String, required: true, maxlength: 100 },
 *   phone: { type: String, required: true, maxlength: 15 },
 *   date: { type: Date, required: true },
 *   preferredTime: { type: String },
 *   serviceType: { type: String, required: true },
 *   status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
 * }, { timestamps: true });
 * 
 * const EnquirySchema = new mongoose.Schema({
 *   name: { type: String, required: true, maxlength: 100 },
 *   email: { type: String, required: true, maxlength: 255 },
 *   phone: { type: String, maxlength: 15 },
 *   message: { type: String, required: true, maxlength: 1000 },
 * }, { timestamps: true });
 */

export interface Appointment {
  patientName: string;
  phone: string;
  date: string;
  preferredTime?: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Enquiry {
  name: string;
  email: string;
  phone?: string;
  message: string;
}
