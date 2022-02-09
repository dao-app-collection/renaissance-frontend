import React from "react"

import { useSelector } from "react-redux"

import BondTable from "@components/bonds/BondTable"
import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import Skeleton from "@components/ui/Skeleton"
import { prettify } from "@helper"
import { allBondsMap } from "@helper/bonds/allBonds"



function Header(){

  const isBondLoading = useSelector(
    (state: any) => state.bonding.loading ?? true
  )

  const marketPrice = useSelector((state: any) => {
    return state.app.marketPrice
  })

  const treasuryBalance = useSelector((state: any) => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased
        }
      }
      return tokenBalances
    }
  })
  return (
    <div className="grid grid-cols-4 text-white px-10 space-x-16 md:text-md 2xl:text-sm mr-10">
      <div className="space-y-2 align-middle py-5">
          <div className="text-4xl font-bold">Bond (1,1)</div>
          <div className="text-dark-600 row-start-2 text-md">Receive ART at a discount</div>     
      </div>
      <div className="bg-bg-scheme-500 bg-opacity-50 rounded-lg col-span-3 inline-flex flex-wrap items-center gap-x-20 gap-y-5 py-2 px-3">
        <div className="grid grid-rows-2">
            <div className="text-gray-500 row-start-1 text-md">Treasury Balance</div>
            <div className="row-start-2  text-lg">
              <>
              {isBondLoading ? (
                <Skeleton height={40} width={150} />
                  ) : (
                "$" + prettify(treasuryBalance)
                )}
              </>
            </div>
          </div>
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">ART Market Price</div>
          <div className="row-start-2 text-white text-lg">
            <>
              {isBondLoading ? (
                <Skeleton height={40} width={100} />
                  ) : (
                "$" + prettify(marketPrice)
              )}
            </>
        </div>
      </div>
    </div>
  </div>
  )
}

function Bond() {
  const isBondLoading = useSelector(
    (state: any) => state.bonding.loading ?? true
  )

  const marketPrice = useSelector((state: any) => {
    return state.app.marketPrice
  })

  const treasuryBalance = useSelector((state: any) => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased
        }
      }
      return tokenBalances
    }
  })

  return (
    <Layout>
      <div
        className="container relative h-full min-h-screen bg-black"
        data-cy="bond-page"
      >
        <div className="px-8 bg-black grid grid-cols-12 pt-6 py-8">
          <div className="md:grid col-start-11 col-span-2 hidden">
                <ConnectButton/>
          </div>
        </div>
        <Header/>
        <div className="mt-10 mx-10 py-7 px-5 mb-5 rounded-md mr-20 bg-bg-scheme-500 bg-opacity-50">
          <div className="text-white md:text-xl">
            <span>Your Claimable Rewards: $</span>
            <span className="font-bold">{
                  <>
                    {isBondLoading ? (
                      <Skeleton height={40} width={200} />
                    ) : (
                      prettify(treasuryBalance)
                    )}
                  </>
                }
            </span>
          </div>
        </div>
        <div className="mx-10 mr-20"> 
          <div className="items-center text-2xl font-bold text-white gap-2 sm:text-2xl tracking-2%">Choose a bond</div>
            <BondTable/>
            </div>
      </div>
    </Layout>
  )
}

export default Bond
