import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Callout,  mergeStyles, Text } from "@fluentui/react";
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
    width: 250,
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




const NavItem: React.FC<NavItemProps> = ({ icon, label, isOpen }) => (
  <Stack horizontal horizontalAlign="start" verticalAlign="center" styles={{root: {
    padding: '0px 0 10px 20px',
  }}}  tokens={{childrenGap : 20}}>
    <Text>{icon}</Text>
    {isOpen && <Text variant="mediumPlus">{label}</Text>}
  </Stack>
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
    <Stack horizontal className="lato-thin">
      {/* Sidebar */}
      <Stack
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
        <Stack
          verticalAlign="start"
          styles={{root: {
            
            borderBottom: '1px solid',
            borderColor: 'rgba(0,0,0,0.1)'
          }}}
          tokens={{childrenGap: 25}}
        >
          <Stack
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            styles={{root: {
              padding: '10px 0 0px 20px',
            }}}
          >
            <Text styles={{root: {
              cursor: 'pointer'
            }}}><FaBars size={18} /></Text>
          </Stack>
          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            <NavItem
              icon={<RiDashboardHorizontalLine size={18} />}
              label="Dashboard"
              isOpen={isOpen}
            />
          </Link>
        </Stack>

        <Stack
          styles={{root: {
            marginTop: "10px",
            borderBottom: "1px solid",
            borderColor: "rgba(133, 129, 129, 0.1)",
          }}}
        >
          {isOpen && (
            <Text styles={{root: { paddingLeft: "10px", fontWeight: 700, paddingBottom: '10px' }}}>Operations</Text>
          )}
          <Link
            to={"/client"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem icon={<TfiBag size={18}  />} label="Client" isOpen={isOpen} />
          </Link>
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem
              icon={<HiOutlineCalendarDays size={18}  />}
              label="Quotes"
              isOpen={isOpen}
            />
          </Link>
          <Link
            to={"/items"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem
              icon={<PiUserList size={18}  />}
              label="Item"
              isOpen={isOpen}
            />
          </Link>
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem
              icon={<PiCalendarDots size={18}  />}
              label="Deadlines"
              isOpen={isOpen}
            />
          </Link>
        </Stack>
        <Stack
          styles={{root: {
            marginTop: "10px",
            borderBottom: "1px solid",
            borderColor: "rgba(133, 129, 129, 0.1)",
          }}}
        >
          {isOpen && (
            <Text styles={{root: { paddingLeft: "10px", fontWeight: 700,paddingBottom: '10px' }}} >Sales</Text>
          )}
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem
              icon={<LiaUserCheckSolid size={18}  />}
              label="Leads"
              isOpen={isOpen}
            />
          </Link>
          
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem icon={<BsCardList size={18}  />} label="Task" isOpen={isOpen} />
          </Link>
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem
              icon={<PiUserList size={18} />}
              label="E-Signatures"
              isOpen={isOpen}
            />
          </Link>
          <Link
            to={"/quote"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem
              icon={<LiaCalendarSolid size={18} />}
              label="Deadlines"
              isOpen={isOpen}
            />
          </Link>
        </Stack>
      </Stack>

      {/* Content Area */}
      <Stack style={{ flex: 1 }}>
        <Stack horizontal horizontalAlign="space-between" styles={{root: {
            backgroundColor: "#0078D4",
            color: "white",
            padding: "4px",
            
            
          }}}>
          <Text variant="large" styles={{root: {
            paddingLeft: "10px" ,
            color: 'white',
            fontWeight: 500
          }}}>
            Acting Office- Dev
          </Text>
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{childrenGap: 16}}
          >
            <Stack
              horizontal
              tokens={{childrenGap: 8}}
              verticalAlign="center"
              styles={{root: {
                
                backgroundColor: "#fff",
                color: "black",
                padding: "2px 10px",
                borderRadius: 4,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              }}}
            >
              <FaSearch color="gray" />
              <input
                placeholder="Ctrl + K"
                style={{ border: "none", outline: "none" }}
              />
            </Stack>

            <BsGrid3X3Gap size={18} style={{}} />
            <VscFileSubmodule size={18} style={{}} />

            <TfiAnnouncement size={18} style={{}} />
            <IoBookmarksOutline size={18} style={{}} />
            <TfiHeadphoneAlt size={18} style={{}} />
            <LiaStickyNoteSolid size={22} style={{}} />

            <Stack
              id={buttonId}
              onClick={toggleIsCalloutVisible}
              horizontal
              horizontalAlign="center"
              verticalAlign="center"
              styles={{root: {
                borderRadius: "50%",
                overflow: "hidden",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                marginRight: "5px",
              }}}
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
            </Stack>
          </Stack>
        </Stack>
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
            <Stack horizontal  tokens={{childrenGap: 5}}>
              <Stack
                horizontal
                horizontalAlign="center"
                verticalAlign="center"
                id={buttonId}
                onClick={toggleIsCalloutVisible}
                styles={{root: {
                  borderRadius: "50%",
                  overflow: "hidden",
                  width: "50px",
                  cursor: "pointer",
                  marginRight: "5px",
                }}}
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
              </Stack>
              <Stack verticalAlign="space-between" styles={{root: { color: "black"}}}>
                <Text variant="large">{user?.firstName}</Text>
                <Text styles={{root: {
                  color: 'grey'
                }}} >{user?.role}</Text>
              </Stack>
            </Stack>

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
                <Text className={buttonStyle} onClick={() => navigate("/profile")}><IoKeyOutline /> Profile</Text>
                <Text
                className={buttonStyle}
                  onClick={() => {
                    logout()
                  }}
                >
                 <RxExit /> logout
                </Text>
              </Stack>
            </FocusZone>
          </Callout>
        ) : null}
        <Outlet />
      </Stack>
    </Stack>
  );
};
