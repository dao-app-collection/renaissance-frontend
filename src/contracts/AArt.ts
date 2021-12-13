import { ethers } from "ethers"

import { currentAddresses } from "@constants"
import { ERC20 } from "@contracts/ERC20"

export const presaleAddress = currentAddresses.DAI_ART_PRESALE_ADDRESS

class AArt extends ERC20 {
  constructor(
    address: string,
    abi: ethers.ContractInterface,
    provider: ethers.providers.Provider | ethers.Signer
  ) {
    super(address, abi, provider)
    super.setDecimals(9)
    super.setSymbol("AART")
  }

  async setPresale() {
    const payout = await this.contract.setPresale(presaleAddress)
    return payout as number
  }
}

export default AArt
