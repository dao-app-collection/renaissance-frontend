import { useEffect } from "react"

import toast, { Toaster, useToasterStore } from "react-hot-toast"
import { useSelector } from "react-redux"
import "@helper/consoleInterceptor"

// A component that displays error messages
function Messages() {
  const TOAST_LIMIT = 3
  const TOAST_DURATION = 3000
  const messages = useSelector((state: any) => state.messages)
  const { toasts } = useToasterStore()

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit?
      .forEach((t) => toast.dismiss(t.id)) // Dismiss – Use toast.remove(t.id) for no exit animation
  }, [toasts])

  useEffect(() => {
    if (!messages.items.length) return
    const message = messages.items[messages.items.length - 1]
    for (const toast in toasts) {
      if (toasts[toast].message == message.text) return
    }

    let text =
      message.text.length > 70
        ? message.text.slice(0, 70) + "..."
        : message.text

    if (message.severity == "error") {
      toast.error(text, {
        duration: TOAST_DURATION,
        position: "bottom-center",
        iconTheme: {
          primary: "#CE2A4A",
          secondary: "#fff",
        },
      })
    } else if (message.severity == "success") {
      toast.success(text, {
        duration: TOAST_DURATION,
        position: "bottom-center",
        iconTheme: {
          primary: "#535353",
          secondary: "#fff",
        },
      })
    } else if (message.severity == "info") {
      toast.success(text, {
        duration: 6000,
        position: "top-center",

        icon: "🔱",
      })
    }
  }, [messages])

  return <Toaster />
}

export default Messages
