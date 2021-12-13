import { useState } from "react"

import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"
import { ethers } from "ethers"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import ConnectButton from "@components/ConnectButton"
import FraxIcon from "@components/customicons/FraxIcon"
import Layout from "@components/layouts/Layout"
import ArtSwitch from "@components/ui/ArtSwitch"
import CTABox from "@components/ui/CTABox"
import PageHeading from "@components/ui/PageHeading"
import Skeleton from "@components/ui/Skeleton"
import Spinner from "@components/ui/Spinner"
import { prettify } from "@helper"
import {
  useStaking,
  useStakingData,
  useStakingHelper,
} from "@hooks/contracts/useStaking"
import { parseSecondsToReadable, parseToFixed } from "@utils/parseUtils"

function Stake() {
  const staking = useStaking()

  const { active } = useWeb3React()

  const { stakingAPY, currentIndex, secondsUntilNextEpoch, contractBalance } =
    useStakingData(staking)

  // for the switch, we cannot really use another datatype other than boolean
  const [mode, setMode] = useState(false)

  // therefore this is to simplify reading code
  const isStaking = !mode
  const isUnstaking = mode

  const trimmedStakingAPY =
    stakingAPY > 500000 ? ">500,000" : prettify(stakingAPY)

  const { days, hours, minutes } = parseSecondsToReadable(secondsUntilNextEpoch)
  const timeText = `${days}d ${hours}h ${minutes}m`

  return (
    <Layout>
      <div
        className="container relative min-h-screen py-10"
        data-cy="stake-page"
      >
        <PageHeading>
          <div className="flex-grow">
            <PageHeading.Title>Stake</PageHeading.Title>
            {active && (
              <PageHeading.Subtitle>
                {secondsUntilNextEpoch > 0 ? (
                  `Next Rebase: ~${timeText}`
                ) : (
                  <Skeleton height={15} width={80} />
                )}
              </PageHeading.Subtitle>
            )}
          </div>

          <PageHeading.Content>
            <PageHeading.Stat
              title="APY"
              subtitle={
                <>
                  {stakingAPY > 0 ? (
                    `${trimmedStakingAPY}%`
                  ) : (
                    <Skeleton height={40} width={200} />
                  )}
                </>
              }
            />

            <PageHeading.Stat
              title="ART STAKED"
              subtitle={
                <>
                  {contractBalance ? (
                    `${prettify(contractBalance)}`
                  ) : (
                    <Skeleton height={40} width={200} />
                  )}
                </>
              }
            />

            <PageHeading.Stat
              title="INDEX"
              subtitle={
                <>
                  {currentIndex ? (
                    `${prettify(currentIndex)} ART`
                  ) : (
                    <Skeleton height={40} width={200} />
                  )}
                </>
              }
            />
          </PageHeading.Content>
        </PageHeading>

        <div className="py-16">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-4">
              <span
                className={clsx(
                  "tracking-2% transition-colors font-medium text-dark-300",
                  {
                    "font-semibold !text-orange-600": !mode,
                  }
                )}
              >
                Stake
              </span>
              <ArtSwitch enabled={mode} onChange={setMode} />
              <span
                className={clsx(
                  "tracking-2% transition-colors font-medium text-dark-300",
                  {
                    "font-semibold !text-orange-600": mode,
                  }
                )}
              >
                Unstake
              </span>
            </div>
          </div>

          <div className="mt-8">
            {isStaking && <StakeContent />}
            {isUnstaking && <UnstakeContent />}
          </div>
        </div>
      </div>
    </Layout>
  )
}

function StakeContent() {
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
        toast.success(`Staked ${amount} ART successfully`)
      } catch (error) {
        toast.error("Something went wrong")
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
        <CTABox className="flex items-center justify-between max-w-lg mx-auto sm:px-0 2xl:max-w-2xl xl:max-w-xl">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <FraxIcon className="w-8 h-8" />
              <p className="text-2xl font-medium text-white 2xl:text-[32px] tracking-2%">
                ART
              </p>
            </div>

            {/* <button
              onClick={async () => {
                const contractBalance2 = await staking.contractBalance()
                console.log({ stakingAPY })
                console.log({ stakingRebase })
                console.log({ fiveDayRate })
                console.log({ stakingTVL })
                console.log({ contractBalance })
                console.log({ contractBalance2 })
              }}
            >
              Herer
            </button> */}

            <p className="mt-2 text-sm font-medium 2xl:text-base tracking-2% text-dark-300">
              Balance{" "}
              {artBalance.balance >= 0 ? (
                <>{maxArtTrimmed} ART</>
              ) : (
                <Skeleton className="inline-block" height={15} width={80} />
              )}{" "}
              (
              <button
                className="font-medium text-orange-600"
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
            className="w-full text-3xl font-semibold text-right text-white bg-transparent border-transparent outline-none reset-number-spinner 2xl:text-[35px] 2xl:leading-normal tracking-2% focus-visible:border-transparent focus-visible:ring-0 placeholder-dark-75"
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
        <StakingInfo />
      </div>

      <div className="flex justify-center mt-8">
        {active && (
          <button
            disabled={!isValid || isSubmitting}
            type="submit"
            className="flex items-center gap-3 button button-primary button-hover disabled:opacity-75"
          >
            {isSubmitting && <Spinner />}

            <span>
              {isAllowanceSufficient || !watch("amount") ? "Stake" : "Approve"}
            </span>
          </button>
        )}

        {!active && (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        )}
      </div>
    </form>
  )
}

