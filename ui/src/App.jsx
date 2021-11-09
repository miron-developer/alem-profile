import Footer from "components/footer/footer";
import Header from "components/header/header";
import User from "components/user/user";

import styled from "styled-components";

const SApp = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function App() {
  return (
    <SApp>
      <Header />
      <User />
      <Footer />
    </SApp>
  );
}

export default App;
