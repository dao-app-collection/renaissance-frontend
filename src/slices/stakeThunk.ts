import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ethers, BigNumber } from "ethers"

import ArtStakingABI from "../abi/ArtStaking.json"
import ierc20ABI from "../abi/IERC20.json"
import { currentAddresses, keys } from "../constants"
import { fetchAccountSuccess, getBalances } from "./accountSlice"
import { IJsonRPCError } from "./interfaces"
import { error, info } from "./messagesSlice"
import {
  clearPendingTxn,
  fetchPendingTxns,
  getStakingTypeText,
} from "./pendingTxnsSlice"

interface IUAData {
  address: string
  value: string
  approved: boolean
  txHash: string | null
  type: string | null
}

function alreadyApprovedToken(
  token: string,
  stakeAllowance: BigNumber,
  unstakeAllowance: BigNumber
) {
  // set defaults
  let bigZero = BigNumber.from("0")
  let applicableAllowance = bigZero

  // determine which allowance to check
  if (token === keys.token) {
    applicableAllowance = stakeAllowance
  } else if (token === keys.stoken) {
    applicableAllowance = unstakeAllowance
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true

  return false
}

interface IChangeApproval {
  readonly token: string
  readonly walletProvider: Web3Provider
  readonly address: string
  readonly chainId: number
}
export const changeApproval = createAsyncThunk(
  "stake/changeApproval",
  async (
    { token, walletProvider, address, chainId }: IChangeApproval,
    { dispatch }
  ) => {
    if (!walletProvider) {
      dispatch(error("Please connect your wallet!"))
      return
    }

    const artContract = new ethers.Contract(
      currentAddresses.ART_ADDRESS as string,
      ierc20ABI.abi,
      walletProvider.getSigner()
    )
    let unstakeAllowance = BigNumber.from(0)
    let sartContract
    if (currentAddresses.SART_ADDRESS) {
      sartContract = new ethers.Contract(
        currentAddresses.SART_ADDRESS as string,
        ierc20ABI.abi,
        walletProvider.getSigner()
      )
      unstakeAllowance = await sartContract.allowance(
        address,
        currentAddresses.STAKING_ADDRESS
      )
    }

    let approveTx
    let stakeAllowance = await artContract.allowance(
      address,
      currentAddresses.STAKING_ADDRESS
    )

    // return early if approval has already happened
    if (alreadyApprovedToken(token, stakeAllowance, unstakeAllowance)) {
      dispatch(info("Approval completed."))
      return dispatch(
        fetchAccountSuccess({
          staking: {
            artStake: +stakeAllowance,
            artUnstake: +unstakeAllowance,
          },
        })
      )
    }

    try {
      if (token === keys.token) {
        // won't run if stakeAllowance > 0
        approveTx = await artContract.approve(
          currentAddresses.STAKING_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString()
        )
      } else if (sartContract && token === keys.stoken) {
        approveTx = await sartContract.approve(
          currentAddresses.STAKING_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString()
        )
      }

      const text = "Approve " + (token === keys.token ? "Staking" : "Unstaking")
      const pendingTxnType =
        token === keys.token ? "approve_staking" : "approve_unstaking"
      if (approveTx) {
        dispatch(
          fetchPendingTxns({
            txnHash: approveTx.hash,
            text,
            type: pendingTxnType,
          })
        )

        await approveTx.wait()
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message))
      return
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash))
      }
    }

    // go get fresh allowances
    stakeAllowance = await artContract.allowance(
      address,
      currentAddresses.STAKING_ADDRESS
    )
    unstakeAllowance = await sartContract.allowance(
      address,
      currentAddresses.STAKING_ADDRESS
    )

    return dispatch(
      fetchAccountSuccess({
        staking: {
          artStake: +stakeAllowance,
          artUnstake: +unstakeAllowance,
        },
      })
    )
  }
)

interface IChangeStake {
  readonly action: string
  readonly value: string
  readonly rpcProvider: StaticJsonRpcProvider
  readonly walletProvider: Web3Provider
  readonly address: string
  readonly chainId: number
}
export const changeStake = createAsyncThunk(
  "stake/changeStake",
  async (
    {
      action,
      value,
      rpcProvider,
      walletProvider,
      address,
      chainId,
    }: IChangeStake,
    { dispatch }
  ) => {
    if (!walletProvider) {
      dispatch(error("Please connect your wallet!"))
      return
    }

    const staking = new ethers.Contract(
      currentAddresses.STAKING_ADDRESS as string,
      ArtStakingABI.abi,
      walletProvider.getSigner()
    )
    let stakeTx
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    }
    try {
      if (action === "stake") {
        uaData.type = "stake"
        stakeTx = await staking.stake(
          ethers.utils.parseUnits(value, "gwei"),
          address
        )
      } else {
        uaData.type = "unstake"
        stakeTx = await staking.unstake(
          ethers.utils.parseUnits(value, "gwei"),
          true
        )
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking"
      uaData.txHash = stakeTx.hash
      dispatch(
        fetchPendingTxns({
          txnHash: stakeTx.hash,
          text: getStakingTypeText(action),
          type: pendingTxnType,
        })
      )
      await stakeTx.wait()
    } catch (e: unknown) {
      uaData.approved = false
      const rpcError = e as IJsonRPCError
      if (
        rpcError.code === -32603 &&
        rpcError.message.indexOf("ds-math-sub-underflow") >= 0
      ) {
        dispatch(
          error(
            "You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow"
          )
        )
      } else {
        dispatch(error(rpcError.message))
      }
      return
    } finally {
      if (stakeTx) {
        dispatch(clearPendingTxn(stakeTx.hash))
      }
    }
    dispatch(getBalances({ address, provider: rpcProvider }))
  }
)
