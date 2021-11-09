import { useMemo } from "react";
import { useSelector } from "react-redux";

import LineChart from "components/chart/line-chart/chart";

import { PrepareDataToGraph } from "./calculate";
import styled from "styled-components";

const SProgress = styled.div`
  height: 50rem;
`;

export default function XPProgress() {
  const { transactionXPs } = useSelector((state) => state.user);

  const { points, xAxies, yAxies, descriptionLinesThickness } = useMemo(
    () => PrepareDataToGraph(transactionXPs),
    [transactionXPs]
  );

  return (
    <SProgress>
      <LineChart
        points={points}
        xAxies={xAxies}
        yAxies={yAxies}
        descriptionLinesThickness={descriptionLinesThickness}
        title="XP progress"
      />
    </SProgress>
  );
}
