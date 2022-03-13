import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"

import ConnectButton from "@components/ConnectButton"
import Button from "@components/ui/Buttons"
import CTABox from "@components/ui/CTABox"
import Skeleton from "@components/ui/Skeleton"
import { prettify } from "@helper"
import { txnButtonText } from "@slices/pendingTxnsSlice"

function BondRedeem({ bond }) {
  const { chainId, account, library } = useWeb3React<Web3Provider>()

  let isBondLoading = false
  let bondNamePretty = "name"
  let marketPrice = 0
  const vestingPeriod = () => ""
  const pendingTransactions = []
  const isRedeemAutostakeLoading = false
  const isRedeemLoading = false
  const onRedeem = ({ autostake }) => {}

  return (
    <div>
      <div className="space-y-6">
        <CTABox
          className={`max-w-lg mx-auto sm:px-0 2xl:max-w-2xl xl:max-w-xl`}
        >
          <div className="flex items-center gap-2">
            <bond.bondIconSvg className="h-8 w-15" />
            <p className="text-2xl font-medium text-white uppercase 2xl:text-[32px] tracking-2%">
              {bondNamePretty}
            </p>
          </div>
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
          </div>
        </CTABox>

        <CTABox className="max-w-lg py-4 mx-auto sm:px-0 2xl:max-w-2xl xl:max-w-xl">
          <div className="py-2">
            <h2 className="font-medium uppercase tracking-2% text-dark-300">
              Redeem Info
            </h2>

            <div className="mt-3 text-sm sm:text-base space-y-3">
              <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
                <p>Pending Rewards</p>
                {isBondLoading ? (
                  <Skeleton height={20} />
                ) : (
                  <p className="text-right">{prettify(bond.interestDue)} ART</p>
                )}
              </div>

              <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
                <p>Claimable Rewards</p>
                {isBondLoading ? (
                  <Skeleton height={20} />
                ) : (
                  <p className="text-right">
                    {prettify(bond.pendingPayout)} ART
                  </p>
                )}
              </div>

              <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
                <p className="capitalize">Time until fully vested</p>
                <p className="text-right">
                  {isBondLoading ? (
                    <Skeleton height={20} />
                  ) : (
                    <p className="text-right">{vestingPeriod()}</p>
                  )}
                </p>
              </div>

              <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
                <p>ROI</p>
                {isBondLoading ? (
                  <Skeleton height={20} />
                ) : (
                  <p className="text-right">
                    {bond.bondDiscount && prettify(bond.bondDiscount * 100)}%
                  </p>
                )}
              </div>

              <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
                <p>Debt Ratio</p>
                {isBondLoading ? (
                  <Skeleton height={20} />
                ) : (
                  <p className="text-right">
                    {prettify(bond.debtRatio / 10000000)}%
                  </p>
                )}
              </div>

              <div className="font-medium text-white grid grid-cols-2 gap-2 sm:gap-16 tracking-2%">
                <p>Vesting Term</p>
                {isBondLoading ? (
                  <Skeleton height={20} />
                ) : (
                  <p className="text-right">{vestingPeriod()}</p>
                )}
              </div>
            </div>
          </div>
        </CTABox>
      </div>

      <div className="flex mt-8 justfy-center">
        <div className="flex flex-wrap justify-center mx-auto sm:grid-cols-2 gap-4">
          {!account ? (
            <ConnectButton />
          ) : (
            <>
              <Button
                loading={isRedeemLoading}
                disabled={
                  bond.pendingPayout == 0.0 ||
                  isRedeemLoading ||
                  isRedeemAutostakeLoading
                }
                onClick={() => onRedeem({ autostake: false })}
              >
                {txnButtonText(
                  pendingTransactions,
                  "redeem_bond_" + bond.name,
                  "Claim"
                )}
              </Button>

              <Button
                loading={isRedeemAutostakeLoading}
                disabled={
                  bond.pendingPayout == 0.0 ||
                  isRedeemLoading ||
                  isRedeemAutostakeLoading
                }
                onClick={() => onRedeem({ autostake: true })}
              >
                {txnButtonText(
                  pendingTransactions,
                  "redeem_bond_" + bond.name + "_autostake",
                  "Claim and Autostake"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BondRedeem
