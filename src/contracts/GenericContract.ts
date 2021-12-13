import { Contract, ethers } from "ethers"

// abstract because it should not be instantiated directly
export abstract class GenericContract {
  address: string
  abi: ethers.ContractInterface
  contract: Contract
  provider: ethers.providers.Provider | ethers.Signer

  public constructor(
    address: string,
    abi: ethers.ContractInterface,
    provider: ethers.providers.Provider | ethers.Signer
  ) {
    this.address = address
    this.abi = abi
    this.provider = provider
    this.contract = new ethers.Contract(address, abi, this.provider)
  }
}

export default GenericContract
