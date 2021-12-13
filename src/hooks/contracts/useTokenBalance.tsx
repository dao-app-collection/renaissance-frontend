import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

import { ERC20 } from "@contracts/ERC20"

// would have put balance and allowance in useToken but it's bad dev experience when people have to add spender to the function call
export function useTokenBalance(token: ERC20) {
  const { account } = useWeb3React()

  const { data: balance, mutate } = useSWR(
    [`/balance/${token?.address}`, account],
    (_, account) => token.balanceOf(account)
  )

  return { balance, mutate }
}
