import { error } from "@slices/messagesSlice"
import store from "@store"

// List of error messages we wish to intercept
const interceptedConsoleMessages = ["Wrong network, please switch to mainnet"]

interface IConsoleInterceptor {
  (message: string): void
  isInterceptor: boolean
}
let consoleInterceptor: IConsoleInterceptor = Object.assign(
  (message: string) => {
    if (interceptedConsoleMessages.includes(message)) {
      store.dispatch(error(message))
    }
    console.log(message)
  },
  { isInterceptor: false }
)

consoleInterceptor.isInterceptor = true
console.error = consoleInterceptor
