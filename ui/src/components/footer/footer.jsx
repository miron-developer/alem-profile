import styled from "styled-components";

const SFooter = styled.footer`
  margin-top: auto;
  padding: 1rem;
  text-align: center;
  color: #00d900;
  background: black;
`;

export default function Footer() {
  return (
    <SFooter>
      <span>
        Created by
        <a href="https://github.com/miron-developer"> Miron-developer </a>
      </span>
      <span>
        with support from <a href="https://getbootstrap.com/">Bootstrap</a> and
        <a href="https://create-react-app.dev/"> Create-react-app </a>
        powered with <a href="https://redux.js.org/"> Redux</a>,
        <a href="https://react-redux.js.org/"> React-Redux</a>,
        <a href="https://redux-toolkit.js.org/"> Redux-toolkit</a>,
        <a href="https://styled-components.com/"> Styled-components</a>.
      </span>
    </SFooter>
  );
}
