import React, { useEffect, useRef, useState } from "react";
import {
  DetailsListLayoutMode,
  SelectionMode,
  Selection,
  ShimmeredDetailsList,
  mergeStyles,
  Text,
  Stack,
} from "@fluentui/react";
import { ThemeProvider, createTheme } from "@fluentui/react";

import "@fluentui/react/dist/css/fabric.css";
import type { IColumn } from "@fluentui/react/lib/DetailsList";
import { MarqueeSelection } from "@fluentui/react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { CommandBarNav } from "./CommandBarNav";
import QuoteDetailSideCanvas from "./QuoteDetailsSideCanvas";
import { FaShare } from "react-icons/fa";
import SideCanvas from "./SideCanvas";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import type { IQuote } from "../types/projectTypes";
import { HiOutlineExternalLink } from "react-icons/hi";

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

const actions = mergeStyles({
  display: "flex",
  alignItems: "center",
  gap: "5px",
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
  Accepted: 'rgba(95, 235, 76, 0.56)',
  Drafted: 'rgba(0,0,0,0.4)',
  Rejected: 'rgba(177, 54, 54, 0.7)',
}

const QuoteList = () => {
  const [quoteData, setQuoteData] = useState<IQuote[]>([]);
  const navigate = useNavigate();
  const [refreshList, setRefreshList] = useState(false);
  const [refreshIcon, setRefreshIcon] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ criteria: "", value: "" });
  const updateFilter = (filterValue: { criteria: string; value: string }) => {
    setFilter(filterValue);
    console.log(filterValue);
  };
  const updateSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    console.log(searchTerm);
  };
  const refresh = () => {
    setRefreshList(!refreshList);
  };

  const handleDelete = async (id: string) => {
    try {
      const resp = await axiosInstance.delete(`/Quote/delete/${id}`);
      if (resp.data) {
        console.log(resp.data);
        refresh();
      } else {
        setError(resp.data);
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
          `/Quote/get?searchTerm=${search}&criteria=${filter.criteria}&value=${filter.value}`
        );
        console.log("Response from API:", response.data);

        const data = response.data.data?.map(
          (quote: Omit<IQuote, "key">, index: number) => {
            return {
              key: index + 1,
              ...quote,
            };
          }
        );
        console.log("Fetched clients data:", data);
        // Ensure data is an array before setting state
        setQuoteData(data || []);
        setRefreshIcon(false);
      } catch (error) {
        console.error("Error fetching clients data:", error);
      }
    };

    fetchQuotesData();
  }, [refreshList, search, filter]);

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
              padding: "4px 8px",
              cursor: "pointer",
            },
          }}
        >
          <QuoteDetailSideCanvas id={item.id} item={item.quoteNumber} val="" refreshList={refresh}/>
          
        </Text>
        <Link style={{marginLeft: '2rem'}} to={`/quote/${item.id}`}><HiOutlineExternalLink size={16} /></Link>
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
      onRender: (item: IQuote) => <Text variant="mediumPlus">{item.date}</Text>,
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
          onClick={() => navigate(`/client/${item.businessId}`)}
        >
          {item.businessName}
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
        <Text variant="mediumPlus">{item.firstResponse}</Text>
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
        <Text variant="mediumPlus">{item.totalAmount}</Text>
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
        <Text variant="mediumPlus" styles={{root: {
          padding: '3px 6px',
          color: 'rgb(29, 32, 32)',
          backgroundColor: quoteStatusColor[item.quoteStatus as 'Accepted' | 'Rejected' | 'Drafted'],
          borderRadius: 6,
          fontWeight: 500
        }}}>{item.quoteStatus}</Text>
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
            <QuoteDetailSideCanvas id={item.id} item={""} val={<FaShare /> } refreshList={refresh} />
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
          <Text className={deleteButtons} onClick={() => handleDelete(item.id)}>
            <MdDelete size={18} />
          </Text>
        </Stack>
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
        updateFilter={updateFilter}
      />
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
          No Data Found Add a Quote
        </Text>
      )}

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
    </ThemeProvider>
  );
};

export default QuoteList;
