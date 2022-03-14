import { errorToast } from "@components/ui/Toast"

// List of error messages we wish to intercept
const interceptedConsoleMessages = ["Wrong network, please switch to mainnet"]

interface IConsoleInterceptor {
  (message: string): void
  isInterceptor: boolean
}
let consoleInterceptor: IConsoleInterceptor = Object.assign(
  (message: string) => {
    if (interceptedConsoleMessages.includes(message)) {
      errorToast(message)
    }
    console.log(message)
  },
  { isInterceptor: false }
)

consoleInterceptor.isInterceptor = true
console.error = consoleInterceptor
