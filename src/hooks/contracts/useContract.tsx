import { useMemo } from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"

import GenericContract from "@contracts/GenericContract"
import { getProvider } from "@helper"
import { getContract } from "@utils/getContract"

type IGenericContractConstructor<T> = new (
  address: string,
  abi: ethers.ContractInterface,
  provider: ethers.providers.Provider
) => T

export function useContract<T extends GenericContract>(
  Contract: IGenericContractConstructor<T>,
  address: string,
  abi: ethers.ContractInterface
) {
  const { library } = useWeb3React<Web3Provider>()

  return useMemo(() => {
    if (!address || !abi) return null

    if (!library) {
      // if no provider is injected found, use the default provider
      try {
        return getContract(Contract, address, abi, getProvider())
      } catch (error) {
        console.error("Failed to get contract with default provider", error)
        return null
      }
    }

    // library (aka user injected provider) exists, let's use it so we can use the signer object
    try {
      return getContract(Contract, address, abi, library)
    } catch (error) {
      console.error("Failed to get contract with injected provider", error)
      return null
    }
  }, [address, library, abi, Contract])
}
