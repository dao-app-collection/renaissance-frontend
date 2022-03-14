import { useState } from "react"

import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"
import { ethers } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import Image from "next/image"
import { useForm } from "react-hook-form"

import ConnectButton from "@components/ConnectButton"
import ArtIcon from "@components/customicons/FraxIcon"
import Layout from "@components/layouts/Layout"
import Button from "@components/ui/Buttons"
import CTABox from "@components/ui/CTABox"
import Skeleton from "@components/ui/Skeleton"
import { errorToast, successToast } from "@components/ui/Toast"
import { prettify } from "@helper"
import { parseToFixed } from "@helper/parseUtils"
import { useStaking, useStakingData, useStakingHelper } from "@hooks/useStaking"

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

function Content() {
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

function Stake() {
  // for the switch, we cannot really use another datatype other than boolean
  const [mode, setMode] = useState(false)
  const set = () => {
    setMode(!mode)
  }
  const stakingRebase = 0
  const sartBalance = 0
  const trimmedBalance = sartBalance
  const fiveDayRate = 1
  const stakingRebasePercentage = Number(prettify(stakingRebase * 100))
  const nextRewardValue = prettify(
    (stakingRebasePercentage / 100) * trimmedBalance,
    4
  )

  const artBalance = 0
  const currentIndex = 0
  const stakingAPY = 0
  const stakingTVL = 0
  const trimmedStakingAPY = prettify(stakingAPY * 100)

  if (process.env.IS_PRESALE == "true") return null

  const isStaking = !mode
  const isUnstaking = mode

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
          {isStaking ? <StakeContent mode /> : <UnstakeContent />}
        </div>
      </div>
    </Layout>
  )
}

