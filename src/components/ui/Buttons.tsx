import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

import CheckIcon from "@components/customicons/CheckIcon"

import Spinner from "./Spinner"

export default function Button({
  className,
  children,
  loading,
  disabled,
  onClick,
  ...props
}: {
  className?: string
  children?: React.ReactNode
  loading?: boolean
  disabled?: boolean
  onClick?: (event: any) => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      type="submit"
      className={`flex items-center justify-center text-center button gap-3 button-primary button-hover disabled:opacity-75 bg-blue-500 px-4 py-3 my-1 text-white font-semibold text-md rounded-md ${className}`}
      {...props}
    >
      {loading && <Spinner />}

      <span>{children}</span>
    </button>
  )
}

export const AuctionButton = ({
  type,
  onClick,
  loading = false,
}: {
  type: "accept" | "reject"
  onClick: VoidFunction
  loading?: boolean
}) => {
  return (
    <div
      onClick={onClick}
      className={`h-12 rounded-xl border-solid border-[3px] px-4 ${
        type === "accept" ? "border-accents-green" : "border-accents-red"
      } cursor-pointer uppercase text-white bg-scheme-bg font-bold hover:bg-scheme-600`}
    >
      <div className="flex items-center justify-center h-full text-lg space-x-2">
        <div>
          {loading ? (
            <Spinner />
          ) : (
            <CheckIcon type={type === "accept" ? "green" : "red"} />
          )}
        </div>
        <div>{type}</div>
      </div>
    </div>
  )
}

export const MaxButton = ({
  onClick,
  ...props
}: {
  onClick: VoidFunction
  styles?: string
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 font-bold border text-accents-blue border-accents-blue bg-scheme-200 rounded-md whitespace-nowrap ${props?.styles}`}
      {...props}
    >
      Max amount
    </button>
  )
}
