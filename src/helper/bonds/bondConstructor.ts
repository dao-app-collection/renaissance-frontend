import React from "react"

import {
  StaticJsonRpcProvider,
  ExternalProvider,
} from "@ethersproject/providers"
import { ethers } from "ethers"

import { contractForBondCalculator } from "@helper/contracts"
import ierc20Abi from "src/abi/IERC20.json"
import { currentAddresses } from "src/constants"

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
  isAvailable: boolean // set false to hide
  bondIconSvg: (props: React.SVGProps<SVGSVGElement>) => JSX.Element //  SVG path for icons
  bondContractABI: ethers.ContractInterface // ABI for contract
  networkAddrs: BondAddresses // Mapping of network --> Addresses
  bondToken: string // Unused, but native token to buy the bond.
  soldOut?: boolean
}

// Technically only exporting for the interface
export abstract class Bond {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string
  readonly displayName: string
  readonly type: BondType
  readonly isAvailable: boolean
  readonly bondIconSvg: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  readonly bondContractABI: ethers.ContractInterface // Bond ABI
  readonly networkAddrs: BondAddresses
  readonly bondToken: string
  readonly soldOut: boolean

  // The following two fields will differ on how they are set depending on bond type
  abstract isLP: boolean
  abstract reserveContract: ethers.ContractInterface // Token ABI
  abstract displayUnits: string

  // Async method that returns a Promise
  abstract getTreasuryBalance(
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
    this.soldOut = bondOpts?.soldOut ?? false
  }

  getAddressForBond() {
    return this.networkAddrs.bondAddress
  }
  getContractForBond(provider: StaticJsonRpcProvider) {
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

  async getBondPriceInUSD(provider: StaticJsonRpcProvider) {
    const bondContract = this.getContractForBond(provider)
    return await bondContract.bondPriceInUSD()
  }

  async getBondReservePrice(provider: StaticJsonRpcProvider) {
    const pairContract = this.getContractForReserve(provider)
    const reserves = await pairContract.getReserves()
    const marketPrice =
      Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9
    return marketPrice
  }

  async getStandardizedDebtRatio(provider: StaticJsonRpcProvider) {
    const bondContract = this.getContractForBond(provider)
    return await bondContract.standardizedDebtRatio()
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
  async getTreasuryBalance(provider: StaticJsonRpcProvider) {
    const token = this.getContractForReserve(provider)
    const tokenAddress = this.getAddressForReserve()
    const bondCalculator = contractForBondCalculator(provider)
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

  async getTreasuryBalance(provider: StaticJsonRpcProvider) {
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
    provider: StaticJsonRpcProvider
  ) => Promise<number>
  customGetBondPriceInUSDFunc?: (
    this: CustomBond,
    provider: StaticJsonRpcProvider
  ) => Promise<number>
  customGetStandardizedDebtRatio?: (
    this: CustomBond,
    provider: StaticJsonRpcProvider
  ) => Promise<number>
}
export class CustomBond extends Bond {
  readonly isLP: boolean
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

    if (customBondOpts.customGetBondPriceInUSDFunc) {
      this.getBondPriceInUSD =
        customBondOpts.customGetBondPriceInUSDFunc.bind(this)
    }

    if (customBondOpts.customGetStandardizedDebtRatio) {
      this.getStandardizedDebtRatio =
        customBondOpts.customGetStandardizedDebtRatio.bind(this)
    }
  }
}
