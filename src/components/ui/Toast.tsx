import toast from "react-hot-toast"
import { DefaultToastOptions } from "react-hot-toast/dist/core/types"

type ErrorOptions = DefaultToastOptions["error"]
type SuccessOptions = DefaultToastOptions["success"]
// same as success but keeping own type for explicitness
type InfoOptions = DefaultToastOptions["blank"]

const errorToastOptions: ErrorOptions = {
  position: "bottom-center",
  duration: 5000,
}

const successToastOptions: SuccessOptions = {
  position: "bottom-center",
  duration: 5000,
}

const infoToastOptions: InfoOptions = {
  position: "top-center",
  duration: 5000,
}

const errorToast = (text: string) => toast.error(text, errorToastOptions)
const successToast = (text: string) => toast.success(text, successToastOptions)
const infoToast = (text: string) => toast(text, infoToastOptions)

// export toast options
export { errorToastOptions, successToastOptions, infoToastOptions }

// export toast functions
export { errorToast, successToast, infoToast }
