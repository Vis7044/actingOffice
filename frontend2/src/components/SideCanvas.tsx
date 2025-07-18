import { useState, type ReactNode } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ClientForm from './ClientForm';
import QuoteForm from './QuoteForm';
import { BsPlusLg } from 'react-icons/bs';
import axiosInstance from '../utils/axiosInstance';
import EditClientForm from './EditClientForm';
import ItemForm from './ItemForm';
import type { Client, IAddress } from '../types/projectTypes';
import type { IQuote } from '../types/projectTypes';
import { Text } from '@fluentui/react';

interface ClientWithId extends Client {
  id: string;
}

interface Quote extends IQuote {
  vatRate: number;
  amountBeforeVat: number;
  vatAmount: number;
  businessDetails: {
    address: IAddress;
    businessName: string;
    id: string;
    type: string;
  };
}

interface IService {
    key: number;
    name: string;
    description: string;
    amount: number;
    userId: string
}

function SideCanvas({
  name,
  refreshLIst,
  isEdit,
  businessId,
  quoteId,
  itemId
}: {
  name: ReactNode;
  refreshLIst: () => void;
  isEdit?: boolean;
  businessId?: string;
  quoteId?: string;
  itemId?:string
}) {
  const [show, setShow] = useState(false);
  const [isData, setIsData] = useState(false);
  const [updateClientData, setUpdateClientData] = useState<ClientWithId | null>(null);
  const [updatedQuoteData, setUpdateQuoteData] = useState<Quote | null>(null);
  const [serviceData, setServiceData] = useState<IService | null>(null)
  const location = window.location.pathname;
  const isQuotePage = location.includes('quote');
  const isItemPage = location.includes('items');
  const isClientPage = location.includes('client');

  const handleClose = () => {
    setShow(false);
    setIsData(false); // reset for next open
  };

  const handleFetch = async () => {
    try {
      const response = await axiosInstance.get(`/Client/getClient/${businessId}`);
      setUpdateClientData(response.data.client);
      setIsData(true);
    } catch (error) {
      console.error("Client fetch error:", error);
    }
  };

  const handleFetchService = async () => {
    try {
      const response = await axiosInstance.get(`/Service/get/${itemId}`);
      setServiceData(response.data)
      setIsData(true);
    } catch (error) {
      console.error("item Fetch error", error)
    }
  }

  const handleQuoteFetch = async () => {
    try {
      const response = await axiosInstance.get(`/Quote/get/${quoteId}`);
      setUpdateQuoteData(response.data);
      setIsData(true);
    } catch (error) {
      console.error("Quote fetch error:", error);
    }
  };

  const handleShow = async () => {
    setShow(true);

    if (isEdit) {
      if (quoteId) {
        await handleQuoteFetch();
      } else if (businessId) {
        await handleFetch();
      } else if(itemId) {
       await handleFetchService()
      }
    } else {
      setIsData(true); // for create mode
    }
  };

  return (
    <>
      <Text
        onClick={handleShow}
        style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
      >
        {isEdit ? name : (
          <>
            <BsPlusLg size={22} /> <Text>Add</Text>
          </>
        )}
      </Text>

      <Offcanvas
        show={show && isData}
        onHide={handleClose}
        placement="end"
        style={{ width: '700px' }}
      >
        <Offcanvas.Header closeButton style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.2)' }}>
          {isEdit ? <Text>Edit Details</Text> : <Text>{quoteId ? 'Create Quote' : 'Add Business'}</Text>}
        </Offcanvas.Header>

        <Offcanvas.Body>
          {isClientPage && !isEdit && (
            <ClientForm refreshLIst={refreshLIst} handleClose={handleClose} />
          )}
          {isQuotePage && !isEdit && !quoteId && (
            <QuoteForm isEdit={false} refreshLIst={refreshLIst} handleClose={handleClose} />
          )}
          {isClientPage && isEdit && updateClientData && (
            <EditClientForm
              refreshLIst={refreshLIst}
              handleClose={handleClose}
              initialClientData={updateClientData}
            />
          )}
          {isQuotePage && isEdit && updatedQuoteData && (
            <QuoteForm
              refreshLIst={refreshLIst}
              handleClose={handleClose}
              initialQuoteData={updatedQuoteData}
              isEdit={isEdit}
            />
          )}
          {isItemPage && !isEdit && (
            <ItemForm refreshLIst={refreshLIst} handleClose={handleClose} />
          )}
          {isItemPage && isEdit && serviceData && <ItemForm isEdit refreshLIst={refreshLIst} handleClose={handleClose} initialServiceData={serviceData} itemId={itemId} />}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SideCanvas;
