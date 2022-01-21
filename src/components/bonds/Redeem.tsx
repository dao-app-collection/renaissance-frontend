import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
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
import { useState } from "react"

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
        
    <div className="mt-8 px-12">
        <div className="flex item-stretch">
                <div className="py-2 px-1.5 text-white text-xl font-semibold">Redeem ART</div>
                <BondIcon className="py-2 w-8 h-12"/>
        </div>
    <div className="space-y-6">
        <CTABox className="flex items-center border-2 border-gray-600 justify-between ">
            <div className="">
                <input
                    onChange={(e: any) => setQuantity(e.target.value)}
                    className="w-full text-lg font-semibold text-left bg-transparent outline-none text-dark-500 text-[35px] text-dark-input tracking-2%"
                    size={12}
                    placeholder="0.0 ART"
                />
            </div>
            <div className="">
                <button onClick={setMax} className="bg-transparent hover:bg-blue-500 border border-indigo-500 text-indigo-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Max amount</button>
            </div>
        </CTABox>
    </div>


    <div className="text-right text-white text-md py-4">Pending Rewards: 1000 ART     Claimable Rewards: 100 FRAX</div>
          <div className="py-5 md:py-5 bg-dark-1000 bg-opacity-60 sm:py-4 sm:px-10 rounded-xl ">
            <div className="text-sm  grid grid-cols-2">
                <div className="py-1.5 text-left text-white">You Will Get</div>
                <div className="py-1.5 text-right text-white">
                    <>
                    {isBondLoading ? (
                    <Skeleton height={20} />
                    ) : (
                    <p className="text-right">
                        {format(round(bond.bondQuote, 4), 3) || "0"} ART
                    </p>
                        )}
                    </>
                </div>
                <div className="py-1.5 text-left text-white">Time Until Fully Vested</div>
                <div className="py-1.5 text-right text-white">
                    <>
                    <p className="text-right">{vestingTime()}</p>
                    </>
                </div>
                <div className="py-1.5 text-left text-white">Debt Ratio</div>
                <div className="py-1.5 text-right text-green-500">
                    <>
                    {isBondLoading ? (
                    <Skeleton height={20} />
                    ) : (
                    <p className="text-right">
                        {prettify(bond.debtRatio / 10000000)}%
                    </p>
                    )}
                    </>
                </div>
                <div className="py-1.5 text-left text-white">ROI (5-Day Rate)</div>
                <div className="py-1.5 text-right text-green-500">
                    <>
                    {prettify(bond.bondDiscount * 100)}%
                    </>
                </div>
            </div>
        </div>
        <div className="py-5 flex item-stretch">
        {!account ? (
            <ConnectButton />
          ) : (
            <>
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
                  "Claim"
                )}
              </Button>
              <div className="px-3"></div>
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
            </>
          )}
      </div>
    </div>
  )
}

export default Redeem
