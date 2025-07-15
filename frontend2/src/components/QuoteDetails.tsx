import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance';
import { Stack, StackItem, Text } from '@fluentui/react';
import type { IQuote } from '../types/projectTypes';


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
  id: string
} 


interface Quote extends IQuote {
  vatRate: number;
  amountBeforeVat: number;
  vatAmount: number;
  businessDetails: {
      address: IAddress,
      businessName:string,
      id: string,
      type: string
    }
}

const quoteStatusColor = {
  Accepted: 'rgba(95, 235, 76, 0.56)',
  Drafted: 'rgba(0,0,0,0.4)',
  Rejected: 'rgba(177, 54, 54, 0.7)',
}

export default function QuoteDetails({id,handleClose,refreshList}: {id: string, handleClose: () => void,refreshList: () => void}) {
    const [quote, setQuoteData] = useState<Quote>();
    const fetchQuote =async () => {
        const resp = await axiosInstance.get(`Quote/get/${id}`);
        setQuoteData(resp.data)
        console.log(resp,"lol")
    }
    useEffect(() => {
        fetchQuote()
    },[])

    const handleUpdate = async (status: number) => {
        const resp = await axiosInstance.put(`Quote/update/${id}`, {...quote, quoteStatus: status, businessIdName: {id: quote?.businessDetails.id,name: quote?.businessDetails.businessName}});
        console.log({...quote, quoteStatus: status})
        if(resp.data){
            handleClose();
            refreshList()
        }
        console.log(resp, 'updating')
    }
  return (
    <Stack styles={{root: {height: '100%',position: 'relative'}}}>
        <Text>To,</Text>
        <Stack style={{paddingLeft: '10px', borderBottom: '1px solid', borderColor: 'rgba(0,0,0,0.3)'}}>
            <Stack horizontal horizontalAlign='space-between'>
                <Text variant='large' styles={{root :{fontWeight : 600}}}>{quote?.businessDetails.businessName}</Text>
                <Text><Text variant='large' styles={{root: {fontWeight: 600}}}>date: </Text><Text styles={{root: {color: 'rgba(68, 63, 63, 0.51)', fontWeight: 500}}}>{quote?.date}</Text></Text>
            </Stack>
            <Stack styles={{root: {
                
            }}}>
                <Text styles={{root: {color: 'rgba(68, 63, 63, 0.51)', fontWeight: 500}}}>{quote?.businessDetails?.address.building}</Text>
                <Text styles={{root: {color: 'rgba(68, 63, 63, 0.51)', fontWeight: 500}}}>{quote?.businessDetails?.address.street}</Text>
                <Text styles={{root: {color: 'rgba(68, 63, 63, 0.51)', fontWeight: 500}}}>{quote?.businessDetails?.address.city}</Text>
                <Text styles={{root: {color: 'rgba(68, 63, 63, 0.51)', fontWeight: 500}}}>{quote?.businessDetails?.address.pinCode}</Text>
                <Text styles={{root: {color: 'rgba(68, 63, 63, 0.51)', fontWeight: 500}}}>{quote?.businessDetails?.address.state}</Text>
                <Text styles={{root: {color: 'rgba(68, 63, 63, 0.51)', fontWeight: 500}}}>{quote?.businessDetails?.address.country}</Text>
            </Stack>
        </Stack>
        <Stack horizontal tokens={{childrenGap : 20}} styles={{root: {borderBottom: '3px solid', borderColor: 'rgba(0, 0, 0, 0.2)', paddingBottom: '4px'}}}>
            <Text variant='mediumPlus' styles={{root:{width : '15%', fontWeight: 600}}}>Sr. No</Text>
            <Text variant='mediumPlus' styles={{root:{width : '40%', fontWeight: 600}}}>Description</Text>
            <Text variant='mediumPlus' styles={{root:{width : '45%', textAlign : 'right', fontWeight: 600}}}>Amount</Text>
        </Stack>
        <Stack>
            {quote?.services.map((service,index) => {
                return (
                 
                    <Stack key={index} horizontal tokens={{childrenGap : 20}} styles={{root: {borderBottom: '1px solid', borderColor: 'rgba(0, 0, 0, 0.2)', paddingBottom: '4px'}}}>
                        <Text variant='medium' styles={{root:{width : '15%', fontWeight: 500, color: 'rgba(68, 63, 63, 0.75)'}}}>{index+1}</Text>
                        <Text variant='medium' styles={{root:{width : '40%', fontWeight: 500,color: 'rgba(68, 63, 63, 0.75)'}}}>{service.description}</Text>
                        <Text variant='medium' styles={{root:{width : '45%', textAlign : 'right', fontWeight: 500,color: 'rgba(68, 63, 63, 0.75)'}}}>€{service.amount}</Text>
                    </Stack>
               
            )
            })}
        </Stack>
        <Stack horizontalAlign='end'>
        
            <Stack horizontal horizontalAlign='space-between' tokens={{childrenGap: 10}} styles={{root: {width: '30%',padding: 2}}}>
                <Text styles={{root: {width: '40%'}}}>Sub Total</Text>
                <Stack horizontal horizontalAlign='end' styles={{root: {borderBottom: '1px solid',width: '90%', borderColor: 'rgba(0, 0, 0, 0.2)',}}}>
                    <Text>€{quote?.amountBeforeVat}</Text>
                </Stack>
            </Stack>
            <Stack horizontal horizontalAlign='space-between' tokens={{childrenGap: 10}} styles={{root: {width: '30%',padding: 2}}}>
                <Text styles={{root: {width: '40%'}}}>VAT({quote?.vatRate}%)</Text>
                <Stack horizontal horizontalAlign='end' styles={{root: {borderBottom: '1px solid',width: '90%', borderColor: 'rgba(0, 0, 0, 0.2)',}}}>
                    <Text >€{quote?.vatAmount}</Text>
                </Stack>
            </Stack>
            <Stack horizontal horizontalAlign='space-between' tokens={{childrenGap: 10}} styles={{root: {width: '30%',padding: 2}}}>
                <Text variant='mediumPlus' styles={{root: {width: '40%', fontWeight: 600}}}>Total</Text>
                <Stack horizontal horizontalAlign='end' >
                    <Text >€{quote?.totalAmount}</Text>
                </Stack>
            </Stack>
            <Text variant="mediumPlus" styles={{root: {
                  padding: '2px 8px',
                  color: 'rgb(29, 32, 32)',
                  backgroundColor: quoteStatusColor[quote?.quoteStatus as "Accepted" | "Rejected" | "Drafted"],
                  borderRadius: 3,
                  fontWeight: 500,
                  marginTop: 10
                }}}>{quote?.quoteStatus}</Text>
        </Stack>
        <Stack horizontal tokens={{childrenGap: 10}} styles={{root: {
            position: 'absolute',
            bottom: '0',
            right: '0'
        }}}>
            {
                quote?.quoteStatus === 'Drafted' && <>
                <Text onClick={() => {handleUpdate(0)}} variant="mediumPlus" styles={{root: {
                  padding: '3px 10px',
                  color: 'rgb(29, 32, 32)',
                  backgroundColor: 'green',
                  borderRadius: 6,
                  fontWeight: 500,
                  marginTop: 10,
                  cursor: 'pointer'
                }}}>Accept</Text>
                <Text onClick={() => {handleUpdate(2)}} variant="mediumPlus" styles={{root: {
                  padding: '3px 10px',
                  color: 'rgb(32, 29, 30)',
                  backgroundColor: 'rgba(226, 55, 55, 0.86)',
                  borderRadius: 6,
                  fontWeight: 500,
                  marginTop: 10,
                  cursor: 'pointer'
                }}}>Reject</Text></>
            }
        </Stack>
    </Stack>
  )
}
