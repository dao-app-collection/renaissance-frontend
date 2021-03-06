import { useState } from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import Image from "next/image"
import { useSelector, useDispatch } from "react-redux"

import ConnectButton from "@components/ConnectButton"
import Button from "@components/ui/Buttons"
import CTABox from "@components/ui/CTABox"
import Skeleton from "@components/ui/Skeleton"
import {
  prettify,
  prettifySeconds,
  secondsUntilBlock,
  prettyVestingPeriod,
  getProvider,
  format,
  round,
} from "@helper"
import { redeemBond } from "@slices/bondSlice"
import { isPendingTxn, txnButtonText } from "@slices/pendingTxnsSlice"

function Content({ bond, quantity }) {
  const currentBlock = useSelector((state: any) => {
    return state.app.currentBlock
  })

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock)
  }
  const isBondLoading = useSelector(
    (state: any) => state.bonding.loading ?? true
  )
  return (
    <div className="flex-wrap items-center px-3 py-4 rounded-lg grid grid-cols-1 lg:grid-cols-3 bg-scheme-500 bg-opacity-50 lg:justify-items-center gap-x-20">
      <div className="text-left grid grid-rows-2">
        <div className="text-gray-500 row-start-1 text-md">
          What You Will Get
        </div>
        <div className="text-lg row-start-2">
          <>
            {isBondLoading ? (
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
            {isBondLoading ? (
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

function Redeem({ bond }) {
  const dispatch = useDispatch()
  const { chainId, account, library } = useWeb3React<Web3Provider>()
  const rpcProvider = getProvider()
  const walletProvider = library
  const [quantity, setQuantity] = useState(0)

  const isBondLoading = useSelector(
    (state: any) => state.bonding.loading ?? true
  )

  const marketPrice = useSelector((state: any) => {
    return state.app.marketPrice
  })

  const currentBlock = useSelector((state: any) => {
    return state.app.currentBlock
  })
  const pendingTransactions = useSelector((state: any) => {
    return state.pendingTransactions
  })
  const bondingState = useSelector((state: any) => {
    return state.bonding && state.bonding[bond.name]
  })

  async function onRedeem({ autostake }) {
    await dispatch(
      redeemBond({
        address: account,
        bond,
        chainId,
        rpcProvider,
        walletProvider,
        autostake,
      })
    )
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock)
  }

  const vestingPeriod = () => {
    const vestingBlock =
      parseInt(currentBlock) + parseInt(bondingState?.vestingTerm)
    const seconds = secondsUntilBlock(currentBlock, vestingBlock)
    return prettifySeconds(seconds, "day")
  }

  const isRedeemLoading = isPendingTxn(
    pendingTransactions,
    "redeem_bond_" + bond.name
  )

  const isRedeemAutostakeLoading = isPendingTxn(
    pendingTransactions,
    "redeem_bond_" + bond.name + "_autostake"
  )

  const bondNamePretty = bond.name
    .split("_")
    .join("-")
    .toUpperCase()
    .replace("-LP", " LP")

  const getMax = () => {
    let maxQ
    if (bond.maxBondPrice * bond.bondPrice < Number(bond.balance)) {
      // there is precision loss here on Number(bond.balance)
      maxQ = bond.maxBondPrice * bond.bondPrice.toString()
    } else {
      maxQ = bond.balance
    }
    return maxQ
  }

  const setMax = () => {
    let maxQ = getMax()
    setQuantity(maxQ)
  }
  const BondIcon = bond.bondIconSvg

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
        <span className="">
          Pending Rewards: {prettify(bond.interestDue)} ART{" "}
        </span>
        <span className="px-0 md:px-5"></span>
        <span className="">
          Claimable Rewards: {prettify(bond.pendingPayout)} ART
        </span>
      </div>
      <Content bond={bond} quantity={quantity} />
      <div className="flex py-4 item-stretch">
        {!account ? (
          <ConnectButton />
        ) : (
          <>
            <Button
              loading={isRedeemAutostakeLoading}
              disabled={
                bond.pendingPayout == 0.0 ||
                isRedeemLoading ||
                isRedeemAutostakeLoading
              }
              onClick={() => onRedeem({ autostake: true })}
            >
              {txnButtonText(
                pendingTransactions,
                "redeem_bond_" + bond.name + "_autostake",
                "Claim and Autostake"
              )}
            </Button>
            <div className="px-3"></div>
            <Button
              loading={isRedeemLoading}
              disabled={
                bond.pendingPayout == 0.0 ||
                isRedeemLoading ||
                isRedeemAutostakeLoading
              }
              onClick={() => onRedeem({ autostake: false })}
            >
              {txnButtonText(
                pendingTransactions,
                "redeem_bond_" + bond.name,
                "Claim Only"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default Redeem
