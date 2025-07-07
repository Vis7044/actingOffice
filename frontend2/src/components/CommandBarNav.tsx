import {  useState } from "react";
import {  FaSearch } from "react-icons/fa";
import { SlReload } from "react-icons/sl";
import { CiFilter } from "react-icons/ci";
import { mergeStyles, getTheme } from "@fluentui/react";
import SideCanvas from "./SideCanvas";
import { BsPlusLg } from "react-icons/bs";

const theme = getTheme();

const commandBarStyle = mergeStyles({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 20px",
  backgroundColor: theme.palette.neutralLighter,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  borderBottom: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
});


const sectionStyle = mergeStyles({
  display: "flex",
  alignItems: "center",
  gap: "20px",
});

const itemStyle = mergeStyles({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "4px",
  selectors: {
    ":hover": {
      backgroundColor: theme.palette.neutralLight,
    },
  },
});

const filterStyle = mergeStyles({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 10px",
  backgroundColor: "#C7E0F4",
  cursor: "pointer",
  borderRadius: "40px",
  selectors: {
    ":hover": {
      backgroundColor: "#B3D0E8",
    },
  },
});

export const CommandBarNav = ({refreshLIst, updateSearch, refreshIcon}: {refreshLIst: ()=>void, updateSearch: (search:string) => void, refreshIcon: boolean}) => {
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  return (
    <div className={commandBarStyle}>
      {/* Left side */}
      <div className={sectionStyle}>
        <div className={itemStyle}>
          <BsPlusLg />

          <SideCanvas name="Add business" refreshLIst = {refreshLIst}/>
        </div>
        <div className={itemStyle} onClick={refreshLIst}>
          <SlReload className={refreshIcon? 'spin' : ''}/>
          <span >Refresh</span>
        </div>
      </div>

      {/* Right side */}
      <div className={sectionStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#fff",
            color: "black",
            padding: "8px 10px",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "rgba(0,0,0,0.2)",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          <FaSearch color="gray" />
          <input
            placeholder="Search"
            style={{ border: "none", outline: "none" }}
            onChange={(e)=>{
              setSearchTerm(e.target.value)
              if(e.target.value === ''){
                updateSearch('');
              }
            }}
            onKeyDown={(e) => {
              if(e.key === "Enter")
                updateSearch(searchTerm);
            }}
          />
        </div>
        <div className={filterStyle}>
          <CiFilter />
          <span>Add Filter</span>
        </div>
      </div>
    </div>
  );
};
