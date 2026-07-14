import { create } from 'zustand';
import Instance from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const url = import.meta.env.MODE === "development" ? "http://localhost:8081" : "/";
export const checkAuthStore = create((set, get) => ({
    isAuth: null,
    isSignup: false,
    isLogin: false,
    isUpdateprfile: false,
    ischeckauth: false,
    onlineUsers: [],
    socket: null,

    checkauth: async () => {
        set({ isCheckauth: true });
        try {
            const res = await Instance.get('/auth/check');
            set({ isAuth: res.data });
            get().socketConnect();
        } catch (error) {
            set({ isAuth: false });
        }
        finally {
            set({ isCheckauth: false });
        }
    },

    signup: async (data) => {
        set({ isSignup: true });
        try {
            const res = await Instance.post('/auth/signup', data);
            set({ isAuth: res.data });
            if (isAuth) {
                toast.success('Signup Success');
            }
            get().socketConnect();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
            toast.error(errorMessage);
        } finally {
            set({ isSignup: false });
        }
    },

    logout: async () => {
        try {
            const res = await Instance.get('/auth/logout');
            get().socketDisconnect();
            set({ isAuth: null });
            if (!isAuth) {
                toast.success(res.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
            toast.error(errorMessage);
        }
    },

    login: async (data) => {
        set({ isLogin: true });
        try {
            const res = await Instance.post('/auth/login', data);
            set({ isAuth: res.data });
            toast.success('Login Success');
            get().socketConnect();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
            toast.error(errorMessage);
        } finally {
            set({ isLogin: false });
        }
    },

    updateprofile: async (data) => {
        set({ isUpdateprfile: true });
        try {
            const res = await Instance.put('/auth/update', data);
            set({ isAuth: res.data });
            if (isAuth) {
                toast.success('Profile Updated');
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdateprfile: false });
        }
    },

    socketConnect: () => {
        const { isAuth } = get()
        if (!isAuth || get().socket?.connected) return;
        const socket = io(url, {
            query: {
                userId: isAuth._id,
            },
        })
        socket.connect()
        socket.on("onelineusers", (usersid) => {
            set({ onlineUsers: usersid })
        })
        set({ socket: socket })
    },

    socketDisconnect: async () => {
        if (get().socket?.connected) get().socket.disconnect();
    }
}));