import mongoose from 'mongoose'
//nada relevante


const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const TicketModel = mongoose.model("tickets" , ticketSchema)

export default TicketModel