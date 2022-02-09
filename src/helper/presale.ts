import { Web3Provider } from "@ethersproject/providers"
import { ethers } from "ethers"

import aArtAbi from "@abi/aArtAbi.json"
import presaleAbi from "@abi/aArtPresaleAbi.json"
import fraxAbi from "@abi/FraxAbi.json"
import { currentAddresses } from "@constants"
import { getProvider } from "@helper"

export const presaleAddress = currentAddresses.AART_PRESALE_ADDRESS
export const aArtAddress = currentAddresses.AART_ADDRESS
export const fraxAddress = currentAddresses.FRAX_RESERVE_ADDRESS

function getContract() {
  const provider = getProvider()

  const contract = new ethers.Contract(presaleAddress, presaleAbi, provider)

  return contract
}

async function deposit(library: Web3Provider, amount: number) {
  const contract = getContract().connect(library.getSigner())
  const val = ethers.utils.parseEther(amount.toString())
  const tx = await contract.deposit(val)
  await tx.wait()
}

async function getTotalRaisedFRAX() {
  const contract = getContract()
  const totalRaised = await contract.totalRaisedFRAX()
  const formattedRaised = totalRaised.number() as Number

  return formattedRaised
}

async function getWhitelistedState(address: string): Promise<boolean> {
  const contract = getContract()
  const isWhitelistedA = await contract.whitelistedA(address)
  const isWhitelistedB = await contract.whitelistedB(address)
  return isWhitelistedA || isWhitelistedB
}

async function getUser(address: string) {
  const contract = getContract()
  const user = await contract.userInfo(address)

  const formattedUser = {
    claimed: user.claimed,
    amount: parseFloat(ethers.utils.formatEther(user?.amount)),
    debt: parseFloat(ethers.utils.formatEther(user.debt)),
  }

  return formattedUser
}

async function approve(library: Web3Provider, spender: string, amount: number) {
  const signer = library.getSigner()
  const contract = new ethers.Contract(fraxAddress, fraxAbi, signer).connect(
    signer
  )
  const val = ethers.utils.parseEther(amount.toString())
  const payout = await contract.approve(spender, val)
  await payout.wait()
}

async function getAllowance(owner: string) {
  const provider = getProvider()

  const contract = new ethers.Contract(fraxAddress, fraxAbi, provider)

  const allowance = await contract.allowance(owner, presaleAddress)
  return parseFloat(ethers.utils.formatEther(allowance))
}

async function getFraxBalance(address: string) {
  const provider = getProvider()

  const contract = new ethers.Contract(fraxAddress, fraxAbi, provider)

  const payout = await contract.balanceOf(address)
  return ethers.utils.formatEther(payout)
}

async function getAArtBalance(address: string) {
  const provider = getProvider()

  const contract = new ethers.Contract(aArtAddress, aArtAbi, provider)

  const payout = await contract.balanceOf(address)
  return ethers.utils.formatUnits(payout, 9)
}

async function getAArtPrice() {
  const contract = getContract()

  const payout = await contract.price()
  return ethers.utils.formatUnits(payout, 18)
}

async function getUserRemainingAllocation(address: string) {
  const contract = getContract()

  const remainingAllocation = await contract.getUserRemainingAllocation(address)
  return ethers.utils.formatUnits(remainingAllocation, 18)
}

//DEV / TEST FUNCTIONS FROM HERE

//For testing with mock frax
async function mintFrax(address: string) {
  const provider = getProvider()

  const contract = new ethers.Contract(fraxAddress, fraxAbi, provider)

  const val = ethers.utils.parseEther("1500")

  const payout = await contract.mint(address, val)
  await payout.wait()
}

async function setPresale() {
  const provider = getProvider()

  const contract = new ethers.Contract(aArtAddress, aArtAbi, provider)

  const payout = await contract.setPresale(presaleAddress)
  return payout as number
}

async function startSale() {
  const contract = getContract()
  const tx = await contract.start()
  await tx.wait()
}

async function whiteListUser(address: string, list: "A" | "B") {
  const contract = getContract()
  const tx =
    list === "A"
      ? await contract.addWhitelistA(address)
      : list === "B"
      ? await contract.addWhitelistB(address)
      : null

  await tx?.wait?.()
}

export {
  deposit,
  getTotalRaisedFRAX,
  startSale,
  whiteListUser,
  getWhitelistedState,
  getUser,
  mintFrax,
  setPresale,
  getAArtBalance,
  getAArtPrice,
  getUserRemainingAllocation,
  approve,
  getAllowance,
  getFraxBalance,
}
