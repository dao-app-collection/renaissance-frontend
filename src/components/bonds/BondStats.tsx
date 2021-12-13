import { useSelector } from "react-redux"

import Skeleton from "@components/ui/Skeleton"
import { prettify } from "@helper"
import { allBondsMap } from "@helper/bonds/allBonds"

function BondStats() {
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
    <div className="sm:flex sm:gap-12 space-y-8 sm:space-y-0">
      <div className="sm:text-right">
        <div className="text-sm font-medium uppercase text-dark-300">
          Treasury Value
        </div>
        <div className="mt-1 text-3xl font-medium text-dark-600">
          {isBondLoading ? (
            <Skeleton height={40} />
          ) : (
            "$" + prettify(treasuryBalance)
          )}
        </div>
      </div>

      <div className="sm:text-right">
        <div className="text-sm font-medium uppercase text-dark-300">
          Art Price
        </div>
        <div className="mt-1 text-3xl font-medium text-dark-600">
          {isBondLoading ? (
            <Skeleton height={40} />
          ) : (
            "$" + prettify(marketPrice)
          )}
        </div>
      </div>
    </div>
  )
}

export default BondStats
