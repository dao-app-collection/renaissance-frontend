import React, { useEffect, useCallback } from "react"

import { useWeb3React, Web3ReactProvider } from "@web3-react/core"
import { AppProps } from "next/app"
import { useRouter } from "next/router"
import { Provider } from "react-redux"
import { useDispatch } from "react-redux"

import Web3Manager from "@components/layouts/Web3Manager"
import Toast from "@components/ui/Toast"
import { IS_PRODUCTION } from "@constants"
import { getProvider } from "@helper"
import getLibrary from "@helper/getLibrary"
import * as gtag from "@helper/gtag"
import useBonds from "@hooks/bondData"
import { ModalProvider } from "@hooks/useModal"
import {
  loadAccountDetails,
  calculateUserBondDetails,
} from "@slices/accountSlice"
// import { loadAppDetails } from "@slices/appSlice"
import { calcBondDetails } from "@slices/bondSlice"
import store from "@store"

import "../styles/tailwind.scss"

function Root({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const { bonds } = useBonds()
  const provider = getProvider()
  const { account, active } = useWeb3React()
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

  async function loadDetails(whichDetails: string) {
    let loadProvider = provider
    if (whichDetails === "app") {
      loadApp(loadProvider)
    }

    // don't run unless provider is a Wallet...
    if (whichDetails === "account" && account && active) {
      loadAccount(loadProvider)
    }
  }

  const loadApp = useCallback(
    (loadProvider) => {
      // dispatch(loadAppDetails({ chainId, provider: loadProvider }))
      bonds.map((bond: any) => {
        dispatch(
          calcBondDetails({
            bond,
            value: null,
            provider: loadProvider,
            chainId,
          })
        )
      })
    },
    [chainId, bonds, dispatch]
  )

  const loadAccount = useCallback(
    (loadProvider) => {
      dispatch(
        loadAccountDetails({
          chainId,
          address: account,
          provider: loadProvider,
        })
      )
      bonds.map((bond: any) => {
        dispatch(
          calculateUserBondDetails({
            address: account,
            bond,
            provider,
            chainId,
          })
        )
      })
    },
    [account, chainId, provider, dispatch, bonds]
  )

  // useEffect(() => {
  //   loadDetails("app")
  // }, [])

  // useEffect(() => {
  //   // don't load ANY details until wallet is Connected
  //   if (active) {
  //     loadDetails("account")
  //   }
  // }, [active, account])

  return <>{children}</>
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      if (IS_PRODUCTION) gtag.pageview(url)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3Manager>
        <Provider store={store}>
          <ModalProvider>
            <Root>
              <Component {...pageProps} />
            </Root>
          </ModalProvider>

          <Toast />
        </Provider>
      </Web3Manager>
    </Web3ReactProvider>
  )
}

export default MyApp
