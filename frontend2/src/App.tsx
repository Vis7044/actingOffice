
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './pages/Home'
import {lazy} from 'react'
const Client = lazy(() => import('./pages/Client'))
import { Quote } from './pages/Quote'
import { Signup } from './pages/Signup'
import {SideNav} from './components/SideNav'
import { Login } from './pages/Login'
import { ClientDetails } from './pages/ClientDetails'
import ProtectRoute from './helper/ProtectRoute'
import { Profile } from './pages/Profile'



function App() {

  return (
    <>
       <BrowserRouter>
        
        <Routes>
          <Route path='/' element={<ProtectRoute><SideNav/></ProtectRoute>}>
          <Route index element={
            <Home/>}/>
          <Route path='client' element={<Client/>}/>
          <Route path='quote' element={<Quote/>}/>

          <Route path="/client/:id" element={<ClientDetails   />} />
          <Route path='profile' element={<Profile/>}/>
          </Route>

          <Route path='signup' element={<Signup/>}/> 
         <Route path='login' element={<Login/>}/>
        </Routes>
      </BrowserRouter> 
    </>
  )
}

export default App
