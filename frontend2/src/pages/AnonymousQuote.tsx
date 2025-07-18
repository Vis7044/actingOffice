import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Image, Row, Table } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance';
import { FaCheckCircle } from 'react-icons/fa';

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
    quoteStatus:string
}

export default function AnonymousQuote() {
  const [quoteData, setQuoteData] = useState<IQuote | null>(null)
  const {id} = useParams();
  const fetchQuote = async () => {
    const resp = await axiosInstance.get(`/Quote/get/${id}`);
    const data = resp.data;
    setQuoteData(data);
  }

  useEffect(() => {
    fetchQuote()
  },[])
  return (
    <Container fluid style={{maxWidth: '700px'}}>
      <Row>
        <Col style={{display: 'flex', alignItems: 'center',justifyContent: "center"}}>
        <Image src='/logo.svg'  style={{width: "130px"}} className='py-4' />
        </Col>
      </Row>
      <Row className='border rounded col-sm-12'>
        <Card style={{padding: 0}}>
          <Card.Header >
          <span>Quote ({quoteData?.quoteNumber})</span>
          </Card.Header>
          <Card.Body>
            <div className='text-end'>To,</div> 
            <div className='text-end' style={{fontWeight : 600}}>{quoteData?.businessName}</div>
            <div className='text-end text-muted' style={{fontSize: '12px'}} >{quoteData?.businessDetails?.address.building}</div>
            <div className='text-end text-muted'style={{fontSize: '12px'}}  >{quoteData?.businessDetails?.address.street}</div>
            <div className='text-end text-muted'style={{fontSize: '12px'}}  >{quoteData?.businessDetails?.address.city}</div>
            <div className='text-end text-muted'style={{fontSize: '12px'}}  >{quoteData?.businessDetails?.address.pinCode}</div>
            <div className='text-end text-muted'style={{fontSize: '12px'}}  >{quoteData?.businessDetails?.address.state}</div>
            <div className='text-end text-muted'style={{fontSize: '12px'}}  >{quoteData?.businessDetails?.address.country}</div>
            <div className='text-end'><span  style={{fontWeight: 600,fontSize: '14px'}}>Quote Date: </span><span  style={{fontSize: '14px'}}>{quoteData?.date}</span></div>
            <Table>
              <thead>
                <tr>
                  <th style={{width: '100px'}}>S.No.</th>
                  <th>Description</th>
                  <th className='text-end'>Price</th>
                </tr>
              </thead>
              <tbody className='border-bottom'>
                {quoteData?.services?.map((quote, index) => {
                  return <tr>
                    <td style={{width: '100px'}}>{index+1}</td>
                    <td>{quote.description}</td>
                    <td className='text-end'>€{quote.amount}</td>
                  </tr>
                })}
                <tr>
                  <td className='border-0'></td>
                  <td className='text-end border-0'>Sub Total</td>
                  <td className='text-end'>€{quoteData?.amountBeforeVat}</td>
                </tr>
                <tr>
                  <td className='border-0'></td>
                  <td className='text-end border-0'>VAT ({quoteData?.vatRate}%)</td>
                  <td className='text-end'>€{quoteData?.vatAmount}</td>
                </tr>
                <tr>
                  <td className='border-0'></td>
                  <td className='text-end border-0'>Total</td>
                  <td className='text-end' style={{width: '140px'}}>€{quoteData?.totalAmount}</td>
                </tr>
              </tbody>
            </Table>
            <Card className='border mx-auto mb-4 pb-4' style={{width: '70%'}}>
                <div className='border-bottom pb-2' style={{margin: '20px 20px 0 40px'}}>
                  <FaCheckCircle color=' #8de23eff' /> Signature valid
                </div>
                <Card.Body style={{margin: '10px 20px 0 40px', padding: 0}}>
                  <div>Timestamp: {quoteData?.date}</div>
                  <div>Ip Address</div>
                  <div>Signature ID</div>
                  <div>Document ID: {quoteData?.id}</div>
                </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
