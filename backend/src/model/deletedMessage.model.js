import mongoose from "mongoose";

const deletedMessageSchema = new mongoose.Schema({
    messageid: {
        type: String,
        required: true,
        ref: "Message"
    },
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
    message: {
        type: String,
    },
    image: {
        type: String,
    },
    reply: {
        type: Array,
    },
    beforeDeleteCreatedDate: {
        type: String,
        required: true,
        ref: "User"
    },
},
    {
        timestamps: true,
    });

const DeletedMessage = mongoose.model("DeletedMessage", deletedMessageSchema);
export default DeletedMessage;