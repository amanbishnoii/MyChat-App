import { useEffect, useRef, useState } from "react";
import { Image, SendHorizontal, X } from "lucide-react";
import toast from "react-hot-toast";
import { useChatStore } from "../files/useChatStore";
import Reply from "./Reply";
const Messageinput = () => {
  const [message, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const { sendMessage, toReply, selectedUser } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !imagePreview) return;
    const msg = message.trim();
    const img = imagePreview
    let reply = null
    // Clear form
    setText("");
    setImagePreview(null);

    try {
      if (toReply) {
        reply = toReply
      }
      await sendMessage({
        message: msg,
        image: img,
        name: selectedUser.name,
        reply: reply
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    const focusInput = () => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    };

    focusInput();

  }, []);
  return (
    <div>
      {toReply && <Reply />}
      <div className="px-4 py-2 pb-4 w-full">
        {imagePreview && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-md sm:input-md"
              placeholder="Type a message..."
              value={message}
              ref={inputRef}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            <button
              type="button"
              className={`flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={20} />
            </button>
          </div>
          <button
            type="submit"
            className="btn btn-sm btn-circle"
            disabled={!message.trim() && !imagePreview}
          >
            <SendHorizontal size={25} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default Messageinput;
