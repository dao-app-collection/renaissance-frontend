import { useCallback, useState, useEffect } from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
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

function Content({ bond, quantity }){

  const currentBlock = useSelector((state: any) => {
    return state.app.currentBlock
  })

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(bond.vestingTerm)
    const seconds = secondsUntilBlock(currentBlock, vestingBlock)
    return prettifySeconds(seconds, "day")
  }
  const isBondLoading = useSelector(
    (state: any) => state.bonding.loading ?? true
  )
  return (
    <div className="flex-wrap items-center px-3 py-4 rounded-lg grid grid-cols-1 lg:grid-cols-3 bg-scheme-500 bg-opacity-50 lg:justify-items-center gap-x-20">
    <div className="text-left grid grid-rows-2">
        <div className="text-gray-500 row-start-1 text-md">What You Will Get</div>
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
      <div className="text-gray-500 row-start-1 text-md">Vesting Term</div>
      <div className="text-lg text-white row-start-2">
        <p>
          {isBondLoading ? <Skeleton height={20} /> : vestingPeriod()}
        </p>
    </div>
  </div>

  <div className="text-left grid grid-rows-2">
      <div className="text-gray-500 row-start-1 text-md">ROI</div>
      <div className="text-lg text-white row-start-2">
        <p>
          {prettify(bond.bondDiscount * 100)}%
        </p>
    </div>
  </div>
</div>


  )
}

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
              overview={<Content bond={bond} quantity={quantity} />}
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
              overview={<Content bond={bond} quantity={quantity} />}
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
        <div className="px-1 mt-8">
            <div className="flex item-stretch">
                    <div className="py-2 text-xl font-semibold text-white px-1.5">Bond</div>
                    <div className="py-2 text-xl font-semibold text-white uppercase px-1.5">{bond.name.split("_").join(" ")}</div>
                    <BondIcon className="w-8 py-2 h-11"/>
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
                        <button onClick={setMax} className="px-4 py-2 mx-6 text-sm font-bold text-indigo-500 bg-transparent border border-indigo-500 rounded md:text-md hover:bg-blue-500 hover:text-white hover:border-transparent bg-dark-1500">Max amount</button>
                </CTABox>
              </div>
              <div className="py-4 text-right text-white text-md"> 
                <span className="">Max You Can Buy: {format(round(bond.maxBondPrice, 4), 3) || "0"} ART </span>
                <span className="px-0 md:px-5"></span>
                <span className="">Balance: {prettify(bond.balance)} {displayUnits}</span>
              </div>
              <Content bond={bond} quantity={quantity}/>
        <div className="flex py-4 item-stretch">
            {!account ? (
              <ConnectButton/>
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
        <div className="text-xs text-gray-600"> 
        {(account && !hasAllowance()) ?
        <div>The "Approve" transaction is only needed when bonding for the first time</div> :
        <div></div>
        }
      </div>
    </div>
  )
}
export default Bonding
