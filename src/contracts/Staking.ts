import { ContractTransaction } from "@ethersproject/contracts"
import { ethers } from "ethers"

import GenericContract from "@contracts/GenericContract"
import { parseBigNumberToFloat } from "@helper/parseUtils"

interface WarmupInfo {
  deposit: number
  gons: number
  expiry: number
  lock: boolean
}

interface Epoch {
  length: number
  number: number
  endBlock: number
  distribute: number
}

class Staking extends GenericContract {
  async stake(amount: ethers.BigNumber, address: string) {
    const stakeTx: ContractTransaction = await this.contract.stake(
      amount,
      address
    )
    await stakeTx.wait()
  }

  async unstake(amount: ethers.BigNumber) {
    const unstakeTx: ContractTransaction = await this.contract.unstake(
      amount,
      true
    )
    await unstakeTx.wait()
  }

  async claim(address: string) {
    const claimTx: ContractTransaction = await this.contract.claim(address)
    await claimTx.wait()
  }

  async epoch() {
    const epoch = await this.contract.epoch()

    const formattedInfo: Epoch = {
      length: parseBigNumberToFloat(epoch.length),
      number: parseBigNumberToFloat(epoch.number),
      endBlock: epoch.endBlock.toNumber(),
      distribute: epoch.distribute.toNumber(),
    }
    return formattedInfo
  }

  async index() {
    const index = await this.contract.index()
    const formattedIndex = parseBigNumberToFloat(index, 9)
    return formattedIndex
  }

  async warmupInfo(address: string) {
    const info = await this.contract.warmupInfo(address)

    const formattedInfo: WarmupInfo = {
      deposit: parseBigNumberToFloat(info.deposit, 9),
      gons: parseBigNumberToFloat(info.gons),
      expiry: parseBigNumberToFloat(info.expiry),
      lock: info.lock,
    }

    return formattedInfo
  }

  async contractBalance() {
    const balance = await this.contract.contractBalance()
    const formatted = parseBigNumberToFloat(balance, 9)
    return formatted
  }
}

export default Staking
