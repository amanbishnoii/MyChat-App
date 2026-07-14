import React from 'react'
import { CornerUpRight, X } from 'lucide-react'
import { useChatStore } from '../files/useChatStore'

function Reply() {
    const { setToReply, toReply } = useChatStore();
    return (
        <div className='flex px-2 pt-2 flex-col gap-1 bg-base-100 border-t '>
            <div className='flex justify-between px-2'>
                <div className='flex flex-row gap-1 items-center'>
                    <CornerUpRight className='size-4' />
                    <p className='text-white text-sm'>Reply To</p>
                </div>
                <div>
                    <X onClick={() => setToReply(null)} />
                </div>
            </div>

            <div className='bg-base-200 w-full rounded-xl px-3 py-2'>
                <p className='text-m text-primary'>{toReply.name}</p>
                <p className='text-sm truncate w-full'>{toReply.message}</p>
            </div>
        </div>
    )
}

export default Reply