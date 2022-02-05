import React, { useState } from "react"

import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import useSWR, { useSWRConfig } from "swr"

import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import CTABox from "@components/ui/CTABox"
import PageHeading from "@components/ui/PageHeading"
import { currentAddresses } from "@constants"
import {
  approve,
  deposit,
  getAllowance,
  getAArtBalance,
  getFraxBalance,
  getUser,
  getWhitelistedState,
} from "@helper/presale"
import { error } from "@slices/messagesSlice"

const MAX_ALLOCATION = 1500

interface Fields {
  amount: number
}

export default function Whitelist() {
  const [mode, setMode] = useState(false)

  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const { mutate } = useSWRConfig()

  const { data: user } = useSWR(["/user", account], (_, account) =>
    getUser(account)
  )

  const { data: isWhitelisted } = useSWR(
    ["/whitelisted", account],
    (_, account) => getWhitelistedState(account)
  )

  const { data: aArtBalance } = useSWR(
    ["/aArtPayout", account],
    (_, account) => getAArtBalance(account)
  )

  const { data: fraxBalance } = useSWR(["/fraxBalance", account], (_, account) =>
    getFraxBalance(account)
  )

  const { data: fraxAllowance } = useSWR(
    ["/fraxAllowance", account],
    (_, account) => getAllowance(account)
  )

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
        await approve(currentAddresses.AART_PRESALE_ADDRESS, 1500)
        mutate(["/fraxAllowance", account])
      }
    } catch (e) {
      dispatch(error("Check your deposit limit!"))
    }
  }

  const router = useRouter()

  return (
    <Layout>
      <div className="container relative h-full min-h-screen bg-black py-6">

        <PageHeading>
          <div className="flex-grow py-10">
            <PageHeading.Title> Whitelist</PageHeading.Title>
            <PageHeading.Subtitle>
              For Virtuosos & Maestros.
            </PageHeading.Subtitle>
            </div>

        <div className="px-2 bg-black">
          <ConnectButton/>
      </div>
        </PageHeading>
            <div className="py-7 px-20 rounded-xl bg-dark-1000 bg-opacity-30">
              
            <div className="text-white text-2xl py-3">Deposit FRAX</div>
            <DepositContent mode={mode} />
            <div className="text-right text-white text-md py-6">Max You Can Buy: {} FRAX Balance {} FRAX</div>
              <div className="flex items-stretch py-5 md:py-5 bg-dark-1000 bg-opacity-60 sm:py-4 sm:px-10 rounded-xl m">
                <PageHeading>
                  <PageHeading.Content>
                    <PageHeading.Stat
                      title="What You Will Get"
                      subtitle="aART"
                    />
                  </PageHeading.Content>
                  
                </PageHeading>
              </div>
              <div className="flex items-center justify-center py-10">
              <button className="bg-blue-600 px-12 py-3 mx-1 text-white font-bold text-md rounded-md">Deposit</button>
            </div>  
            </div>
          </div>
    </Layout>
  )
}


function DepositContent(mode) {

  const [quantity, setQuantity] = useState(0)
  const isStaking = !mode
  const isUnstaking = mode
  const isAppLoading = useSelector((state: any) => state.app.loading)

  const artBalance = useSelector((state: any) => {
    return state.account.balances && state.account.balances.art
  })
  const sartBalance = useSelector((state: any) => {
    return state.account.balances && state.account.balances.sart
  })
  const setMax = () => {
    if (isStaking) {
      setQuantity(artBalance)
    } else {
      setQuantity(sartBalance)
    }
  }
  return (
    <div className="space-y-6">
      <CTABox className="flex items-center border-2 border-gray-600 justify-between ">
        <div className="">
          <input
            onChange={(e: any) => setQuantity(e.target.value)}
            className="w-full text-lg font-semibold text-left bg-transparent outline-none text-dark-500 text-[35px] text-dark-input tracking-2%"
            size={12}
            placeholder="   0.0 FRAX"
          />
        </div>
        <div className="px-3">
          <button onClick={setMax} className="bg-transparent hover:bg-blue-500 border border-indigo-500 text-indigo-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md">Max amount</button>
        </div>
      </CTABox>
      </div>
      
  )
}