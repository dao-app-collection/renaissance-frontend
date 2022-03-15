import { useMemo } from "react"

import { useBonds } from "@hooks/useBonds"

export function useTreasuryBalance() {
  const bonds = useBonds()

  const loading = bonds.every(({ bondPrice }) => !bondPrice)
  const treasuryBalance = useMemo(() => {
    return bonds.reduce((totalBalance, bond) => {
      return totalBalance + bond.purchased
    }, 0)
  }, [bonds])

  return {
    loading,
    treasuryBalance,
  }
}
