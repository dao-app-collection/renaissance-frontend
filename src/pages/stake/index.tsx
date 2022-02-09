import { useState } from "react"

import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"
import { ethers } from "ethers"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"

import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import Button from "@components/ui/Button"
import CTABox from "@components/ui/CTABox"
import Skeleton from "@components/ui/Skeleton"
import { keys } from "@constants"
import { getProvider, prettify } from "@helper"
import { error } from "@slices/messagesSlice"
import { isPendingTxn, txnButtonText } from "@slices/pendingTxnsSlice"
import { changeApproval, changeStake } from "@slices/stakeThunk"


function Header(){

  const isBondLoading = useSelector(
    (state: any) => state.bonding.loading ?? true
  )

  const stakingAPY = useSelector((state: any) => {
    return state.app.stakingAPY
  })
  const stakingTVL = useSelector((state: any) => {
    return state.app.stakingTVL
  })

  const currentIndex = useSelector((state: any) => {
    return state.app.currentIndex
  })
  const trimmedStakingAPY = prettify(stakingAPY * 100)

  return (
    <div className="px-10 mr-10 text-white grid grid-cols-4 space-x-12 md:text-md 2xl:text-sm">
      <div className="py-5 align-middle space-y-2">
          <div className="text-4xl font-bold">Stake (3,3)</div>
          <div className="text-dark-600 row-start-2 text-md">HODL, stake, and compound</div>     
      </div>
      <div className="inline-flex flex-wrap items-center px-3 py-2 rounded-lg bg-bg-scheme-500 bg-opacity-50 col-span-3 gap-x-20 gap-y-5">
        <div className="grid grid-rows-2">
            <div className="text-gray-500 row-start-1 text-md">APY</div>
            <div className="text-lg row-start-2">
            <>
                  {stakingAPY > 0 ? (
                    `${trimmedStakingAPY}%`
                  ) : (
                    <Skeleton height={40} width={100} />
                  )}
                </>
            </div>
          </div>
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">Total Value Deposited</div>
          <div className="text-lg text-white row-start-2">
          <>
                  {stakingTVL ? (
                    "$"+ prettify(stakingTVL)
                  ) : (
                    <Skeleton height={40} width={100} />
                  )}
            </>
        </div>
      </div>
      <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">Current Index</div>
          <div className="text-lg text-white row-start-2">
          <>
                  {currentIndex ? (
                    prettify(currentIndex) + " smART"
                  ) : (
                    <Skeleton height={40} width={100} />
                  )}
                </>
        </div>
      </div>
    </div>
  </div>
  )
}


function Content(){
  const sartBalance = useSelector((state: any) => {
    return state.account.balances && state.account.balances.sart
  })
  const stakingRebase = useSelector((state: any) => {
    return state.app.stakingRebase
  })
  const trimmedBalance = sartBalance
  const fiveDayRate = useSelector((state: any) => {
    return state.app.fiveDayRate
  })
  const stakingRebasePercentage = Number(prettify(stakingRebase * 100))
  const nextRewardValue = prettify(
    (stakingRebasePercentage / 100) * trimmedBalance,
    4
  )
  return (
    <div className="flex-wrap items-center px-3 py-4 rounded-lg grid grid-cols-1 lg:grid-cols-3 bg-bg-scheme-500 bg-opacity-50 lg:justify-items-center gap-x-20">
    <div className="text-left grid grid-rows-2">
        <div className="text-gray-500 row-start-1 text-md">Newt Reward Amount</div>
        <div className="text-lg text-white row-start-2">
                      <>
                        {prettify(Number({nextRewardValue}),4)} ART
                      </>
        </div>
      </div>
    <div className="text-left grid grid-rows-2">
      <div className="text-gray-500 row-start-1 text-md">Staking Rebase</div>
      <div className="text-lg text-white row-start-2">
      <>
        {stakingRebasePercentage}%
      </>
    </div>
  </div>

  <div className="text-left grid grid-rows-2">
      <div className="text-gray-500 row-start-1 text-md">ROI (5-Day Rate)</div>
      <div className="text-lg text-white row-start-2">
        <>
          {prettify(fiveDayRate * 100,3)}%
        </>
    </div>
  </div>
</div>


  )
}