function StakeContent({ mode }) {
  const staking = useStaking()
  const stakingHelper = useStakingHelper()

  const { art, artBalance, sArtBalance, stakeAllowance } =
    useStakingData(staking)

  const { active, account } = useWeb3React()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<{ amount: number }>({
    mode: "all",
    reValidateMode: "onChange",
  })

  const isAllowanceSufficient = stakeAllowance.allowance >= watch("amount")

  const onSubmit = async ({ amount }: { amount: number }) => {
    const amountInArt = parseUnits(amount.toString(), 9)

    if (isAllowanceSufficient) {
      try {
        await stakingHelper.stake(amountInArt, account)
        artBalance.mutate()
        sArtBalance.mutate()
        reset({ amount: 0 })
        successToast(`Staked ${amount} ART successfully`)
      } catch (error) {
        errorToast("Something went wrong")
      }
    } else {
      await art.approve(stakingHelper.address, ethers.constants.MaxUint256)
      stakeAllowance.mutate()
    }
  }

  const maxArtTrimmed = parseToFixed(artBalance.balance, 9)

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-cy="stake-content">
      <div className="space-y-6">
        <CTABox className="flex items-center justify-between border border-gray-700">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <ArtIcon className="w-8 h-8" />
              <p className="text-2xl font-medium 2xl:text-[32px] text-dark-1000 tracking-2%">
                ART
              </p>
            </div>

            <p className="mt-2 text-sm font-medium 2xl:text-base tracking-2% text-dark-300">
              Balance{" "}
              {artBalance.balance >= 0 ? (
                <>{maxArtTrimmed} ART</>
              ) : (
                <Skeleton className="inline-block" height={15} width={80} />
              )}{" "}
              (
              <button
                className="font-medium text-wine-600"
                type="button"
                onClick={() => {
                  setValue("amount", artBalance.balance, {
                    shouldValidate: true,
                  })
                }}
              >
                Max
              </button>
              )
            </p>
          </div>

          <input
            className="w-full text-3xl font-semibold text-right bg-transparent border-transparent outline-none reset-number-spinner text-dark-400 2xl:text-[35px] 2xl:leading-normal tracking-2% focus-visible:border-transparent focus-visible:ring-0 placeholder-dark-75"
            type="number"
            placeholder="0.0"
            step="0.000000001"
            {...register("amount", {
              required: true,
              max: artBalance.balance,
              min: 0,
            })}
          />
        </CTABox>
      </div>
      <Content />
      <div className="flex mt-5 item-stretch">
        {active && (
          <Button
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            type="submit"
            className="flex items-center gap-3 button button-primary button-hover disabled:opacity-75"
          >
            <span>
              {isAllowanceSufficient || !watch("amount") ? "Stake" : "Approve"}
            </span>
          </Button>
        )}

        {!active && (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        )}
      </div>
      <div className="mt-5 text-xs text-gray-600">
        {account ? (
          <div>
            The "Approve" transaction is only needed when bonding for the first
            time
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </form>
  )
}

function UnstakeContent() {
  const { account } = useWeb3React()

  const staking = useStaking()

  const { sArt, unstakeAllowance, sArtBalance, artBalance } =
    useStakingData(staking)

  const { active } = useWeb3React()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<{ amount: number }>({
    mode: "all",
    reValidateMode: "onChange",
  })

  const isAllowanceSufficient = unstakeAllowance.allowance >= watch("amount")

  const onSubmit = async ({ amount }: { amount: number }) => {
    const amountInArt = parseUnits(amount.toString(), 9)

    if (isAllowanceSufficient) {
      try {
        await staking.unstake(amountInArt)
        artBalance.mutate()
        sArtBalance.mutate()
        reset({ amount: 0 })
        successToast(`Unstaked ${amount} sART successfully`)
      } catch (error) {
        errorToast("Something went wrong")
        console.error(error)
      }
    } else {
      await sArt.approve(staking.address, ethers.constants.MaxUint256)
      unstakeAllowance.mutate()
    }
  }

  const maxsArtTrimmed = parseToFixed(sArtBalance.balance, 9)

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-cy="unstake-content">
      <div className="space-y-6">
        <CTABox className="flex items-center justify-between border border-gray-700">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <ArtIcon className="w-8 h-8" />
              <p className="text-2xl font-medium 2xl:text-[32px] text-dark-1000 tracking-2%">
                sART
              </p>
            </div>

            <p className="mt-2 text-sm font-medium 2xl:text-base tracking-2% text-dark-300">
              Balance{" "}
              {sArtBalance.balance >= 0 ? (
                <>{maxsArtTrimmed} sART</>
              ) : (
                <Skeleton className="inline-block" height={15} width={80} />
              )}{" "}
              (
              <button
                className="font-medium text-wine-600"
                type="button"
                onClick={() => {
                  setValue("amount", sArtBalance.balance, {
                    shouldValidate: true,
                  })
                }}
              >
                Max
              </button>
              )
            </p>
          </div>

          <input
            className="w-full text-3xl font-semibold text-right bg-transparent border-transparent outline-none reset-number-spinner text-dark-400 2xl:text-[35px] 2xl:leading-normal tracking-2% focus-visible:border-transparent focus-visible:ring-0 placeholder-dark-75"
            type="number"
            placeholder="0.0"
            step="0.000000001"
            {...register("amount", {
              required: true,
              max: sArtBalance.balance,
              min: 0,
            })}
          />
        </CTABox>
      </div>
      <Content />
      <div className="flex mt-5 item-stretch">
        {active && (
          <Button
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            type="submit"
            className="flex items-center gap-3 button button-primary button-hover disabled:opacity-75"
          >
            <span>
              {isAllowanceSufficient || !watch("amount")
                ? "Unstake"
                : "Approve"}
            </span>
          </Button>
        )}

        {!active && (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        )}
      </div>
      <div className="mt-5 text-xs text-gray-600">
        {account ? (
          <div>
            The "Approve" transaction is only needed when bonding for the first
            time
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </form>
  )
}

export default Stake
