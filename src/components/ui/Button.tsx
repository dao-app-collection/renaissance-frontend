import Spinner from "./Spinner"

function Button({
  className,
  children,
  loading,
  disabled,
  onClick,
}: {
  className?: string
  children?: React.ReactNode
  loading?: boolean
  disabled?: boolean
  onClick?: (event: any) => void
}) {
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      type="submit"
      className={`flex items-center text-center button gap-3 button-primary button-hover disabled:opacity-75 ${className}`}
    >
      {loading && <Spinner />}

      <span>{children}</span>
    </button>
  )
}

export default Button
