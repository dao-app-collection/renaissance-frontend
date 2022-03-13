import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

import { BOND_REFRESH_INTERVAL } from "@constants"
import { getProvider } from "@helper"
import allBonds from "@helper/bonds/allBonds"
import { CustomBond, LPBond, StableBond } from "@helper/bonds/bondConstructor"
import { ISingleBond } from "@typings"

import { useArtMarketPrice } from "../useMarketPrice"

function useBonds() {
  const availableBonds = allBonds
    .map(useSingleBond)
    .filter((bond) => !bond.isAvailable)
    .sort((a, b) => {
      return a.bondDiscount > b.bondDiscount
        ? -1
        : b.bondDiscount > a.bondDiscount
        ? 1
        : 0
    })

  const unavailableBonds = allBonds
    .map(useSingleBond)
    .filter((bond) => bond.isAvailable)

  // show available bonds first and then sold out bonds at the end
  const sortedBonds = [...availableBonds, ...unavailableBonds]

  return sortedBonds
}

function useSingleBond(bond: StableBond | LPBond | CustomBond): ISingleBond {
  const marketPrice = useArtMarketPrice()
  const { chainId } = useWeb3React()

  const rpcProvider = getProvider()

  const { bondIconSvg, displayName, displayUnits, isLP, name, isAvailable } =
    bond

  const contract = bond.getContractForBond(rpcProvider)

  const { data: _bondPrice, mutate: mutateBondPrice } = useSWR(
    `/bond/priceInUSD/${displayName}/${contract?.address}`,
    async () => await bond.getBondPriceInUSD(rpcProvider),
    { refreshInterval: BOND_REFRESH_INTERVAL }
  )

  const { data: _debtRatio, mutate: mutateDebtRatio } = useSWR(
    `/bond/debtRatio/${displayName}/${contract?.address}`,
    async () => await bond.getStandardizedDebtRatio(rpcProvider),
    { refreshInterval: BOND_REFRESH_INTERVAL }
  )

  const { data: _maxBondPrice, mutate: mutateMaxBondPrice } = useSWR(
    `/bond/maxPayout/${displayName}/${contract?.address}`,
    async () => await contract.maxPayout(),
    { refreshInterval: BOND_REFRESH_INTERVAL }
  )

  const { data: _purchased, mutate: mutatePurchased } = useSWR(
    `/bond/purchased/${chainId}/${displayName}/${contract?.address}`,
    async () => await bond.getTreasuryBalance(rpcProvider),
    { refreshInterval: BOND_REFRESH_INTERVAL, loadingTimeout: 30000 }
  )

  const { data: _terms } = useSWR(
    `/bond/terms/${displayName}/${contract?.address}`,
    async () => await contract.terms()
  )

  const bondPrice = _bondPrice
    ? Number(_bondPrice.toString()) / Math.pow(10, 18)
    : undefined

  const bondDiscount = _bondPrice
    ? (marketPrice * Math.pow(10, 18) - Number(_bondPrice.toString())) /
      Number(_bondPrice.toString()) // 1 - bondPrice / (bondPrice * Math.pow(10, 9));
    : undefined

  const debtRatio = Number(_debtRatio?.toString()) / Math.pow(10, 9)

  const maxBondPrice = Number(_maxBondPrice?.toString()) / Math.pow(10, 9)

  const purchased = _purchased || 0

  const vestingTerm = Number(_terms?.vestingTerm.toString())

  const mutateBond = () => {
    mutateBondPrice()
    mutateDebtRatio()
    mutateMaxBondPrice()
    mutatePurchased()
  }

  return {
    bond,
    bondContract: contract,
    bondDiscount,
    bondIconSvg,
    bondPrice,
    debtRatio,
    displayName,
    displayUnits,
    isLP: !!isLP,
    maxBondPrice,
    mutateBond,
    name,
    purchased,
    vestingTerm,
    isAvailable,
    marketPrice,
    payoutTokenName: "ART",
    pro: false,
  }
}

export { useBonds }
