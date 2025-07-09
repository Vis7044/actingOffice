import { useState, type ReactNode } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import QuoteDetails from './QuoteDetails';

function QuoteDetailSideCanvas({ item, id, val}: { item:string, id: string, val: ReactNode}) {
  const [show, setShow] = useState(false);

  const location = window.location.pathname;
  const isQuotePage = location.includes('quote');
  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => setShow(true);

  return (
    <>
      <span onClick={handleShow}>{item}{val}</span>
      <Offcanvas style={isQuotePage?{width: '800px'}: {width: '600px'}} show={show} onHide={handleClose} placement={'end'} >
        <Offcanvas.Header closeButton style={{borderBottom: '1px solid', borderColor: 'slate'}}>
          Quote Details
        </Offcanvas.Header>
        <Offcanvas.Body>
          <QuoteDetails id={id}/>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default QuoteDetailSideCanvas;
