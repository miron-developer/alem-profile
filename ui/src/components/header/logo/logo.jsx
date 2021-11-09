import styled from "styled-components";

const SLogo = styled.div`
  max-width: 5rem;
  max-height: 5rem;
  border-radius: 50%;
  overflow: hidden;

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
