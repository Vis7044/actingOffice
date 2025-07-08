import React, { useState } from "react";
import type { ReactNode } from "react";
import { FaHome, FaUser, FaBars, FaSearch } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import { mergeStyles } from "@fluentui/react";
import Breadcrumb from "./BreadCrumb";
import { LiaStickyNoteSolid } from "react-icons/lia";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { IoBookmarksOutline } from "react-icons/io5";
import { TfiAnnouncement } from "react-icons/tfi";
import { VscFileSubmodule } from "react-icons/vsc";
import { BsGrid3X3Gap } from "react-icons/bs";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  isOpen: boolean;
}

const navItemStyle = mergeStyles({
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "8px 16px",
  cursor: "pointer",
  transition: "background-color 0.2s ease-in-out",
  selectors: {
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      visibility: "visible",
    },
  },
});

const navHeaderStyle = mergeStyles({
  backgroundColor: "#0078D4",
  color: "white",
  padding: "2px",
  display: "flex",
});

const iconStyle = mergeStyles({
  fontSize: 18,
});

const labelStyle = mergeStyles({
  fontSize: 14,
});

const NavItem: React.FC<NavItemProps> = ({ icon, label, isOpen }) => (
  <div className={navItemStyle}>
    <div className={iconStyle}>{icon}</div>
    {isOpen && <span className={labelStyle}>{label}</span>}
  </div>
);

export const SideNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div style={{ display: "flex" }} className="roboto-font">
      {/* Sidebar */}
      <div
        style={{
          background: "#fff",
          color: "black",
          height: "100vh",
          borderRight: "1px solid",
          borderColor: 'rgba(0, 0, 0, 0.1)',
          width: isOpen ? 200 : 64,
          transition: "width 0.3s",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid",
            borderColor: 'rgba(0, 0, 0, 0.2)',
          }}
        > 
          <button
            onClick={toggleSidebar}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "black",
              opacity: 0.6,
              fontSize: 20,
              paddingLeft: 16,
              paddingTop: 16,
              paddingBottom: 16,
              
            }}
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
          <Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
          <NavItem icon={<FaHome />} label="Dashboard" isOpen={isOpen} />
          </Link>
        </div>

        <nav style={{ marginTop: 16 }}>
          <Link to={'/client'} style={{ textDecoration: 'none', color: 'inherit' }}>
          <NavItem icon={<FaHome />} label="Client" isOpen={isOpen} />
          </Link>
          <Link to={'/quote'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <NavItem icon={<FaUser />} label="Quote" isOpen={isOpen} />
          </Link>
          
        </nav>
      </div>

      {/* Content Area */}
      <div style={{flex: 1}}>
        <div className={navHeaderStyle}>
          <h1 style={{ paddingTop: '10px', fontSize: 16, paddingLeft: '10px' }}>Acting Office- Dev</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: "auto",position: 'relative' }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: '#fff', color: 'black', padding: '2px 10px', borderRadius: 4, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
              <FaSearch color="gray"  />
              <input placeholder="Ctrl + K" style={{border: 'none', outline: 'none'}}/>
            </div>
            <BsGrid3X3Gap size={18} style={{}}/>
            <VscFileSubmodule size={18} style={{}}/>
            
            <TfiAnnouncement size={18} style={{}}/>
            <IoBookmarksOutline size={18} style={{}}/>
            <TfiHeadphoneAlt size={18} style={{ }}/>
            <LiaStickyNoteSolid size={22} style={{}}/>
            <div style={{ borderRadius: '50%', overflow: 'hidden', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',marginRight: '5px' }}>
                <img src="/profile_logo.jpg" style={{width: '30px',}} alt="profile"/>
            </div>
              <span style={{width: '12px', height: '12px',borderRadius:'50%',backgroundColor: 'green', position: 'absolute',zIndex: '100', top: '24px', right: '4px', border: '3px solid', borderColor: 'white'}}></span>
          </div>
        </div> 
          <Breadcrumb/>
        <Outlet />
      </div>
    </div>
  );
};
