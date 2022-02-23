import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

import { CheckLabel } from "./Display"
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
    <CheckLabel
      color={type === "accept" ? "green" : "red"}
      onClick={onClick}
      className="h-12 border-[3px]"
    >
      {type}
    </CheckLabel>
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
