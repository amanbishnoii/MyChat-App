import './App.css'
import {Routes, Route, Navigate} from 'react-router-dom'
import Navbar from './component/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Setting from './pages/Setting'
import Profile from './pages/Profile'
import {checkAuthStore} from './files/checkAuthFile'
import {usedtheme} from "./files/usedtheam"
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import { Toaster} from "react-hot-toast"
function App() {
  const {isAuth, checkauth, isCheckauth} = checkAuthStore();
  const {theme}=usedtheme();
  useEffect(() => {
    checkauth();
  }, [checkauth]);

if(isCheckauth&& !isAuth)return(
  <div className='flex justify-center items-center h-screen'>
    <Loader className="size-10 animate-spin"/>
    </div>
)
  return (
    <>
    <div data-theme={theme}>
       <Navbar/>
<Routes>
  <Route path="/" element={isAuth?<Home />:<Navigate to="/login"/>} />
  <Route path="/signup" element={!isAuth?<Signup />: <Navigate to="/"/>} />
  <Route path="/login" element={!isAuth?<Login />:<Navigate to="/"/>} />
  <Route path="/setting" element={<Setting />} />
  <Route path="/profile" element={isAuth?<Profile />:<Navigate to="/login"/>} />
</Routes>
    </div>
      <Toaster/>
    </>
  )
}

export default App
