import styled from "styled-components";

const SLogo = styled.div`
  max-width: 10rem;
  max-height: 10rem;

  img {
    width: 100%;
  }
`;

export default function Logo() {
  return (
    <SLogo>
      <img src="/logo192.png" alt="logo" />
    </SLogo>
  );
}
