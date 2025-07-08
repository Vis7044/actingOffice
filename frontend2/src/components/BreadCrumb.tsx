import { Link, useLocation } from 'react-router-dom';
import { PiGreaterThanLight } from "react-icons/pi";
import { LiaGreaterThanSolid } from "react-icons/lia";
import { FontWeights } from '@fluentui/react';

const breadcrumbStyles = {
  container: {
    borderBottom: '1px solid rgba(0,0,0,0.2)',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    fontSize: '14px',
    backgroundColor: '#f9f9f9',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    margin: 0,
    padding: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    display: 'flex',
    alignItems: 'center',
  },
  current: {
    color: 'rgb(33, 35, 37)',
    display: 'flex',
    alignItems: 'center',
    FontWeight: '800',
    fontSize: '18px',
  },
  icon: {
    margin: '0 6px',
  },
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean); // remove empty items

  return (
    <nav style={breadcrumbStyles.container}>
      <ul style={breadcrumbStyles.list}>
        <li style={breadcrumbStyles.listItem}>
          <Link to="/" style={breadcrumbStyles.link}>Home</Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={index} style={breadcrumbStyles.listItem}>
              {isLast ? (
                <>
                  <LiaGreaterThanSolid size={16} style={breadcrumbStyles.icon} />
                  <span style={breadcrumbStyles.current}>{decodeURIComponent(name)}</span>
                </>
              ) : (
                <>
                  <PiGreaterThanLight size={16} color="black" style={breadcrumbStyles.icon} />
                  <Link to={routeTo} style={breadcrumbStyles.link}>
                    {decodeURIComponent(name)}
                  </Link>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
