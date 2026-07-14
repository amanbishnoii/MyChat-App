import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderid: {
        type: String,
        required: true,
        ref: "User"
    },
    receiverid: {
        type: String,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        ref: "User",
        required: true
    },
    message: {
        type: String,
    },
    image: {
        type: String,
    },
    reply: {
        type: Array,
    }
},
    {
        timestamps: true,
    });

const Message = mongoose.model("Message", messageSchema);
export default Message;