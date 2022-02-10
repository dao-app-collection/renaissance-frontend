import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit"
import { BigNumber, BigNumberish, Contract, ethers } from "ethers"

import { setAll } from "@helper"
import { RootState } from "src/store"

import ierc20Abi from "../abi/IERC20.json"
import sART from "../abi/sART.json"
import { addresses, currentAddresses } from "../constants"
import {
  IBaseAddressAsyncThunk,
  ICalcUserBondDetailsAsyncThunk,
} from "./interfaces"

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, provider }: IBaseAddressAsyncThunk) => {
    const artContract = new ethers.Contract(
      currentAddresses.ART_ADDRESS as string,
      ierc20Abi.abi,
      provider
    )
    const artBalance = await artContract.balanceOf(address)

    let sartBalance = BigNumber.from(0)
    if (currentAddresses.SART_ADDRESS) {
      const sartContract = new ethers.Contract(
        currentAddresses.SART_ADDRESS as string,
        ierc20Abi.abi,
        provider
      )
      await sartContract.balanceOf(address)
    }

    let poolBalance = BigNumber.from(0)
    const poolTokenContract = new ethers.Contract(
      currentAddresses.PT_TOKEN_ADDRESS as string,
      ierc20Abi.abi,
      provider
    )
    poolBalance = await poolTokenContract.balanceOf(address)

    return {
      balances: {
        art: ethers.utils.formatUnits(artBalance, "gwei"),
        sart: ethers.utils.formatUnits(sartBalance, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    }
  }
)

const getBalancesSafe = async (
  contract: Contract,
  address: string,
  withAllowance: boolean = false
): Promise<{ allowance?: BigNumber; balance: BigNumber }> => {
  try {
    const [balance, allowance] = await Promise.all([
      contract.balanceOf(address),
      ...(withAllowance ? [contract.allowance(address)] : []),
    ])
    return {
      balance,
      ...(withAllowance ? { allowance } : {}),
    }
  } catch {
    return {
      balance: BigNumber.from(0),
      ...(withAllowance ? { allowance: BigNumber.from(0) } : {}),
    }
  }
}

interface IUserAccountDetails {
  balances: {
    dai: string
    art: string
    sart: string
    frax: string
  }
  staking: {
    artStake: number
    artUnstake: number
  }
  bonding: {
    daiAllowance: number
  }
}
export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({
    chainId,
    provider,
    address,
  }: IBaseAddressAsyncThunk): Promise<IUserAccountDetails> => {
    let artBalance = BigNumber.from(0)
    let fraxBalance = BigNumber.from(0)
    let sartBalance = BigNumber.from(0)
    let stakeAllowance = BigNumber.from(0)
    let unstakeAllowance = BigNumber.from(0)
    let daiBondAllowance = 0

    const daiContract = new ethers.Contract(
      addresses[chainId].DAI_ADDRESS as string,
      ierc20Abi.abi,
      provider
    )
    const daiBalance = await daiContract.balanceOf(address)
    if (addresses[chainId].ART_ADDRESS) {
      const artContract = new ethers.Contract(
        addresses[chainId].ART_ADDRESS as string,
        ierc20Abi.abi,
        provider
      )
      const { balance, allowance } = await getBalancesSafe(
        artContract,
        address,
        true
      )
      artBalance = balance
      stakeAllowance = allowance
    }

    if (addresses[chainId].SART_ADDRESS) {
      const sartContract = new ethers.Contract(
        addresses[chainId].SART_ADDRESS as string,
        sART.abi,
        provider
      )
      const { balance, allowance } = await getBalancesSafe(
        sartContract,
        address,
        true
      )
      sartBalance = balance
      unstakeAllowance = allowance
    }

    if (addresses[chainId].FRAX_RESERVE_ADDRESS) {
      const fraxContract = new ethers.Contract(
        addresses[chainId].FRAX_RESERVE_ADDRESS,
        ierc20Abi.abi,
        provider
      )
      const { balance } = await getBalancesSafe(fraxContract, address)
      fraxBalance = balance
    }

    return {
      balances: {
        dai: ethers.utils.formatEther(daiBalance),
        art: ethers.utils.formatUnits(artBalance, "gwei"),
        sart: ethers.utils.formatUnits(sartBalance, "gwei"),
        frax: ethers.utils.formatEther(fraxBalance),
      },
      staking: {
        artStake: +stakeAllowance,
        artUnstake: +unstakeAllowance,
      },
      bonding: {
        daiAllowance: daiBondAllowance,
      },
    }
  }
)

export interface IUserBondDetails {
  allowance: number
  interestDue: number
  bondMaturationBlock: number
  pendingPayout: string //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({
    address,
    bond,
    chainId,
    provider,
  }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      }
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(provider)
    const reserveContract = bond.getContractForReserve(provider)

    let pendingPayout, bondMaturationBlock

    const bondDetails = await bondContract.bondInfo(address)
    let interestDue: BigNumberish =
      Number(bondDetails.payout.toString()) / Math.pow(10, 9)
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock
    pendingPayout = await bondContract.pendingPayoutFor(address)

    let allowance,
      balance = BigNumber.from(0)
    allowance = await reserveContract.allowance(
      address,
      bond.getAddressForBond()
    )
    balance = await reserveContract.balanceOf(address)
    // formatEthers takes BigNumber => String
    const balanceVal = ethers.utils.formatEther(balance)
    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance.toString()),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    }
  }
)

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails }
  balances: {
    art: string
    sart: string
    dai: string
    oldsart: string
  }
  loading: boolean
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { art: "", sart: "", dai: "", oldsart: "" },
}

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAccountDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload)
        state.loading = false
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false
        console.error(error)
      })
      .addCase(getBalances.pending, (state) => {
        state.loading = true
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload)
        state.loading = false
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false
        console.error(error)
      })
      .addCase(calculateUserBondDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return
        const bond = action.payload.bond
        state.bonds[bond] = action.payload
        state.loading = false
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false
        console.error(error)
      })
  },
})

export default accountSlice.reducer

export const { fetchAccountSuccess } = accountSlice.actions

const baseInfo = (state: RootState) => state.account

export const getAccountState = createSelector(baseInfo, (account) => account)
