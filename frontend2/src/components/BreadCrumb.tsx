import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Stack, Text, type IStackTokens, type IStackStyles, type ITextStyles } from '@fluentui/react';
import { PiGreaterThanLight } from "react-icons/pi";
import { LiaGreaterThanSolid } from "react-icons/lia";

// Stack spacing between items
const stackTokens: IStackTokens = {
  childrenGap: 4,
};

// Outer container styles
const containerStyles: IStackStyles = {
  root: {
    borderBottom: '1px solid rgba(0,0,0,0.2)',
    height: '40px',
    padding: '0 16px',
    fontSize: '14px',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
};

// Text styles
const linkTextStyles: ITextStyles = {
  root: {
    color: '#007bff',
    fontWeight: 'normal',
    textDecoration: 'none',
    selectors: {
      ':hover': {
        textDecoration: 'underline',
      },
    },
  },
};

const currentTextStyles: ITextStyles = {
  root: {
    color: 'rgb(33, 35, 37)',
    fontWeight: 600,
    fontSize: 16,
  },
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <Stack horizontal verticalAlign="center" styles={containerStyles} tokens={stackTokens}>
      <Stack horizontal verticalAlign="center" tokens={stackTokens}>
        <RouterLink to="/" style={{ textDecoration: 'none' }}>
          <Text styles={linkTextStyles}>Home</Text>
        </RouterLink>
      </Stack>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <Stack horizontal key={index} verticalAlign="center" tokens={stackTokens}>
            {isLast ? (
              <>
                <LiaGreaterThanSolid size={16} />
                <Text styles={currentTextStyles}>{decodeURIComponent(name)}</Text>
              </>
            ) : (
              <>
                <PiGreaterThanLight size={16} />
                <RouterLink to={routeTo} style={{ textDecoration: 'none' }}>
                  <Text styles={linkTextStyles}>{decodeURIComponent(name)}</Text>
                </RouterLink>
              </>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default Breadcrumb;
