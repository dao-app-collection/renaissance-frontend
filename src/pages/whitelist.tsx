import React, { useState } from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWR, { useSWRConfig } from "swr"

import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import Button from "@components/ui/Buttons"
import { MaxButton } from "@components/ui/Buttons"
import CTABox from "@components/ui/CTABox"
import PageHeading from "@components/ui/Display"
import { errorToast } from "@components/ui/Toast"
import { currentAddresses } from "@constants"
import {
  approve,
  deposit,
  getAllowance,
  getFraxBalance,
  getAArtPrice,
  getAArtBalance,
  getUserRemainingAllocation,
  getWhitelistedState,
} from "@helper/presale"
import { parseEthersErrorMessage } from "@utils/parseUtils"

export default function Whitelist() {
  const { account, library } = useWeb3React<Web3Provider>()
  const { mutate } = useSWRConfig()

  const [txPending, setTxPending] = useState(false)
  const [amount, setAmount] = useState("")

  const { data: isWhitelisted } = useSWR(
    ["/whitelisted", account],
    (_, account) => getWhitelistedState(account)
  )

  const { data: aArtBalance } = useSWR(
    ["/aArtBalance", account],
    (_, account) => getAArtBalance(account)
  )

  const { data: fraxBalance } = useSWR(
    ["/fraxBalance", account],
    (_, account) => getFraxBalance(account)
  )

  const { data: fraxAllowance } = useSWR(
    ["/fraxAllowance", account],
    (_, account) => getAllowance(account)
  )

  const { data: userRemainingAllocation } = useSWR(
    ["/userRemainingAllocation", account],
    (_, account) =>
      getUserRemainingAllocation(account).then((number) => (+number).toFixed(2))
  )

  const { data: aArtPrice } = useSWR(["/aArtPrice", account], getAArtPrice)

  const isAllowanceSufficient = fraxAllowance >= +amount
  const maxAArtClaimable = +userRemainingAllocation / +aArtPrice
  const receivingAmount = (+amount / +aArtPrice).toFixed(4)
  const maxFraxDeposit =
    +fraxBalance > +userRemainingAllocation
      ? +userRemainingAllocation
      : +fraxBalance
  const validateInput = (input: string | number | undefined): input is number =>
    !isNaN(+input) && +input > 0 && +input <= +userRemainingAllocation
  const isValid = validateInput(amount)
  const buttonDisabled = !isWhitelisted || !amount || !isValid

  async function onSubmit() {
    if (library) {
      try {
        setTxPending(true)
        if (isAllowanceSufficient && isValid) {
          await deposit(library, amount)
          mutate(["/user", account])
          mutate(["/aArtPayout", account])
          mutate(["/fraxBalance", account])
          mutate(["/userRemainingAllocation", account])
          setAmount("")
        } else {
          await approve(
            library,
            currentAddresses.AART_PRESALE_ADDRESS,
            maxAArtClaimable * +aArtPrice
          )
          mutate(["/fraxAllowance", account])
        }
      } catch (e) {
        errorToast(parseEthersErrorMessage(e))
      } finally {
        setTxPending(false)
      }
    }
  }

  return (
    <Layout>
      <ConnectButton customStyle="z-50 absolute right-[5px] top-[50px] w-[200px] lg:right-[40px]" />
      <div className="container relative h-full min-h-screen py-6">
        <PageHeading>
          <div className="flex-grow py-10 mt-[50px]">
            <PageHeading.Title>Whitelist</PageHeading.Title>
            <PageHeading.Subtitle>
              For Virtuosos & Maestros.
            </PageHeading.Subtitle>
          </div>
        </PageHeading>
        <div className="px-20 py-7 rounded-xl bg-scheme-600 max-w-[1000px]">
          <div className="py-3 text-2xl text-white">Deposit FRAX</div>
          <DepositContent
            maxFraxDeposit={maxFraxDeposit}
            amount={amount}
            setAmount={(e) => {
              let amount = Number(e)
              if (amount > maxFraxDeposit || amount > 2000 || isNaN(amount))
                return
              setAmount(e)
            }}
          />
          <div className="flex justify-end flex-grow w-full py-4 text-white text-md">
            <div>
              aArt Balance: {!isNaN(+aArtBalance) ? aArtBalance : "--"} aART
            </div>
            <div className="flex-grow" />
            <div className="mx-6">
              Max You Can Buy:{" "}
              {!isNaN(maxAArtClaimable) && isWhitelisted
                ? maxAArtClaimable
                : "--"}{" "}
              aART
            </div>
            <div>
              Balance:{" "}
              {!isNaN(+fraxBalance) ? (+fraxBalance).toFixed(2) : "0.00"} FRAX
            </div>
          </div>
          <div className="px-4 py-5 md:py-5 bg-scheme-200 bg-opacity-60 sm:py-4 sm:px-10 rounded-xl">
            <div className="text-sm text-scheme-100">You will receive</div>
            <div className="text-lg text-white">
              {!isNaN(+receivingAmount) ? receivingAmount : "0.0000"} aART
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-6">
            {account && !isWhitelisted && (
              <div className="text-gray-400">
                (This address is not whitelisted)
              </div>
            )}
            <Button
              className="px-14"
              disabled={buttonDisabled}
              loading={txPending}
              onClick={onSubmit}
            >
              {isAllowanceSufficient ? "Deposit" : "Approve"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export function DepositContent({
  maxFraxDeposit,
  amount,
  setAmount,
}: {
  maxFraxDeposit: number
  amount: string
  setAmount: (quantity: string) => void
}) {
  const isAppLoading = false
  const maxButtonDisabled = maxFraxDeposit === 0
  const setMax = () => setAmount(maxFraxDeposit.toString())

  return (
    <div className="space-y-6">
      <CTABox className="flex items-center justify-between bg-transparent border-2 border-gray-600">
        <div className="w-full">
          <input
            value={amount}
            disabled={isAppLoading}
            onChange={(e: any) => setAmount(e.target.value)}
            className={`w-full text-xl text-left bg-transparent outline-none text-${
              +amount > 0 ? "gray-200" : "scheme-100"
            } text-dark-input tracking-2%`}
            size={12}
            placeholder="0.0 FRAX"
          />
        </div>
        <MaxButton disabled={maxButtonDisabled} onClick={setMax} />
      </CTABox>
    </div>
  )
}
