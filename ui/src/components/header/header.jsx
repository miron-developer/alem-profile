import Logo from "./logo/logo";
import SearchUser from "./search-user/user";

import styled from "styled-components";

const SHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 1rem;
  background: linear-gradient(90deg, #340000, #000032);

  .title {
    margin: 1rem;
    text-align: center;
    color: #ffffff;
    text-shadow: 2px 3px 3px #b3b3b3;
  }
`;

export default function Header() {
  return (
    <SHeader>
      <Logo />
      <h1 className="title">Alem profiles</h1>
      <SearchUser />
    </SHeader>
  );
}
