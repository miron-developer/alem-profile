import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {
      id: -1,
      login: "",
    },
    transactions: [],
    transactionUps: {},
    transactionDowns: {},
    transactionXPs: {},
    xpAmount: 0,
    auditDownAmount: 0,
    auditUpAmount: 0,
    auditDownCount: 0,
    auditUpCount: 0,
    xpCount: 0,

    /**
     * -3 - loading transaction error
     * -2 - loaded transactions, empty
     * -1 - loading user error
     * 0 - neutral
     * 1 - loaded user info, OK, start load transactions
     * 2 - loading transactions
     * 3 - loaded transactions, OK, start aggregation user info
     * 4 - aggragation user info
     * 5 - user profile created, OK, show
     */
    loadingState: 0,
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload.userInfo;
    },
    clearUser: (state) => {
      state.userInfo = {
        id: -1,
        login: "",
      };
    },
    setLoadingState: (stata, action) => {
      stata.loadingState = action.payload.state;
    },
    setTransactions: (state, action) => {
      const a = action.payload;
      if (a.type === "up") state.transactionUps = a.transactions;
      else if (a.type === "down") state.transactionDowns = a.transactions;
      else if (a.type === "xp") state.transactionXPs = a.transactions;
      else state.transactions.push(...a.transactions);
    },
    clearTransactions: (state, action) => {
      if (action.payload.type === "up") state.transactionUps = {};
      else if (action.payload.type === "down") state.transactionDowns = {};
      else if (action.payload.type === "xp") state.transactionXPs = {};
      else state.transactions = [];
    },
    clearAllTransactions: (state) => {
      state.transactions = [];
      state.transactionUps = {};
      state.transactionDowns = {};
      state.transactionXPs = {};
    },
    setAmount: (state, action) => {
      if (action.payload.type === "up")
        state.auditUpAmount = action.payload.amount;
      else if (action.payload.type === "down")
        state.auditDownAmount = action.payload.amount;
      else state.xpAmount = action.payload.amount;
    },
    clearAmounts: (state) => {
      state.auditUpAmount = 0;
      state.auditDownAmount = 0;
      state.xpAmount = 0;
    },
    setCount: (state, action) => {
      if (action.payload.type === "up")
        state.auditUpCount = action.payload.count;
      else if (action.payload.type === "down")
        state.auditDownCount = action.payload.count;
      else state.xpCount = action.payload.count;
    },
    clearCounts: (state) => {
      state.auditUpCount = 0;
      state.auditDownCount = 0;
      state.xpCount = 0;
    },
    clearUserAllInfo: (state) => {
      state.userInfo = {
        id: -1,
        login: "",
      };

      state.transactions = [];
      state.transactionUps = {};
      state.transactionDowns = {};
      state.transactionXPs = {};

      state.auditUpAmount = 0;
      state.auditDownAmount = 0;
      state.xpAmount = 0;

      state.auditUpCount = 0;
      state.auditDownCount = 0;
      state.xpCount = 0;

      state.loadingState = 0;
    },
  },
});

export const {
  setUser,
  clearUser,
  setLoadingState,
  setTransactions,
  clearTransactions,
  clearAllTransactions,
  setAmount,
  clearAmounts,
  setCount,
  clearCounts,
  clearUserAllInfo,
} = userSlice.actions;

export default userSlice.reducer;
