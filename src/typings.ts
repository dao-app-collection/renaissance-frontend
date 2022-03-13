import React from "react"

import { ethers } from "ethers"

import { CustomBond, LPBond, StableBond } from "@helper/bonds/bondConstructor"

export interface ISingleBond {
  bond: StableBond | LPBond | CustomBond
  bondContract: ethers.Contract
  bondDiscount: number
  bondIconSvg: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  bondPrice: number
  debtRatio: number
  displayName: string
  displayUnits: string
  isLP: boolean
  maxBondPrice: number
  mutateBond: Function
  name: string
  purchased: number
  vestingTerm: number
  isAvailable: boolean
  marketPrice: number
  payoutTokenName: string
  pro: boolean
}

export interface IBonder {
  allowance: number
  approveSpend: Function
  approvePending: boolean
  balance: string
  bondMaturationBlock: number
  interestDue: number
  mutateBonder: Function
  pendingPayout: string
  purchaseBond: Function
  purchaseBondPending: boolean
  redeemBond: Function
  redeemProBond: Function
  redeemBondPending: boolean
  redeemBondAutoPending: boolean
}

export interface NavigationItem {
  name: string
  href: string
  sub?: React.ReactNode
}

export interface NavigationItemWithIcon {
  name: string
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  href: string
  hrefActive: string[]
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

export interface IJsonRPCError {
  readonly message: string
  readonly code: number
}
