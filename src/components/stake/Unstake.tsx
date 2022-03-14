import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import { useForm } from "react-hook-form"

import ConnectButton from "@components/ConnectButton"
import ArtIcon from "@components/customicons/FraxIcon"
import Button from "@components/ui/Buttons"
import CTABox from "@components/ui/CTABox"
import Skeleton from "@components/ui/Skeleton"
import { errorToast, successToast } from "@components/ui/Toast"
import { parseToFixed } from "@helper/parseUtils"
import { useStaking, useStakingData } from "@hooks/useStaking"

import Content from "./StakeInfo"

export default function UnstakeContent() {
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
