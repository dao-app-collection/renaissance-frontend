import React from "react"

import {
  StaticJsonRpcProvider,
  JsonRpcSigner,
  ExternalProvider,
} from "@ethersproject/providers"
import { ethers } from "ethers"

import { contractForBondCalculator } from "@helper/contracts"
import ierc20Abi from "src/abi/IERC20.json"
import { currentAddresses } from "src/constants"

export enum chainId {
  Mainnet = 1,
  Testnet = 4,
}

export enum BondType {
  StableAsset,
  LP,
}

export interface BondAddresses {
  reserveAddress: string
  bondAddress: string
}

interface BondOpts {
  name: string // Internal name used for references
  displayName: string // Displayname on UI
  isAvailable: Boolean // set false to hide
  bondIconSvg: React.ReactNode //  SVG path for icons
  bondContractABI: ethers.ContractInterface // ABI for contract
  networkAddrs: BondAddresses // Mapping of network --> Addresses
  bondToken: string // Unused, but native token to buy the bond.
}

// Technically only exporting for the interface
export abstract class Bond {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string
  readonly displayName: string
  readonly type: BondType
  readonly isAvailable: Boolean
  readonly bondIconSvg: React.ReactNode
  readonly bondContractABI: ethers.ContractInterface // Bond ABI
  readonly networkAddrs: BondAddresses
  readonly bondToken: string

  // The following two fields will differ on how they are set depending on bond type
  abstract isLP: Boolean
  abstract reserveContract: ethers.ContractInterface // Token ABI
  abstract displayUnits: string

  // Async method that returns a Promise
  abstract getTreasuryBalance(
    chainId: number,
    provider: StaticJsonRpcProvider | ExternalProvider
  ): Promise<number>

  constructor(type: BondType, bondOpts: BondOpts) {
    this.name = bondOpts.name
    this.displayName = bondOpts.displayName
    this.type = type
    this.isAvailable = bondOpts.isAvailable
    this.bondIconSvg = bondOpts.bondIconSvg
    this.bondContractABI = bondOpts.bondContractABI
    this.networkAddrs = bondOpts.networkAddrs
    this.bondToken = bondOpts.bondToken
  }

  getAddressForBond() {
    return this.networkAddrs.bondAddress
  }
  getContractForBond(provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForBond()
    return new ethers.Contract(bondAddress, this.bondContractABI, provider)
  }

  getContractForBondFromWallet(provider: ethers.Signer) {
    const bondAddress = this.getAddressForBond()
    return new ethers.Contract(bondAddress, this.bondContractABI, provider)
  }

  getAddressForReserve() {
    return this.networkAddrs.reserveAddress
  }
  getContractForReserve(provider: ethers.providers.Provider | ethers.Signer) {
    const bondAddress = this.getAddressForReserve()
    return new ethers.Contract(bondAddress, this.reserveContract, provider)
  }

  getContractForReserveFromWallet(provider: ethers.Signer) {
    const bondAddress = this.getAddressForReserve()
    return new ethers.Contract(bondAddress, this.reserveContract, provider)
  }

  async getBondReservePrice(provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const pairContract = this.getContractForReserve(provider)
    const reserves = await pairContract.getReserves()
    const marketPrice =
      Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9
    return marketPrice
  }
}

// Keep all LP specific fields/logic within the LPBond class
export interface LPBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface
  lpUrl: string
}

export class LPBond extends Bond {
  readonly isLP = true
  readonly lpUrl: string
  readonly reserveContract: ethers.ContractInterface
  readonly displayUnits: string

  constructor(lpBondOpts: LPBondOpts) {
    super(BondType.LP, lpBondOpts)

    this.lpUrl = lpBondOpts.lpUrl
    this.reserveContract = lpBondOpts.reserveContract
    this.displayUnits = "LP"
  }
  async getTreasuryBalance(chainId: number, provider: StaticJsonRpcProvider) {
    const token = this.getContractForReserve(provider)
    const tokenAddress = this.getAddressForReserve()
    const bondCalculator = contractForBondCalculator(chainId, provider)
    const tokenAmount = await token.balanceOf(currentAddresses.TREASURY_ADDRESS)
    const valuation = await bondCalculator.valuation(tokenAddress, tokenAmount)
    const markdown = await bondCalculator.markdown(tokenAddress)
    let tokenUSD =
      (Number(valuation.toString()) / Math.pow(10, 9)) *
      (Number(markdown.toString()) / Math.pow(10, 18))
    return Number(tokenUSD.toString())
  }
}

// Generic BondClass we should be using everywhere
// Assumes the token being deposited follows the standard ERC20 spec
export interface StableBondOpts extends BondOpts {}
export class StableBond extends Bond {
  readonly isLP = false
  readonly reserveContract: ethers.ContractInterface
  readonly displayUnits: string

  constructor(stableBondOpts: StableBondOpts) {
    super(BondType.StableAsset, stableBondOpts)
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = stableBondOpts.displayName
    this.reserveContract = ierc20Abi.abi // The Standard ierc20Abi since they're normal tokens
  }

  async getTreasuryBalance(chainId: number, provider: StaticJsonRpcProvider) {
    let token = this.getContractForReserve(provider)
    let tokenAmount = await token.balanceOf(currentAddresses.TREASURY_ADDRESS)
    return Number(tokenAmount.toString()) / Math.pow(10, 18)
  }
}

// These are special bonds that have different valuation methods
export interface CustomBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface
  bondType: number
  lpUrl: string
  customTreasuryBalanceFunc: (
    this: CustomBond,
    chainId: number,
    provider: StaticJsonRpcProvider
  ) => Promise<number>
}
export class CustomBond extends Bond {
  readonly isLP: Boolean
  getTreasuryBalance(): Promise<number> {
    throw new Error("Method not implemented.")
  }
  readonly reserveContract: ethers.ContractInterface
  readonly displayUnits: string
  readonly lpUrl: string

  constructor(customBondOpts: CustomBondOpts) {
    super(customBondOpts.bondType, customBondOpts)

    if (customBondOpts.bondType === BondType.LP) {
      this.isLP = true
    } else {
      this.isLP = false
    }
    this.lpUrl = customBondOpts.lpUrl
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = customBondOpts.displayName
    this.reserveContract = customBondOpts.reserveContract
    this.getTreasuryBalance =
      customBondOpts.customTreasuryBalanceFunc.bind(this)
  }
}
