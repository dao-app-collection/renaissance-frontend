import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import useSWR from "swr"

import { BOND_REFRESH_INTERVAL } from "@constants"
import { contractForBondCalculator } from "@helper/contracts"
import { ISingleBond } from "@typings"

export default function useBondQuote(
  singleBond: ISingleBond,
  value: string = "0"
) {
  const { library: walletProvider } = useWeb3React()

  const { bond, isLP, pro } = singleBond

  const contract = walletProvider
    ? bond.getContractForBondFromWallet(walletProvider.getSigner())
    : undefined

  const reserveAddress = bond.getAddressForReserve()

  const amountInWei = ethers.utils.parseEther(value)

  // disable requests when value is 0
  const enabled = Number(value) > 0

  const bondCalcContract = walletProvider
    ? contractForBondCalculator(walletProvider)
    : undefined

  const { data: valuation } = useSWR(
    // only request for LP bonds
    enabled && isLP ? `/bond/bondQuote/${reserveAddress}/${value}` : undefined,
    async () => await bondCalcContract.valuation(reserveAddress, amountInWei),
    { refreshInterval: BOND_REFRESH_INTERVAL }
  )

  const { data: bondQuote } = useSWR(
    enabled ? `/bond/bondQuote/${contract?.address}/${value}` : undefined,
    async () => {
      if (isLP && !pro) {
        const _bondQuote = await contract.payoutFor(valuation)
        return Number(_bondQuote.toString()) / Math.pow(10, 9)
      } else {
        const _bondQuote = await contract.payoutFor(amountInWei)
        return Number(_bondQuote.toString()) / Math.pow(10, 18)
      }
    },
    { refreshInterval: BOND_REFRESH_INTERVAL }
  )

  return enabled ? bondQuote : 0
}
