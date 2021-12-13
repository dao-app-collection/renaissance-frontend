import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers"
import { ethers, BigNumber, BigNumberish } from "ethers"

import BondCalcContractABI from "src/abi/BondCalcContract.json"
import { getAddresses } from "src/constants"

import { Bond } from "./bonds/bondConstructor"
import { loadMarketPrice } from "./price"

export function getBondCalculator(
  chainId: number,
  provider: StaticJsonRpcProvider
) {
  return new ethers.Contract(
    getAddresses(chainId).BONDINGCALC_ADDRESS as string,
    BondCalcContractABI.abi,
    provider
  )
}

export interface IBondDetails {
  bond: string
  bondDiscount: number
  debtRatio: number
  bondQuote: number
  purchased: number
  vestingTerm: number
  maxBondPrice: number
  bondPrice: number
  marketPrice: number
}

interface CalcDetailParams {
  bond: Bond
  value: string
  provider: Web3Provider
  chainId: number
}

export const calcBondDetails = async ({
  bond,
  value,
  provider,
  chainId,
}: CalcDetailParams): Promise<IBondDetails> => {
  if (!value) {
    value = "0"
  }
  const amountInWei = ethers.utils.parseEther(value)

  // const vestingTerm = VESTING_TERM; // hardcoded for now
  let bondPrice = BigNumber.from(0),
    bondDiscount = 0,
    valuation = 0,
    bondQuote: BigNumberish = BigNumber.from(0)
  const bondContract = bond.getContractForBond(provider)
  const bondCalcContract = getBondCalculator(chainId, provider)

  const terms = await bondContract.terms()
  const maxBondPrice = await bondContract.maxPayout()
  let debtRatio: BigNumberish = await bondContract.standardizedDebtRatio()
  debtRatio = Number(debtRatio.toString()) / Math.pow(10, 9)

  let marketPrice: number = 0
  try {
    const originalPromiseResult = await loadMarketPrice({
      provider: provider,
    })
    marketPrice = originalPromiseResult?.marketPrice
  } catch (rejectedValueOrSerializedError) {
    // handle error here
    console.error("Returned a null response from dispatch(loadMarketPrice)")
  }

  try {
    bondPrice = await bondContract.bondPriceInUSD()
    // bondDiscount = (marketPrice * Math.pow(10, 9) - bondPrice) / bondPrice; // 1 - bondPrice / (bondPrice * Math.pow(10, 9));
    bondDiscount =
      (marketPrice * Math.pow(10, 18) - Number(bondPrice.toString())) /
      Number(bondPrice.toString()) // 1 - bondPrice / (bondPrice * Math.pow(10, 9));
  } catch (e) {
    console.log("error getting bondPriceInUSD", e)
  }

  if (Number(value) === 0) {
    // if inputValue is 0 avoid the bondQuote calls
    bondQuote = BigNumber.from(0)
  } else if (bond.isLP) {
    valuation = Number(
      (
        await bondCalcContract.valuation(
          bond.getAddressForReserve(),
          amountInWei
        )
      ).toString()
    )
    bondQuote = await bondContract.payoutFor(valuation)
    if (!amountInWei.isZero() && Number(bondQuote.toString()) < 100000) {
      bondQuote = BigNumber.from(0)
      const errorString = "Amount is too small!"

      console.log(errorString)
    } else {
      bondQuote = Number(bondQuote.toString()) / Math.pow(10, 9)
    }
  } else {
    // RFV = DAI
    bondQuote = await bondContract.payoutFor(amountInWei)

    if (
      !amountInWei.isZero() &&
      Number(bondQuote.toString()) < 100000000000000
    ) {
      bondQuote = BigNumber.from(0)
      const errorString = "Amount is too small!"

      console.log(errorString)
    } else {
      bondQuote = Number(bondQuote.toString()) / Math.pow(10, 18)
    }
  }

  // Display error if user tries to exceed maximum.
  if (
    !!value &&
    parseFloat(bondQuote.toString()) >
      Number(maxBondPrice.toString()) / Math.pow(10, 9)
  ) {
    const errorString =
      "You're trying to bond more than the maximum payout available! The maximum bond payout is " +
      (Number(maxBondPrice.toString()) / Math.pow(10, 9))
        .toFixed(2)
        .toString() +
      " ART."

    console.log(errorString)
  }

  // Calculate bonds purchased
  let purchased = await bond.getTreasuryBalance(chainId, provider)

  return {
    bond: bond.name,
    bondDiscount,
    debtRatio: Number(debtRatio.toString()),
    bondQuote: Number(bondQuote.toString()),
    purchased,
    vestingTerm: Number(terms.vestingTerm.toString()),
    maxBondPrice: Number(maxBondPrice.toString()) / Math.pow(10, 9),
    bondPrice: Number(bondPrice.toString()) / Math.pow(10, 18),
    marketPrice: marketPrice,
  }
}
