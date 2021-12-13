import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit"
import { ethers } from "ethers"

import { setAll } from "@helper"
import { getTokenPrice, getMarketPrice } from "@helper/price"
import { RootState } from "src/store"

import ArtStakingABI from "../abi/ArtStaking.json"
import sArtABI from "../abi/sART.json"
import { addresses } from "../constants"
import { IBaseAsyncThunk } from "./interfaces"

const initialState = {
  loading: false,
  loadingMarketPrice: false,
}

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ chainId, provider }: IBaseAsyncThunk, { dispatch }) => {
    let marketPrice
    try {
      const originalPromiseResult = await dispatch(
        loadMarketPrice({ provider: provider })
      ).unwrap()
      marketPrice = originalPromiseResult?.marketPrice
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error("Returned a null response from dispatch(loadMarketPrice)")
      return
    }

    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet")
      return {
        marketPrice,
      }
    }
    const currentBlock = await provider.getBlockNumber()
    const stakingContract = new ethers.Contract(
      addresses[chainId].STAKING_ADDRESS as string,
      ArtStakingABI.abi,
      provider
    )
    const sartMainContract = new ethers.Contract(
      addresses[chainId].SART_ADDRESS as string,
      sArtABI.abi,
      provider
    )

    // TODO: This is the best value that could found without using subgraph indexer. To be revised
    let stakingTVL = await stakingContract.contractBalance()
    stakingTVL = (stakingTVL.toNumber() / Math.pow(10, 9)) * marketPrice
    // Calculating staking
    const epoch = await stakingContract.epoch()
    const stakingReward = epoch.distribute
    const circ = await sartMainContract.circulatingSupply()
    const stakingRebase = Number(circ.toString())
      ? Number(stakingReward.toString()) / Number(circ.toString())
      : 0
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1

    // Current index
    const currentIndex = await stakingContract.index()

    return {
      stakingTVL,
      currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingRebase,
      marketPrice,
    }
  }
)

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ chainId: chainId, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ chainId, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState()
    let marketPrice
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ provider: provider })
        ).unwrap()
        marketPrice = originalPromiseResult?.marketPrice
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)")
        return
      }
    }
    return { marketPrice }
  }
)

/**
 * - fetches the ART price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from art-frax contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk(
  "app/loadMarketPrice",
  async ({ provider }: IBaseAsyncThunk) => {
    let marketPrice: number
    try {
      marketPrice = await getMarketPrice({ provider })
      console.log("MP: ", marketPrice)
      marketPrice = marketPrice / Math.pow(10, 9)
      console.log("MP: ", marketPrice)
    } catch (e) {
      marketPrice = await getTokenPrice("art")
    }
    return { marketPrice }
  }
)

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAppDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload)
        state.loading = false
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false
        console.error(error.name, error.message, error.stack)
      })
      .addCase(loadMarketPrice.pending, (state) => {
        state.loadingMarketPrice = true
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload)
        state.loadingMarketPrice = false
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false
        console.error(error.name, error.message, error.stack)
      })
  },
})

const baseInfo = (state: RootState) => state.app

export default appSlice.reducer

export const { fetchAppSuccess } = appSlice.actions

export const getAppState = createSelector(baseInfo, (app) => app)
