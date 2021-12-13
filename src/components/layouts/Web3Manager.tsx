import { useEffect, useState } from "react"

import { useWeb3React } from "@web3-react/core"

import {
  useEagerConnect,
  useInactiveListener,
} from "@hooks/useExistingWalletConnection"

function Web3Manager({ children }: { children: React.ReactNode }) {
  const { connector, active, deactivate } = useWeb3React()

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  return <>{children}</>
}

export default Web3Manager
