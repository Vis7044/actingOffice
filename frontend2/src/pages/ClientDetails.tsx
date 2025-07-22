import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useEffect, useState } from "react";
import { FaCircleUser, FaMessage } from "react-icons/fa6";
import { mergeStyles, Stack, Text } from "@fluentui/react";
import { MdEdit, MdOutlineEdit } from "react-icons/md";
import {  FaPlus } from "react-icons/fa";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { MdAttachEmail } from "react-icons/md";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { AiOutlineSignature } from "react-icons/ai";
import { TbNotes } from "react-icons/tb";

import { Label, Pivot, PivotItem } from "@fluentui/react";
import type { IStyleSet, ILabelStyles } from "@fluentui/react";
import SideCanvas from "../components/SideCanvas";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10 },
};

interface IClient {
  id: string;
  businessName: string;
  clientId: string;
  type: string;
  status: string;
  address: ClientAddress;
  history: [];
  createdBy: {
    dateTime: Date
  }
}

interface ClientAddress {
  building: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
}

export interface IClientHistory {
  id: string;
  createdBy: {
    dateTime: Date
  },
  action: string;
  description: string;
  target: {
    id: string;
    name: string;
  };
}

interface IClientHistoryWithUser {
  history: IClientHistory;
  user: IUser;
}

const iconButtons = mergeStyles({
  cursor: "pointer",
  selectors: {
    ":hover": {
      color: "rgb(36, 115, 160)",
    },
  },
});

