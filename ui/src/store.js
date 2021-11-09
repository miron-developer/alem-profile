import { configureStore } from "@reduxjs/toolkit";

import userSlice from "components/user/userSlice";

export default configureStore({
  reducer: {
    user: userSlice,
  },
});
