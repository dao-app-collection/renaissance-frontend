import { useCallback, useState, useEffect } from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"
import { useSelector, useDispatch } from "react-redux"

import ConnectButton from "@components/ConnectButton"
import ProceedPromptModal from "@components/modals/ProceedPromptModal"
import Button from "@components/ui/Button"
import CTABox from "@components/ui/CTABox"
import Skeleton from "@components/ui/Skeleton"
import {
  prettify,
  round,
  format,
  prettifySeconds,
  secondsUntilBlock,
  getProvider,
} from "@helper"
import useDebounce from "@hooks/debounce"
import useModal from "@hooks/useModal"
import { changeApproval, bondAsset, calcBondDetails } from "@slices/bondSlice"
import { error } from "@slices/messagesSlice"
import { isPendingTxn, txnButtonText } from "@slices/pendingTxnsSlice"
import { parseToFixed } from "@utils/parseUtils"



function Bonding({ bond, slippage, setSlippage }) {
    const SECONDS_TO_REFRESH = 60
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(0)
    const { account, chainId, library } = useWeb3React<Web3Provider>()
    const rpcProvider = getProvider()
  
    const walletProvider = library
  
    const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH)
  
    const isBondLoading = useSelector(
      (state: any) => state.bonding.loading ?? true
    )
  
    const pendingTransactions = useSelector((state: any) => {
      return state.pendingTransactions
    })
  
    const currentBlock = useSelector((state: any) => {
      return state.app.currentBlock
    })
  
    const vestingPeriod = () => {
      const vestingBlock = parseInt(currentBlock) + parseInt(bond.vestingTerm)
      const seconds = secondsUntilBlock(currentBlock, vestingBlock)
      return prettifySeconds(seconds, "day")
    }
  
    const hasAllowance = useCallback(() => {
      return bond.allowance > 0
    }, [bond.allowance])
  
    const { showModal } = useModal()
  
    async function onBond() {
      if (quantity <= 0) {
        dispatch(error("Please enter a value!"))
      } else if (isNaN(quantity)) {
        dispatch(error("Please enter a valid value!"))
      } else if (bond.interestDue > 0 || bond.pendingPayout > 0) {
        const shouldProceed = window.confirm(
          "You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?"
        )
        if (shouldProceed) {
          const proceedAction = () => {
            dispatch(
              bondAsset({
                value: quantity.toString(),
                slippage,
                bond,
                chainId,
                rpcProvider,
                walletProvider,
                address: account,
              })
            )
          }
  
          showModal(
            <ProceedPromptModal
              onProceed={proceedAction}
              overview={<BuyInfo bond={bond} quantity={quantity} />}
            />
          )
        }
      } else {
        const proceedAction = () => {
          dispatch(
            bondAsset({
              value: quantity.toString(),
              slippage,
              bond,
              chainId,
              rpcProvider,
              walletProvider,
              address: account,
            })
          )
  
          clearInput()
        }
  
        if (bond.bondDiscount < 0) {
          showModal(
            <ProceedPromptModal
              onProceed={proceedAction}
              overview={<BuyInfo bond={bond} quantity={quantity} />}
            />
          )
        }
        // all good, bond not negative
        else {
          proceedAction()
        }
      }
    }
  
    const marketPrice = useSelector((state: any) => {
      return state.app.marketPrice
    })
  
    const clearInput = () => {
      setQuantity(0)
    }
  
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
  
    const bondDetailsDebounce = useDebounce(quantity.toString(), 1000)
  
    useEffect(() => {
      dispatch(
        calcBondDetails({
          bond,
          value: quantity.toString(),
          provider: rpcProvider,
          chainId: chainId,
        })
      )
    }, [bondDetailsDebounce])
  
    useEffect(() => {
      let interval = null
      if (secondsToRefresh > 0) {
        interval = setInterval(() => {
          setSecondsToRefresh((secondsToRefresh) => secondsToRefresh - 1)
        }, 1000)
      } else {
        clearInterval(interval)
        dispatch(
          calcBondDetails({
            bond,
            value: quantity.toString(),
            provider: rpcProvider,
            chainId: chainId,
          })
        )
        setSecondsToRefresh(SECONDS_TO_REFRESH)
      }
      return () => clearInterval(interval)
    }, [secondsToRefresh, quantity])
  
    const onSeekApproval = async () => {
      dispatch(
        changeApproval({
          address: account,
          bond,
          rpcProvider,
          walletProvider,
          chainId: chainId,
        })
      )
    }
  
    const displayUnits = bond.displayUnits
  
    const isAllowanceDataLoading = bond.allowance == null
  
    const maxTrimmed = parseToFixed(getMax(), 4)
  
    const bondNamePretty = bond.name
      .split("_")
      .join("-")
      .toUpperCase()
      .replace("-LP", " LP")

      const BondIcon = bond.bondIconSvg

      return (
        <div className="mt-8 px-12">
            <div className="flex item-stretch">
                    <div className="py-2 px-1.5 text-white text-xl font-semibold">Bond</div>
                    <div className="py-2 px-1.5 text-white text-xl font-semibold uppercase">{bond.name.split("_").join(" ")}</div>
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

          <div className="text-right text-white text-md py-4">Max You Can Buy: {} ART     Balance: {} FRAX</div>
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
                <div className="py-1.5 text-left text-white">Vesting Term</div>
                <div className="py-1.5 text-right text-white">
                    <>
                    {isBondLoading ? <Skeleton height={20} /> : vestingPeriod()}
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
            ) : hasAllowance() ? (
              <Button
                disabled={!bond.isAvailable}
                loading={isPendingTxn(pendingTransactions, "bond_" + bond.name)}
                onClick={onBond}
              >
                {txnButtonText(pendingTransactions, "bond_" + bond.name, "Bond")}
              </Button>
            ) : (
              <Button
                loading={isPendingTxn(pendingTransactions, "approve_" + bond.name)}
                onClick={onSeekApproval}
              >
                {txnButtonText(
                  pendingTransactions,
                  "approve_" + bond.name,
                  "Approve to continue"
                )}
              </Button>
            )}
        </div>
      <div className="pt-2 text-xs text-gray-600 "> The "Approve" transaction is only needed when bonding for the first time</div>
    </div>
    )
}

