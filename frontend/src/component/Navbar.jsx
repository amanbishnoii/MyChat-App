import React from 'react'
import logo from '../pages/logoimg/sam.jpg';
import defaultimg from '../pages/logoimg/default-avatar.png';
import { Settings, House  } from 'lucide-react';
import {checkAuthStore} from '../files/checkAuthFile';
import { Link ,useNavigate } from 'react-router-dom';
function Navbar() {
  const {isAuth} = checkAuthStore();
  const navigate = useNavigate();
  return (
    <div className='bg-base-200'>
    <div className='flex justify-between items-center'>

       <div className="w-15 m-2 grid grid-cols-2 gap-1 justify-center shrink-0 cursor-default" onClick={() => navigate('/')}>
                  <img src={logo} alt="Sam Logo" className="size-7 rounded-[14px]" />
      <h3 className="text-[16px] font-bold m-0.5">
        MyChat
      </h3>
       </div>
    <div className='pr-2.5 flex gap-2 justify-center items-center'>
    {isAuth&&(<> 
        <Link to='/' className='btn btn-sm pt-0.5 pr-3 pl-3 pb-0.5 items-center rounded-xl'>
        <button className='text-[15px] flex gap-1 cursor-pointer'>
          <House  size={18} className='mt-0.5' />
          <span className='hidden sm:inline'>Home</span>
            </button>
        </Link>
       </>)}
     <Link to='/setting' className='btn btn-sm pt-0.5 pr-3 pl-3 pb-0.5 items-center rounded-xl'>
     <button className='text-[15px] flex gap-1 cursor-pointer'>
    <Settings size={18} className='mt-0.5' />
    <span className='hidden sm:inline'>Settings</span>
      </button>
      </Link>
{isAuth&& (
  <>
      <div className="cursor-default overflow-hidden rounded-[50%] scale-120 border-1 p-[3px]" onClick={() => navigate('/profile')}>
                  <img src={isAuth.profileimage|| defaultimg} alt="Profile Logo" className="size-6 scale-110 rounded-[50%] scale" />
       </div>
</>)
}
    </div>
       
    </div>
       <hr />
       </div>
  )
}

export default Navbar