function Stake() {
  // for the switch, we cannot really use another datatype other than boolean
  const [mode, setMode] = useState(false)
  const set = () =>{
    setMode(!mode)
  }
  const stakingRebase = useSelector((state: any) => {
    return state.app.stakingRebase
  })
  const sartBalance = useSelector((state: any) => {
    return state.account.balances && state.account.balances.sart
  })
  const trimmedBalance = sartBalance
  const fiveDayRate = useSelector((state: any) => {
    return state.app.fiveDayRate
  })
  const stakingRebasePercentage = Number(prettify(stakingRebase * 100))
  const nextRewardValue = prettify(
    (stakingRebasePercentage / 100) * trimmedBalance,
    4
  )

  const artBalance = useSelector((state: any) => {
    return state.account.balances && state.account.balances.art
  })
  const currentIndex = useSelector((state: any) => {
    return state.app.currentIndex
  })

  const stakingAPY = useSelector((state: any) => {
    return state.app.stakingAPY
  })
  const stakingTVL = useSelector((state: any) => {
    return state.app.stakingTVL
  })

  const trimmedStakingAPY = prettify(stakingAPY * 100)

  if (process.env.IS_PRESALE == "true") return null

  return (
    <Layout>
      <div className="container relative h-full min-h-screen bg-black">
      <div className="px-8 py-8 pt-6 bg-black grid grid-cols-12">
          <div className="hidden md:grid col-start-11 col-span-2">
                <ConnectButton/>
          </div>
        </div>
        <Header/>
        <div className="px-10 mx-10 mt-10 mb-5 mr-20 py-7 rounded-md bg-bg-scheme-500 bg-opacity-50">

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
                Stake
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
                Unstake
              </button>
            </div>
          </div>
          <div className="flex item-stretch">
            <div className="py-3 text-2xl text-white px-1.5">Stake ART</div>
            <Image
                  src="/images/r_logo.svg"
                  alt="Near"
                  width={25}
                  height={25}
              />
              </div>
            <StakeContent mode={mode} />

        </div>
      </div>
    </Layout>
  )
}



function StakeContent({ mode }) {

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
      <CTABox className="flex items-center justify-between border border-gray-700">
        <div className="">
          <input
            onChange={(e: any) => setQuantity(e.target.value)}
            className="w-full ml-3 text-left bg-transparent outline-none h-1/4 md:text-md text-dark-500 text-[35px] text-dark-input tracking-2%"
            size={12}
            placeholder="0.0 ART"
          />
        </div>
          <button onClick={setMax} className="px-4 py-2 mx-6 text-sm font-semibold text-indigo-500 bg-transparent border border-indigo-500 rounded md:text-md hover:bg-blue-500 hover:text-white hover:border-transparent bg-dark-1500">Max amount</button>
      </CTABox>
      <Content/>
      {/*
        <div className="text-right text-white text-md py-4"> 
                  <span className="">Staked Balance: {trimmedBalance} sART </span>
                  <span className="px-0 md:px-5"></span>
                  <span className="">Balance: {prettify(artBalance, 4)} ART</span>
        </div>
            <div className="py-5 md:py-5 bg-dark-1000 bg-opacity-60 sm:py-4 sm:px-10 rounded-xl ">
              <div className="text-sm  grid grid-cols-2">
                  <div className="px-4 py-1.5 text-left text-white">Next Reward Amount</div>
                  <div className="px-4 py-1.5 text-right text-white">
                      <>
                          {nextRewardValue} ART
                      </>
                  </div>
                  <div className="px-4 py-1.5 text-left text-white">Staking Rebase</div>
                  <div className="px-4 py-1.5 text-right text-green-500">
                      <>
                          {stakingRebasePercentage}%
                      </>
                  </div>
                  <div className="px-4 py-1.5 text-left text-white">ROI (5-Day Rate)</div>
                  <div className="px-4 py-1.5 text-right text-green-500">
                      <>
                          {prettify(fiveDayRate * 100,3)}%
                      </>
                  </div>
              </div>
          </div>
      */}
          <div className="flex item-stretch">
        {isStaking ? (
          !account ? (
            <ConnectButton />
          ) : isAllowanceDataLoading ? (
            <Button loading={true}>Loading...</Button>
          ) : account && stakeAllowance > 0 ? (
            <Button
              loading={isPendingTxn(pendingTransactions, "staking")}
              onClick={() => {
                onChangeStake("stake")
              }}
            >
              {txnButtonText(pendingTransactions, "staking", "Stake ART")}
            </Button>
          ) : (
            <Button
              loading={isPendingTxn(pendingTransactions, "approve_staking")}
              onClick={() => {
                onSeekApproval(keys.token)
              }}
            >
              {txnButtonText(pendingTransactions, "approve_staking", "Approve to Continue")}
            </Button>
          )
        ) : !account ? (
          <ConnectButton />
        ) : isAllowanceDataLoading ? (
          <Button loading={true}>Loading...</Button>
        ) : account && unstakeAllowance > 0 ? (
          <Button
            loading={isPendingTxn(pendingTransactions, "unstaking")}
            onClick={() => {
              onChangeStake("unstake")
            }}
          >
            {txnButtonText(pendingTransactions, "unstaking", "Unstake ART")}
          </Button>
        ) : (
          <Button
            loading={isPendingTxn(pendingTransactions, "approve_unstaking")}
            onClick={() => {
              onSeekApproval(keys.stoken)
            }}
          >
            {txnButtonText(pendingTransactions, "approve_unstaking", "Approve to Continue")}
          </Button>
        )}
      </div>
      <div className="text-xs text-gray-600"> 
        {(account) ?
        <div>The "Approve" transaction is only needed when bonding for the first time</div> :
        <div></div>
        }
      </div>
    </div>
  )
}

export default Stake
