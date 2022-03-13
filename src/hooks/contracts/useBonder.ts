import { useState } from "react"

import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import useSWR from "swr"

import { errorToast } from "@components/ui/Toast"
import { BOND_REFRESH_INTERVAL } from "@constants"
import { IBonder, IJsonRPCError, ISingleBond } from "@typings"

function useBonder(singleBond: ISingleBond): IBonder {
  const [approvePending, setApprovePending] = useState(false)
  const [purchaseBondPending, setPurchaseBondPending] = useState(false)
  const [redeemBondPending, setRedeemBondPending] = useState(false)
  const [redeemBondAutoPending, setRedeemBondAutoPending] = useState(false)

  const { account, library: walletProvider } = useWeb3React()

  const { bond, mutateBond, pro } = singleBond

  const bondAddress = bond.getAddressForBond()
  const bondContract = walletProvider
    ? bond.getContractForBondFromWallet(walletProvider.getSigner())
    : undefined
  const reserveContract = walletProvider
    ? bond.getContractForReserveFromWallet(walletProvider.getSigner())
    : undefined

  const { data: allowance, mutate: mutateAllowance } = useSWR(
    `/bond/allowance/${reserveContract?.address}`,
    async () => await reserveContract.allowance(account, bondAddress)
  )

  const { data: bondPriceRaw, mutate: mutateBondPriceRaw } = useSWR(
    `/bond/price/${bondContract?.address}`,
    async () =>
      pro ? await bondContract.trueBondPrice() : await bondContract.bondPrice(),
    { refreshInterval: BOND_REFRESH_INTERVAL }
  )

  const { data: _balance, mutate: mutateBalance } = useSWR(
    `/bond/balance/${reserveContract?.address}`,
    async () => await reserveContract.balanceOf(account)
  )

  const { data: _bondDetails, mutate: mutateBondDetails } = useSWR(
    `/bond/bondDetails/${bondContract?.address}`,
    async () => await bondContract.bondInfo(account)
  )

  const { data: _pendingPayout, mutate: mutatePendingPayout } = useSWR(
    `/bond/pendingPayout/${reserveContract?.address}`,
    async () => await bondContract.pendingPayoutFor(account)
  )

  const balance = _balance ? ethers.utils.formatEther(_balance) : undefined

  const bondMaturationBlock = +_bondDetails?.vesting + +_bondDetails?.lastBlock

  const interestDue =
    Number(_bondDetails?.payout?.toString()) / Math.pow(10, pro ? 18 : 9)

  const pendingPayout = _pendingPayout
    ? pro
      ? ethers.utils.formatUnits(_pendingPayout, "ether")
      : ethers.utils.formatUnits(_pendingPayout, "gwei")
    : "0"

  const mutateBonder = () => {
    mutateAllowance()
    mutateBalance()
    mutateBondDetails()
    mutatePendingPayout()
    mutateBond()
  }

  const approveSpend = async () => {
    try {
      setApprovePending(true)
      const tx = await reserveContract.approve(
        bondAddress,
        ethers.utils.parseUnits("1000000000", "ether").toString()
      )
      await tx.wait()
      mutateAllowance()
    } catch (e: unknown) {
      errorToast((e as IJsonRPCError).message)
    } finally {
      setApprovePending(false)
    }
  }

  const purchaseBond = async (quantity: string, slippage: number) => {
    try {
      setPurchaseBondPending(true)
      const valueInWei = ethers.utils.parseUnits(quantity, "ether")
      const maxPremium = Math.round(
        Number(bondPriceRaw.toString()) * (1 + slippage)
      )
      const tx = await bondContract.deposit(valueInWei, maxPremium, account)
      await tx.wait()
      mutateBonder()
    } catch (e: unknown) {
      const rpcError = e as IJsonRPCError
      if (
        rpcError.code === -32603 &&
        rpcError.message.indexOf("ds-math-sub-underflow") >= 0
      ) {
        errorToast(
          "You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow"
        )
      } else {
        errorToast(rpcError.message)
      }
    } finally {
      setPurchaseBondPending(false)
    }
  }

  const setRedeemPendingState = (autostake: boolean, isPending: boolean) => {
    if (autostake) {
      setRedeemBondAutoPending(isPending)
    } else {
      setRedeemBondPending(isPending)
    }
  }

  const redeemBond = async ({ autostake }: { autostake: boolean }) => {
    try {
      setRedeemPendingState(autostake, true)
      const tx = await bondContract.redeem(account, autostake === true)
      await tx.wait()
      mutateBonder()
    } catch (e: unknown) {
      errorToast((e as IJsonRPCError).message)
    } finally {
      setRedeemPendingState(autostake, false)
    }
  }

  const redeemProBond = async () => {
    try {
      setRedeemPendingState(false, true)
      const tx = await bondContract.redeem(account)
      await tx.wait()
      mutateBonder()
    } catch (e: unknown) {
      errorToast((e as IJsonRPCError).message)
    } finally {
      setRedeemPendingState(false, false)
    }
  }

  return {
    allowance,
    approveSpend,
    approvePending,
    balance,
    bondMaturationBlock,
    interestDue,
    mutateBonder,
    pendingPayout,
    purchaseBond,
    purchaseBondPending,
    redeemBond,
    redeemProBond,
    redeemBondPending,
    redeemBondAutoPending,
  }
}

export default useBonder
