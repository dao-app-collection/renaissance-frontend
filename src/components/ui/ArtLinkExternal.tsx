import { ArrowRightIcon } from "@heroicons/react/outline"
import Link from "next/link"

interface ArtLinkProps {
  href: string
  dataCy?: string
  children: String
}

export default function ArtExternal({ href, children, dataCy }: ArtLinkProps) {
  return (
    <Link href={href}>
      <a
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center font-medium text-orange-600 2xl:gap-2 gap-2 md:gap-1.5 group tracking-2% md:text-sm 2xl:text-base"
        data-cy={dataCy}
      >
        <span>{children}</span>
        <ArrowRightIcon className="w-4 h-4 transition transform group-hover:translate-x-1" />
      </a>
    </Link>
  )
}
