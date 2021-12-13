import { utils } from "ethers"

import GenericContract from "@contracts/GenericContract"
import { parseBigNumberToFloat } from "@utils/parseUtils"

class Presale extends GenericContract {
  async deposit(amount: number) {
    const val = utils.parseEther(amount.toString())
    const tx = await this.contract.deposit(val)
    await tx.wait()
  }

  async withdraw(amount: number) {
    const val = utils.parseUnits(amount.toString(), 9)
    const tx = await this.contract.withdraw(val)
    await tx.wait()
  }

  async getTotalRaisedDAI() {
    const totalRaised = await this.contract.totalRaisedDAI()
    return parseBigNumberToFloat(totalRaised)
  }

  async startSale() {
    const tx = await this.contract.start()
    await tx.wait()
  }

  async whiteListUser(address: string) {
    const tx = await this.contract.addWhitelist(address)
    await tx.wait()
  }

  async getWhitelistedState(address: string): Promise<boolean> {
    const isWhitelisted = await this.contract.whitelisted(address)
    return isWhitelisted as boolean
  }

  async userInfo(address: string) {
    const user = await this.contract.userInfo(address)

    const formattedUser = {
      claimed: user.claimed,
      amount: parseBigNumberToFloat(user.amount),
      debt: parseBigNumberToFloat(user.debt),
    }

    return formattedUser
  }
}

export default Presale
