import { create } from 'zustand';
import toast from 'react-hot-toast';
import Instance from "../lib/axios.js";
import { checkAuthStore } from './checkAuthFile.js';
export const useChatStore = create((set, get) => (
    {
        messages: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessageLoading: false,
        isImage: false,
        list: ['Reply', 'Delete', 'Copy'],
        deletedChat: [],
        opratorMsg: null,
        toReply: null,
        setToReply: (data) => {
            set({ toReply: null })
            set({ toReply: data })
        },
        getUsers: async () => {
            set({ isUsersLoading: true })
            try {
                const res = await Instance.get("/message/users");
                set({ users: res.data })
            } catch (error) {
                toast.error(error.response.data.message)
            }
            finally {
                set({ isUsersLoading: false })
            }
        },

        getMessages: async (userid) => {

            set({ isMessageLoading: true })
            try {
                const res = await Instance.get(`/message/${userid}`)
                set({ messages: res.data });
            } catch (error) {
                toast.error(error.response.data.message)
            } finally {
                set({ isMessageLoading: false })
            }
        },

        sendMessage: async (messagedata) => {
            const { selectedUser, messages } = get();
            if (messagedata.image) {
                set({ isImage: true });
            }
            try {
                const res = await Instance.post(`/message/send/${selectedUser._id}`, messagedata);
                set({ messages: [...messages, res.data], isImage: false })
            } catch (error) {
                toast.error(error)
            } finally {
                set({ isImage: false })
                get().setToReply(null)
            }
        },

        setSelectedUser: (selecteduserid) => {
            set({ selectedUser: selecteduserid })
        },

        setToMessage: () => {
            const { selectedUser } = get()
            if (!selectedUser) return;
            const socket = checkAuthStore.getState().socket
            socket.on("newone", (data) => {
                const isSendingMessageToSelectedUser = data.senderid === selectedUser._id
                if (!isSendingMessageToSelectedUser) return;
                set({ messages: [...get().messages, data] })
            })
        },

        unSetToMessage: () => {
            const socket = checkAuthStore.getState().socket
            socket.off("newone");
        },

        copyContaxt: (msg) => {
            let textToCopy = msg?.message || "No content to copy";
            window.navigator.clipboard.writeText(textToCopy).then(() => {
                toast.success("Successfully Copy ")
            })
                .catch(() => {
                    toast.error("Something Went Wrong")
                })
        },

        replyContaxt: (message) => {

            get().setToReply(message)
        },

        deleteContaxt: async (id) => {
            try {
                if (!id) return;
                const res = await Instance.post(`/message/delete/${id}`)
                toast.success("Successfully Deleted")

            } catch (error) {
                toast.error("Error While Deleting")
            }
        },

        setToDeleteChat: () => {
            const { selectedUser } = get();
            if (!selectedUser) return;
            const socket = checkAuthStore.getState().socket
            socket.on("deletedMSG", (data) => {
                set({ messages: [...get().messages.filter((message) => message._id !== data._id)], data })
            })
        },

        handlecontaxtmenu: (operation) => {
            const { list, copyContaxt, replyContaxt, deleteContaxt, opratorMsg } = get();
            if (!list.includes(operation)) {
                set({ opratorMsg: operation })
                return
            }
            else {
                switch (operation) {
                    case "Copy":
                        copyContaxt(opratorMsg)
                        set({ opratorMsg: null })
                        break;
                    case "Reply":
                        replyContaxt(opratorMsg)
                        set({ opratorMsg: null })
                        break;
                    case "Delete":
                        deleteContaxt(opratorMsg._id)
                        set({ opratorMsg: null })
                        break;
                    default:
                        console.log("operation not found")
                        set({ opratorMsg: null })
                }
            }

        }
    }
)
)