import { useState } from "react"

import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"
import { ethers } from "ethers"
import { useDispatch, useSelector } from "react-redux"

import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import Button from "@components/ui/Button"
import CTABox from "@components/ui/CTABox"
import PageHeading from "@components/ui/PageHeading"
import Skeleton from "@components/ui/Skeleton"
import { keys } from "@constants"
import { getProvider, prettify } from "@helper"
import { error } from "@slices/messagesSlice"
import { isPendingTxn, txnButtonText } from "@slices/pendingTxnsSlice"
import { changeApproval, changeStake } from "@slices/stakeThunk"

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
      <div className="container relative h-full min-h-screen py-6 bg-black">

        <PageHeading>
          <div className="flex-grow py-10">
            <PageHeading.Title>Stake (3,3)</PageHeading.Title>
            <PageHeading.Subtitle>
              HODL,stake,and compound.
            </PageHeading.Subtitle>
            {/* {active && (
                <PageHeading.Subtitle>
                  {secondsUntilNextEpoch > 0 ? (
                    `Next Rebase: ~${timeText}`
                  ) : (
                    <Skeleton height={15} width={80} />
                  )}
                </PageHeading.Subtitle>
              )} */}
          </div>
          <div className="px-4 rounded-md bg-opacity-30 px-20  py-10">
          <PageHeading.Content>
            <PageHeading.Stat
              title="APY"
              subtitle={
                <>
                  {stakingAPY > 0 ? (
                    `${trimmedStakingAPY}%`
                  ) : (
                    <Skeleton height={40} width={100} />
                  )}
                </>
              }
            />

            <PageHeading.Stat
              title="Total Value Deposited"
              subtitle={
                <>
                  {stakingTVL ? (
                    "$"+ prettify(stakingTVL)
                  ) : (
                    <Skeleton height={40} width={100} />
                  )}
                </>
              }
            />

            <PageHeading.Stat
              title="Current Index"
              subtitle={
                <>
                  {currentIndex ? (
                    prettify(currentIndex) + "smART"
                  ) : (
                    <Skeleton height={40} width={100} />
                  )}
                </>
              }
            />
          </PageHeading.Content>
          </div>

          <div className="px-4 bg-black">
            <ConnectButton/>
        </div>
        </PageHeading>

        <div className="py-7 px-20 rounded-xl bg-dark-1000 bg-opacity-30">

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
          
            <div className="text-white text-2xl py-3">Stake ART</div>
          
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
      <CTABox className="flex items-center border-2 border-gray-600 justify-between">
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

      <div className="text-right text-white text-md">Staked Balance: {trimmedBalance} sART  Balance: {prettify(artBalance, 4)} ART</div>
            <div className="py-5 md:py-5 bg-dark-1000 bg-opacity-60 sm:py-4 sm:px-10 rounded-xl ">
              <div className="text-sm  grid grid-cols-2">
                  <div className="py-1.5 text-left text-white">Next Reward Amount</div>
                  <div className="py-1.5 text-right text-white">
                      <>
                          {nextRewardValue} ART
                      </>
                  </div>
                  <div className="py-1.5 text-left text-white">Staking Rebase</div>
                  <div className="py-1.5 text-right text-green-500">
                      <>
                          {stakingRebasePercentage}%
                      </>
                  </div>
                  <div className="py-1.5 text-left text-white">ROI (5-Day Rate)</div>
                  <div className="py-1.5 text-right text-green-500">
                      <>
                          {prettify(fiveDayRate * 100,3)}%
                      </>
                  </div>
              </div>
          </div>
          <div className="">
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
      <div className="text-xs text-gray-600 "> The "Approve" transaction is only needed when staking/unstaking for the first time</div>
    </div>
  )
}

export default Stake
