import { prettify } from "@helper"
import { useStaking, useStakingData } from "@hooks/useStaking"

export default function StakeInfo() {
  const staking = useStaking()

  const { sArtBalance, stakingRebase, fiveDayRate } = useStakingData(staking)

  const stakingRebasePercentage = Number(prettify(stakingRebase * 100))
  const nextRewardValue = prettify(
    (stakingRebasePercentage / 100) * Number(sArtBalance),
    4
  )

  return (
    <div className="flex-wrap items-center px-3 py-4 rounded-lg grid grid-cols-1 lg:grid-cols-3 bg-bg-scheme-500 bg-opacity-50 lg:justify-items-center gap-x-20">
      <div className="text-left grid grid-rows-2">
        <div className="text-gray-500 row-start-1 text-md">
          Next Reward Amount
        </div>
        <div className="text-lg text-white row-start-2">
          <>{prettify(Number(nextRewardValue), 4)} ART</>
        </div>
      </div>
      <div className="text-left grid grid-rows-2">
        <div className="text-gray-500 row-start-1 text-md">Staking Rebase</div>
        <div className="text-lg text-white row-start-2">
          <>{stakingRebasePercentage}%</>
        </div>
      </div>

      <div className="text-left grid grid-rows-2">
        <div className="text-gray-500 row-start-1 text-md">
          ROI (5-Day Rate)
        </div>
        <div className="text-lg text-white row-start-2">
          <>{prettify(fiveDayRate * 100, 3)}%</>
        </div>
      </div>
    </div>
  )
}
