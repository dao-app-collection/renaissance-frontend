import React from "react"

import CheckIcon from "@components/customicons/CheckIcon"

import Spinner from "./Spinner"

interface PageHeadingProps {
  children: React.ReactNode
}

export type WithTailwind = React.HTMLAttributes<HTMLDivElement>

export const Divide = ({
  className,
}: { className?: string } & WithTailwind) => (
  <div className={`w-full my-6 mt-5 bg-dark-500 h-[4px] ${className}`} />
)

export const Label = ({
  children,
  classNames = "",
}: {
  children: React.ReactNode
  classNames?: string
} & WithTailwind) => (
  <div className={`font-bold text-dark-200 text-lg ${classNames}`}>
    {children}
  </div>
)
export const Stat = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
} & WithTailwind) => (
  <div className={`text-xl font-bold text-white ${className}`}>{children}</div>
)

export const CheckLabel = ({
  children,
  color = "green",
  isLoading = false,
  size,
  ...props
}: {
  color?: "red" | "green"
  isLoading?: boolean
  size?: number
  children: React.ReactNode
} & WithTailwind) => {
  const { className, ...rest } = props
  return (
    <div
      className={`rounded-xl text-lg border-solid px-4 ${
        color === "green" ? "border-accents-green" : "border-accents-red"
      } cursor-pointer uppercase text-white bg-scheme-bg font-bold hover:bg-scheme-600 ${className}`}
      {...rest}
    >
      <div className="flex items-center justify-center h-full space-x-2">
        <div>
          {isLoading ? (
            <Spinner />
          ) : (
            <CheckIcon color={color} size={size?.toString()} />
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

function PageHeading({ children }: PageHeadingProps) {
  return (
    <section className="w-full sm:flex space-y-8 sm:space-y-0">
      {children}
    </section>
  )
}

PageHeading.Title = function PageHeadingTitle({
  children,
}: {
  children: string
}) {
  return (
    <p className="items-center text-5xl font-semibold text-white gap-2 sm:text-5xl tracking-2%">
      {children}
    </p>
  )
}

PageHeading.Subtitle = function PageHeadingSubTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <p className="mt-3 font-medium text-md text-dark-100 tracking-2%">
      {children}
    </p>
  )
}

interface StatProps {
  title: string
  subtitle: React.ReactNode
}

PageHeading.Stat = function PageHeadingStat({ title, subtitle }: StatProps) {
  return (
    <div className="sm:text-right">
      <div className="text-sm font-medium text-white">{title}</div>
      <div className="mt-1  text-xl font-medium text-white 2xl:text-xl">
        {subtitle}
      </div>
    </div>
  )
}

PageHeading.Content = function Content({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="inline-flex flex-wrap items-baseline justify-items-start xl:gap-12 gap-6 md:flex-nowrap">
      {children}
    </div>
  )
}

export default PageHeading
