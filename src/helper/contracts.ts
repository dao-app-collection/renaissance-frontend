import { StaticJsonRpcProvider } from "@ethersproject/providers"
import { ethers } from "ethers"

import { currentAddresses } from "@constants"
import BondCalcContractABI from "src/abi/BondCalcContract.json"

export function contractForBondCalculator(provider: StaticJsonRpcProvider) {
  return new ethers.Contract(
    currentAddresses.BONDINGCALC_ADDRESS as string,
    BondCalcContractABI.abi,
    provider
  )
}
