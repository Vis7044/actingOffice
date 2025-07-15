import {  useEffect, useState } from "react";
import {
  DetailsListLayoutMode,
  SelectionMode,
  Selection,
  ShimmeredDetailsList,
  Pivot,
  PivotItem,
  mergeStyles,
  Text,
  Stack,
  
} from "@fluentui/react";
import { ThemeProvider } from "@fluentui/react";

import "@fluentui/react/dist/css/fabric.css";
import type { IColumn } from "@fluentui/react/lib/DetailsList";
import { MarqueeSelection } from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { CommandBarNav } from "./CommandBarNav";
import { Pagination } from "react-bootstrap";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import SideCanvas from "./SideCanvas";


interface IClient {
  key: number;
  id: string;
  clientId: string;
  businessName: string;
  type: string;
  createdOn: Date;
  status: string;
}


const iconButtons = mergeStyles({
  cursor: 'pointer',
  selectors: {
    ":hover": {
      color: 'rgb(36, 115, 160)'
    }
  }
})
const deleteButtons = mergeStyles({
  cursor: 'pointer',
  selectors: {
    ":hover": {
      color: 'rgb(160, 65, 36)'
    }
  }
})


const ClientDetailList = () => {
  const [clientsData, setClientsData] = useState<IClient[]>([]);
  const navigate = useNavigate();
  const [refreshList, setRefreshList] = useState(false);
  const [refreshIcon, setRefreshIcon] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState({criteria: '', value: ''})


  const updateSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    console.log(searchTerm);
  };

  const updateFilter = (filterValue: {criteria: string,value:string}) =>{
    setFilter(filterValue);
    console.log(filterValue)
  }
  const refresh = () => {
    setRefreshList(!refreshList);
  };

  

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        setRefreshIcon(true);
        console.log(filter)
        const response = await axiosInstance.get(
          `/Client/getClient?searchTerm=${search}&page=${activePage}&pageSize=${pageSize}&criteria=${filter.criteria}&value=${filter.value}`
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
  }, [refreshList, search, activePage, pageSize,filter]);

  if (refreshList == true) {
    console.log("refreshing");
  }

  const handleDelete = async (id: string) => {
    try {
      const resp = await axiosInstance.delete(`/Client/delete/${id}`);
      if(resp.data){
        console.log(resp.data);
        refresh()
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const columns: IColumn[] = [
    {
      key: "sl. No",
      name: "S.No.",
      onRenderHeader: () => (
        <Text variant="mediumPlus" styles={{root: { color: "rgb(2, 91, 150)", fontWeight: 500}}}>S.No.</Text>
      ),
      fieldName: "key",
      minWidth: 50,
      maxWidth: 70,
      isResizable: true,
      onRender: (item: IClient) => (
        <Text variant="medium">{item.key}</Text>
      ),

    },
    {
      key: "businessName",
      name: "Business Name",
      onRenderHeader: () => (
        <Text variant="mediumPlus" styles={{root: { color: "rgb(2, 91, 150)", fontWeight: 500}}}>Business Name</Text>
      ),
      fieldName: "businessName",
      minWidth: 150,
      maxWidth: 300,
      isResizable: true,

      onRender: (item: IClient) => (
        <Text
          className="clickable-text"
          variant="medium"
          onClick={() => navigate(`/client/${item.id}`)}
        >
          {item.businessName}
        </Text>
      ),
    },
    {
      key: "clientId",
      name: "Client ID",
      onRenderHeader: () => (
        <Text variant="mediumPlus" styles={{root: { color: "rgb(2, 91, 150)", fontWeight: 500}}}>Client Id</Text>
      ),
      fieldName: "clientId",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: IClient) => (
        <Text
        variant="medium"
          styles={{root: {
            backgroundColor: "rgb(180, 208, 230)",
            color: "rgb(5, 64, 153)",
            borderRadius: "3px",
            padding: "2px 6px",
            cursor: "pointer",
          }}}
          onClick={() => navigate(`/client/${item.id}`)}
        >
          {item.clientId}
        </Text>
      ),
    },
    {
      key: "type",
      name: "Type",
      onRenderHeader: () => (
        <Text variant="mediumPlus" styles={{root: { color: "rgb(2, 91, 150)", fontWeight: 500}}}>Type</Text>
      ),
      fieldName: "type",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: IClient) => (
        <Text variant="medium">{item.type}</Text>
      ),
    },
    {
      key: "createdOn",
      name: "Created On",
      onRenderHeader: () => (
        <Text variant="mediumPlus" styles={{root: { color: "rgb(2, 91, 150)", fontWeight: 500}}}>Create On</Text>
      ),
      fieldName: "createdOn",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: IClient) => (
        <Text variant="medium">
          {new Date(item.createdOn).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
      ),
    },
    {
      key: "Actions",
      name: "actions",
      onRenderHeader: () => (
        <Text variant="mediumPlus" styles={{root: { color: "rgb(2, 91, 150)", fontWeight: 500}}}>Actions</Text>
      ),
      fieldName: "createdOn",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item:IClient) => (
        <Stack horizontal verticalAlign="center" tokens={{childrenGap: 5}}>
           <SideCanvas name={<Text className={iconButtons}><MdOutlineEdit size={18} /></Text>} refreshLIst={refresh} isEdit={true} businessId={item.id}  />
           <Text className={deleteButtons} onClick={() => handleDelete(item.id)}><MdDelete size={18}/></Text>
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
    <ThemeProvider >
      <Pivot aria-label="Basic Pivot Example">
      <PivotItem
        headerText="Businesses"
        headerButtonProps={{
          'data-order': 1,
          'data-title': 'Businesses',
        }}
      >
        <CommandBarNav
        refreshLIst={refresh}
        updateSearch={updateSearch}
        refreshIcon={refreshIcon}
        updateFilter={updateFilter}
      />
      {clientsData.length==0 && <Text style={{position: 'absolute', top:'50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '20px'}}>No Data Found Add a business</Text>}
      {clientsData.length>0 && 
      <Stack>
        <Stack
          styles={{root:{
            maxHeight: `${clientsData.length * 45 + 70}px`,
            overflowY: "auto",
          }}}
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
      </Stack>}
      </PivotItem>
      <PivotItem headerText="Contacts">
        <CommandBarNav
        refreshLIst={refresh}
        updateSearch={updateSearch}
        refreshIcon={refreshIcon}
        updateFilter={updateFilter}
      />
      <Text styles={{root: {margin: '50px 100px'}}}>No contacts</Text>
      </PivotItem>
      
    </Pivot>
      
    </ThemeProvider>
  );
};

export default ClientDetailList;
