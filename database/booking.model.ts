import mongoose, { Document, Model, Schema } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
    eventId: mongoose.Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose schema definition
const BookingSchema = new Schema<IBooking>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, 'Event ID is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            validate: {
                validator: (v: string) => {
                    // RFC 5322 compliant email validation regex
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(v);
                },
                message: 'Invalid email format',
            },
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

// Pre-save hook to validate that the referenced Event exists
BookingSchema.pre('save', async function () {
    // Only validate eventId if it's modified or the document is new
    if (this.isModified('eventId') || this.isNew) {
        try {
            const eventExists = await Event.findById(this.eventId).select('_id');
            if (!eventExists) {
                throw new Error('Referenced event does not exist');
            }
        } catch (error) {
            throw new Error('Error validating event reference');
        }
    }
});

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Optional: Compound index for preventing duplicate bookings (same email for same event)
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

// Export the model
const Booking: Model<IBooking> =
    mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
