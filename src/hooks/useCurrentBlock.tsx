import useSWR from "swr"

import { getProvider } from "@helper"

export function useCurrentBlock() {
  const provider = getProvider()

  const { data: currentBlock } = useSWR(
    `/app/currentBlock`,
    async () => await provider.getBlockNumber()
  )

  return currentBlock
}
