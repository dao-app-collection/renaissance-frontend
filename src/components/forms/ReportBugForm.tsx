import React, { useState } from "react"

import toast from "react-hot-toast"

import useModal from "@hooks/useModal"

export default function ReportBugForm() {
  const { close } = useModal()

  const [text, setText] = useState("")
  const [discord, setDiscord] = useState("")
  const [loading, setLoading] = useState(false)
  const [discordLength, setDiscordLength] = useState(0)
  const [textLength, setTextLength] = useState(0)

  const send = () => {
    if (text) {
      setLoading(true)

      const payload = {
        discord: discord,
        text: text,
        url: window.location.origin + window.location.pathname,
      }

      fetch("/api/discord/reportBug", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        setDiscord("")
        setText("")
        close()
        toast.success("Report submitted!")
      })
    }
  }

  return (
    <form className="w-full max-w-lg">
      <div className="mb-6">
        <div className="">
          <label
            className="block pr-4 mb-1 font-semibold text-gray-500"
            htmlFor="inline-email"
          >
            Discord Username{" "}
            <span className="text-xs italic font-normal">(optional)</span>
          </label>
        </div>
        <div className="">
          <input
            className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-red-500"
            id="inline-email"
            type="text"
            placeholder="username#0"
            onChange={(e) => {
              setDiscord(e.target.value)
              setDiscordLength(e.target.value.length)
            }}
            name="discord"
            value={discord}
            maxLength={256}
          />
        </div>
      </div>
      <div className="mb-6">
        <div className="">
          <label
            className="block pr-4 mb-1 font-semibold text-gray-500"
            htmlFor="inline-message"
          >
            Describe The Bug{" "}
            <span className="relative italic text-red-500 bottom-[8px] right-[8px]">
              *
            </span>
          </label>
        </div>

        <div className="">
          <textarea
            className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-red-500"
            id="inline-message"
            placeholder="Please describe the bug."
            rows={5}
            name="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setTextLength(e.target.value.length)
            }}
            maxLength={2048}
            required
          ></textarea>
          <div className="text-right text-[#808080]">{textLength}/2048</div>
        </div>
      </div>

      <div className="items-center">
        {loading && (
          <>
            <button
              className="flex items-center gap-2 button button-primary"
              type="button"
              disabled
            >
              <svg
                className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Processing...</span>
            </button>
          </>
        )}

        {!loading && (
          <>
            <button
              className="button button-primary hover:button-hover"
              type="button"
              onClick={send}
              data-cy="submit-report-bug-form"
            >
              Submit Report
            </button>
          </>
        )}
      </div>
    </form>
  )
}
