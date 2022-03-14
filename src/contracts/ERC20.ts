import { ethers, ContractTransaction } from "ethers"

import { parseBigNumberToFloat } from "@helper/parseUtils"

import GenericContract from "./GenericContract"

interface IERC20 {
  approve: (spender: string, amount: ethers.BigNumber) => Promise<void>
  allowance: (owner: string, spender: string) => Promise<number>
  mint: (address: string, val: ethers.BigNumber) => Promise<void>
  balanceOf: (address: string) => Promise<number>
}

export class ERC20 extends GenericContract implements IERC20 {
  decimals: number
  symbol: string

  setDecimals(decimals: number) {
    this.decimals = decimals
    return this
  }

  setSymbol(symbol: string) {
    this.symbol = symbol
    return this
  }

  async approve(spender: string, val: ethers.BigNumber) {
    const tx: ContractTransaction = await this.contract.approve(spender, val)
    await tx.wait()
  }

  async allowance(owner: string, spender: string) {
    const allowance = await this.contract.allowance(owner, spender)
    return parseBigNumberToFloat(allowance, this.decimals)
  }

  async mint(address: string, val: ethers.BigNumber) {
    const payout = await this.contract.mint(address, val)
    await payout.wait()
  }

  async balanceOf(address: string) {
    const balance = await this.contract.balanceOf(address)
    return parseBigNumberToFloat(balance, this.decimals)
  }

  async totalSupply() {
    const balance = await this.contract.totalSupply()
    return parseBigNumberToFloat(balance, this.decimals)
  }
}
