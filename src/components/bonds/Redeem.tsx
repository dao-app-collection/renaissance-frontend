import { useState } from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import Image from "next/image"
import { useSelector, useDispatch } from "react-redux"

import ConnectButton from "@components/ConnectButton"
import Button from "@components/ui/Button"
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


function Content({ bond, quantity }){

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
    <div className="grid grid-cols-1 lg:grid-cols-3 bg-bg-header bg-opacity-50 rounded-lg flex-wrap items-center lg:justify-items-center gap-x-20 py-4 px-3">
    <div className="grid grid-rows-2 text-left">
        <div className="text-gray-500 row-start-1 text-md">What You Will Get</div>
        <div className="row-start-2  text-lg">
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
    <div className="grid grid-rows-2 text-left">
      <div className="text-gray-500 row-start-1 text-md">Time Untill Fully Vested</div>
      <div className="row-start-2 text-white text-lg">
        <p>
        {isBondLoading ? (
                    <Skeleton height={20} />
                  ) : (
                    <p className="text-right">{vestingTime()}</p>
                  )}        </p>
    </div>
  </div>

  <div className="grid grid-rows-2 text-left">
      <div className="text-gray-500 row-start-1 text-md">ROI</div>
      <div className="row-start-2 text-white text-lg">
        <p>
          {prettify(bond.bondDiscount * 100)}%
        </p>
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
      
    <div className="mt-8 px-1">
        <div className="flex item-stretch">
                <div className="py-2 px-1.5 text-white text-xl font-semibold">Redeem ART</div>
                <Image
                  src="/images/r_logo.svg"
                  alt="Near"
                  width={25}
                  height={25}
              />
        </div>
    <div className="space-y-6">
        <CTABox className="flex items-center border border-gray-700 justify-between ">
            <div className="">
                <input
                    onChange={(e: any) => setQuantity(e.target.value)}
                    className="w-full h-1/4 md:text-md ml-3 text-left bg-transparent outline-none text-dark-500 text-[35px] text-dark-input tracking-2%"
                    size={12}
                    placeholder="0.0 ART"
                />
            </div>
                <button onClick={setMax} className="mx-6 py-2 px-4 text-sm md:text-md bg-transparent hover:bg-blue-500 text-indigo-500 font-bold hover:text-white border border-indigo-500 hover:border-transparent rounded bg-dark-1500">Max amount</button>
        </CTABox>
    </div>
    <div className="text-right text-white text-md py-4"> 
                <span className="">Pending Rewards: {prettify(bond.interestDue)} ART </span>
                <span className="px-0 md:px-5"></span>
                <span className="">Claimable Rewards: {prettify(bond.pendingPayout)} ART</span>
    </div>
    <Content bond={bond} quantity={quantity}/>
        <div className="py-4 flex item-stretch">
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
