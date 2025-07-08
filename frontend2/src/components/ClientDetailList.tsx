import React, { act, useEffect, useState } from "react";
import {
  DetailsListLayoutMode,
  SelectionMode,
  Selection,
  ShimmeredDetailsList,
} from "@fluentui/react";
import { ThemeProvider, createTheme } from "@fluentui/react";

import "@fluentui/react/dist/css/fabric.css";
import type { IColumn } from "@fluentui/react/lib/DetailsList";
import { MarqueeSelection } from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { CommandBarNav } from "./CommandBarNav";
import { Pagination } from "react-bootstrap";
import { number } from "yup";

const customTheme = createTheme({
  palette: {
    themePrimary: "#0078d4",
    themeLighterAlt: "#f3f9fd",
    themeLighter: "#d0e7f8",
    themeLight: "#a9d3f2",
    themeTertiary: "#5ca9e5",
    themeSecondary: "#1a86d9",
    themeDarkAlt: "#006cbe",
    themeDark: "#005ba1",
    themeDarker: "#004377",
    neutralLighterAlt: "#f8f8f8",
    neutralLighter: "#f4f4f4",
    neutralLight: "#eaeaea",
    neutralQuaternaryAlt: "#dadada",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c8c8",
    neutralTertiary: "#a6a6a6",
    neutralSecondary: "#666666",
    neutralPrimaryAlt: "#3c3c3c",
    neutralPrimary: "#333333",
    neutralDark: "#212121",
    black: "#1c1c1c",
    white: "#ffffff",
  },
});

interface IClient {
  key: number;
  id: string;
  clientId: string;
  businessName: string;
  type: string;
  createdOn: Date;
  status: string;
}

const ClientDetailList = () => {
  const [clientsData, setClientsData] = useState<IClient[]>([]);
  const navigate = useNavigate();
  const [refreshList, setRefreshList] = useState(false);
  const [refreshIcon, setRefreshIcon] = useState(false);

  const [search, setSearch] = useState("");

  const updateSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    console.log(searchTerm);
  };
  const refresh = () => {
    setRefreshList(!refreshList);
  };

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(1);

  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        setRefreshIcon(true);
        const response = await axiosInstance.get(
          `/Client/getClient?searchTerm=${search}&page=${activePage}&pageSize=${pageSize}`
        );
        const data = response.data?.data.map(
          (client: Omit<IClient, "key">, index: number) => {
            return {
              key: index + 1,
              ...client,
            };
          }
        );
        setPageSize(response.data.pageSize);
        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
        setActivePage(response.data.page);
        console.log("Fetched clients data:", response.data);
        setClientsData(data || []);
        setRefreshIcon(false);
      } catch (error) {
        console.error("Error fetching clients data:", error);
      }
    };

    fetchClientsData();
  }, [refreshList, search, activePage, pageSize]);

  if (refreshList == true) {
    console.log("refreshing");
  }

  const columns: IColumn[] = [
    {
      key: "sl. No",
      name: "S.No.",
      onRenderHeader: () => (
        <span style={{ color: "rgb(2, 91, 150)", fontSize: "14px" }}>S.No.</span>
      ),
      fieldName: "key",
      minWidth: 50,
      maxWidth: 70,
      isResizable: true,
      onRender: (item: IClient) => (
        <span style={{ color: "black", fontSize: "14px" }}>{item.key}</span>
      ),

    },
    {
      key: "businessName",
      name: "Business Name",
      onRenderHeader: () => (
        <span style={{ color: "rgb(2, 91, 150)", fontSize: "14px" }}>Business Name</span>
      ),
      fieldName: "businessName",
      minWidth: 150,
      maxWidth: 300,
      isResizable: true,

      onRender: (item: IClient) => (
        <span
          className="clickable-text"
          style={{ fontSize: "14px" }}
          onClick={() => navigate(`/client/${item.id}`)}
        >
          {item.businessName}
        </span>
      ),
    },
    {
      key: "clientId",
      name: "Client ID",
      onRenderHeader: () => (
        <span style={{ color: "rgb(2, 91, 150)", fontSize: "14px" }}>Client Id</span>
      ),
      fieldName: "clientId",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: IClient) => (
        <span
          style={{
            backgroundColor: "rgb(131, 183, 223)",
            color: "white",
            borderRadius: "8px",
            padding: "4px 8px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/client/${item.id}`)}
        >
          {item.clientId}
        </span>
      ),
    },
    {
      key: "type",
      name: "Type",
      onRenderHeader: () => (
        <span style={{ color: "rgb(2, 91, 150)", fontSize: "14px" }}>Type</span>
      ),
      fieldName: "type",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: IClient) => (
        <span style={{ color: "black", fontSize: "14px" }}>{item.type}</span>
      ),
    },
    {
      key: "createdOn",
      name: "Created On",
      onRenderHeader: () => (
        <span style={{ color: "rgb(2, 91, 150)", fontSize: "14px" }}>Create On</span>
      ),
      fieldName: "createdOn",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: IClient) => (
        <span>
          {new Date(item.createdOn).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  const selection = new Selection({
    onSelectionChanged: () => {
      const selectedItems = selection.getSelection();
      console.log("Selected items:", selectedItems);
    },
  });



  return (
    <ThemeProvider theme={customTheme}>
      <CommandBarNav
        refreshLIst={refresh}
        updateSearch={updateSearch}
        refreshIcon={refreshIcon}
      />
      {clientsData.length==0 && <div style={{position: 'absolute', top:'50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '20px'}}>No Data Found Add a business</div>}
      {clientsData.length>0 && 
      <div>
        <div
          style={{
            maxHeight: `${clientsData.length * 45 + 70}px`,
            overflowY: "auto",
          }}
        >
          <MarqueeSelection selection={selection}>
            <ShimmeredDetailsList
            
              items={clientsData}
              columns={columns}
              selection={selection}
              setKey="set"
              layoutMode={DetailsListLayoutMode.fixedColumns}
              selectionMode={SelectionMode.single}
              isHeaderVisible={true}
              selectionPreservedOnEmptyClick={true}
              enableShimmer={refreshIcon}
              ariaLabelForSelectionColumn="Toggle selection"
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              checkButtonAriaLabel="select row"
            />
          </MarqueeSelection>
        </div>

        <div style={{ marginLeft: "60px", marginTop: "15px" }}>
          <select
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{
              backgroundColor: "  #ffffff",
              color: "rgb(27, 124, 189)",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "2px 2px",
            }}
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
        <Pagination style={{ float: "right", marginRight: "4px" }}>
          <Pagination.First onClick={() => setActivePage(1)} />
          <Pagination.Prev
            onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
          />

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(
              Math.min(activePage - 1, totalPages - 3),
              Math.min(activePage + 2, totalPages)
            )
            .map((val) => (
              <Pagination.Item
                key={val}
                active={val === activePage}
                onClick={() => setActivePage(val)}
              >
                {val}
              </Pagination.Item>
            ))}

          <Pagination.Next
            onClick={() =>
              setActivePage((prev) => Math.min(prev + 1, totalPages))
            }
          />
          <Pagination.Last onClick={() => setActivePage(totalPages)} />
        </Pagination>
      </div>}
    </ThemeProvider>
  );
};

export default ClientDetailList;
