import { useState } from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import Image from "next/image"

import ConnectButton from "@components/ConnectButton"
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
        <Image src="/images/r_logo.svg" alt="Near" width={25} height={25} />
      </div>
      <div className="space-y-6">
        <CTABox className="flex items-center justify-between border border-gray-700">
          <div className="">
            <input
              value={quantity}
              onChange={(e: any) => setQuantity(e.target.value)}
              className="w-full ml-3 text-left bg-transparent outline-none h-1/4 md:text-md text-dark-500 text-[35px] text-dark-input tracking-2%"
              size={12}
              placeholder="0.0 ART"
            />
          </div>
          <button
            onClick={setMax}
            className="px-4 py-2 mx-6 text-sm font-bold text-indigo-500 bg-transparent border border-indigo-500 rounded md:text-md hover:bg-blue-500 hover:text-white hover:border-transparent bg-dark-1500"
          >
            Max amount
          </button>
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
