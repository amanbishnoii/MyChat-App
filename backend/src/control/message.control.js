import User from "../model/user.model.js";
import Message from "../model/message.model.js";
import { getReceiverSocketId, io } from "../lib/socketio.lib.js";
import DeletedMessage from "../model/deletedMessage.model.js";
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';


const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

export const getusers = async (req, res) => {
    try {
        let loginuser = req.user._id;
        let users = await User.find({ _id: { $ne: loginuser } }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' + error });

    }
}

export const getmessages = async (req, res) => {
    try {
        let { id: receiverid } = req.params;
        let loginuser = req.user._id;
        let messages = await Message.find({
            $or: [
                {
                    senderid: loginuser, receiverid: receiverid
                },
                {
                    senderid: receiverid, receiverid: loginuser
                }
            ]
        });
        res.status(200).json(messages);


    } catch (error) {
        res.status(500).json({ message: 'Internal server error' + error });
    }
}

export const sendmessage = async (req, res) => {
    try {
        let { id: receiverid } = req.params;
        let senderid = req.user._id;
        let { message, image, name, reply } = req.body;
        let imgurl;
        if (image) {
            imgurl = await imagedatabase(image);
        }
        let newmessage = new Message({
            senderid,
            receiverid,
            name,
            message,
            reply,
            image: imgurl
        });
        await newmessage.save();

        const receiverSocketid = getReceiverSocketId(receiverid);
        if (receiverSocketid) {
            io.to(receiverSocketid).emit("newone", newmessage)
        }

        res.status(200).json(newmessage);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' + error });
    }
}
const imagedatabase = async (base64Image) => {
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(cleanBase64, 'base64');
    const filePath = './image.jpg';  // Temporary file path

    // Write the image to a file
    fs.writeFileSync(filePath, imageBuffer);

    // Step 2: Prepare the FormData object for upload
    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("photo", fs.createReadStream(filePath));

    try {
        const response = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
            formData,
            {
                headers: formData.getHeaders(),
            }
        );

        // Extract file ID
        const fileId = response.data.result?.photo?.pop()?.file_id;
        if (!fileId) {
            throw new Error("No file_id found");
        }

        // Get the file URL
        const fileResponse = await axios.get(
            `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
        );

        const filePath = fileResponse.data.result.file_path;
        return `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    } catch (error) {
        console.error("Error uploading image:", error.response ? error.response.data : error.message);
    } finally {
        // Clean up the temporary image file
        fs.unlinkSync(filePath);
    }
}

export const deletemessage = async (req, res) => {
    try {
        let { id: messageid } = req.params;
        const message = await Message.findById(messageid);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        const deletedMessage = new DeletedMessage({
            messageid: message._id,
            senderid: message.senderid,
            receiverid: message.receiverid,
            message: message.message,
            image: message.image,
            beforeDeleteCreatedDate: message.createdAt
        });
        await deletedMessage.save();
        await Message.deleteOne({ _id: messageid });
        io.emit("deletedMSG", message)

        res.status(200).json({ message: "Message deleted" });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' + error });
    }
}