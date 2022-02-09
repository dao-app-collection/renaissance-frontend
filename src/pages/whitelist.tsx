import React, { useState } from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import useSWR, { useSWRConfig } from "swr"

import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import Button from "@components/ui/Button"
import CTABox from "@components/ui/CTABox"
import { MaxButton } from "@components/ui/MaxButton"
import PageHeading from "@components/ui/PageHeading"
import { currentAddresses } from "@constants"
import {
  approve,
  deposit,
  getAllowance,
  getFraxBalance,
  getAArtPrice,
  getUserRemainingAllocation,
  getUser,
  getWhitelistedState,
} from "@helper/presale"
import { error } from "@slices/messagesSlice"
import { parseEthersErrorMessage } from "@utils/parseUtils"

const MAX_ALLOCATION = 1000

interface Fields {
  amount: number
}

export default function Whitelist() {
  const { account, library } = useWeb3React<Web3Provider>()
  const dispatch = useDispatch()
  const { mutate } = useSWRConfig()
  const [amount, setAmount] = useState(0)

  const { data: user } = useSWR(["/user", account], (_, account) =>
    getUser(account)
  )

  const { data: isWhitelisted } = useSWR(
    ["/whitelisted", account],
    (_, account) => getWhitelistedState(account)
  )

  const { data: fraxBalance } = useSWR(
    ["/fraxBalance", account],
    (_, account) => getFraxBalance(account)
  )

  const { data: fraxAllowance } = useSWR(
    ["/fraxAllowance", account],
    (_, account) => getAllowance(account)
  )

  const { data: amountClaimable } = useSWR(
    ["/userRemainingAllocation", account],
    (_, account) =>
      getUserRemainingAllocation(account).then((number) => (+number).toFixed(2))
  )

  const { data: aArtPrice } = useSWR(["/aArtPrice", account], getAArtPrice)

  const {
    reset,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<Fields>({
    mode: "all",
    reValidateMode: "onChange",
  })

  const isAllowanceSufficient = fraxAllowance >= +amount
  const receivingAmount = (+amount / +aArtPrice).toFixed(4)
  const buttonDisabled = !isWhitelisted || !amount || !isValid

  async function onSubmit() {
    if (library) {
      try {
        if (isAllowanceSufficient) {
          await deposit(library, amount)
          mutate(["/user", account])
          mutate(["/aArtPayout", account])
          mutate(["/fraxBalance", account])
          mutate(["/userRemainingAllocation", account])
          reset({ amount: 0 })
        } else {
          await approve(
            library,
            currentAddresses.AART_PRESALE_ADDRESS,
            MAX_ALLOCATION
          )
          mutate(["/fraxAllowance", account])
        }
      } catch (e) {
        dispatch(error(parseEthersErrorMessage(e)))
      }
    }
  }

  return (
    <Layout>
      <div className="container relative h-full min-h-screen py-6 bg-scheme-bg">
        {/* <PageHeading> */}
        <div className="flex w-full justify-items-end ">
          <ConnectButton customStyle="w-[150px]" />
        </div>
        {/* </PageHeading> */}
        <PageHeading>
          <div className="flex-grow py-10">
            <PageHeading.Title> Whitelist</PageHeading.Title>
            <PageHeading.Subtitle>
              For Virtuosos & Maestros.
            </PageHeading.Subtitle>
          </div>
        </PageHeading>
        <div className="px-20 py-7 rounded-xl bg-scheme-600">
          <div className="py-3 text-2xl text-white">Deposit FRAX</div>
          <DepositContent amount={amount} setAmount={setAmount} />
          <div className="flex justify-end flex-grow w-full py-4 text-white text-md">
            <div className="mx-6">Max You Can Buy: {amountClaimable} aART</div>{" "}
            <div>
              Balance{" "}
              {!isNaN(+fraxBalance) ? (+fraxBalance).toFixed(2) : "0.00"} FRAX
            </div>
          </div>
          <div className="py-5 md:py-5 bg-scheme-200 bg-opacity-60 sm:py-4 sm:px-10 rounded-xl">
            <div className="text-sm text-scheme-400">You will receive</div>
            <div className="text-lg text-white">
              {!isNaN(+receivingAmount) ? receivingAmount : "0.00000"} aART
            </div>
          </div>
          <div className="flex items-center justify-center py-6">
            <Button
              className="px-14"
              disabled={buttonDisabled}
              loading={isSubmitting}
              onClick={onSubmit}
            >
              Deposit
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function DepositContent({
  amount,
  setAmount,
}: {
  amount: number
  setAmount: (quantity: number) => void
}) {
  const isAppLoading = !!useSelector((state: any) => state.app.loading)

  const artBalance = useSelector((state: any) => {
    return state.account.balances ? state.account.balances.frax : "0"
  })

  const setMax = () => setAmount(artBalance)

  return (
    <div className="space-y-6">
      <CTABox className="flex items-center justify-between bg-transparent border-2 border-gray-600">
        <div className="w-full">
          <input
            value={amount}
            disabled={isAppLoading}
            onChange={(e: any) => setAmount(e.target.value)}
            className="w-full text-xl text-left bg-transparent outline-none text-scheme-400 text-dark-input tracking-2%"
            size={12}
            placeholder="0.0 FRAX"
          />
        </div>
        <MaxButton onClick={setMax} />
      </CTABox>
    </div>
  )
}
