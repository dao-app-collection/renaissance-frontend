import { useState } from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"

import ConnectButton from "@components/ConnectButton"
import ProceedPromptModal from "@components/modals/ProceedPromptModal"
import Button from "@components/ui/Buttons"
import CTABox from "@components/ui/CTABox"
import Skeleton from "@components/ui/Skeleton"
import { errorToast } from "@components/ui/Toast"
import { prettify, round, format } from "@helper"
import useBonder from "@hooks/useBonder"
import useBondQuote from "@hooks/useBondQuote"
import useDebounce from "@hooks/useDebounce"
import { useModal } from "@hooks/useModal"

function Content({ bond, quantity }) {
  const loading = !bond.bondPrice
  const valueDebounced = useDebounce(quantity.toString(), 1000)
  const bondQuote = useBondQuote(bond, valueDebounced)

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
                {format(round(bondQuote, 4), 3) || "0"} ART
              </p>
            )}
          </>
        </div>
      </div>
      <div className="text-left grid grid-rows-2">
        <div className="text-gray-500 row-start-1 text-md">Vesting Term</div>
        <div className="text-lg text-white row-start-2">
          <p>5 days</p>
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

function BondPurchase({ bond, slippage, setSlippage }) {
  const [quantity, setQuantity] = useState(0)
  const { account } = useWeb3React<Web3Provider>()

  const {
    allowance,
    approveSpend,
    approvePending,
    balance,
    interestDue,
    pendingPayout,
    purchaseBond,
    purchaseBondPending,
  } = useBonder(bond)
  const { bondDiscount, bondPrice, maxBondPrice } = bond

  const hasAllowance = allowance > 0

  const showModal = useModal((state: any) => state.showModal)

  async function onBond() {
    const proceedAction = async () => {
      const acceptedSlippage = slippage / 100 || 0.005 // 0.5% as default
      await purchaseBond(quantity.toString(), acceptedSlippage)
      clearInput()
    }
    if (quantity <= 0) {
      errorToast("Please enter a value!")
    } else if (isNaN(quantity)) {
      errorToast("Please enter a valid value!")
    } else if (interestDue > 0 || Number(pendingPayout) > 0) {
      const shouldProceed = window.confirm(
        "You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?"
      )
      if (shouldProceed) {
        if (bondDiscount < 0) {
          showModal(
            <ProceedPromptModal
              onProceed={proceedAction}
              overview={<BuyInfo bond={bond} quantity={quantity} />}
            />
          )
        } else {
          proceedAction()
        }
      }
    } else {
      if (bondDiscount < 0) {
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

  const clearInput = () => {
    setQuantity(0)
  }

  const getMax = () => {
    let maxQ
    if (maxBondPrice * bondPrice < Number(balance)) {
      // there is precision loss here on Number(bond.balance)
      maxQ = maxBondPrice * bondPrice
    } else {
      maxQ = balance
    }
    return maxQ
  }

  const setMax = () => {
    let maxQ = getMax()
    setQuantity(maxQ)
  }

  const BondIcon = bond.bondIconSvg
  const prettifiedBondName = bond.name.split("_").join(" ")

  return (
    <div className="px-1 mt-8">
      <div className="flex item-stretch">
        <div className="py-2 text-xl font-semibold text-white px-1.5">
          Bond <span className="uppercase">{prettifiedBondName}</span>
        </div>
      </div>
      <div className="space-y-6">
        <CTABox className="flex items-center justify-between border border-gray-700">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <BondIcon className="w-8 h-8" />
              <p className="text-2xl font-medium text-white uppercase 2xl:text-[32px] tracking-2%">
                {prettifiedBondName}
              </p>
            </div>

            <p className="mt-2 text-sm font-medium 2xl:text-base tracking-2% text-dark-300">
              Balance{" "}
              {bondPrice ? (
                <>
                  {balance} {prettifiedBondName}
                </>
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
        <span className="">
          Max You Can Buy: {format(round(bond.maxBondPrice, 4), 3) || "0"} ART{" "}
        </span>
        <span className="px-0 md:px-5"></span>
        <span className="">Balance: {prettify(bond.balance)}</span>
      </div>
      <Content bond={bond} quantity={quantity} />
      <div className="flex py-4 item-stretch">
        {!account ? (
          <ConnectButton />
        ) : hasAllowance ? (
          <Button
            disabled={!bond.isAvailable}
            loading={purchaseBondPending}
            onClick={onBond}
          >
            {purchaseBondPending ? "Pending..." : "Bond"}
          </Button>
        ) : (
          <Button loading={approvePending} onClick={() => approveSpend()}>
            Approve to continue
          </Button>
        )}
      </div>
      <div className="text-xs text-gray-600">
        {account && !hasAllowance ? (
          <div>
            The "Approve" transaction is only needed when bonding for the first
            time
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}

function BuyInfo({ bond, quantity }) {
  const { bondDiscount, bondPrice, name, marketPrice, payoutTokenName } = bond

  const bondQuote = useBondQuote(bond, quantity.toString())

  return (
    <div className="py-6 mt-3 text-sm sm:text-base space-y-2">
      <div className="font-medium grid grid-cols-2 gap-2 sm:gap-16 text-dark-1000 tracking-2%">
        <p>Bonding</p>
        {name === undefined ? (
          <Skeleton height={20} />
        ) : (
          <p className="text-right">
            {quantity} <span className="capitalize">{name}</span>
          </p>
        )}{" "}
      </div>

      <div className="font-medium grid grid-cols-2 gap-2 sm:gap-16 text-dark-1000 tracking-2%">
        <p>You Will Receive</p>
        {bondQuote === undefined ? (
          <Skeleton height={20} />
        ) : (
          <p className="text-right">
            {format(round(bondQuote, 4), 3) || "0"} {payoutTokenName}
          </p>
        )}
      </div>

      <div className="font-medium grid grid-cols-2 gap-2 sm:gap-16 text-dark-1000 tracking-2%">
        <p>Bond Price</p>
        {bondPrice === undefined ? (
          <Skeleton height={20} />
        ) : (
          <p className="text-right">${prettify(bondPrice)}</p>
        )}
      </div>

      <div className="font-medium grid grid-cols-2 gap-2 sm:gap-16 text-dark-1000 tracking-2%">
        <p>Market Price</p>
        {marketPrice === undefined ? (
          <Skeleton height={20} />
        ) : (
          <p className="text-right">${prettify(marketPrice)}</p>
        )}
      </div>

      <div className="items-center font-medium grid grid-cols-2 gap-2 sm:gap-16 text-dark-1000 tracking-2%">
        <p>Discount</p>
        {bondDiscount === undefined ? (
          <Skeleton height={20} />
        ) : (
          <p
            className={clsx("text-right", {
              "text-red-600": bondDiscount < 0,
              "text-green-600": bondDiscount > 0,
            })}
          >
            {bondDiscount && prettify(bondDiscount * 100)}%
          </p>
        )}
      </div>
    </div>
  )
}

export default BondPurchase
