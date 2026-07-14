import React from 'react'
import { useChatStore } from '../files/useChatStore';
import SideBar from '../component/SideBar';
import NoChatSelected from '../component/NoChatSelected';
import ChatContainer from '../component/ChatContainer';

function Home() {
  const { selectedUser } = useChatStore();
  return (
    <div className="h-[calc(100dvh-45px)] bg-base-200">
      <div className="flex items-center justify-center pt-5 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <SideBar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>

  )
}

export default Home