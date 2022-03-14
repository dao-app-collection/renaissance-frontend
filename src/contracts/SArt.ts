import { ethers } from "ethers"

import { ERC20 } from "@contracts/ERC20"
import { parseBigNumberToFloat } from "@utils/parseUtils"

// SArt is it's own class because it extends the ERC20 with circulatingSupply, if we wanted to use it as an ERC20, we could do that with useToken but then we wouldn't have access to ciculatingSupply
// if we really want to use circulatingSupply, we need to create this contract with a custom useContract call
class SArt extends ERC20 {
  constructor(
    address: string,
    abi: ethers.ContractInterface,
    provider: ethers.providers.Provider | ethers.Signer
  ) {
    super(address, abi, provider)
    super.setDecimals(9)
    super.setSymbol("AROME")
  }

  async circulatingSupply() {
    const supply = await this.contract.circulatingSupply()
    return supply
  }

  async balanceForGons(gons: ethers.BigNumber) {
    const balance = await this.contract.balanceForGons(gons)
    return parseBigNumberToFloat(balance, 9)
  }
}

export default SArt
