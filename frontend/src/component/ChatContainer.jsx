import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../files/useChatStore";
import MessageSkeleton from "../skelton/MessageSkeleton";
import Chatheader from "./Chatheader";
import Messageinput from "./messageinput";
import { checkAuthStore } from "../files/checkAuthFile";
import defaultimg from '../pages/logoimg/default-avatar.png';
import ContextMenu from "./ContextMenu";
import { otherRequireFilecreate } from "../files/otherRequireFile";
const ChatContainer = () => {
  const { messages, getMessages, setToDeleteChat, isMessageLoading, selectedUser, setToMessage, unSetToMessage, isImage, handlecontaxtmenu } = useChatStore();
  const { showDate, showTime } = otherRequireFilecreate();
  const { isAuth } = checkAuthStore();
  const [showMenu, setShowMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const messageEndRef = useRef(null);
  useEffect(() => {
    getMessages(selectedUser._id);
    setToMessage();
    setToDeleteChat();
    return () => unSetToMessage();
  }, [selectedUser._id, getMessages, setToMessage, setToDeleteChat, unSetToMessage]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (isMessageLoading) return (
    <div className="flex flex-1 flex-col overflow-auto">
      <Chatheader />
      <MessageSkeleton />
      <Messageinput />
    </div>
  );




  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Chatheader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1]; // Get previous message
          const prevDate = prevMessage ? showDate(prevMessage.createdAt) : null;
          const curDate = showDate(message.createdAt);
          return (
            <div key={index}>
              {index === "0" || prevDate != curDate &&

                <div className='rounded-xl bg-primary/90 mx-auto w-fit px-3 left select-none'>
                  <p className='text-base-100'>
                    {showDate(message.createdAt)}</p>
                </div>
              }

              <div
                key={message._id}
                className={`chat ${message.senderid === isAuth._id ? "chat-end " : "chat-start"}`}
                ref={messageEndRef}

              >

                <div className=" chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderid === isAuth._id
                          ? isAuth.profileimage || defaultimg
                          : selectedUser.profileimage || defaultimg
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {showTime(message.createdAt)}
                  </time>
                </div>
                <div className={`chat-bubble px-2 flex flex-col ${message.senderid === isAuth._id ? " bg-primary text-primary-content" : ""}`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setMenuPosition({ x: (e.clientX + 116) > window.innerWidth ? e.clientX - 130 : e.clientX, y: e.clientY + 4 });
                    setShowMenu(message._id);
                    handlecontaxtmenu(message);
                  }}>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-2xl mb-2"
                    />
                  )}
                  {message.reply && <>
                    <div className='bg-primary-content/50 w-full rounded-md px-1'>
                      <p style={{ lineHeight: 1 }} className='text-sm text-primary/80 line-clamp-6'>{message.reply[0].name}</p>
                      <p className='text-sm truncate w-full '>{message.reply[0].message}</p>
                    </div>
                  </>}
                  {message.message && <p>{message.message}</p>}
                </div>

              </div>
            </div>
          )
        }


        )}
        {isImage && <>
          <div className="skeleton h-16 w-[200px] float-right" />
        </>
        }

        <div className={`${showMenu ? "absolute duration-100" : "hidden"}`} style={{ top: menuPosition.y, left: menuPosition.x }}>
          <ContextMenu />
        </div>


        {
          window.addEventListener('click', () => {
            setShowMenu(null)
          })
        }
      </div>

      <Messageinput />
    </div >
  );
};
export default ChatContainer;