function UnstakeContent() {
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
        toast.success(`Unstaked ${amount} sART successfully`)
      } catch (error) {
        toast.error("Something went wrong")
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
        <CTABox className="flex items-center justify-between max-w-lg mx-auto sm:px-0 2xl:max-w-2xl xl:max-w-xl">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <FraxIcon className="w-8 h-8" />
              <p className="text-2xl font-medium text-white 2xl:text-[32px] tracking-2%">
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
                className="font-medium text-orange-600"
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
            className="w-full text-3xl font-semibold text-right text-white bg-transparent border-transparent outline-none reset-number-spinner 2xl:text-[35px] 2xl:leading-normal tracking-2% focus-visible:border-transparent focus-visible:ring-0 placeholder-dark-75"
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

        <StakingInfo />
      </div>

      <div className="flex justify-center mt-8">
        {active && (
          <button
            disabled={!isValid || isSubmitting}
            type="submit"
            className="flex items-center gap-3 button button-primary button-hover disabled:opacity-75"
          >
            {isSubmitting && <Spinner />}

            <span>
              {isAllowanceSufficient || !watch("amount")
                ? "Unstake"
                : "Approve"}
            </span>
          </button>
        )}

        {!active && (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        )}
      </div>
    </form>
  )
}

function StakingInfo() {
  const staking = useStaking()
  const { artBalance, sArtBalance, fiveDayRate, stakingRebase } =
    useStakingData(staking)

  const stakingRebasePercentage = Number(prettify(stakingRebase * 100))

  const sArtTrimmed = parseToFixed(sArtBalance.balance, 9)

  const nextRewardValue = prettify(
    (stakingRebasePercentage / 100) * sArtTrimmed,
    9
  )

  return (
    <CTABox className="max-w-lg py-4 mx-auto sm:px-0 2xl:max-w-2xl xl:max-w-xl">
      <div className="py-2">
        <h2 className="font-medium uppercase tracking-2% text-dark-300">
          Staking Information
        </h2>

        <div className="mt-3 text-sm space-y-3 sm:text-base">
          <div className="items-center font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
            <p>Your Balance</p>
            <p className="text-right">
              {artBalance.balance >= 0 ? (
                <>{prettify(artBalance.balance, 4)} ART</>
              ) : (
                <Skeleton className="inline-block" height={15} width={80} />
              )}
            </p>
          </div>

          <div className="items-center font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
            <p>Your Staked Balance</p>
            <p className="text-right">
              {sArtBalance.balance >= 0 ? (
                <>{sArtTrimmed} sART</>
              ) : (
                <Skeleton className="inline-block" height={15} width={80} />
              )}
            </p>
          </div>

          <div className="items-center font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
            <p>Next Reward</p>
            <p className="text-right">
              {sArtBalance.balance >= 0 ? (
                <>{nextRewardValue} sART</>
              ) : (
                <Skeleton className="inline-block" height={15} width={80} />
              )}
            </p>
          </div>

          <div className="items-center font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
            <p>Staking Rebase</p>
            <p className="text-right">
              {stakingRebasePercentage ? (
                <>{stakingRebasePercentage} %</>
              ) : (
                <Skeleton className="inline-block" height={15} width={80} />
              )}
            </p>
          </div>

          <div className="items-center font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
            <p>ROI (5-Day Rate)</p>
            <p className="text-right">
              {fiveDayRate ? (
                <>{prettify(fiveDayRate * 100, 4)} %</>
              ) : (
                <Skeleton className="inline-block" height={15} width={80} />
              )}
            </p>
          </div>
        </div>
      </div>
    </CTABox>
  )
}

export default Stake
