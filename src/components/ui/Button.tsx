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
      className={`flex items-center text-center button gap-3 button-primary button-hover disabled:opacity-75 bg-blue-600 px-4 py-4 my-1 text-white font-semibold text-md rounded-md ${className}`}
    >
      {loading && <Spinner />}

      <span>{children}</span>
    </button>
  )
}

export default Button
