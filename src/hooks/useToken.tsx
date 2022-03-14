import ERC20Abi from "@abi/ERC20Abi.json"
import { ERC20 } from "@contracts/ERC20"

import { useContract } from "./useContract"

interface Options {
  decimals?: number
  symbol?: string
}

export function useToken(address: string, options?: Options) {
  const erc20Contract = useContract(ERC20, address, ERC20Abi.abi)

  if (!erc20Contract) return null

  if (options?.decimals) {
    erc20Contract.decimals = options.decimals
  }
  if (options?.symbol) {
    erc20Contract.symbol = options.symbol
  }

  return erc20Contract
}
