import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers"
import { ethers } from "ethers"

import RedeemHelperABI from "@abi/RedeemHelper.json"
import { getAddresses } from "@constants"
import BondCalcContractABI from "src/abi/BondCalcContract.json"

export function contractForRedeemHelper({
  chainId,
  provider,
}: {
  chainId: number
  provider: StaticJsonRpcProvider | JsonRpcSigner
}) {
  return new ethers.Contract(
    getAddresses(chainId).REDEEM_HELPER_ADDRESS as string,
    RedeemHelperABI.abi,
    provider
  )
}

export function contractForBondCalculator(
  chainId: number,
  provider: StaticJsonRpcProvider
) {
  return new ethers.Contract(
    getAddresses(chainId).BONDINGCALC_ADDRESS as string,
    BondCalcContractABI.abi,
    provider
  )
}
