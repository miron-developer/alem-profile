import { useSelector } from "react-redux";

import BarChart from "components/chart/bar-chart/chart";
import styled from "styled-components";

const SRatio = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;

  /* for bars */
  & > figure {
    margin: 1rem;
  }

  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

export default function AuditRatio() {
  const { auditUpCount, auditUpAmount, auditDownCount, auditDownAmount } =
    useSelector((state) => state.user);

  return (
    <SRatio>
      <BarChart
        data={[
          {
            name: "done",
            amount: auditUpAmount,
          },
          {
            name: "received",
            amount: auditDownAmount,
          },
        ]}
        title="Audit ratio (in bytes?)"
        direction="1"
        accuracy="2"
        amountSuffix="B"
      />

      <BarChart
        data={[
          {
            name: "up",
            amount: auditUpCount,
          },
          {
            name: "down",
            amount: auditDownCount,
          },
        ]}
        title="Audit ratio (in count)"
        direction="3"
        accuracy="0"
      />
    </SRatio>
  );
}
