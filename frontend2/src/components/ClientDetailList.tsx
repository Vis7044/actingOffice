import React, { useEffect, useState } from 'react';
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Selection,
  
} from '@fluentui/react';
import { ThemeProvider, createTheme } from '@fluentui/react';

import '@fluentui/react/dist/css/fabric.css';
import type { IColumn } from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

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


interface IClient {
  key: any;
  id: string;
  clientId: string;
  businessName: string;
  type: string;
  createdOn: string;
  status: string;
}

const ClientDetailList: React.FC = () => {
  const [clientsData, setClientsData] = useState<IClient[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const response = await axiosInstance.get('/Client/getClient');
        const data = response.data?.data.map((client: any, index: any) => {
          return {
            key: index+1,
            ...client
          };
        })
        console.log('Fetched clients data:', data);
        // Ensure data is an array before setting state
        setClientsData(data || []);
      } catch (error) {
        console.error('Error fetching clients data:', error);
      }
    };



    fetchClientsData();
  }, []);

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
      key: 'businessName',
      name: 'Business Name',
      fieldName: 'businessName',
      minWidth: 150,
      maxWidth: 300,
      isResizable: true,

      onRender: (item: IClient) => (
        <span
          
          className="clickable-text"
          onClick={() => navigate(`/client/${item.id}`)}
        >
          {item.businessName}
        </span>
      ),
    },
    {
      key: 'clientId',
      name: 'Client ID',
      fieldName: 'clientId',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: IClient) => (
        <span
          style={{ backgroundColor: 'rgb(131, 183, 223)', color: 'white', borderRadius: '8px', padding:'4px 8px', cursor: 'pointer' }}
          onClick={() => navigate(`/client/${item.id}`)}
        >
          {item.clientId}
        </span>
      ),
    }
    ,
    {
      key: 'type',
      name: 'Type',
      fieldName: 'type',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
    },
    {
      key: 'createdOn',
      name: 'Created On',
      fieldName: 'createdOn',
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
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
    <MarqueeSelection selection={selection}>
      <DetailsList
      items={clientsData}
      columns={columns}
      selection={selection}
      setKey="set"
      layoutMode={DetailsListLayoutMode.fixedColumns}
      selectionMode={SelectionMode.single}
      isHeaderVisible={true}
      selectionPreservedOnEmptyClick={true}
      ariaLabelForSelectionColumn="Toggle selection"
      ariaLabelForSelectAllCheckbox="Toggle selection for all items"
      checkButtonAriaLabel="select row"
    />
    </MarqueeSelection>
    </ThemeProvider>  
  );
};

export default ClientDetailList;
