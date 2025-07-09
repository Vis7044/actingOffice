import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Callout,  mergeStyles } from "@fluentui/react";
import Breadcrumb from "./BreadCrumb";
import { LiaStickyNoteSolid } from "react-icons/lia";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { IoBookmarksOutline, IoKeyOutline } from "react-icons/io5";
import { TfiAnnouncement } from "react-icons/tfi";
import { VscFileSubmodule } from "react-icons/vsc";
import { BsGrid3X3Gap } from "react-icons/bs";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { TfiBag } from "react-icons/tfi";
import { BsCardList } from "react-icons/bs";
import { PiCalendarDots, PiUserList } from "react-icons/pi";
import { LiaCalendarSolid } from "react-icons/lia";
import { LiaUserCheckSolid } from "react-icons/lia";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import {
  mergeStyleSets,
  FocusZone,
  FocusZoneTabbableElements,
  FontWeights,
  Stack,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import axiosInstance from "../utils/axiosInstance";
import { RxExit } from "react-icons/rx";
import { useAuth } from "../utils/useAuth";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  isOpen: boolean;
}

interface IUser {
  firstName: string;
  role: string;
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
const styles = mergeStyleSets({
  callout: {
    width: 320,
    padding: "20px 24px",
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semilight,
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 20,
  },
});

const buttonStyle = mergeStyles({
  cursor: 'pointer',
  padding: '6px 12px',
  border: '1px solid transparent',
  borderRadius: '4px',
  transition: 'all 0.2s ease-in-out',
  selectors: {
    ':hover': {
      backgroundColor: '#f3f2f1',
      color: '#0078d4',
    },
  },
});

const navHeaderStyle = mergeStyles({
  backgroundColor: "#0078D4",
  color: "white",
  padding: "2px",
  display: "flex",
  justifyContent: "space-between",
});

const iconStyle = mergeStyles({
  fontSize: 18,
  paddingBottom: "6px",
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
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);
  const buttonId = useId("callout-button");
  const [user, setUser] = useState<IUser | null>(null);

  const {logout} = useAuth()
  const fetchUser = async () => {
    const resp = await axiosInstance.get("/Auth/me");
    setUser(resp.data);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const navigate = useNavigate();
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div style={{ display: "flex" }} className="lato-thin">
      {/* Sidebar */}
      <div
        style={{
          background: "#fff",
          color: "black",
          height: "100vh",
          borderRight: "1px solid",
          borderColor: "rgba(133, 129, 129, 0.1)",
          width: isOpen ? 200 : 64,
          transition: "width 0.3s",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid",
            borderColor: "rgba(133, 129, 129, 0.1)",
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
          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            <NavItem
              icon={<RiDashboardHorizontalLine size={20} color={"black"} />}
              label="Dashboard"
              isOpen={isOpen}
            />
          </Link>
        </div>

        <nav
          style={{
            marginTop: "10px",
            borderBottom: "1px solid",
            borderColor: "rgba(133, 129, 129, 0.1)",
          }}
        >
          {isOpen && (
            <p style={{ paddingLeft: "10px", fontWeight: "600" }}>Operations</p>
          )}
          <Link
            to={"/client"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem icon={<TfiBag />} label="Client" isOpen={isOpen} />
          </Link>
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem icon={<BsCardList />} label="Task" isOpen={isOpen} />
          </Link>
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem
              icon={<PiUserList />}
              label="E-Signatures"
              isOpen={isOpen}
            />
          </Link>
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem
              icon={<PiCalendarDots />}
              label="Deadlines"
              isOpen={isOpen}
            />
          </Link>
        </nav>
        <nav
          style={{
            marginTop: "10px",
            borderBottom: "1px solid",
            borderColor: "rgba(133, 129, 129, 0.1)",
          }}
        >
          {isOpen && (
            <p style={{ paddingLeft: "10px", fontWeight: "600" }}>Sales</p>
          )}
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem
              icon={<LiaUserCheckSolid />}
              label="Leads"
              isOpen={isOpen}
            />
          </Link>
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem
              icon={<HiOutlineCalendarDays />}
              label="Quotes"
              isOpen={isOpen}
            />
          </Link>
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem
              icon={<PiUserList />}
              label="E-Signatures"
              isOpen={isOpen}
            />
          </Link>
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem
              icon={<LiaCalendarSolid />}
              label="Deadlines"
              isOpen={isOpen}
            />
          </Link>
        </nav>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1 }}>
        <div className={navHeaderStyle}>
          <h1 style={{ paddingTop: "10px", fontSize: 16, paddingLeft: "10px" }}>
            Acting Office- Dev
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#fff",
                color: "black",
                padding: "2px 10px",
                borderRadius: 4,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              }}
            >
              <FaSearch color="gray" />
              <input
                placeholder="Ctrl + K"
                style={{ border: "none", outline: "none" }}
              />
            </div>

            <BsGrid3X3Gap size={18} style={{}} />
            <VscFileSubmodule size={18} style={{}} />

            <TfiAnnouncement size={18} style={{}} />
            <IoBookmarksOutline size={18} style={{}} />
            <TfiHeadphoneAlt size={18} style={{}} />
            <LiaStickyNoteSolid size={22} style={{}} />

            <div
              id={buttonId}
              onClick={toggleIsCalloutVisible}
              style={{
                borderRadius: "50%",
                overflow: "hidden",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                marginRight: "5px",
              }}
            >
              <img
                src="/profile_logo.jpg"
                style={{ width: "30px" }}
                alt="profile"
              />
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "green",
                  position: "absolute",
                  zIndex: "100",
                  top: "24px",
                  right: "4px",
                  border: "3px solid",
                  borderColor: "white",
                }}
              ></span>
            </div>
          </div>
        </div>
        <Breadcrumb />
        {isCalloutVisible ? (
          <Callout
            role="dialog"
            className={styles.callout}
            gapSpace={2}
            target={`#${buttonId}`}
            onDismiss={toggleIsCalloutVisible}
            setInitialFocus
          >
            <div style={{ display: "flex", gap: '5px',height: '40px'  }}>
              <div
                id={buttonId}
                onClick={toggleIsCalloutVisible}
                style={{
                  borderRadius: "50%",
                  overflow: "hidden",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  marginRight: "5px",
                }}
              >
                <img
                  src="/profile_logo.jpg"
                  style={{ width: "50px" }}
                  alt="profile"
                />
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "green",
                    position: "absolute",
                    zIndex: "100",
                    top: "36px",
                    left: "36px",
                    border: "3px solid",
                    borderColor: "white",
                  }}
                ></span>
              </div>
              <div style={{ color: "black", display:'flex', flexDirection: 'column'}}>
                <span style={{fontSize: '20px'}}>{user?.firstName}</span>
                <span style={{color: 'grey', fontSize:"16px"}}>{user?.role}</span>
              </div>
            </div>

            <FocusZone
              handleTabKey={FocusZoneTabbableElements.all}
              isCircularNavigation
            >
              <Stack
                className={styles.buttons}
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                gap={20}
                style={{display: 'flex', justifyContent: 'space-between'}}
                horizontal
              >
                <div className={buttonStyle} onClick={() => navigate("/profile")}><IoKeyOutline /> Profile</div>
                <div
                className={buttonStyle}
                  onClick={() => {
                    logout()
                  }}
                >
                 <RxExit /> logout
                </div>
              </Stack>
            </FocusZone>
          </Callout>
        ) : null}
        <Outlet />
      </div>
    </div>
  );
};
