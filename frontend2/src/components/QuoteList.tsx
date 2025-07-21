import  { useEffect, useState } from "react";
import {
  DetailsListLayoutMode,
  SelectionMode,
  ShimmeredDetailsList,
  mergeStyles,
  Text,
  Stack,
} from "@fluentui/react";
import { ThemeProvider, createTheme } from "@fluentui/react";

import "@fluentui/react/dist/css/fabric.css";
import type { IColumn } from "@fluentui/react/lib/DetailsList";
import {  useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { CommandBarNav } from "./CommandBarNav";
import QuoteDetailSideCanvas from "./QuoteDetailsSideCanvas";
import { FaShare } from "react-icons/fa";
import SideCanvas from "./SideCanvas";
import { MdDelete, MdOutlineEdit} from "react-icons/md";
import type { IQuote } from "../types/projectTypes";
import { HiOutlineExternalLink } from "react-icons/hi";
import { QuoteStats } from "./QuoteStats";
import { LiaUndoAltSolid } from "react-icons/lia";
import { Pagination } from "react-bootstrap";

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

const iconButtons = mergeStyles({
  cursor: "pointer",
  selectors: {
    ":hover": {
      color: "rgb(36, 115, 160)",
    },
  },
});

const deleteButtons = mergeStyles({
  cursor: "pointer",
  selectors: {
    ":hover": {
      color: "rgb(160, 65, 36)",
    },
  },
});


const quoteStatusColor = {
  Accepted: "rgba(96, 153, 89, 0.56)",
  Drafted: "rgba(0,0,0,0.4)",
  Rejected: "rgba(177, 54, 54, 0.7)",
};

const QuoteList = () => {
  const [quoteData, setQuoteData] = useState<IQuote[]>([]);
  const navigate = useNavigate();
  const [refreshList, setRefreshList] = useState(false);
  const [refreshIcon, setRefreshIcon] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Active")
  const [filter, setFilter] = useState({ criteria: "", value: "" });
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const updateFilter = (filterValue: { criteria: string; value: string }) => {
    setFilter(filterValue);
  };
  const updateSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };
  const refresh = () => {
    setRefreshList(!refreshList);
  };

  const handleDelete = async (id: string) => {
    try {
      const resp = await axiosInstance.delete(`/Quote/delete/${id}`);
      if (resp.data) {
        refresh();
      } else {
        console.error('something went wrong')
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchQuotesData = async () => {
      try {
        setRefreshIcon(true);
        const response = await axiosInstance.get(
          `/Quote/get?searchTerm=${search}&criteria=${filter.criteria}&value=${filter.value}&IsDeleted=${status}&page=${activePage}&pageSize=${pageSize}`
        );

        setTotalPages(Math.ceil(response.data.totalCount/response.data.pageSize))
        const data = response.data.data?.map(
          (quote: Omit<IQuote, "key">, index: number) => {
            return {
              key: pageSize*(activePage-1)+index + 1,
              ...quote,
            };
          }
        );
        // Ensure data is an array before setting state
        setQuoteData(data || []);
        setRefreshIcon(false);
      } catch (error) {
        console.error("Error fetching clients data:", error);
      }
    };

    fetchQuotesData();
  }, [refreshList, search, filter,status,activePage,pageSize]);

  const columns: IColumn[] = [
    {
      key: "s.No",
      name: "S.No",
      onRenderHeader: () => (
        <Text
          variant="mediumPlus"
          styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
        >
          S.No
        </Text>
      ),
      fieldName: "key",
      minWidth: 50,
      maxWidth: 70,
      isResizable: true,
      onRender: (item: IQuote) => <Text variant="mediumPlus">{item.key}</Text>,
    },
    {
      key: "ref. No",
      name: "Ref. No",
      onRenderHeader: () => (
        <Text
          variant="mediumPlus"
          styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
        >
          Ref. No
        </Text>
      ),
      fieldName: "quoteNumber",
      minWidth: 150,
      
      maxWidth: 300,
      isResizable: true,
      onRender: (item: IQuote) => (
        <Stack horizontal verticalAlign="center">
          <Text
            variant="mediumPlus"
            styles={{
              root: {
                borderRadius: "8px",
                
                cursor: "pointer",
              },
            }}
          >
            <QuoteDetailSideCanvas
              id={item.id}
              item={item.quoteNumber}
              val=""
              refreshList={refresh}
            />
          </Text>
          <a
            href={`/quote/${item.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: "2rem" }}
          >
            <HiOutlineExternalLink size={16} />
          </a>
        </Stack>
      ),
    },
    {
      key: "date",
      name: "Date",
      onRenderHeader: () => (
        <Text
          variant="mediumPlus"
          styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
        >
          Date
        </Text>
      ),
      fieldName: "date",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: IQuote) => <Text variant="mediumPlus">{new Date(item.date).toISOString().split("T")[0]}</Text>,
    },
    {
      key: "businessName",
      name: "Business Name",
      onRenderHeader: () => (
        <Text
          variant="mediumPlus"
          styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
        >
          Business Name
        </Text>
      ),
      fieldName: "businessName",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,

      onRender: (item: IQuote) => (
        <Text
          className="clickable-text"
          variant="mediumPlus"
          onClick={() => navigate(`/client/${item.businessIdName.id}`)}
        >
          {item.businessIdName.name}
        </Text>
      ),
    },
    {
      key: "firstResponse",
      name: "First Response",
      onRenderHeader: () => (
        <Text
          variant="mediumPlus"
          styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
        >
          First Response
        </Text>
      ),
      fieldName: "firstResponse",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: IQuote) => (
        <Text variant="mediumPlus">{item.firstResponse.firstName} {item.firstResponse.lastName}</Text>
      ),
    },
    {
      key: "amount",
      name: "Amount",
      onRenderHeader: () => (
        <Text
          variant="mediumPlus"
          styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
        >
          Amount
        </Text>
      ),
      fieldName: "totalAmount",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: IQuote) => (
        <Text variant="mediumPlus">€ {item.totalAmount}</Text>
      ),
    },
    {
      key: "Status",
      name: "status",
      onRenderHeader: () => (
        <Text
          variant="mediumPlus"
          styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
        >
          Status
        </Text>
      ),
      fieldName: "quoteStatus",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: IQuote) => (
        <Text
          variant="mediumPlus"
          styles={{
            root: {
              padding: "2px 6px",
              color: "rgba(22, 21, 21, 1)",
              backgroundColor:
                quoteStatusColor[
                  item.quoteStatus as "Accepted" | "Rejected" | "Drafted"
                ],
              borderRadius: 6,
              fontWeight: 400,
            },
          }}
        >
          {item.quoteStatus}
        </Text>
      ),
    },
    {
      key: "action",
      name: "",
      fieldName: "",
      onRenderHeader: () => (
        <Text
          variant="mediumPlus"
          styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
        >
          Actions
        </Text>
      ),
      minWidth: 150,
      maxWidth: 300,
      isResizable: true,
      onRender: (item: IQuote) => (
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 5 }}>
          <Text className={iconButtons}>
            {" "}
            <QuoteDetailSideCanvas
              id={item.id}
              item={""}
              val={<FaShare />}
              refreshList={refresh}
            />
          </Text>
          <SideCanvas
            name={
              <Text className={iconButtons}>
                <MdOutlineEdit size={18} />
              </Text>
            }
            refreshLIst={refresh}
            isEdit={true}
            quoteId={item.id}
          />
          {item.isDeleted === "Inactive"?<Text style={{cursor: 'pointer'}} onClick={async () => {
            
                await axiosInstance.put(
                  `/Quote/update/${item?.id}`,
                  {...item,isDeleted: 'Active'}
                );
              

              refresh();
          }}>
            <LiaUndoAltSolid  size={18} />
          </Text>:<Text className={deleteButtons} onClick={() => handleDelete(item.id)}>
            <MdDelete size={18} />
          </Text>}
        </Stack>
      ),
    },
  ];

  
  return (
    <ThemeProvider theme={customTheme}>
      <Stack styles={{root: {overflow: 'hidden', height: '90vh',overflowY: 'auto'}}}>
        <CommandBarNav
        refreshLIst={refresh}
        updateSearch={updateSearch}
        refreshIcon={refreshIcon}
        updateFilter={updateFilter}
        updateStatus={setStatus}
      />
      <QuoteStats refreshList={refreshList} />
      {quoteData.length == 0 && (
        <Text
          variant="large"
          styles={{
            root: {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            },
          }}
        >
          No Data Found
        </Text>
      )}

      <Stack>
        {quoteData.length > 0 && (
        <ShimmeredDetailsList
          items={quoteData}
          columns={columns}
          setKey="set"
          
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.none}
          isHeaderVisible={true}
          enableShimmer={refreshIcon}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="select row"
          
        />
      )}
      </Stack>
      <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
          <Text styles={{root:{ marginLeft: "60px"} }}>
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
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
          </select>
        </Text>
        <Pagination style={{ marginRight: "60px", paddingTop: "15px"} }>
          <Pagination.First onClick={() => setActivePage(1)} />
          <Pagination.Prev
            onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
          />

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            
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
        </Stack>
      </Stack>
      
    </ThemeProvider>
  );
};

export default QuoteList;
