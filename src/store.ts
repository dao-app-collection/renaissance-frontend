import { configureStore } from "@reduxjs/toolkit"

import accountReducer from "./slices/accountSlice"
import appReducer from "./slices/appSlice"
import bondingReducer from "./slices/bondSlice"
import messagesReducer from "./slices/messagesSlice"
import pendingTransactionsReducer from "./slices/pendingTxnsSlice"

// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    //   we'll have state.account, state.bonding, etc, each handled by the corresponding
    // reducer imported from the slice file
    account: accountReducer,
    bonding: bondingReducer,
    app: appReducer,
    pendingTransactions: pendingTransactionsReducer,
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
