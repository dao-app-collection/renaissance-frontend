import { ArrowRightIcon } from "@heroicons/react/outline"
import Link from "next/link"

interface ArtLinkProps {
  href: string
  children: String
}

export default function ArtLink({ href, children }: ArtLinkProps) {
  return (
    <Link href={href}>
      <a className="inline-flex items-center font-medium text-orange-600 2xl:gap-2 gap-2 md:gap-1.5 group tracking-2% md:text-sm 2xl:text-base">
        <span>{children}</span>
        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition transform" />
      </a>
    </Link>
  )
}
