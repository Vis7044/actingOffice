
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { SideNav } from './components/SideNav'
import Home from './pages/Home'
import { Client } from './pages/Client'
import { Quote } from './pages/Quote'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'



function App() {

  return (
    <>
      <BrowserRouter>
        
        <Routes>
          <Route path='/' element={<SideNav/>}>
          <Route index element={<Home/>}/>
          <Route path='client' element={<Client/>}/>
          <Route path='quote' element={<Quote/>}/> 
          </Route>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
