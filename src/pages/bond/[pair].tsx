import { useEffect, useState } from "react"

import { ArrowLeftIcon } from "@heroicons/react/outline"
import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"
import { ethers } from "ethers"
import Link from "next/link"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"

import Bonding from "@components/bonds/Bonding"
import Redeem from "@components/bonds/Redeem"
import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import CTABox from "@components/ui/CTABox"
import Skeleton from "@components/ui/Skeleton"
import { getProvider, prettify } from "@helper"
import { allBondsMap } from "@helper/bonds/allBonds"
import useBonds from "@hooks/bondData"
import { error } from "@slices/messagesSlice"
import { changeApproval, changeStake } from "@slices/stakeThunk"

function Header() {
  const isBondLoading = useSelector(
    (state: any) => state.bonding.loading ?? true
  )

  const marketPrice = useSelector((state: any) => {
    return state.app.marketPrice
  })

  const treasuryBalance = useSelector((state: any) => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased
        }
      }
      return tokenBalances
    }
  })
  const { bonds } = useBonds()
  const router = useRouter()
  // for the switch, we cannot really use another datatype other than boolean

  const [bond, setBond] = useState<any>({})

  useEffect(() => {
    if (!router.query.pair) return
    setBond(allBondsMap[router.query.pair.toString()])
  }, [bonds, router])

  if (!bond.name) return null

  const BondIcon = bond.bondIconSvg

  return (
    <div className="px-10 mr-10 text-white grid grid-cols-4 space-x-16 md:text-md 2xl:text-sm">
      <div className="py-5 align-middle space-y-2">
        <div className="text-4xl font-bold">Bond (1,1)</div>
        <div className="flex item-stretch">
          <div className="text-xl font-semibold text-white uppercase">
            {bond.name.split("_").join(" ")}
          </div>
          <BondIcon className="w-8 h-8" />
        </div>
      </div>
      <div className="inline-flex flex-wrap items-center px-3 py-2 rounded-lg bg-bg-scheme-500 bg-opacity-50 col-span-3 gap-x-20 gap-y-5">
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">Bonded Value</div>
          <div className="text-lg row-start-2">
            <>
              {isBondLoading ? (
                <Skeleton height={40} width={100} />
              ) : (
                "$" + prettify(treasuryBalance)
              )}
            </>
          </div>
        </div>
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">
            ART Market Price
          </div>
          <div className="text-lg text-white row-start-2">
            <>
              {isBondLoading ? (
                <Skeleton height={40} width={100} />
              ) : (
                "$" + prettify(marketPrice)
              )}
            </>
          </div>
        </div>
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">Bond Price</div>
          <div className="text-lg text-white row-start-2">
            <>
              {isBondLoading ? (
                <Skeleton height={40} width={100} />
              ) : (
                "$" + prettify(marketPrice)
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  )
}

function BondPair() {
  const { bonds } = useBonds()
  const router = useRouter()
  const isBondLoading = useSelector(
    (state: any) => state.bonding.loading ?? true
  )
  // for the switch, we cannot really use another datatype other than boolean
  const [mode, setMode] = useState(false)
  const isBonding = !mode
  const isRedeeming = mode

  const [bond, setBond] = useState<any>({})
  const [slippage, setSlippage] = useState(0.5)

  const marketPrice = useSelector((state: any) => {
    return state.app.marketPrice
  })
  useEffect(() => {
    if (!router.query.pair) return
    setBond(allBondsMap[router.query.pair.toString()])
  }, [bonds, router])

  if (!bond.name) return null
  const set = () => {
    setMode(!mode)
  }
  const BondIcon = bond.bondIconSvg

  return (
    <Layout>
      <div
        className="container relative h-full min-h-screen bg-black"
        data-cy="bond-page"
      >
        <div className="px-8 py-8 pt-6 bg-black grid grid-cols-12">
          <div className="hidden md:grid col-start-11 col-span-2">
            <ConnectButton />
          </div>
        </div>
        <Header />
        <div className="px-10 mx-10 mt-10 mb-5 mr-20 py-7 rounded-md bg-bg-scheme-500 bg-opacity-50">
          <Link href="/bond">
            <a className="items-center hidden px-10 text-gray-500 sm:inline-flex left-1 sm:absolute gap-2 group">
              <ArrowLeftIcon className="h-10 px-20 w-6.5 group-hover:-translate-x-1 transition transform" />
            </a>
          </Link>

          <div className="flex justify-center">
            <div className="inline-flex items-center px-1 py-1 text-white border-2 gap-2 border-dark-1000 rounded-md">
              <button
                onClick={set}
                className={clsx(
                  "px-5 py-1.5 tracking-2% transition-colors font-medium",
                  {
                    "bg-dark-1000 rounded-md font-semibold": !mode,
                  }
                )}
              >
                Bond
              </button>
              <button
                onClick={set}
                className={clsx(
                  "px-3 py-1 tracking-2% transition-colors font-medium",
                  {
                    "bg-dark-1000 rounded-md font-semibold": mode,
                  }
                )}
              >
                Redeem
              </button>
            </div>
          </div>

          <div className="mt-8">
            {isBonding && (
              <div>
                <Bonding
                  bond={bond}
                  slippage={slippage}
                  setSlippage={setSlippage}
                />
              </div>
            )}
            {isRedeeming && (
              <div>
                <Redeem bond={bond} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

function BondingContent({ mode }) {
  const dispatch = useDispatch()
  const { chainId, account, library } = useWeb3React()
  const rpcProvider = getProvider()
  const walletProvider = library

  // therefore this is to simplify reading code
  const isStaking = !mode
  const isUnstaking = mode
  const [quantity, setQuantity] = useState(0)

  const isAppLoading = useSelector((state: any) => state.app.loading)

  const fiveDayRate = useSelector((state: any) => {
    return state.app.fiveDayRate
  })
  const artBalance = useSelector((state: any) => {
    return state.account.balances && state.account.balances.art
  })
  const sartBalance = useSelector((state: any) => {
    return state.account.balances && state.account.balances.sart
  })
  const stakeAllowance = useSelector((state: any) => {
    return state.account.staking && state.account.staking.artStake
  })
  const unstakeAllowance = useSelector((state: any) => {
    return state.account.staking && state.account.staking.artUnstake
  })
  const stakingRebase = useSelector((state: any) => {
    return state.app.stakingRebase
  })
  const pendingTransactions = useSelector((state: any) => {
    return state.pendingTransactions
  })

  const setMax = () => {
    if (isStaking) {
      setQuantity(artBalance)
    } else {
      setQuantity(sartBalance)
    }
  }

  const onSeekApproval = async (token) => {
    await dispatch(
      changeApproval({
        address: account,
        token,
        walletProvider,
        chainId,
      })
    )
  }

  const onChangeStake = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0) {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"))
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity.toString(), "gwei")
    if (
      action === "stake" &&
      gweiValue.gt(ethers.utils.parseUnits(artBalance, "gwei"))
    ) {
      return dispatch(error("You cannot stake more than your ART balance."))
    }

    if (
      action === "unstake" &&
      gweiValue.gt(ethers.utils.parseUnits(sartBalance, "gwei"))
    ) {
      return dispatch(error("You cannot unstake more than your sART balance."))
    }

    await dispatch(
      changeStake({
        address: account,
        action,
        value: quantity.toString(),
        walletProvider,
        rpcProvider,
        chainId,
      })
    )
  }

  const isAllowanceDataLoading =
    (stakeAllowance == null && isStaking) ||
    (unstakeAllowance == null && isUnstaking)

  const trimmedBalance = sartBalance
  const stakingRebasePercentage = Number(prettify(stakingRebase * 100))
  const nextRewardValue = prettify(
    (stakingRebasePercentage / 100) * trimmedBalance,
    4
  )

  return (
    <div className="space-y-6">
      <CTABox className="flex items-center justify-between border-2 border-gray-600">
        <div className="">
          <input
            onChange={(e: any) => setQuantity(e.target.value)}
            className="w-full text-lg font-semibold text-left bg-transparent outline-none text-dark-500 text-[35px] text-dark-input tracking-2%"
            size={12}
            placeholder="   0.0 ART"
          />
        </div>
        <div className="px-3">
          <button
            onClick={setMax}
            className="px-4 py-2 font-semibold text-indigo-700 bg-transparent border rounded hover:bg-blue-500 hover:text-white hover:border-transparent"
          >
            Max amount
          </button>
        </div>
      </CTABox>
    </div>
  )
}
export default BondPair
