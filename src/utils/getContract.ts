import { Web3Provider } from "@ethersproject/providers"
import { ethers } from "ethers"
import { isAddress } from "ethers/lib/utils"

import GenericContract from "@contracts/GenericContract"
import { IGenericContractConstructor } from "@typings"

// https://www.typescriptlang.org/docs/handbook/2/generics.html#using-class-types-in-generics look here to understand the use of class types

/**
 *
 * @param Contract implementation details of a contract
 * @param address contract address
 * @param ABI contract abi
 * @param provider provider to use contract with
 * @param account optional account that makes contract use signer instead of just provider if present
 * @returns
 */
export function getContract<T extends GenericContract>(
  Contract: IGenericContractConstructor<T>,
  address: string,
  ABI: ethers.ContractInterface,
  provider: ethers.providers.Provider | ethers.Signer,
  account?: string
): T {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  if (provider instanceof Web3Provider) {
    // type guard: if the provider of type Web3Provider, we can safely get the signer
    return new Contract(address, ABI, provider.getSigner())
  } else {
    // if the provider is of any other type, (e.g because it was not injected), we shouldn't get the signer
    return new Contract(address, ABI, provider)
  }
}
