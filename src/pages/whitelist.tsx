import React from "react"
import { useState } from "react"

import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import useSWR from "swr"

import ArtPresaleABI from "@abi/ArtPresale.json"
import Layout from "@components/layouts/Layout"
import CTABox from "@components/ui/CTABox"
import PageHeading from "@components/ui/PageHeading"
import { currentAddresses } from "@constants"
import Presale from "@contracts/Presale"
import { useContract } from "@hooks/contracts/useContract"
import { useToken } from "@hooks/contracts/useToken"
import { useTokenBalance } from "@hooks/contracts/useTokenBalance"

const MAX_ALLOCATION = 1500

interface Fields {
  amount: number
}

export default function Whitelist() {
  const { account } = useWeb3React()
  const [mode, setMode] = useState(false)

  const aArt = useToken(currentAddresses.AART_ADDRESS, {
    decimals: 9,
  })

  const presale = useContract(
    Presale,
    currentAddresses.DAI_ART_PRESALE_ADDRESS,
    ArtPresaleABI
  )

  const aArtBalance = useTokenBalance(aArt)

  const { data: user } = useSWR(["/user", account], (_, account) =>
    presale.userInfo(account)
  )

  const router = useRouter()

  return (
    <Layout>
      <div className="container relative min-h-screen py-10 bg-black">
      <div className="z-20 flex flex-col px-4 mb-10"></div>

        <PageHeading>
          <div className="flex-grow">
            <PageHeading.Title> Whitelist</PageHeading.Title>
            <PageHeading.Subtitle>
              For Virtuosos & Maestros.
            </PageHeading.Subtitle>
            <div className="mt-8 bg-dark-1000 bg-opacity-30 px-12">
            <div className="text-white text-2xl py-3">Deposit FRAX</div>
            <StakeContent mode={mode} />
            <div className="text-right text-white text-md py-4">Max You Can Buy: {} FRAX Balance {} FRAX</div>
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
            </div>
            <div className="flex items-center justify-center py-5">
              <button className="bg-blue-600 px-12 py-2 mx-1 text-white font-bold text-md rounded-md">Deposit</button>
            </div>  
          </div>
        </PageHeading>
      </div>
    </Layout>
  )
}


function StakeContent(mode) {

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
            placeholder="0.0 FRAX"
          />
        </div>
        <div className="">
          <button onClick={setMax} className="bg-transparent hover:bg-blue-500 border border-indigo-500 text-indigo-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md">Max amount</button>
        </div>
      </CTABox>
      </div>
      
  )
}
