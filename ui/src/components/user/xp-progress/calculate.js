import { ReadableCount } from "utils/content";

const sortByTime = (transactionXPs = {}) => {
  return Object.values(transactionXPs).sort((a, b) => {
    if (Date.parse(a.createdAt) > Date.parse(b.createdAt)) return 1;
    return -1;
  });
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getMonthDiff = (curMonth, curYear, d) => {
  const monthDiff = d.getMonth() - curMonth;
  const yearDiff = d.getFullYear() - curYear;

  if (yearDiff === 0) return monthDiff;
  if (yearDiff > 0) return yearDiff * 12 + monthDiff;
  if (yearDiff < 0) return -1;
};

const getMonthAndYears = (sorted = []) => {
  const min = new Date(sorted[0].createdAt);
  const res = [];

  let curYear = min.getFullYear();
  let curMonth = min.getMonth();
  sorted.forEach((p) => {
    const d = new Date(p.createdAt);
    const month = months[d.getMonth()];
    const k = month + " " + d.getFullYear();
    const monthDiff = getMonthDiff(curMonth, curYear, d);

    if (monthDiff > 1) {
      for (let i = 0; i < monthDiff; i++) {
        if (curMonth === 11) {
          curYear++;
          curMonth = 0;
        } else curMonth++;
        const k = `${months[curMonth]} ${curYear}`;
        if (res.includes(k)) continue;
        res.push(k);
      }
      return;
    }

    if (res.includes(k)) return;
    return res.push(k);
  });

  return res;
};

const calculatePoints = (
  maxX,
  maxY,
  minX,
  minY,
  descriptionLinesThickness,
  sortedData = []
) => {
  if (!maxX || !maxY || sortedData.length === 0) return [];

  const res = [];
  res.push({
    coords: "".concat(descriptionLinesThickness, ",", 100),
    render: () => {
      <span>init point</span>;
    },
  });
  const maxDX = maxX - minX;
  const maxDY = maxY - minY;

  let curY = minY;
  res.push(
    ...sortedData.map((p) => {
      const x = ((Date.parse(p.createdAt) - minX) * 100) / maxDX;
      const y = ((curY + p.amount) * 100) / maxDY;

      curY += p.amount;
      return {
        coords: `${descriptionLinesThickness + x},${100 - y}`,
        render: () => {
          const d = new Date(p.createdAt);
          return (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>
                Date: {d.getDate()}/{d.getMonth() + 1}/{d.getFullYear()}{" "}
              </span>
              <span>Project: {p.object.name}</span>
            </div>
          );
        },
      };
    })
  );
  return res;
};

export const PrepareDataToGraph = (transactionXPs = {}) => {
  const sorted = sortByTime(transactionXPs);

  const maxAmount = sorted.reduce((acc, p) => (acc += p.amount), 0);
  const minAmount = 0;
  const maxTime = Date.parse(sorted[sorted.length - 1].createdAt);
  const minTime = Date.parse(sorted[0].createdAt);

  const descriptionLinesThickness = 10;

  const yAxieStepCounts = 10;
  const stepYAxie = maxAmount / yAxieStepCounts;
  const yAxies = [];
  for (let i = 0; i < yAxieStepCounts + 1; i++)
    yAxies.push(ReadableCount(i * stepYAxie, 2) + "B");

  const xAxies = getMonthAndYears(sorted);
  const points = calculatePoints(
    maxTime,
    maxAmount,
    minTime,
    minAmount,
    descriptionLinesThickness,
    sorted
  );

  return {
    points,
    xAxies,
    yAxies,
    descriptionLinesThickness,
  };
};