export const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState<IClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<IClientHistoryWithUser[]>([]);

  
  const fetchClientDetail = async () => {
    try {
      const resp = await axiosInstance.get(`/Client/getClient/${id}`);
      setClient(resp.data?.client);
      setHistory(resp.data?.historyWithUsers);
    } catch (err) {
      console.error(err);
      setError("Failed to load client details.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClientDetail();
  }, [id]);

  if (loading) return <div>Loading client details...</div>;
  if (error) return <div>{error}</div>;
  if (!client) return <div>No client found.</div>;

  return (
    <Stack horizontal styles={{root: {minHeight: '92%'}}}>
      <Stack styles={{root: {width: '80%'}}}>
        <Stack horizontal tokens={{ childrenGap: 5 }}>
        <Stack
          horizontal
          styles={{ root: { margin: "20px 10px", position: "relative" } }}
        >
          <FaCircleUser size={65} color="rgba(104, 102, 102, 0.45)" />
          <Stack
            horizontal
            verticalAlign="center"
            horizontalAlign="center"
            styles={{
              root: {
                position: "absolute",
                top: "45px",
                right: "0",
                backgroundColor: "white",
                borderRadius: "50%",
                width: "22px",
                height: "22px",
                overflow: "auto",
              },
            }}
          >
            <FaPlus color="rgb(71, 162, 236)" size={12} />
          </Stack>
        </Stack>
        <Stack
          tokens={{ childrenGap: 15 }}
          styles={{ root: { padding: "10px 10px" } }}
        >
          <Stack tokens={{ childrenGap: 10 }}>
            <Text style={{ fontSize: "24px", color: "rgb(80, 79, 79)" }}>
              {client.businessName}
            </Text>
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 10 }}
            >
              <Text
                style={{
                  backgroundColor: "#FFF4CE",
                  padding: "1px 5px",
                  borderRadius: "8px",
                }}
              >
                {client.clientId}
              </Text>
              <MdEdit color="rgb(106, 176, 233)" style={{}} />
              <Text style={{ color: "rgba(124, 122, 122, 0.81)" }}>
                {client.type}
              </Text>
            </Stack>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 15 }}>
            <RiStickyNoteAddLine color="rgb(102, 184, 250)" />
            <MdAttachEmail color="rgb(102, 184, 250)" />
            <LiaFileInvoiceDollarSolid color="rgb(102, 184, 250)" />
            <AiOutlineSignature color="rgb(102, 184, 250)" />
            <TbNotes color="rgb(116, 187, 245)" />
            <FaMessage color="rgb(146, 188, 223)" />
            <FaMessage color="rgb(146, 188, 223)" />
            <FaMessage color="rgb(146, 188, 223)" />
            <FaMessage color="rgb(146, 188, 223)" />
            <FaMessage color="rgb(146, 188, 223)" />
          </Stack>
        </Stack>
      </Stack>
      <Stack
        tokens={{ childrenGap: 10 }}
        styles={{ root: { marginTop: "20px",  } }}
      >
        <Pivot aria-label="Basic Pivot Example">
          <PivotItem
            headerText="Profile"
            headerButtonProps={{
              "data-order": 1,
              "data-title": "Profile",
            }}
            style={{padding: "0px 20px"}}
          >
            <Label styles={labelStyles}>
              <Stack
                
                styles={{
                  root: {
                    width: "100%",
                    backgroundColor: "rgba(77, 74, 74, 0.07)",
                    border: "1px solid",
                    borderColor: "rgba(32, 31, 31, 0.18)",
                    borderRadius: "10px",
                  },
                }}
              >
                <Stack
                  horizontal
                  verticalAlign="center"
                  horizontalAlign="space-between"
                  styles={{
                    root: {
                      borderBottom: "1px solid",
                      borderColor: "rgba(73, 71, 71, 0.2)",

                      padding: "1px 3px",
                    },
                  }}
                >
                  <Text
                    styles={{
                      root: {
                        fontSize: "14px",
                        color: "gray",
                        fontWeight: "400",
                      },
                    }}
                  >
                    Basic Details
                  </Text>
                  <SideCanvas
                    name={
                      <span className={iconButtons}>
                        <MdOutlineEdit size={18} />
                      </span>
                    }
                    refreshLIst={fetchClientDetail}
                    isEdit={true}
                    businessId={client.id}
                  />
                </Stack>

                <Stack tokens={{childrenGap: 10}} styles={{ root: { paddingLeft: "10px" } }}>
                  <Stack>
                    <Text styles={{ root:{color: "gray", fontSize: "16px" }}}>
                      Incorporated Date
                    </Text>
                    <Text>
                      {new Date(client.createdBy.dateTime.toString().split("T")[0]).toLocaleDateString()}
                    </Text>
                  </Stack>
                  <Stack>
                    <Text
                      styles={{ root: { color: "gray", fontSize: "16px" } }}
                    >
                      Address
                    </Text>
                    <Text>
                      {client.address.street} {client.address.pinCode},{" "}
                      {client.address.city} {client.address.state}{" "}
                      {client.address.country}
                    </Text>
                  </Stack>
                  <Stack>
                    <Text
                      styles={{ root: { color: "gray", fontSize: "16px" } }}
                    >
                      Client Id
                    </Text>
                    <Text>{client.clientId}</Text>
                  </Stack>
                </Stack>
              </Stack>
            </Label>
          </PivotItem>
          <PivotItem headerText="History" style={{width: "100%" }}>
            <Label styles={labelStyles}>
              {history.map((item, index) => (
                <Stack horizontal tokens={{childrenGap: 10}} verticalAlign="center" key={index} styles={{root:{width: '100%',border: '0.4px solid',borderColor: 'rgba(71, 69, 69, 0.06)', padding: '10px'}}}>
                  <MdEdit size={20} color=" #5fb3e4ff"/>
                  <Text styles={{root:{width: "300px"}}}>
                    at {new Date(item.history.createdBy.dateTime.toString()).toLocaleString()} by{" "}
                    <strong>
                      {item.user.firstName} {item.user.lastName}
                    </strong>
                    <br />
                    Action:{" "}
                    <Text>
                      {item.history.description.split(";").map(des => <Text>{des}</Text>)}
                    </Text>
                  </Text>
                </Stack>
              ))}
            </Label>
          </PivotItem>
          <PivotItem headerText="Billing">
            <Label styles={labelStyles}>Billing</Label>
          </PivotItem>
        </Pivot>
      </Stack>
      </Stack>
      <Stack styles={{root:{width:'20%',borderLeft: '1px solid',borderColor: 'rgba(0,0,0,0.2)'}}}>
        Hello
      </Stack>
    </Stack>
  );
};
