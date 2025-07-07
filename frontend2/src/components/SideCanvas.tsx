import { useState, type ReactNode } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ClientForm from './ClientForm';
import QuoteForm from './QuoteForm';

function SideCanvas({name, refreshLIst}: {name: ReactNode, refreshLIst: () => void}) {
  const [show, setShow] = useState(false);

  const location = window.location.pathname;
  const isQuotePage = location.includes('quote');
  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => setShow(true);

  return (
    <>
       <span onClick={handleShow}>Add</span>
      <Offcanvas style={isQuotePage?{width: '800px'}: {width: '600px'}} show={show} onHide={handleClose} placement={'end'} >
        <Offcanvas.Header closeButton style={{borderBottom: '1px solid', borderColor: 'slate'}}>
          {name}
        </Offcanvas.Header>
        <Offcanvas.Body>
          {!isQuotePage && (<ClientForm refreshLIst={refreshLIst} handleClose={handleClose}/>)}
          {isQuotePage && (<QuoteForm refreshLIst={refreshLIst} handleClose={handleClose}/>)}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SideCanvas;
