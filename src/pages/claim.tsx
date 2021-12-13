import React, { useRef } from "react"

import ArtIcon from "@components/customicons/ArtIcon"
import { ArrowRightIcon } from "@heroicons/react/solid"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import Link from "next/link"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Reward from "react-rewards"
import { useSWRConfig } from "swr"

import ArtPresaleABI from "@abi/ArtPresale.json"
import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import CTABox from "@components/ui/CTABox"
import PageHeading from "@components/ui/PageHeading"
import Skeleton from "@components/ui/Skeleton"
import Spinner from "@components/ui/Spinner"
import { currentAddresses } from "@constants"
import Presale from "@contracts/Presale"
import { useContract } from "@hooks/contracts/useContract"
import { useToken } from "@hooks/contracts/useToken"
import { useTokenAllowance } from "@hooks/contracts/useTokenAllowance"
import { useTokenBalance } from "@hooks/contracts/useTokenBalance"
import { parseToFixed } from "@utils/parseUtils"

interface Fields {
  amount: number
}

export default function Whitelist() {
  const { account, active } = useWeb3React()
  const { mutate } = useSWRConfig()

  const presale = useContract(
    Presale,
    currentAddresses.DAI_ART_PRESALE_ADDRESS,
    ArtPresaleABI
  )

  const aArt = useToken(currentAddresses.AART_ADDRESS, {
    decimals: 9,
  })
  const art = useToken(currentAddresses.ART_ADDRESS, { decimals: 9 })

  const aArtBalance = useTokenBalance(aArt)
  const aArtAllowance = useTokenAllowance(
    aArt,
    currentAddresses.DAI_ART_PRESALE_ADDRESS
  )

  const artBalance = useTokenBalance(art)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<Fields>({
    mode: "all",
    reValidateMode: "onChange",
  })

  const isAllowanceSufficient = aArtAllowance.allowance >= watch("amount")

  const rewardsRef = useRef(null)

  async function onSubmit({ amount }: Fields) {
    try {
      if (amount <= 0) {
        toast.error("Please enter amount greater than 0!")
      }
      if (isAllowanceSufficient) {
        await presale.withdraw(amount)
        // shoot some grapes
        rewardsRef.current.rewardMe()
        mutate(["/user", account])
        aArtBalance.mutate()
        artBalance.mutate()
        reset({ amount: 0 })
      } else {
        await aArt.approve(
          currentAddresses.DAI_ART_PRESALE_ADDRESS,
          ethers.constants.MaxUint256
        )
        aArtAllowance.mutate()
      }
    } catch (error) {
      if (
        error?.data?.message ===
        "Error: VM Exception while processing transaction: reverted with reason string 'ART is not yet claimable'"
      ) {
        toast.error("ART is not yet claimable!")
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  const router = useRouter()

  const maxaArtTrimmed = parseToFixed(aArtBalance.balance, 4)

  return (
    <Layout>
      <div className="container relative h-full min-h-screen py-10">
        <PageHeading>
          <div className="flex-grow">
            <PageHeading.Title>Claim</PageHeading.Title>
            <PageHeading.Subtitle>
              aART Remaining:{" "}
              {aArtBalance.balance > 0 && (
                <span className="text-orange-600 capitalize">Yes</span>
              )}
              {!aArtBalance.balance && (
                <span className="text-orange-600 capitalize">No</span>
              )}
            </PageHeading.Subtitle>
          </div>

          <PageHeading.Content>
            <PageHeading.Stat
              title="aART BALANCE"
              subtitle={
                aArtBalance.balance >= 0 ? (
                  <>{aArtBalance.balance} aART</>
                ) : (
                  <Skeleton className="inline-block" height={15} width={80} />
                )
              }
            />
            <PageHeading.Stat
              title="ART BALANCE"
              subtitle={
                artBalance.balance >= 0 ? (
                  <>{artBalance.balance} ART</>
                ) : (
                  <Skeleton className="inline-block" height={15} width={80} />
                )
              }
            />
          </PageHeading.Content>
        </PageHeading>

        <section className="mt-14 space-y-10 xl:space-y-12">
          <div className="flex justify-center">
            <p className="max-w-lg mx-auto font-medium sm:text-sm sm:px-0 2xl:leading-relaxed xl:px-4 2xl:px-6 2xl:text-[17px] text-dark-700 xl:max-w-xl 2xl:max-w-2xl tracking-2%">
              ArtDAO has conducted a fixed price auction of aART. Your aART is
              to be converted to Art 1:1. Please claim your ART at your earliest
              convenience.{" "}
              <Link href="https://medium.com/@ArtDAO/3057b706a11a">
                <a
                  className="inline-flex items-center font-medium text-orange-600 2xl:gap-2 gap-2 md:gap-1.5 group tracking-2%"
                  target="_blank"
                  rel="noopener nofollow"
                >
                  <span>Learn more</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition transform" />
                </a>
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-lg mx-auto sm:px-0 2xl:max-w-2xl xl:max-w-xl">
              <CTABox className="flex items-center justify-between">
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <ArtIcon className="w-8 h-8" />
                    <p className="text-2xl font-medium 2xl:text-[32px] text-dark-1000 tracking-2%">
                      aART
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-medium 2xl:text-base tracking-2% text-dark-300">
                    Balance{" "}
                    {aArtBalance.balance >= 0 ? (
                      <>{maxaArtTrimmed} aART</>
                    ) : (
                      <Skeleton
                        className="inline-block"
                        height={15}
                        width={80}
                      />
                    )}{" "}
                    (
                    <button
                      className="font-medium text-orange-600"
                      type="button"
                      onClick={() => {
                        setValue("amount", aArtBalance.balance, {
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
                  className="w-full text-3xl font-semibold text-right border-transparent outline-none reset-number-spinner text-dark-400 2xl:text-[35px] 2xl:leading-normal tracking-2% focus-visible:border-transparent focus-visible:ring-0 placeholder-dark-75"
                  type="number"
                  placeholder="0.0"
                  step="0.000000001"
                  {...register("amount", {
                    required: true,
                    max: aArtBalance.balance,
                    min: 0,
                  })}
                />
              </CTABox>
            </div>

            <div className="mt-12">
              <div className="w-1 h-1 mx-auto">
                <Reward
                  ref={rewardsRef}
                  type="emoji"
                  config={{
                    emoji: ["🍇"],
                    lifetime: 100,
                    springAnimation: false,
                    spread: 80,
                  }}
                >
                  <div></div>
                </Reward>
              </div>

              <div className="flex justify-center">
                {active && (
                  <button
                    disabled={!isValid || isSubmitting}
                    type="submit"
                    className="flex items-center button gap-3 button-primary button-hover disabled:opacity-75"
                  >
                    {isSubmitting && <Spinner />}

                    <span>
                      {isAllowanceSufficient || !watch("amount")
                        ? "Claim ART"
                        : "Approve"}
                    </span>
                  </button>
                )}

                {!active && (
                  <div className="flex justify-center">
                    <ConnectButton customStyle="w-100" />
                  </div>
                )}
              </div>
            </div>
          </form>
        </section>
      </div>
    </Layout>
  )
}
