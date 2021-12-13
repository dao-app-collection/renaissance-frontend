import React, { createContext, useEffect } from "react"
import { useState } from "react"

import { ethers } from "ethers"

import { calcBondDetails, IBondDetails } from "@helper/bondCalculator"
import allBonds from "@helper/bonds/allBonds"

interface DataContext {
  bonds: IBondDetails[]
  userBonds: string[]
  fetchBonds: () => void
  fetchUserBonds: () => void
}

const DataContext = createContext<DataContext>({
  bonds: [],
  userBonds: [],
  fetchBonds: () => null,
  fetchUserBonds: () => null,
})

function DataProvider({ children }: { children: React.ReactNode }) {
  const [bonds, setBonds] = useState<IBondDetails[]>([])
  const [userBonds, setUserBonds] = useState([])

  const fetchBonds = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any)["ethereum"] ?? null
    )

    const bonds = await Promise.all(
      allBonds.map(async (bond) => {
        return await calcBondDetails({
          bond,
          value: "0",
          provider,
          chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
        })
      })
    )
    setBonds(bonds)
  }

  const fetchUserBonds = () => {
    setUserBonds([])
  }

  useEffect(() => {
    fetchBonds()
  }, [])

  return (
    <DataContext.Provider
      value={{ bonds, userBonds, fetchBonds, fetchUserBonds }}
    >
      {children}
    </DataContext.Provider>
  )
}

function useData() {
  return React.useContext(DataContext)
}

export { DataProvider, useData }
