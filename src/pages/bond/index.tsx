import React from "react"

import { useSelector } from "react-redux"

import BondTable from "@components/bonds/BondTable"
import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import PageHeading from "@components/ui/PageHeading"
import Skeleton from "@components/ui/Skeleton"
import { prettify } from "@helper"
import { allBondsMap } from "@helper/bonds/allBonds"

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
        className="container relative h-full min-h-screen bg-black py-6"
        data-cy="bond-page"
      >
        <PageHeading>
          <div className="flex-grow py-10">
            <PageHeading.Title>Bond (1,1)</PageHeading.Title>
            <PageHeading.Subtitle>
              Receivce ART at a discount.
            </PageHeading.Subtitle>
          </div>
          <div className="rounded-md bg-opacity-30 px-4 py-10">
          <PageHeading.Content>
            <PageHeading.Stat
              title="Treasury Balance"
              subtitle={
                <>
                  {isBondLoading ? (
                    <Skeleton height={40} width={150} />
                  ) : (
                    "$" + prettify(treasuryBalance)
                  )}
                </>
              }
            />
            <PageHeading.Stat
              title="ART Market Price"
              subtitle={
                <>
                  {isBondLoading ? (
                    <Skeleton height={40} width={100} />
                  ) : (
                    "$" + prettify(marketPrice)
                  )}
                </>
              }
            />
          </PageHeading.Content>
        </div>
        <div className="px-2 bg-black">
          <ConnectButton/>
      </div>
        </PageHeading>


        <div className="my-20 ml-5 py-7 px-3 rounded-md bg-dark-1000 bg-opacity-20 ">
          <PageHeading>
            <PageHeading.Content>
            <PageHeading.Stat
                title=""
                subtitle={
                  <>
                    {isBondLoading ? (
                      <Skeleton height={40} width={200} />
                    ) : (
                      "Your Claimable Rewards: " + "$" + prettify(treasuryBalance)
                    )}
                  </>
                }
              />
            </PageHeading.Content>

            
          </PageHeading>
        </div>
        <div className="mt-12">
          <div className="items-center text-2xl font-semibold text-white gap-2 sm:text-2xl tracking-2%">Choose a bond</div>
            <BondTable/>
        </div>
      </div>
    </Layout>
  )
}

export default Bond
