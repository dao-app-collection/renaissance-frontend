import { StaticJsonRpcProvider } from "@ethersproject/providers"

import getChain, { BLOCK_RATE_SECONDS } from "../constants"

// Used for:
// AccountSlice.ts, AppSlice.ts,
export function setAll(state: any, properties: any) {
  if (!properties) return
  const props = Object.keys(properties)
  props.forEach((key) => {
    state[key] = properties[key]
  })
}

export function prettify(money: number, decimals?: number): string {
  return format(round(money, decimals == 0 || decimals ? decimals : 2), 3)
}

export function round(money: number, decimal: number): number {
  if (isNaN(money)) {
    return 0
  }

  let value = 0

  let round = 1 * Math.pow(10, decimal)
  value = Math.round(money * round) / round
  return value
}

export function format(money: number, decimal: number): string {
  if (!money) {
    return "0"
  }

  let value = 0

  if (decimal) {
    value = round(money, decimal)
  }
  const moneyString = value.toString().split(".")
  moneyString[0] = moneyString[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  if (moneyString[1]) {
    return moneyString[0] + "." + moneyString[1]
  } else {
    return moneyString[0]
  }
}

export function secondsUntilBlock(startBlock: number, endBlock: number) {
  const blocksAway = endBlock - startBlock

  if (blocksAway < 0) return 0

  const secondsAway = blocksAway * BLOCK_RATE_SECONDS

  return secondsAway
}

export function prettyVestingPeriod(
  currentBlock: number,
  vestingBlock: number
) {
  if (vestingBlock === 0) {
    return "0"
  }

  const seconds = secondsUntilBlock(currentBlock, vestingBlock)
  if (seconds < 0) {
    return "Fully Vested"
  }
  return prettifySeconds(seconds)
}

export function prettifySeconds(seconds: number, resolution?: string) {
  if (seconds !== 0 && !seconds) {
    return ""
  }

  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)

  if (resolution === "day") {
    return d + (d == 1 ? " day" : " days")
  }

  const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : ""
  const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : ""
  const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : ""

  let result = dDisplay + hDisplay + mDisplay
  if (mDisplay === "") {
    result = result.slice(0, result.length - 2)
  }

  return result
}

export const shouldTriggerSafetyCheck = () => {
  const _storage = window.sessionStorage
  const _safetyCheckKey = "-renaissance-safety"
  // check if sessionStorage item exists for SafetyCheck
  if (!_storage.getItem(_safetyCheckKey)) {
    _storage.setItem(_safetyCheckKey, "true")
    return true
  }
  return false
}

function getMainnetURI(): string {
  const chainID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)

  return getChain(chainID).rpcUrls[0]
}

let provider: StaticJsonRpcProvider = null

export function getProvider() {
  if (!provider) {
    provider = new StaticJsonRpcProvider(getMainnetURI())
  }

  return provider
}
