
import * as React from "react";
import {
  AppItem,
  Hamburger,

  NavDrawer,
  NavDrawerBody,
  NavItem,
 
} from "@fluentui/react-components";

import {
 
  Tooltip,
  createPresenceComponent,
  makeStyles,
  motionTokens,
  tokens,

  useRestoreFocusTarget,
} from "@fluentui/react-components";
import {
  Board20Filled,
  Board20Regular,

  MegaphoneLoud20Filled,
  MegaphoneLoud20Regular,

  PersonLightbulb20Filled,
  PersonLightbulb20Regular,

  PersonSearch20Filled,
  PersonSearch20Regular,
  PreviewLink20Filled,
  PreviewLink20Regular,
  bundleIcon,
  PersonCircle32Regular,
} from "@fluentui/react-icons";
import { Link, Outlet } from "react-router-dom";

const drawerWidth = "260px";
const drawerMargin = tokens.spacingVerticalM;

const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    height: "calc(100vh - 20px)",
    position: "relative",
    display: "flex",
    backgroundColor: tokens.colorNeutralBackground1,
  },
  nav: {
    minWidth: "200px",
    width: drawerWidth,
  },
  content: {
    flex: "1",
    padding: "16px",
    display: "grid",
    justifyContent: "flex-start",
    alignItems: "flex-start",

    margin: 0,
    gap: tokens.spacingVerticalM,
    gridAutoRows: "max-content",
    boxSizing: "border-box",
    position: "absolute",
    inset: 0,
  },
  field: {
    display: "flex",
    marginTop: "4px",
    marginLeft: "8px",
    flexDirection: "column",
    gridRowGap: tokens.spacingVerticalS,
  },
});

/*
 * Create a custom DrawerMotion component that animates the drawer surface.
 */
const DrawerMotion = createPresenceComponent(() => {
  const keyframes = [
    {
      opacity: 0,
      transform: "translate3D(-100%, 0, 0)",
      margin: 0,
      backgroundColor: tokens.colorNeutralBackground1,
      borderColor: tokens.colorNeutralBackground1,
      borderRadius: 0,
    },
    {
      opacity: 1,
      transform: "translate3D(0, 0, 0)",
      margin: drawerMargin,
      borderColor: tokens.colorNeutralBackground4,
      borderRadius: tokens.borderRadiusXLarge,
    },
  ];

  return {
    enter: {
      keyframes,
      duration: motionTokens.durationNormal,
      easing: motionTokens.curveDecelerateMin,
    },
    exit: {
      keyframes: [...keyframes].reverse(),
      duration: motionTokens.durationSlow,
      easing: motionTokens.curveAccelerateMin,
    },
  };
});

/*
 * Create a custom ContentMotion component that animates the content element.
 */
const ContentMotion = createPresenceComponent(() => {
  const keyframes = [
    {
      transform: "translate3D(0, 0, 0)",
      width: "100%",
      margin: 0,
      backgroundColor: tokens.colorNeutralBackground1,
      borderColor: tokens.colorNeutralBackground1,
      borderRadius: 0,
    },
    {
      transform: `translate3D(calc(${drawerWidth} + ${drawerMargin}), 0, 0)`,
      width: `calc(100% - ${drawerWidth} - ${drawerMargin} * 3)`,
      margin: drawerMargin,
      backgroundColor: tokens.colorNeutralBackground3,
      borderColor: tokens.colorNeutralBackground4,
      borderRadius: tokens.borderRadiusXLarge,
    },
  ];

  return {
    enter: {
      keyframes,
      duration: motionTokens.durationGentle,
      easing: motionTokens.curveDecelerateMin,
    },
    exit: {
      keyframes: [...keyframes].reverse(),
      duration: motionTokens.durationGentle,
      easing: motionTokens.curveAccelerateMin,
    },
  };
});

const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Announcements = bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular);
const EmployeeSpotlight = bundleIcon(
  PersonLightbulb20Filled,
  PersonLightbulb20Regular
);
const Search = bundleIcon(PersonSearch20Filled, PersonSearch20Regular);
const PerformanceReviews = bundleIcon(
  PreviewLink20Filled,
  PreviewLink20Regular
);



export const SideNav = () => {
  const styles = useStyles();

  
  const [isOpen, setIsOpen] = React.useState(true);

  const [isMultiple, setIsMultiple] = React.useState(true);

  // Tabster prop used to restore focus to the navigation trigger for overlay nav drawers
  const restoreFocusTargetAttributes = useRestoreFocusTarget();



  return (
    <div className={styles.root}>
      <NavDrawer
        defaultSelectedValue="0"
        defaultSelectedCategoryValue=""
        open={isOpen}
        type={"inline"}
        multiple={isMultiple}
        
        onOpenChange={(_, data) => setIsOpen(data.open)}
        surfaceMotion={{ children: (_, props) => <DrawerMotion {...props} /> }}
        className={styles.nav}
      >
        <NavDrawerBody>
          <Link to={'/'} style={{textDecoration: 'none'}}>
          <AppItem
            icon={<PersonCircle32Regular />}
            as="a"
           
          >
            Acting office
          </AppItem>
          </Link>
          <Link to={'/'} style={{textDecoration: 'none'}}>
            <NavItem  icon={<Dashboard />} value="1">
                Dashboard
            </NavItem>
          </Link>
          <Link to={'/client'} style={{textDecoration: 'none'}}>
            <NavItem  icon={<Dashboard />} value="2">
                Client
            </NavItem>
          </Link>
          <Link to={'/quote'} style={{textDecoration: 'none'}}>
            <NavItem  icon={<Dashboard />} value="3">
                Quote
            </NavItem>
          </Link>
          

        </NavDrawerBody>
      </NavDrawer>

      <ContentMotion visible={isOpen}>
        <div className={styles.content}>
          <Tooltip content="Toggle navigation pane" relationship="label">
            <Hamburger
              onClick={() => setIsOpen(!isOpen)}
              {...restoreFocusTargetAttributes}
              aria-expanded={isOpen}
            />
          </Tooltip>

          <div className={styles.field}>
            <Outlet/>
          </div>
        </div>
      </ContentMotion>
    </div>
  );
};