import React, { useEffect, useRef, useState } from 'react';
import {
  DetailsListLayoutMode,
  SelectionMode,
  Selection,
  ShimmeredDetailsList,
  
} from '@fluentui/react';
import { ThemeProvider, createTheme } from '@fluentui/react';

import '@fluentui/react/dist/css/fabric.css';
import type { IColumn } from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { CommandBarNav } from './CommandBarNav';
import QuoteDetailSideCanvas from './QuoteDetailsSideCanvas';
import { FaShare } from 'react-icons/fa';

const customTheme = createTheme({
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#f3f9fd',
    themeLighter: '#d0e7f8',
    themeLight: '#a9d3f2',
    themeTertiary: '#5ca9e5',
    themeSecondary: '#1a86d9',
    themeDarkAlt: '#006cbe',
    themeDark: '#005ba1',
    themeDarker: '#004377',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#f4f4f4',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#a6a6a6',
    neutralSecondary: '#666666',
    neutralPrimaryAlt: '#3c3c3c',
    neutralPrimary: '#333333',
    neutralDark: '#212121',
    black: '#1c1c1c',
    white: '#ffffff',
  },
});



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
}

const QuoteList = () => {
  const [quoteData, setQuoteData] = useState<IQuote[]>([]);
  const navigate = useNavigate();
  const [refreshList, setRefreshList] = useState(false);
  const [refreshIcon, setRefreshIcon] = useState(false);
  
  const [search, setSearch] = useState('')

  const updateSearch = (searchTerm:string) => {
    setSearch(searchTerm);
    console.log(searchTerm)
  }
  const refresh = () => {
    setRefreshList(!refreshList);
  }


  useEffect(() => {
    const fetchQuotesData = async () => {
      try {
        setRefreshIcon(true)
        const response = await axiosInstance.get(`/Quote/get?searchTerm=${search}`);
        console.log('Response from API:', response.data);
        
        const data = response.data.data?.map((quote: Omit<IQuote, 'key'>, index: number) => {
          return {
            key: index+1,
            ...quote
          };
        })
        console.log('Fetched clients data:', data);
        // Ensure data is an array before setting state
        setQuoteData(data || []);
        setRefreshIcon(false)
      } catch (error) {
        console.error('Error fetching clients data:', error);
      }
    };

    fetchQuotesData();
  }, [refreshList,search]);



  const columns: IColumn[] = [
    {
      key: 'sl. No',
      name: 'Sl. No',
      fieldName: 'key',
      minWidth: 50,
      maxWidth: 70,
      isResizable: true,

    },
    {
      key: 'ref. No',
      name: 'Ref. No',
      fieldName: 'quoteNumber',
      minWidth: 150,
      maxWidth: 300,
      isResizable: true,
        onRender: (item: IQuote) => (
        <span
          style={{ borderRadius: '8px', padding:'4px 8px', cursor: 'pointer' }}
          
        >
          <QuoteDetailSideCanvas id={item.id} item={item.quoteNumber}/>
        </span>
      ),
      
    },
    {
      key: 'date',
      name: 'Date',
      fieldName: 'date',
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: 'businessName',
      name: 'Business Name',
      fieldName: 'businessName',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      
      onRender: (item: IQuote) => (
        <span 
          className="clickable-text"
          style={{fontSize: '14px'}}
          onClick={() => navigate(`/client/${item.businessId}`)}
        >
          {item.businessName}
        </span>
      ),
    },
    {
      key: 'firstResponse',
      name: 'First Response',
      fieldName: 'firstResponse',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
    },
    {
      key: 'amount',
      name: 'Amount',
      fieldName: 'totalAmount',
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: 'action',
      name: '',
      fieldName: '',
      minWidth: 150,
      maxWidth: 300,
      isResizable: true,
        onRender: (item: IQuote) => (
        <span
          style={{ borderRadius: '8px', padding:'4px 8px', cursor: 'pointer' }}
          
        >
          <QuoteDetailSideCanvas id={item.id} item={""} val={<FaShare/>}/>
        </span>
      ),
      
    },
    
  ];

  const selection = new Selection({
    onSelectionChanged: () => {
      const selectedItems = selection.getSelection();
      console.log('Selected items:', selectedItems);
    },
  })
  return (
    <ThemeProvider theme={customTheme}>
    <CommandBarNav refreshLIst={refresh} updateSearch={updateSearch} refreshIcon={refreshIcon}/>
   
    <MarqueeSelection selection={selection}>
      <ShimmeredDetailsList
        items={quoteData}
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
    
    </ThemeProvider>  
  );
};

export default QuoteList;
