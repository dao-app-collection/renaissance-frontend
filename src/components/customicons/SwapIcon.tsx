export default function SwapIcon({
  size = "44",
  color = "#646464",
  className = "",
}: {
  size?: string
  color?: string
  className?: string
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="22" cy="22" r="22" fill={color} />
      <path
        d="M28.8913 29.8281V18.875H25.6969V29.8281H20.9052L27.2941 36.0625L33.6829 29.8281H28.8913ZM17.7108 7.9375L11.3219 14.1719H16.1136V25.125H19.308V14.1719H24.0997L17.7108 7.9375Z"
        fill="#B3B3B3"
      />
    </svg>
  )
}
