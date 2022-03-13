import axios from "axios"
import { ethers } from "ethers"
import useSWR from "swr"

import { BOND_REFRESH_INTERVAL } from "@constants"
import { keys } from "@constants"
import { getProvider } from "@helper"
import { art_frax } from "@helper/bonds/allBonds"

import PairContractABI from "../abi/PairContract.json"

export async function getMarketPrice({ provider }) {
  const art_frax_address = art_frax.getAddressForReserve()

  const pairContract = new ethers.Contract(
    art_frax_address,
    PairContractABI.abi,
    provider
  )
  const reserves = await pairContract.getReserves()

  const marketPrice =
    Number(reserves[0].toString()) / Number(reserves[1].toString())
  return marketPrice
}

export async function getTokenPrice(tokenId = keys.token) {
  const resp = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
  )
  let tokenPrice: number = resp.data[tokenId].usd
  return tokenPrice
}

export function useArtMarketPrice() {
  const provider = getProvider()

  const { data: marketPrice } = useSWR(
    `/app/marketPrice`,
    async () => await getMarketPrice({ provider }),
    { refreshInterval: BOND_REFRESH_INTERVAL }
  )

  const { data: tokenPrice } = useSWR(
    `/app/tokenPrice`,
    async () => await getTokenPrice("rome"),
    { refreshInterval: BOND_REFRESH_INTERVAL }
  )

  const marketPriceInUSD = marketPrice ? marketPrice / Math.pow(10, 9) : 0

  // fallback to coingecko price
  return marketPriceInUSD || tokenPrice
}
