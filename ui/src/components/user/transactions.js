import { API } from "utils/api";

import { setLoadingState, setTransactions } from "./userSlice";

const getTransaction = async (id, offset) => {
  if (offset === undefined) return { err: "not have offset" };
  return await API.GetUserTransactions(id, offset).then((resp) => {
    if (resp.errors) return { err: "not loaded transactions: " + resp.errors };
    return resp?.data?.user[0]?.transactions;
  });
};

export const GetTransactions = async (id, dispatch) => {
  let offset = 0;
  const tempTransactions = [];

  const interID = setInterval(async () => {
    const transactions = await Promise.all([
      getTransaction(id, offset),
      getTransaction(id, offset + 50),
      getTransaction(id, offset + 100),
      getTransaction(id, offset + 150),
      getTransaction(id, offset + 200),
    ]);

    tempTransactions.push(...transactions.filter((t) => t.length > 0));

    // if have any error
    if (transactions.some((t) => t.err)) {
      dispatch(setLoadingState({ state: -3 }));
      return clearInterval(interID);
    }

    // if empty stop load with error or pass
    if (transactions.some((t) => t.length === 0)) {
      if (transactions[0].length === 0 && tempTransactions[0].length === 0) {
        dispatch(setLoadingState({ state: -2 }));
      } else {
        dispatch(setTransactions({ transactions: tempTransactions }));
        dispatch(setLoadingState({ state: 3 }));
      }
      return clearInterval(interID);
    }

    offset += 250;
  }, 500);
};
