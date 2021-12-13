import { useMemo } from "react"

import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"

import { getAnyContract } from "@utils/getAnyContract"

export function useAnyContract(
  address: string | undefined,
  abi: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useWeb3React()
  return useMemo(() => {
    if (!address || !abi || !library) return null
    try {
      return getAnyContract(
        address,
        abi,
        library,
        withSignerIfPossible && account ? account : undefined
      )
    } catch (error) {
      console.error("Failed to get contract", error)
      return null
    }
  }, [address, abi, library, withSignerIfPossible, account])
}
