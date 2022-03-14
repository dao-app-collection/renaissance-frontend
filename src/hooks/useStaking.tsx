import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

import ArtStakingAbi from "@abi/ArtStakingAbi.json"
import sArtAbi from "@abi/sArtAbi.json"
import StakingHelperAbi from "@abi/StakingHelperAbi.json"
import { currentAddresses } from "@constants"
import SArt from "@contracts/SArt"
import Staking from "@contracts/Staking"
import StakingHelper from "@contracts/StakingHelper"
import { secondsUntilBlock } from "@helper"
import getLibrary from "@helper/getLibrary"

import useArtToken from "./useArtToken"
import { useContract } from "./useContract"
import { getMarketPrice } from "./useMarketPrice"
import { useTokenAllowance } from "./useTokenAllowance"
import { useTokenBalance } from "./useTokenBalance"

// just like useToken extends useContract, we can create a custom staking hook
export function useStaking() {
  return useContract(Staking, currentAddresses.STAKING_ADDRESS, ArtStakingAbi)
}

export function useStakingHelper() {
  return useContract(
    StakingHelper,
    currentAddresses.STAKING_HELPER_ADDRESS,
    StakingHelperAbi
  )
}

// abstract a lot of hooks away into one single hook 🧹
// using useSWR to fetch data, cache and handle react renders, effectively abstracting data fetching away as well
// might want to use react-query for better caching
// also this architecture is fully compatible with react18 and suspense, upgrading is just a matter of changing a flag and adding suspense components
export function useStakingData(staking: Staking) {
  const { library } = useWeb3React()

  // with useToken we can use sArt as a token but since we want the circulatingSupply which is not an ERC20, we eject instead
  const sArt = useContract(SArt, currentAddresses.SART_ADDRESS, sArtAbi)

  // because it still is an ERC20 token, we can just use the balance, how cool is that?
  const sArtBalance = useTokenBalance(sArt)

  const art = useArtToken()
  const artBalance = useTokenBalance(art)

  const stakeAllowance = useTokenAllowance(
    art,
    currentAddresses.STAKING_HELPER_ADDRESS
  )

  const unstakeAllowance = useTokenAllowance(
    sArt,
    currentAddresses.STAKING_ADDRESS
  )

  const { data: epoch } = useSWR(`/epoch/${staking?.address}`, () =>
    staking.epoch()
  )

  const { data: circulatingSupply } = useSWR(
    `/circulatingSupply/${staking?.address}`,
    () => sArt.circulatingSupply()
  )

  const { data: contractBalance } = useSWR(
    `/stakingBalance/${staking?.address}`,
    () => staking.contractBalance()
  )

  const { data: marketPrice } = useSWR(
    `/marketprice/${staking?.address}`,
    async () => await getMarketPrice()
  )

  const { data: currentIndex } = useSWR(
    `/currentIndex/${staking?.address}`,
    () => staking.index()
  )

  // const stakingTVL = contractBalance * 1000
  // change back
  const stakingTVL = (contractBalance * marketPrice) / 10 ** 9

  // hours daily divided by rebase rate
  const REBASE_PER_DAY = 24 / 7.75

  // just derived data, don't need to use SWR for that
  const stakingReward = epoch?.distribute
  const stakingRebase = stakingReward / circulatingSupply
  const fiveDayRate = Math.pow(1 + stakingRebase, 5 * REBASE_PER_DAY) - 1
  const stakingAPY =
    (Math.pow(1 + stakingRebase, 365 * REBASE_PER_DAY) - 1) * 100

  const { data: currentBlockNumber } = useSWR(
    ["/currentBlock", library?.provider],
    async (_, provider) => await getLibrary(provider).getBlockNumber()
  )

  const secondsUntilNextEpoch = secondsUntilBlock(
    currentBlockNumber,
    epoch?.endBlock
  )

  return {
    art,
    sArt,
    artBalance,
    sArtBalance,
    stakeAllowance,
    unstakeAllowance,
    stakingRebase,
    fiveDayRate,
    stakingAPY,
    // need to change that to fetch actual market price etc.
    stakingTVL,
    contractBalance,
    currentIndex,
    marketPrice,
    epoch,
    secondsUntilNextEpoch,
    currentBlockNumber,
  }
}
