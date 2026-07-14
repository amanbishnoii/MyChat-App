import { create } from 'zustand'
export const otherRequireFilecreate = create((set, get) => ({
    msg: null,

    showDate: (date) => {
        const [year, monthno, day] = date.split("T")[0].split("-").slice(0, 3)
        const monthnoint = parseInt(monthno)
        const monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const month = monthname[monthnoint - 1]
        const newDate = [day, month, year].join("-")
        return newDate
    },
    showTime: (time) => {
        const [hr, min] = time.split("T")[1].split(":").slice(0, 2);
        const hrint = parseInt(hr)
        const period = (hrint > 12) ? "PM" : "AM"
        let newTime = [hr, min].join(":")
        newTime = [newTime, period].join(" ")
        return newTime
    },

    findmsg: async (messages, reply) => {
        let msg = await messages?.find((message) => message._id === reply[0]) || null;
        set({ msg: msg })
    },

}
))