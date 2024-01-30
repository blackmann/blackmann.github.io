import clsx from 'clsx'
import React from 'react'

interface Props extends React.PropsWithChildren {
  title: string
  subtitle: string
}

function Fold({ children, subtitle, title }: Props) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div
      className={clsx(
        'dark:(bg-neutral-900 border-neutral-700) group mt-2 rounded-lg border border-zinc-200 bg-zinc-50',
        {
          expanded,
        },
      )}>
      <header
        className="flex cursor-pointer gap-4 p-2"
        onClick={() => setExpanded(!expanded)}>
        <div>
          <div className="flex size-8 -rotate-90 select-none items-center justify-center rounded-full transition-[background] duration-200 group-hover:bg-zinc-200 group-[.expanded]:rotate-0 dark:group-hover:bg-neutral-700">
            <span className="i-lucide-chevron-down text-secondary"></span>
          </div>
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-secondary">{subtitle}</div>
        </div>
      </header>

      <div className="hidden px-4 pb-4 pt-0 group-[.expanded]:block">
        {children}
      </div>
    </div>
  )
}

export default Fold
