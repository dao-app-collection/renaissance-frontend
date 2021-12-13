import { ContractTransaction } from "@ethersproject/contracts"
import { ethers } from "ethers"

import GenericContract from "@contracts/GenericContract"

class StakingHelper extends GenericContract {
  async stake(amount: ethers.BigNumber, address: string) {
    const stakeTx: ContractTransaction = await this.contract.stake(
      amount,
      address
    )
    await stakeTx.wait()
  }
}

export default StakingHelper
