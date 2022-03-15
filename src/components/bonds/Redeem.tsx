import { useState } from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"

import ConnectButton from "@components/ConnectButton"
import ArtIcon from "@components/customicons/FraxIcon"
import Button from "@components/ui/Buttons"
import CTABox from "@components/ui/CTABox"
import Skeleton from "@components/ui/Skeleton"
import { prettify, format, round, prettyVestingPeriod } from "@helper"
import useBonder from "@hooks/useBonder"
import { useCurrentBlock } from "@hooks/useCurrentBlock"

function Content({ bond }) {
  let loading = !bond.bondPrice

  const { bondMaturationBlock } = useBonder(bond)

  const currentBlock = useCurrentBlock()

  if (!bond.name) return null

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bondMaturationBlock)
  }

  return (
    <div className="flex-wrap items-center px-3 py-4 rounded-lg grid grid-cols-1 lg:grid-cols-3 bg-scheme-500 bg-opacity-50 lg:justify-items-center gap-x-20">
      <div className="text-left grid grid-rows-2">
        <div className="text-gray-500 row-start-1 text-md">
          What You Will Get
        </div>
        <div className="text-lg row-start-2">
          <>
            {loading ? (
              <Skeleton height={20} />
            ) : (
              <p className="text-white">
                {format(round(bond.bondQuote, 4), 3) || "0"} ART
              </p>
            )}
          </>
        </div>
      </div>
      <div className="text-left grid grid-rows-2">
        <div className="text-gray-500 row-start-1 text-md">
          Time Untill Fully Vested
        </div>
        <div className="text-lg text-white row-start-2">
          <p>
            {loading ? (
              <Skeleton height={20} />
            ) : (
              <p className="text-right">{vestingTime()}</p>
            )}{" "}
          </p>
        </div>
      </div>

      <div className="text-left grid grid-rows-2">
        <div className="text-gray-500 row-start-1 text-md">ROI</div>
        <div className="text-lg text-white row-start-2">
          <p>{prettify(bond.bondDiscount * 100)}%</p>
        </div>
      </div>
    </div>
  )
}

function BondRedeem({ bond }) {
  const [quantity, setQuantity] = useState(0)

  const { account } = useWeb3React<Web3Provider>()
  const {
    interestDue,
    pendingPayout,
    redeemBond,
    redeemBondPending,
    redeemBondAutoPending,
  } = useBonder(bond)

  const setMax = () => {
    setQuantity(Number(pendingPayout))
  }

  return (
    <div className="px-1 mt-8">
      <div className="flex item-stretch">
        <div className="py-2 text-xl font-semibold text-white px-1.5">
          Redeem ART
        </div>
      </div>
      <div className="space-y-6">
        <CTABox className="flex items-center justify-between border border-gray-700">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <ArtIcon className="w-8 h-8" />
              <p className="text-2xl font-medium text-white 2xl:text-[32px] tracking-2%">
                ART
              </p>
            </div>

            <p className="mt-2 text-sm font-medium 2xl:text-base tracking-2% text-dark-300">
              Balance{" "}
              {pendingPayout ? (
                <>{prettify(Number(pendingPayout))} ART</>
              ) : (
                <Skeleton className="inline-block" height={15} width={80} />
              )}{" "}
              (
              <button
                className="font-medium text-wine-600"
                type="button"
                onClick={setMax}
              >
                Max
              </button>
              )
            </p>
          </div>
          <input
            value={quantity}
            type="number"
            onChange={(e: any) => {
              const q = e.target.value
              if (isNaN(q) || q < 0) return
              setQuantity(q)
            }}
            className="w-full text-3xl font-semibold text-right bg-transparent border-transparent outline-none reset-number-spinner text-dark-400 2xl:text-[35px] 2xl:leading-normal tracking-2% focus-visible:border-transparent focus-visible:ring-0 placeholder-dark-75"
            size={12}
            placeholder="0.0 ART"
          />
        </CTABox>
      </div>
      <div className="py-4 text-right text-white text-md">
        <span className="">Pending Rewards: {prettify(interestDue)} ART </span>
        <span className="px-0 md:px-5"></span>
        <span className="">
          Claimable Rewards: {prettify(Number(pendingPayout))} ART
        </span>
      </div>
      <Content bond={bond} />
      <div className="flex py-4 item-stretch">
        {!account ? (
          <ConnectButton />
        ) : (
          <>
            <Button
              loading={redeemBondAutoPending}
              disabled={
                bond.pendingPayout == 0.0 ||
                redeemBondPending ||
                redeemBondAutoPending
              }
              onClick={() => redeemBond({ autostake: true })}
            >
              Claim and Autostake
            </Button>
            <div className="px-3"></div>
            <Button
              loading={redeemBondPending}
              disabled={
                bond.pendingPayout == 0.0 ||
                redeemBondPending ||
                redeemBondAutoPending
              }
              onClick={() => redeemBond({ autostake: false })}
            >
              Claim only
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default BondRedeem
