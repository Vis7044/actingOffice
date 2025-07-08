
import { Link, useLocation } from 'react-router-dom';
// import './Breadcrumb.css'; 

const Breadcrumb = () => {
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter(Boolean); // remove empty items

  return (
    <nav style={{borderBottom: '1px solid', borderBottomColor:'rgb(0,0,0,0.2', height: '30px'}}>
      <ul style={{ listStyle: 'none', display: 'flex', alignItems: 'center', height: '30px', }}>
        <li style={{marginLeft: '-28px'}}>
          <Link to="/" style={{textDecoration: 'none',color: 'black', }}>Home </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={index}>
              {isLast ? (
                <span>&nbsp; {' > '}{decodeURIComponent(name)}</span>
              ) : (
                <Link style={{textDecoration: 'none',color: 'black'}}  to={routeTo}> &nbsp; {" > "}{decodeURIComponent(name)}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
