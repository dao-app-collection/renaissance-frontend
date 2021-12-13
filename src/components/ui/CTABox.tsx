function CTABox({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`px-6 py-5 md:py-5 bg-dark-1500 sm:py-6 sm:px-10 rounded-xl ${className}`}
    >
      {children}
    </div>
  )
}

export default CTABox
