import { currentAddresses } from "@constants"

import { useToken } from "./useToken"

export default function useArtToken() {
  return useToken(currentAddresses.ART_ADDRESS, { decimals: 9 })
}
