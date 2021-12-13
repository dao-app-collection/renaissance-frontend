import React from "react"

import { useSelector } from "react-redux"

import BondTable from "@components/bonds/BondTable"
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
        className="container relative h-full min-h-screen py-10 bg-dark-1000"
        data-cy="bond-page"
      >
        <PageHeading>
          <div className="flex-grow">
            <PageHeading.Title>Bond</PageHeading.Title>
            <PageHeading.Subtitle>
              Purchase ART at a discount
            </PageHeading.Subtitle>
          </div>

          <PageHeading.Content>
            <PageHeading.Stat
              title="TOTAL BONDED"
              subtitle={
                <>
                  {isBondLoading ? (
                    <Skeleton height={40} width={200} />
                  ) : (
                    "$" + prettify(treasuryBalance)
                  )}
                </>
              }
            />
            <PageHeading.Stat
              title="ART PRICE"
              subtitle={
                <>
                  {isBondLoading ? (
                    <Skeleton height={40} width={200} />
                  ) : (
                    "$" + prettify(marketPrice)
                  )}
                </>
              }
            />
          </PageHeading.Content>
        </PageHeading>

        <div className="mt-16">
          <BondTable />
        </div>
      </div>
    </Layout>
  )
}

export default Bond
