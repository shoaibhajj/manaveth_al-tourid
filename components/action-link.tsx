'use client'

import Link from 'next/link'
import { useContent, useLocale } from './locale-provider'

type ActionLinkProps = {
  /** When missing, the control keeps its look but is disabled and not clickable. */
  href?: string
  external?: boolean
  className: string
  /** Hover and motion styles that only apply while the link is active. */
  activeClassName?: string
  children: React.ReactNode
}

export function ActionLink({ href, external, className, activeClassName = '', children }: ActionLinkProps) {
  const { t, localize } = useLocale()
  const { site } = useContent()

  if (!href) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title={t(site.ui.unavailableHint)}
        className={`${className} cursor-not-allowed select-none opacity-55`}
      >
        {children}
      </span>
    )
  }

  const classes = `${className} ${activeClassName}`
  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={localize(href)} className={classes}>
      {children}
    </Link>
  )
}
