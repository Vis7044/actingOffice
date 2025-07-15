import { DetailsListLayoutMode, SelectionMode, ShimmeredDetailsList, Stack, Text, type IColumn } from '@fluentui/react'
import React, { useEffect, useState } from 'react'
import { CommandBarNav } from '../components/CommandBarNav'
import axiosInstance from '../utils/axiosInstance';

interface IService {
    key: number;
    name: string;
    description: string;
    amount: number;
    userId: string
}



export default function Item() {
    const [itemData, setItemData] = useState<IService[]>([]);
    const [refreshList, setRefreshList] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState({})
    const [refreshIcon, setRefreshIcon]=useState(false)

    const updateSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    console.log(searchTerm);
  };

  const updateFilter = (filterValue: {criteria: string,value:string}) =>{
    setFilter(filterValue);
    console.log(filterValue)
  }
    const getData = async () => {
        setRefreshIcon(true)
        const resp = await axiosInstance.get("/Service/get");
        const valuewithkey = resp.data.map((item: IService,index:number) =>{
            return {...item, key: index+1}
        })
        setRefreshIcon(false)
        setItemData(valuewithkey)
        console.log(resp.data)
    }
    useEffect(() => {
        getData();
    },[refreshList]) 

    const refresh = () => {
        setRefreshList(!refreshList)
    }

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
      onRender: (item: IService) => <Text variant="mediumPlus">{item.key}</Text>,
    },
    {
      key: "Service",
      name: "Service",
      onRenderHeader: () => (
        <Text
          variant="mediumPlus"
          styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
        >
          Service
        </Text>
      ),
      fieldName: "name",
      minWidth: 150,
      maxWidth: 300,
      isResizable: true,
      onRender: (item: IService) => (
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
          {item.name}
        </Text>
      ),
    },
    {
      key: "description",
      name: "Description",
      onRenderHeader: () => (
        <Text
          variant="mediumPlus"
          styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
        >
          Description
        </Text>
      ),
      fieldName: "description",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: IService) => <Text variant="mediumPlus">{item.description}</Text>,
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
      fieldName: "amount",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,

      onRender: (item: IService) => (
        <Text
          
          variant="mediumPlus"
          
        >
          € {item.amount}
        </Text>
      ),
    },
  ];
  return (
    <Stack>
        <CommandBarNav
            refreshLIst={refresh}
            updateSearch={updateSearch}
            refreshIcon={refreshIcon}
            updateFilter={updateFilter}
        />
        {itemData.length == 0 && (
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
        
              {itemData.length > 0 && (
                <ShimmeredDetailsList
                  items={itemData}
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
  )
}
