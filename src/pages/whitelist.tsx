import React, { useState } from "react"

import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import useSWR, { useSWRConfig } from "swr"

import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import CTABox from "@components/ui/CTABox"
import { MaxButton } from "@components/ui/MaxButton"
import PageHeading from "@components/ui/PageHeading"
import { currentAddresses } from "@constants"
import {
  approve,
  deposit,
  getAllowance,
  getAArtBalance,
  getFraxBalance,
  getAArtPrice,
  getUserRemainingAllocation,
  getUser,
  getWhitelistedState,
} from "@helper/presale"
import { error } from "@slices/messagesSlice"

const MAX_ALLOCATION = 1500
const ART_PRESALE_PRICE = 20

interface Fields {
  amount: number
}

export default function Whitelist() {
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const { mutate } = useSWRConfig()
  const [quantity, setQuantity] = useState(0)

  const { data: user } = useSWR(["/user", account], (_, account) =>
    getUser(account)
  )

  const { data: isWhitelisted } = useSWR(
    ["/whitelisted", account],
    (_, account) => getWhitelistedState(account)
  )

  const { data: aArtBalance } = useSWR(["/aArtPayout", account], (_, account) =>
    getAArtBalance(account)
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
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<Fields>({
    mode: "all",
    reValidateMode: "onChange",
  })

  const isAllowanceSufficient = fraxAllowance >= watch("amount")
  const remaining = MAX_ALLOCATION - user?.amount

  async function onSubmit({ amount }: Fields) {
    try {
      if (isAllowanceSufficient) {
        await deposit(amount)
        mutate(["/user", account])
        mutate(["/aArtPayout", account])
        mutate(["/fraxBalance", account])
        reset({ amount: 0 })
      } else {
        await approve(currentAddresses.AART_PRESALE_ADDRESS, MAX_ALLOCATION)
        mutate(["/fraxAllowance", account])
      }
    } catch (e) {
      dispatch(error("Check your deposit limit!"))
    }
  }

  const router = useRouter()
  const receivingAmount = (+quantity / +aArtPrice).toFixed(4)

  return (
    <Layout>
      <div className="container relative h-full min-h-screen py-6 bg-scheme-bg">
        <PageHeading>
          <div className="flex-grow py-10">
            <PageHeading.Title> Whitelist</PageHeading.Title>
            <PageHeading.Subtitle>
              For Virtuosos & Maestros.
            </PageHeading.Subtitle>
          </div>

          <div className="px-2 bg-">
            <ConnectButton />
          </div>
        </PageHeading>
        <div className="px-20 py-7 rounded-xl bg-scheme-600">
          <div className="py-3 text-2xl text-white">Deposit FRAX</div>
          <DepositContent quantity={quantity} setQuantity={setQuantity} />
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
          <div className="flex items-center justify-center py-10">
            <button className="px-12 py-3 mx-1 font-bold text-white bg-blue-600 text-md rounded-md">
              Deposit
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function DepositContent({
  quantity,
  setQuantity,
}: {
  quantity: number
  setQuantity: (quantity: number) => void
}) {
  const isAppLoading = !!useSelector((state: any) => state.app.loading)

  const artBalance = useSelector((state: any) => {
    return state.account.balances ? state.account.balances.frax : "0"
  })

  const setMax = () => setQuantity(artBalance)

  return (
    <div className="space-y-6">
      <CTABox className="flex items-center justify-between bg-transparent border-2 border-gray-600">
        <div className="w-full">
          <input
            value={quantity}
            disabled={isAppLoading}
            onChange={(e: any) => setQuantity(e.target.value)}
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
