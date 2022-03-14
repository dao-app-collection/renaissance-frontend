import { useState } from "react"

import clsx from "clsx"
import Image from "next/image"

import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import StakeContent from "@components/stake/Stake"
import UnstakeContent from "@components/stake/Unstake"
import Skeleton from "@components/ui/Skeleton"
import { prettify } from "@helper"
import { useStaking, useStakingData } from "@hooks/useStaking"

function Header() {
  const staking = useStaking()

  const { stakingAPY, stakingTVL, currentIndex } = useStakingData(staking)
  const trimmedStakingAPY =
    stakingAPY > 500000 ? ">500,000" : prettify(stakingAPY)

  return (
    <div className="px-10 mr-10 text-white grid grid-cols-4 space-x-12 md:text-md 2xl:text-sm">
      <div className="py-5 align-middle space-y-2">
        <div className="text-4xl font-bold">Stake (3,3)</div>
        <div className="text-dark-600 row-start-2 text-md">
          HODL, stake, and compound
        </div>
      </div>
      <div className="inline-flex flex-wrap items-center px-3 py-2 rounded-lg bg-bg-scheme-500 bg-opacity-50 col-span-3 gap-x-20 gap-y-5">
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">APY</div>
          <div className="text-lg row-start-2">
            <>
              {stakingAPY > 0 ? (
                `${trimmedStakingAPY}%`
              ) : (
                <Skeleton height={40} width={100} />
              )}
            </>
          </div>
        </div>
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">
            Total Value Deposited
          </div>
          <div className="text-lg text-white row-start-2">
            <>
              {stakingTVL ? (
                "$" + prettify(stakingTVL)
              ) : (
                <Skeleton height={40} width={100} />
              )}
            </>
          </div>
        </div>
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">Current Index</div>
          <div className="text-lg text-white row-start-2">
            <>
              {currentIndex ? (
                prettify(currentIndex) + " sART"
              ) : (
                <Skeleton height={40} width={100} />
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stake() {
  // for the switch, we cannot really use another datatype other than boolean
  const [mode, setMode] = useState(false)
  const set = () => {
    setMode(!mode)
  }

  const isStaking = !mode

  return (
    <Layout>
      <div className="container relative h-full min-h-screen bg-black">
        <div className="px-8 py-8 pt-6 bg-black grid grid-cols-12">
          <div className="hidden md:grid col-start-11 col-span-2">
            <ConnectButton />
          </div>
        </div>
        <Header />
        <div className="px-10 mx-10 mt-10 mb-5 mr-20 py-7 rounded-md bg-bg-scheme-500 bg-opacity-50">
          <div className="flex justify-center">
            <div className="inline-flex items-center px-1 py-1 text-white border-2 gap-2 border-dark-1000 rounded-md">
              <button
                onClick={set}
                className={clsx(
                  "px-5 py-1.5 tracking-2% transition-colors font-medium",
                  {
                    "bg-dark-1000 rounded-md font-semibold": !mode,
                  }
                )}
              >
                Stake
              </button>
              <button
                onClick={set}
                className={clsx(
                  "px-3 py-1 tracking-2% transition-colors font-medium",
                  {
                    "bg-dark-1000 rounded-md font-semibold": mode,
                  }
                )}
              >
                Unstake
              </button>
            </div>
          </div>
          <div className="flex item-stretch">
            <div className="py-3 text-2xl text-white px-1.5">Stake ART</div>
            <Image src="/images/r_logo.svg" alt="Near" width={25} height={25} />
          </div>
          {isStaking ? <StakeContent /> : <UnstakeContent />}
        </div>
      </div>
    </Layout>
  )
}

export default Stake
