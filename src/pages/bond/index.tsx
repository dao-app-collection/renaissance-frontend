import React from "react"

import BondTable from "@components/bonds/BondTable"
import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import Skeleton from "@components/ui/Skeleton"
import { prettify } from "@helper"
import { useTreasuryBalance } from "@hooks/useBalance"
import { useArtMarketPrice } from "@hooks/useMarketPrice"

function Header() {
  const marketPrice = useArtMarketPrice()
  const { loading, treasuryBalance } = useTreasuryBalance()

  return (
    <div className="px-10 mr-10 text-white grid grid-cols-4 space-x-16 md:text-md 2xl:text-sm">
      <div className="py-5 align-middle space-y-2">
        <div className="text-4xl font-bold">Bond (1,1)</div>
        <div className="text-dark-600 row-start-2 text-md">
          Receive ART at a discount
        </div>
      </div>
      <div className="inline-flex flex-wrap items-center px-3 py-2 rounded-lg bg-bg-scheme-500 bg-opacity-50 col-span-3 gap-x-20 gap-y-5">
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">
            Treasury Balance
          </div>
          <div className="text-lg row-start-2">
            <>
              {loading ? (
                <Skeleton height={40} width={150} />
              ) : (
                "$" + prettify(treasuryBalance)
              )}
            </>
          </div>
        </div>
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">
            ART Market Price
          </div>
          <div className="text-lg text-white row-start-2">
            <>
              {loading ? (
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
  const loading = false
  const claimableRewards = 0

  return (
    <Layout>
      <div
        className="container relative h-full min-h-screen bg-black"
        data-cy="bond-page"
      >
        <div className="px-8 py-8 pt-6 bg-black grid grid-cols-12">
          <div className="hidden md:grid col-start-11 col-span-2">
            <ConnectButton />
          </div>
        </div>
        <Header />
        <div className="px-5 mx-10 mt-10 mb-5 mr-20 py-7 rounded-md bg-bg-scheme-500 bg-opacity-50">
          <div className="text-white md:text-xl">
            <span>Your Claimable Rewards: $</span>
            <span className="font-bold">
              {
                <>
                  {loading ? (
                    <Skeleton height={40} width={200} />
                  ) : (
                    prettify(claimableRewards)
                  )}
                </>
              }
            </span>
          </div>
        </div>
        <div className="mx-10 mr-20">
          <div className="items-center text-2xl font-bold text-white gap-2 sm:text-2xl tracking-2%">
            Choose a bond
          </div>
          <BondTable />
        </div>
      </div>
    </Layout>
  )
}

export default Bond
