import { useCallback, useState, useEffect } from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"
import { useSelector, useDispatch } from "react-redux"

import ConnectButton from "@components/ConnectButton"
import ProceedPromptModal from "@components/modals/ProceedPromptModal"
import Button from "@components/ui/Buttons"
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

function BondPurchase({ bond, slippage, setSlippage }) {
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

  return (
    <div>
      <div className="space-y-6">
        <CTABox className="max-w-lg mx-auto sm:px-0 2xl:max-w-2xl xl:max-w-xl">
          {!account ? (
            <div className="flex items-center gap-2">
              <bond.bondIconSvg className="h-8 w-15" />
              <p className="text-2xl font-medium text-white uppercase 2xl:text-[32px] tracking-2%">
                {bondNamePretty}
              </p>
            </div>
          ) : isAllowanceDataLoading ? (
            <Skeleton height={60} />
          ) : (
            <div className="flex items-end justify-between">
              {!hasAllowance() ? (
                <h2 className="font-medium text-center text-white tracking-2%">
                  First time bonding <b>{bond.displayName}</b>?
                  <br />
                  Please approve Art DAO to use your <b>
                    {bond.displayName}
                  </b>{" "}
                  for bonding.
                </h2>
              ) : (
                <>
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <bond.bondIconSvg className="h-8 w-15" />
                      <p className="text-2xl font-medium text-white uppercase 2xl:text-[32px] tracking-2%">
                        {bondNamePretty}
                      </p>
                    </div>
                    <p className="mt-3 font-medium text-white tracking-2%">
                      Maximum {maxTrimmed}{" "}
                      <span className="uppercase">{bondNamePretty}</span> (
                      <button
                        onClick={setMax}
                        className="font-medium text-orange-600 cursor-pointer"
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
                    step="0.0001"
                    value={quantity}
                    onChange={(e: any) => {
                      const q = e.target.value
                      if (isNaN(q) || q < 0) return
                      setQuantity(q)
                    }}
                  />
                </>
              )}
            </div>
          )}

          <div className="mt-6 space-y-3">
            <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
              <p>Bond Price</p>
              {isBondLoading ? (
                <Skeleton height={20} />
              ) : (
                <p className="text-right">${prettify(bond.bondPrice)}</p>
              )}{" "}
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

            <div className="flex items-baseline text-sm font-medium">
              <span className="text-dark-200">Slippage: </span>
              <div className="font-semibold text-white">
                <input
                  onChange={(e: any) => {
                    const s = e.target.value
                    if (isNaN(s) || s < 0 || s > 99) return
                    setSlippage(s)
                  }}
                  className="w-8 text-sm font-semibold text-right text-white bg-transparent outline-none text-dark-input tracking-2%"
                  value={slippage}
                />
                %
              </div>
            </div>
          </div>
        </CTABox>

        <CTABox className="max-w-lg py-4 mx-auto sm:px-0 2xl:max-w-2xl xl:max-w-xl">
          <div className="py-2">
            <h2 className="font-medium uppercase text-dark-200 tracking-2%">
              Bonding Info
            </h2>

            <div className="mt-3 text-sm sm:text-base space-y-3">
              <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
                <p>Your Balance</p>
                {isBondLoading ? (
                  <Skeleton height={20} />
                ) : (
                  <p className="text-right">
                    {prettify(bond.balance)} {displayUnits}
                  </p>
                )}{" "}
              </div>

              <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
                <p>You Will Get</p>
                {isBondLoading ? (
                  <Skeleton height={20} />
                ) : (
                  <p className="text-right">
                    {format(round(bond.bondQuote, 4), 3) || "0"} ART
                  </p>
                )}
              </div>

              <div className="items-center font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
                <p>Max You Can Buy</p>
                {isBondLoading ? (
                  <Skeleton height={20} />
                ) : (
                  <p className="text-right">
                    {format(round(bond.maxBondPrice, 4), 3) || "0"} ART
                  </p>
                )}
              </div>

              <div className="items-center font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
                <p>Debt Ratio</p>
                {isBondLoading ? (
                  <Skeleton height={20} />
                ) : (
                  <p className="text-right">
                    {prettify(bond.debtRatio / 10000000)}%
                  </p>
                )}
              </div>

              <div className="items-center font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
                <p>Vesting Term</p>
                <p className="text-right">
                  {isBondLoading ? <Skeleton height={20} /> : vestingPeriod()}
                </p>
              </div>
            </div>
          </div>
        </CTABox>
      </div>

      <div className="flex justify-center mt-8">
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
              "Approve"
            )}
          </Button>
        )}
      </div>
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
export default BondPurchase
