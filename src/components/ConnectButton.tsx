import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"

import { getErrorMessage } from "@helper/getErrorMessage"
import { switchChains } from "@helper/walletHelpers"
import useModal from "@hooks/useModal"

import ConnectorModal from "./modals/ConnectorModal"

interface ownProps {
  customStyle?: string
}

function ConnectButton(props: ownProps) {
  const { customStyle } = props

  const { account, active, error } = useWeb3React()

  const { showModal } = useModal()
  const accountFormatted = account?.substring(0, 6) + "..."

  const errorMessage = getErrorMessage(error)

  if (active) {
    return (
      <div className={customStyle ? customStyle : ""}>
        <div className="flex items-center font-semibold 2xl:text-xl gap-2 text-dark-800 tracking-2%">
          {active && (
            <div className="tracking-2% md:text-sm 2xl:text-base">
              <div className="flex items-center gap-3">
                <span className="uppercase text-dark-800">Wallet</span>
                <span className="w-3 h-3 rounded-full bg-[#cbd3cc]"></span>
              </div>

              <p className="text-dark-100">{accountFormatted}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={customStyle ? customStyle : ""}>
      {error instanceof UnsupportedChainIdError ? (
        <button
          type="button"
          className="bg-scheme-bg sm:text-xs font-bold rounded-xl border border-gray-600 button 2xl:button-lg button-sm button-primary button-hover"
          onClick={switchChains}
        >
          Switch Chain
        </button>
      ) : (
        <div className="2xl:px-6">
          <button
            type="button"
            className="bg-scheme-bg sm:text-s font-bold rounded-xl border border-gray-600 button 2xl:button-lg button-sm button-primary button-hover"
            onClick={() => {
              showModal(<ConnectorModal />)
            }}
          >
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  )
}

export default ConnectButton

// import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"

// import { getErrorMessage } from "@helper/getErrorMessage"
// import { switchChains } from "@helper/walletHelpers"
// import useModal from "@hooks/useModal"

// import ConnectorModal from "./modals/ConnectorModal"

// interface ownProps {
//   customStyle?: string
// }

// function ConnectButton(props: ownProps) {
//   const { customStyle } = props

//   const { account, active, error } = useWeb3React()

//   const { showModal } = useModal()
//   const accountFormatted = account?.substring(0, 6) + "..."

//   const errorMessage = getErrorMessage(error)

//   if (active) {
//     return (
//       <div className="flex items-center font-semibold 2xl:text-xl gap-2 text-dark-800 tracking-2%">
//         {active && (
//           <div className="tracking-2% md:text-sm 2xl:text-base">
//             <div className="flex items-center gap-3">
//               <span className="uppercase text-dark-800">Wallet</span>
//               <span className="w-3 h-3 rounded-full bg-[#cbd3cc]"></span>
//             </div>

//             <p className="text-dark-100">{accountFormatted}</p>
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className={customStyle ? customStyle : ""}>
//       <div className="2xl:px-6">
//         <button
//           type="button"
//           className="bg-black sm:text-xs font-bold rounded-xl border border-gray-600 w-full button 2xl:button-lg button-sm button-primary button-hover"
//           onClick={() => {
//             showModal(<ConnectorModal />)
//           }}
//         >
//           Connect Wallet
//         </button>
//       </div>
//       {error && (
//         <div className="mt-3">
//           {error instanceof UnsupportedChainIdError ? (
//             <button
//               onClick={switchChains}
//               className="text-xs font-medium text-left text-gray-200"
//             >
//               Incorrect Chain! Click to switch
//             </button>
//           ) : (
//             <p className="text-xs font-medium text-gray-200">{errorMessage}</p>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default ConnectButton
