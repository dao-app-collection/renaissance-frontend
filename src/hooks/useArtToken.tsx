import { currentAddresses } from "@constants"

import { useToken } from "./useToken"

export default function useArtToken() {
  return useToken(currentAddresses.ROME_ADDRESS, { decimals: 9 })
}
