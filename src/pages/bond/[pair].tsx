import { useEffect, useState } from "react"

import { ArrowLeftIcon } from "@heroicons/react/outline"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"

import Layout from "@components/layouts/Layout"
import PageHeading from "@components/ui/PageHeading"
import Skeleton from "@components/ui/Skeleton"
import { getProvider, prettify } from "@helper"
import { allBondsMap } from "@helper/bonds/allBonds"
import useBonds from "@hooks/bondData"
import CTABox from "@components/ui/CTABox"
import { useWeb3React } from "@web3-react/core"
import { changeApproval, changeStake } from "@slices/stakeThunk"
import { error } from "@slices/messagesSlice"
import { ethers } from "ethers"
import Bonding from "@components/bonds/Bonding"
import Redeem from "@components/bonds/Redeem"
import ConnectButton from "@components/ConnectButton"

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
const set = () =>{
  setMode(!mode)
}
const BondIcon = bond.bondIconSvg

  return (
    <Layout>
      <div
        className="container relative h-full min-h-screen py-6 bg-black"
        data-cy="bond-page"
      >
        <PageHeading>
          <div className="flex-grow  py-10">
            <PageHeading.Title>Bond (1,1)</PageHeading.Title>
            <div className="flex item-stretch">
            <div className="py-2.5 text-white text-xl font-semibold uppercase">{bond.name.split("_").join(" ")}</div>
                <BondIcon className="py-2 w-8 h-12"/>
              </div>
          </div>
          <div className="px-4 rounded-md bg-opacity-30 px-20  py-10">
          <PageHeading.Content>
            <PageHeading.Stat
              title="Bonded Value"
              subtitle={
                <>
                  {isBondLoading ? (
                    <Skeleton height={40} width={200} />
                  ) : (
                    "$" + prettify(bond.purchased)
                  )}
                </>
              }
            />
            <PageHeading.Stat
              title="ART Market Price"
              subtitle={
                <>
                  {isBondLoading ? (
                    <Skeleton height={40} width={200} />
                  ) : (
                    "$" + prettify(marketPrice)
                  )}
                </>
              }
            />

            <PageHeading.Stat
                          title="Bond Price"
                          subtitle={
                            isBondLoading ? (
                              <Skeleton height={30} width={150} />
                            ) : (
                              "$" + prettify(bond.bondPrice)
                            )
                          }
            />
          </PageHeading.Content>
        </div>
          <div className="px-4 bg-black">
            <ConnectButton/>
        </div>
        </PageHeading>
        <div className="my-20 ml-5 py-7 px-3 rounded-md bg-dark-1000 bg-opacity-30">
          <Link href="/bond">
            <a className="items-center hidden text-gray-500 sm:inline-flex left-1 sm:absolute gap-2 group">
              <ArrowLeftIcon className="px-20 w-6.5 h-10 group-hover:-translate-x-1 transition transform"/>
            </a>
          </Link>

          <div className="flex justify-center">
            <div className="px-1.5 py-1 inline-flex items-center gap-2 border-gray-600 border-2 rounded-md text-white">
              <button
                onClick={set}
                className={clsx(
                  "px-3 py-1 tracking-2% transition-colors font-medium",
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
              <Bonding bond={bond} slippage={slippage} setSlippage={setSlippage}/>
              </div>
            )}
            {isRedeeming && (
             <div>
                <Redeem bond={bond}/>
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
  )
}
export default BondPair