function BuyInfo({ bond, quantity }) {
    const isBondLoading = useSelector(
      (state: any) => state.bonding.loading ?? true
    )
  
    const marketPrice = useSelector((state: any) => {
      return state.app.marketPrice
    })
  
    return (
      <div className="py-6 mt-3 text-sm sm:text-base space-y-2">
        <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
          <p>Bonding</p>
          {isBondLoading ? (
            <Skeleton height={20} />
          ) : (
            <p className="text-right">
              {quantity} <span className="capitalize">{bond.name}</span>
            </p>
          )}{" "}
        </div>
  
        <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
          <p>You Will Receive</p>
          {isBondLoading ? (
            <Skeleton height={20} />
          ) : (
            <p className="text-right">
              {format(round(bond.bondQuote, 4), 3) || "0"} ART
            </p>
          )}
        </div>
  
        <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
          <p>Bond Price</p>
          {isBondLoading ? (
            <Skeleton height={20} />
          ) : (
            <p className="text-right">${prettify(bond.bondPrice)}</p>
          )}
        </div>
  
        <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
          <p>Market Price</p>
          {isBondLoading ? (
            <Skeleton height={20} />
          ) : (
            <p className="text-right">${prettify(marketPrice)}</p>
          )}
        </div>
  
        <div className="items-center font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
          <p>Discount</p>
          {isBondLoading ? (
            <Skeleton height={20} />
          ) : (
            <p
              className={clsx("text-right", {
                "text-red-600": bond.bondDiscount < 0,
                "text-orange-600": bond.bondDiscount > 0,
              })}
            >
              {bond.bondDiscount && prettify(bond.bondDiscount * 100)}%
            </p>
          )}
        </div>
      </div>
    )
  }

  export default Bonding
