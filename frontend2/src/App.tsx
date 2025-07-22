import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import { lazy } from "react";
const Client = lazy(() => import("./pages/Client"));
import { Quote } from "./pages/Quote";
import { Signup } from "./pages/Signup";
import { SideNav } from "./components/SideNav";
import { Login } from "./pages/Login";
import { ClientDetails } from "./pages/ClientDetails";
import ProtectRoute from "./helper/ProtectRoute";
import { Profile } from "./pages/Profile";
import Item from "./pages/Item";
import AnonymousQuote from "./pages/AnonymousQuote";
import { ProtectDashborad } from "./helper/ProtectDashborad";
import { ProtectLogin } from "./helper/ProtectLogin";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectRoute>
                <SideNav />
              </ProtectRoute>
            }
          >
            <Route index element={<ProtectDashborad><Home /></ProtectDashborad>} />
            <Route path="client" index element={<Client />} />
            <Route path="quote" element={<Quote />} />
            <Route path="items" element={<Item />} />
            <Route path="client/:id" element={<ClientDetails />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="signup" element={<ProtectLogin><Signup /></ProtectLogin>} />
          <Route path="login" element={<ProtectLogin><Login /></ProtectLogin>} />
          <Route path="quote/:id" element={<AnonymousQuote />} />
          <Route path="*" element={<div>Page Not Found</div>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
