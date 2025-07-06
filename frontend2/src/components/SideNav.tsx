import React, { useState } from "react";
import type { ReactNode } from "react";
import { FaHome, FaUser, FaBars, FaSearch } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import { mergeStyles } from "@fluentui/react";

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
  padding: "16px",
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
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          background: "#fff",
          color: "black",
          height: "100vh",
          borderRight: "1px solid",
          borderColor: 'rgba(0, 0, 0, 0.2)',
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
          <h1 style={{ margin: 0, fontSize: 20 }}>Acting Office</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: '#fff', color: 'black', padding: '6px 10px', borderRadius: 2, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
              <FaSearch color="gray"  />
              <input placeholder="Ctrl + K" style={{border: 'none', outline: 'none'}}/>
            </div>
            <div>
              <p>Profile</p>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
