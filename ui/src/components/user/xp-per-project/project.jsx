import { useMemo } from "react";
import { useSelector } from "react-redux";

import BarChart from "components/chart/bar-chart/chart";

export default function XPPerProject() {
  const { transactionXPs } = useSelector((state) => state.user);

  const data = useMemo(() => {
    return Object.values(transactionXPs).map((p) => {
      return {
        name: p.object.name,
        amount: p.amount,
      };
    });
  }, [transactionXPs]);

  return (
    <div className="xp-per-project">
      <BarChart
        data={data}
        title="XP per project"
        direction="1"
        accuracy="2"
        amountSuffix="B"
      />
    </div>
  );
}
