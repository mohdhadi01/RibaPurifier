import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 16px;
`;

const HeaderWrap = styled.header`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 8px 0;
`;

const MainContainer = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 16px;
  display: block;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Page className="app-container">
      <HeaderWrap>
        <Navbar />
      </HeaderWrap>
      <MainContainer>{children}</MainContainer>
      <Footer>© {new Date().getFullYear()} RibaPurifier</Footer>
    </Page>
  );
};

export default Layout;

