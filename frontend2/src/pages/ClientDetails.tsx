import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useEffect, useState } from "react";
import { FaCircleUser, FaMessage } from "react-icons/fa6";
import { mergeStyles } from "@fluentui/react";
import { MdEdit, MdOutlineEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { MdAttachEmail } from "react-icons/md";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { AiOutlineSignature } from "react-icons/ai";
import { TbNotes } from "react-icons/tb";


import {
  Label,
  Pivot,
  PivotItem,
} from "@fluentui/react";
import type {
  IStyleSet,
  ILabelStyles,
} from "@fluentui/react";
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
  createdOn: Date
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
  dateTime: string;           
  action: string;               
  description: string;
  target: {
    id:string,
    name: string
  }
}

interface IClientHistoryWithUser {
  history: IClientHistory;
  user: IUser;
}

const profileHeader = mergeStyles({
  display: "flex",
  gap: '10px'
});

const actionSection = mergeStyles({
  display: "flex",
  flexDirection: "column",
  marginTop: "10px",
  gap: "5px",
});

const iconButtons = mergeStyles({
  cursor: 'pointer',
  selectors: {
    ":hover": {
      color: 'rgb(36, 115, 160)'
    }
  }
})

const profileDetail = mergeStyles({
  width: '1090px',
  height: '300px',
  backgroundColor: 'rgba(77, 74, 74, 0.07)',
  border: '1px solid',
  borderColor: 'rgba(32, 31, 31, 0.18)',
  borderRadius: '10px'
})

export const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState<IClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<IClientHistoryWithUser[]>([])

  const fetchClientDetail = async () => {
    try {
      const resp = await axiosInstance.get(`/Client/getClient/${id}`);
      setClient(resp.data?.client);
      setHistory(resp.data?.historyWithUsers);
      console.log(resp.data, 'data');
    } catch (err) {
      console.error(err);
      setError("Failed to load client details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetail();
  }, []);

  if (loading) return <div>Loading client details...</div>;
  if (error) return <div>{error}</div>;
  if (!client) return <div>No client found.</div>;

  return (
    <div>
      <div className={profileHeader}>
        <div style={{ margin: "20px 10px", position: 'relative' }}>
          <FaCircleUser size={48} color="rgba(104, 102, 102, 0.45)" />
          <div style={{ position: "absolute", top: '31px', right: '0' , backgroundColor: 'white', borderRadius: '50%',width: '17px', height: '17px',display: 'flex',alignItems: 'center',justifyContent: 'center', overflow: 'auto'}}>
            <FaPlus
            color="rgb(71, 162, 236)"
            size={12}
          />
          </div>
        </div>
        <div className={actionSection}>
          <div style={{fontSize: '24px', color: 'rgb(80, 79, 79)'}}>{client.businessName}</div>
          <div style={{ display: "flex", gap: "10px", alignItems: 'center', }}>
            <span
              style={{
                backgroundColor: "#FFF4CE",
                padding: "1px 5px",
                borderRadius: "8px",
              }}
            >
              {client.clientId}
            </span>
            <MdEdit color="rgb(106, 176, 233)" style={{ }} />
            <span style={{ color: 'rgba(124, 122, 122, 0.81)' }}>{client.type}</span>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            
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
          </div>
          <Pivot aria-label="Basic Pivot Example">
            <PivotItem
              headerText="Profile"
              headerButtonProps={{
                "data-order": 1,
                "data-title": "Profile",
              }}
            >
              <Label styles={labelStyles}>
                <div className={profileDetail}>
                <div style={{borderBottom: '1px solid', borderColor: 'rgba(73, 71, 71, 0.2)',display:'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1px 3px'}}>
                  <span style={{ fontSize: '14px', color: 'gray', fontWeight: '400',}}>Basic Details</span>
                  <SideCanvas name={<span className={iconButtons}><MdOutlineEdit size={18} /></span>} refreshLIst={fetchClientDetail} isEdit={true} businessId={client.id}  />
                </div>

                <div style={{paddingLeft: '10px'}}>
                  <div>
                    <p style={{color: 'gray', fontSize: '16px'}}>Incorporated Date</p>
                    <p>{new Date(client.createdOn).toLocaleDateString()}</p>
                    
                  </div>
                  <div>
                    <p style={{color: 'gray', fontSize: '16px'}}>Address</p>
                    <p>{client.address.street} {client.address.pinCode}, {client.address.city} {client.address.state}  {client.address.country}</p>
                  </div>
                  <div>
                    <p style={{color: 'gray',fontSize: '16px'}}>Client Id</p>
                    <p>{client.clientId}</p>
                  </div>
                </div>
                </div>
              </Label>
            </PivotItem>
            <PivotItem headerText="History">
              <Label styles={labelStyles}>
                {history.map((item, index) => (
                <div key={index} style={{width: '300px'}}>
                  <p >
                    at {new Date(item.history.dateTime).toLocaleString()} by{" "}
                    <strong >{item.user.firstName} {item.user.lastName}</strong><br />
                    Action: <span style={{width: '300px'}}>{item.history.description}</span>
                  </p>
                </div>  
              ))}
              </Label>
            </PivotItem>
            <PivotItem headerText="Billing">
              <Label styles={labelStyles}>Billing</Label>
            </PivotItem>  
          </Pivot>
        </div>
      </div>
    </div>
  );
};
