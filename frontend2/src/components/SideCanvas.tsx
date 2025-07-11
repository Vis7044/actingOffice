import { use, useEffect, useState, type ReactNode } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ClientForm from './ClientForm';
import QuoteForm from './QuoteForm';
import { BsPlusLg } from 'react-icons/bs';
import axiosInstance from '../utils/axiosInstance';
import EditClientForm from './EditClientForm';
import type { Client } from '../types/projectTypes';
import type {IQuote} from '../types/projectTypes'
import { Stack, Text } from '@fluentui/react';
import ItemForm from './ItemForm';

interface ClientWithId extends Client {
  id: string
}

interface Quote extends IQuote {
  vatRate: number
  amountBeforeVat: number
  vatAmount: number
}

function SideCanvas({name, refreshLIst, isEdit, businessId, quoteId}: {name: ReactNode, refreshLIst: () => void, isEdit?:boolean,  businessId?: string, quoteId?: string}) {
  const [show, setShow] = useState(false);

  const location = window.location.pathname;
  const isQuotePage = location.includes('quote');
  const isItemPage = location.includes('items');
  const itemPage = location.includes('client')
  const handleClose = () => {
    setShow(false);
    
  }
  const [updateClientData, setUpdateClientData] = useState<ClientWithId | null>(null);
  const [updatedQuoteData, setUpdateQuoteData] = useState<Quote | null>(null)
    const handleFetch = async () => {
      try {
        const clientData = await axiosInstance.get(`/Client/getClient/${businessId}`)
        setUpdateClientData(clientData.data.client)
        
      } catch (error) {
        console.log(error)
      }
    }

    const handleQuoteFetch = async () => {
      try {
        const quoteData = await axiosInstance.get(`/Quote/get/${quoteId}`);
        setUpdateQuoteData(quoteData.data)
      } catch (error) {
        console.log(error)
      }
    }
    useEffect(() => {
      if(quoteId) handleQuoteFetch()
      if(businessId) handleFetch()
    },[])
  
  const handleShow = () => setShow(true);

  return (
    <>
       <Text onClick={handleShow} style={{display: 'flex', alignItems: 'center', gap: '5px'}}>{isEdit ? name: <Text ><BsPlusLg size={22} /> <Text>Add</Text></Text>}</Text>
      <Offcanvas style={isQuotePage?{width: '700px'}: {width: '700px'}} show={show} onHide={handleClose} placement={'end'} >
        <Offcanvas.Header closeButton style={{borderBottom: '1px solid', borderColor: 'rgba(0, 0, 0, 0.2)'}}>
          {isEdit ? <Text>Edit Details</Text>: <Text>{quoteId? 'Create Quote': 'Add Business'}</Text>}
        </Offcanvas.Header>
        <Offcanvas.Body >
          {itemPage && !isEdit && (<ClientForm refreshLIst={refreshLIst} handleClose={handleClose}/>)}
          {isQuotePage && !isEdit && !quoteId && (<QuoteForm isEdit={false} refreshLIst={refreshLIst} handleClose={handleClose}/>)}
          {itemPage && isEdit && updateClientData &&  <EditClientForm refreshLIst={refreshLIst} handleClose={handleClose} initialClientData={updateClientData}/>}
          {isQuotePage && isEdit  && updatedQuoteData && (<QuoteForm refreshLIst={refreshLIst} handleClose={handleClose} initialQuoteData={updatedQuoteData} isEdit={isEdit}/>)}
          {isItemPage && !isEdit && <ItemForm refreshLIst={refreshLIst} handleClose={handleClose}/> }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SideCanvas;
