import {
  DetailsListLayoutMode,
  mergeStyles,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Text,
  type IColumn,
} from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { CommandBarNav } from "../components/CommandBarNav";
import axiosInstance from "../utils/axiosInstance";
import SideCanvas from "../components/SideCanvas";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { LiaUndoAltSolid } from "react-icons/lia";
import { Pagination } from "react-bootstrap";

interface IService {
  id: string;
  key: number;
  name: string;
  description: string;
  amount: number;
  userId: string;
  isDeleted: string;
}

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

export default function Item() {
  const [itemData, setItemData] = useState<IService[]>([]);
  const [refreshList, setRefreshList] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({});
  const [refreshIcon, setRefreshIcon] = useState(false);
  const [status, setStatus] = useState("Active");
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const updateSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  const updateFilter = (filterValue: { criteria: string; value: string }) => {
    setFilter(filterValue);
  };
  const getData = async () => {
    setRefreshIcon(true);
    const resp = await axiosInstance.get(
      `/Service/get?searchTerm=${search}&IsDeleted=${status}&page=${activePage}&pageSize=${pageSize}`
    );
    const valuewithkey = resp.data.data.map((item: IService, index: number) => {
      return { ...item, key: pageSize*(activePage-1)+index + 1};
    });
    setRefreshIcon(false);
    setItemData(valuewithkey);

    setTotalPages(Math.ceil(resp.data.totalCount / resp.data.pageSize));
  };
  useEffect(() => {
    getData();
  }, [refreshList, search, status, filter, activePage, pageSize]);

  const refresh = () => {
    setRefreshList(!refreshList);
  };

  const handleDelete = async (id: string) => {
    try {
      const resp = await axiosInstance.post(`/Service/delete/${id}`);
      if (resp.data) {
        refresh();
      } else {
        console.log(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      onRender: (item: IService) => (
        <Text variant="mediumPlus">{item.key}</Text>
      ),
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
      onRender: (item: IService) => (
        <Text variant="mediumPlus">{item.description}</Text>
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
      fieldName: "amount",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,

      onRender: (item: IService) => (
        <Text variant="mediumPlus">€ {item.amount}</Text>
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
      onRender: (item: IService) => (
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 5 }}>
          <SideCanvas
            name={
              <Text className={iconButtons}>
                <MdOutlineEdit size={18} />
              </Text>
            }
            refreshLIst={refresh}
            isEdit={true}
            itemId={item.id}
          />
          {item.isDeleted === "Active" ? (
            <Text
              className={deleteButtons}
              onClick={() => handleDelete(item.id)}
            >
              <MdDelete size={18} />
            </Text>
          ) : (
            <Text
              style={{ cursor: "pointer" }}
              onClick={async () => {
                await axiosInstance.put(`/Service/update/${item?.id}`, {
                  ...item,
                  isDeleted: "Active",
                });

                refresh();
              }}
            >
              <LiaUndoAltSolid size={18} />
            </Text>
          )}
        </Stack>
      ),
    },
  ];
  return (
    <Stack>
      <Stack
        styles={{
          root: { overflow: "hidden", height: "90vh", overflowY: "auto" },
        }}
      >
        <Stack>
          <CommandBarNav
            refreshLIst={refresh}
            updateSearch={updateSearch}
            refreshIcon={refreshIcon}
            updateFilter={updateFilter}
            updateStatus={setStatus}
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
              No Data Found
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

        {itemData.length > 0 && <Stack
          horizontal
          verticalAlign="center"
          horizontalAlign="space-between"
        >
          <Text styles={{ root: { marginLeft: "60px" } }}>
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
          <Pagination style={{ marginRight: "60px", paddingTop: "15px" }}>
            <Pagination.First onClick={() => setActivePage(1)} />
            <Pagination.Prev
              onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
            />

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((val) => (
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
        </Stack>}
      </Stack>
    </Stack>
  );
}
