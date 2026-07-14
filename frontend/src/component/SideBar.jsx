import { useEffect } from 'react'
import { Users } from 'lucide-react';
import defaultimg from '../pages/logoimg/default-avatar.png';
import { useChatStore } from '../files/useChatStore';
import Sideskelton from '../skelton/Sideskelton';
import { checkAuthStore } from '../files/checkAuthFile';
function SideBar() {
  const { getUsers, users, selectedUser, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = checkAuthStore();
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  if (isUsersLoading) return <Sideskelton />;

  return (
    <aside className={`h-full w-[100vw] sm:w-68 border-r border-base-300 flex flex-col transition-all duration-200 ${selectedUser?"hidden sm:flex":"" }`}>
      <div className='border-b border-base-300 w-full p-5'>
        <div className='flex items-center gap-3'>
          <Users className='size-6' />
          <span className='font-medium sm:block'>
            Contacts
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => (
         
          <button
            key={user._id}
            onClick={() => setSelectedUser(user
            )}
            className={`w-full
              
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >


            <div className={`flex w-fit p-3 flex-row hover:bg-base-300 transition-colors
         ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}>
              <div className="relative mx-auto sm:mx-0">
                <img
                  src={user.profileimage || defaultimg}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>
              <div className="text-left min-w-0 pl-2 ">
                <div className="font-medium truncate">{user.name}</div>
                <div className="text-sm text-zinc-400 ">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

    </aside>

  )
}

export default SideBar