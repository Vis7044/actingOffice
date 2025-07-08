import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance';


interface IAddress {
  building: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

interface IClient {
  businessName: string;
  type: string;
  address: IAddress;
} 
interface IService {
    serviceName : string;
    description : string;
    amount: number
}

interface IQuote {
    key: number;
    id: string;
    businessId :string;
    businessName : string;
    quoteNumber: string;    
    date: string;
    firstResponse: string;
    services: IService[]
    totalAmount: number;
    businessDetails: IClient
    amountBeforeVat: number,
    vatAmount: number
    vatRate: number

}

export default function QuoteDetails({id}: {id: string}) {
    const [quote, setQuoteData] = useState<IQuote>();
    const fetchQuote =async () => {
        const resp = await axiosInstance.get(`Quote/get/${id}`);
        setQuoteData(resp.data)
        console.log(resp.data)
    }
    useEffect(() => {
        fetchQuote()
    },[])
  return (
    <div>
        <p>To,</p>
        <div style={{paddingLeft: '10px', borderBottom: '1px solid', borderColor: 'rgba(0,0,0,0.3)'}}>
            <div style={{display:'flex', justifyContent: 'space-between'}}>
                <p>{quote?.businessName}</p>
                <p><span>quote data: </span>{quote?.date}</p>
            </div>
            <div style={{color: 'gray'}}>
                <p>{quote?.businessDetails?.address.building}</p>
                <p>{quote?.businessDetails?.address.street}</p>
                <p>{quote?.businessDetails?.address.city}</p>
                <p>{quote?.businessDetails?.address.pinCode}</p>
                <p>{quote?.businessDetails?.address.state}</p>
                <p>{quote?.businessDetails?.address.country}</p>
            </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'rgba(0,0,0,0.3)' }}>
           <div style={{display: 'flex', gap: '20px'}}>
             <p>Sr. No</p>
            <p>Description</p>
           </div>
            <p>Amount</p>
        </div>
        <div>
            {quote?.services.map((service,index) => {
                return (
                <div key={index}>
                    <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'rgba(0,0,0,0.3)'}}>
                    <div style={{display: 'flex', gap: '60px'}}>
                        <p>{index+1}</p>
                        <p>{service.description}</p>
                    </div>
                        <p>€{service.amount}</p>
                    </div>
                </div>
            )
            })}
        </div>
        <div style={{position: 'relative', color: 'black'}}>
                    <div style={{display: 'flex', justifyContent: 'end', borderBottom: '1px solid', borderColor: 'rgba(0,0,0,0.3)'}}>
                        <div style={{display: 'flex', gap: '60px'}}>
                            <p>Sub Total</p>
                            <p>€{quote?.amountBeforeVat}</p>
                        </div>
                       
                    </div>
                    <div style={{display: 'flex', width: '100px',position: 'absolute',right: '3px', justifyContent: 'end',gap: '60px',borderBottom: '1px solid', borderColor: 'rgba(0,0,0,0.3)'}}>
                        <p>VAT({quote?.vatRate}%)</p>
                        <span >€{quote?.vatAmount}</span>
                    </div>
                    <div style={{display: 'flex', width: '100px',position: 'absolute',top: '90px',right: '3px', justifyContent: 'end',gap: '60px',borderBottom: '1px solid', borderColor: 'rgba(0,0,0,0.3)' }}>
                        <p>Total</p>
                        <p>€{quote?.totalAmount}</p>
                    </div>
                
        </div>
    </div>
  )
}
