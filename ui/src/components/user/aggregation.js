import {
  setAmount,
  setCount,
  setLevel,
  setLoadingState,
  setTransactions,
} from "./userSlice";

const aggregateByType = (transactions = []) => {
  const ups = [];
  const downs = [];
  const xps = [];
  const piscines = [];

  transactions.forEach((t, i) => {
    if (t.object.type !== "project" && t.object.type !== "piscine") {
      return;
    }

    if (t.type === "up") {
      return ups.push(t);
    }

    if (t.type === "down") {
      return downs.push(t);
    }

    if (t.object.type === "piscine") {
      piscines.push(t);
      return xps.push(t);
    }

    if (
      t.type === "xp" &&
      i + 1 < transactions.length &&
      transactions[i + 1] &&
      transactions[i + 1].type === "down"
    ) {
      return xps.push(t);
    }
  });

  return {
    ups,
    downs,
    xps,
    piscines,
  };
};

const aggregateByProject = async (transactions = [], isDistinct = false) => {
  const res = {};
  transactions.forEach((t) => {
    if (isDistinct) {
      return (res[t.object.name] = t);
    }

    if (res[t.object.name]) {
      return res[t.object.name].push(t);
    }

    return (res[t.object.name] = [t]);
  });
  return res;
};

const getAmount = (transactions = []) => {
  if (!(transactions[0] instanceof Array))
    return transactions.reduce((acc, t) => (acc += parseFloat(t.amount)), 0);

  return transactions.reduce((acc, v) => (acc += getAmount(v)), 0);
};

const getCount = (transactions = {}) => {
  let c = 0;
  for (const t of Object.values(transactions)) {
    if (t instanceof Array) {
      c += t.length;
    } else c++;
  }
  return c;
};

// total xp needed for this level
const totalXPForLevel = (level) =>
  Math.round((level * 0.66 + 1) * ((level + 2) * 150 + 50));

// cumul of all the xp needed to reach this level
const cumulXpForLevel = (level) =>
  level > 0 ? totalXPForLevel(level) + cumulXpForLevel(level - 1) : 0;

// level reached for this xp
const getLevelFromXp = (xp, level = 0) =>
  cumulXpForLevel(level) >= xp ? level : getLevelFromXp(xp, level + 1);

export const AggregationUserInfo = async (transactions = [], dispatch) => {
  const allT = [];
  transactions.forEach((t) => allT.push(...t));
  const { ups, downs, xps, piscines } = aggregateByType(allT);

  const [aggrUps, aggrDowns, aggrXPs] = await Promise.all([
    aggregateByProject(ups, false),
    aggregateByProject(downs, false),
    aggregateByProject(xps, true),
  ]);

  const [upAmount, downAmount, xpAmount] = await Promise.all([
    (async () => getAmount(Object.values(aggrUps)))(),
    (async () => getAmount(Object.values(aggrDowns)))(),
    (async () => getAmount(Object.values(aggrXPs)))(),
  ]);

  const [upCount, downCount, xpCount] = await Promise.all([
    (async () => getCount(aggrUps))(),
    (async () => getCount(aggrDowns))(),
    (async () => getCount(aggrXPs))(),
  ]);

  const lvl = getLevelFromXp(xpAmount);

  dispatch(setTransactions({ transactions: aggrXPs, type: "xp" }));
  dispatch(setTransactions({ transactions: aggrDowns, type: "down" }));
  dispatch(setTransactions({ transactions: aggrUps, type: "up" }));
  dispatch(setTransactions({ transactions: piscines, type: "piscine" }));

  dispatch(setAmount({ amount: xpAmount, type: "xp" }));
  dispatch(setAmount({ amount: downAmount, type: "down" }));
  dispatch(setAmount({ amount: upAmount, type: "up" }));

  dispatch(setCount({ count: xpCount, type: "xp" }));
  dispatch(setCount({ count: downCount, type: "down" }));
  dispatch(setCount({ count: upCount, type: "up" }));

  dispatch(setLevel({ level: lvl }));

  dispatch(setLoadingState({ state: 5 }));
};
