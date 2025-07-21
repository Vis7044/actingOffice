import { useState, type ReactNode } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import QuoteDetails from './QuoteDetails';
import { Text } from '@fluentui/react';

function QuoteDetailSideCanvas({ item, id, val,refreshList}: { item:string, id: string, val: ReactNode,refreshList:() => void}) {
  const [show, setShow] = useState(false);
  const location = window.location.pathname;
  const isQuotePage = location.includes('quote');
  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => setShow(true);

  return (
    <>
      <Text onClick={handleShow}>{item}{val}</Text>
      <Offcanvas style={isQuotePage?{width: '700px'}: {width: '600px'}} show={show} onHide={handleClose} placement={'end'} >
        <Offcanvas.Header closeButton style={{borderBottom: '1px solid', borderColor: ' rgba(0,0,0,0.2)'}}>
          Quote Details
        </Offcanvas.Header>
        <Offcanvas.Body>
          <QuoteDetails id={id} handleClose={handleClose} refreshList={refreshList}/>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default QuoteDetailSideCanvas;
