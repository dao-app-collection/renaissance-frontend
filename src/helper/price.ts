import axios from "axios"
import { ethers } from "ethers"

import { keys } from "@constants"

import LPTokenAbi from "../abi/LPTokenAbi.json"
import { art_frax } from "./bonds/allBonds"

export async function getMarketPrice({ provider }) {
  const art_frax_address = art_frax.getAddressForReserve()

  const lpToken = new ethers.Contract(
    art_frax_address,
    LPTokenAbi.abi,
    provider
  )
  const reserves = await lpToken.getReserves()

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

export async function loadMarketPrice({ provider }) {
  let marketPrice: number
  try {
    marketPrice = await getMarketPrice({ provider })
    marketPrice = marketPrice / Math.pow(10, 9)
  } catch (e) {
    marketPrice = await getTokenPrice("art")
  }
  return { marketPrice }
}
