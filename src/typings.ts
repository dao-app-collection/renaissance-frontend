import { ethers } from "ethers"

export interface NavigationItem {
  name: string
  href: string
  sub?: React.ReactNode
}

export interface INewsItem {
  name: string
  date: string
  link: string
}

export type IGenericContractConstructor<T> = new (
  address: string,
  abi: ethers.ContractInterface,
  provider: ethers.providers.Provider | ethers.Signer
) => T
