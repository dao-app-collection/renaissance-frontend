import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"
import { useSelector } from "react-redux"

import ConnectButton from "@components/ConnectButton"
import Button from "@components/ui/Buttons"
import CTABox from "@components/ui/CTABox"
import Skeleton from "@components/ui/Skeleton"
import { prettify, round, format } from "@helper"
import { isPendingTxn, txnButtonText } from "@slices/pendingTxnsSlice"

function BondPurchase({ bond, slippage, setSlippage }) {
  const { account, chainId, library } = useWeb3React<Web3Provider>()

  let isBondLoading = false
  let bondNamePretty = "name"
  let isAllowanceDataLoading = false
  let hasAllowance = () => true
  let maxTrimmed = ""
  let setMax = () => {}
  let setQuantity = (q: number) => {}
  let quantity = 0
  let marketPrice = 0
  const displayUnits = 0
  const vestingPeriod = () => ""
  const pendingTransactions = []
  const onBond = () => {}
  const onSeekApproval = () => {}

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
