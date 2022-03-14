import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

import { ERC20 } from "@contracts/ERC20"

export function useTokenAllowance(token: ERC20, spender: string) {
  const { account } = useWeb3React()

  const { data: allowance, mutate } = useSWR(
    [`/allowance/${token?.address}`, account, spender],
    (_, owner, spender) => token.allowance(owner, spender)
  )

  return { allowance, mutate }
}
