import Skeleton from "@components/ui/Skeleton"
import { prettify } from "@helper"

function BondStats() {
  const isBondLoading = false
  const marketPrice = 0
  const treasuryBalance = 0

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
