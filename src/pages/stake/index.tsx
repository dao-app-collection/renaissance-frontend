import { useState } from "react"

import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"
import { ethers } from "ethers"
import { useDispatch, useSelector } from "react-redux"

import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import ArtSwitch from "@components/ui/ArtSwitch"
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
      <div className="container relative min-h-screen py-10">
        <PageHeading>
          <div className="flex-grow">
            <PageHeading.Title>Stake</PageHeading.Title>
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

          <PageHeading.Content>
            <PageHeading.Stat
              title="APY"
              subtitle={
                <>
                  {stakingAPY > 0 ? (
                    `${trimmedStakingAPY}%`
                  ) : (
                    <Skeleton height={40} width={200} />
                  )}
                </>
              }
            />

            <PageHeading.Stat
              title="ART STAKED"
              subtitle={
                <>
                  {stakingTVL ? (
                    `${prettify(stakingTVL)}`
                  ) : (
                    <Skeleton height={40} width={200} />
                  )}
                </>
              }
            />

            <PageHeading.Stat
              title="INDEX"
              subtitle={
                <>
                  {currentIndex ? (
                    `${prettify(currentIndex)} ART`
                  ) : (
                    <Skeleton height={40} width={200} />
                  )}
                </>
              }
            />
          </PageHeading.Content>
        </PageHeading>

        <div className="py-16">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-4">
              <span
                className={clsx(
                  "tracking-2% transition-colors font-medium text-dark-300",
                  {
                    "font-semibold !text-wine-600": !mode,
                  }
                )}
              >
                Stake
              </span>
              <ArtSwitch enabled={mode} onChange={setMode} />
              <span
                className={clsx(
                  "tracking-2% transition-colors font-medium text-dark-300",
                  {
                    "font-semibold !text-wine-600": mode,
                  }
                )}
              >
                Unstake
              </span>
            </div>
          </div>

          <div className="mt-8">
            <StakeContent mode={mode} />
          </div>
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
      <CTABox className="flex items-center justify-between max-w-lg mx-auto sm:px-0 2xl:max-w-2xl xl:max-w-xl">
        <div className="">
          <p className="font-medium text-white uppercase text-[32px] tracking-2%">
            Art
          </p>
          <p className="font-medium tracking-2% text-dark-300">
            (
            <span onClick={setMax} className="cursor-pointer text-wine-600">
              Max
            </span>
            )
          </p>
        </div>

        <div className="">
          <input
            onChange={(e: any) => setQuantity(e.target.value)}
            className="w-full text-lg font-semibold text-right bg-transparent outline-none text-dark-500 text-[35px] text-dark-input tracking-2%"
            size={6}
            placeholder="0.0"
          />
        </div>
      </CTABox>

      <CTABox className="max-w-lg py-4 mx-auto sm:px-0 2xl:max-w-2xl xl:max-w-xl">
        <div className="space-y-2">
          <h2 className="font-medium uppercase tracking-2% text-dark-300">
            Staking Information
          </h2>
          <div className="space-y-4">
            <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
              <p>Your Balance</p>
              {isAppLoading ? (
                <Skeleton height={20} />
              ) : (
                <p className="text-right">{prettify(artBalance, 4)} ART</p>
              )}
            </div>
            <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
              <p>Your Staked Balance</p>
              {isAppLoading ? (
                <Skeleton height={20} />
              ) : (
                <p className="text-right">{trimmedBalance} sART</p>
              )}
            </div>
            <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
              <p>Next Reward Amount</p>
              {isAppLoading ? (
                <Skeleton height={20} />
              ) : (
                <p className="text-right">{nextRewardValue} sART</p>
              )}
            </div>
            <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
              <p>Next Reward Yield</p>
              {isAppLoading ? (
                <Skeleton height={20} />
              ) : (
                <p className="text-right">{stakingRebasePercentage} %</p>
              )}
            </div>
            <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
              <p>ROI (5-Day Rate)</p>
              {isAppLoading ? (
                <Skeleton height={20} />
              ) : (
                <p className="text-right">{prettify(fiveDayRate * 100, 4)}</p>
              )}
            </div>
          </div>
        </div>
      </CTABox>

      <div className="flex justify-center">
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
              {txnButtonText(pendingTransactions, "approve_staking", "Approve")}
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
            {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Stake
