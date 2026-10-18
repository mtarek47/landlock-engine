import Breadcrumbs from './Breadcrumbs'

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  badge,
  actions,
  meta,
  children,
  className = '',
}) {
  return (
    <header className={`font-bangla space-y-3 pb-4 border-b border-govt-border/70 ${className}`}>
      {Array.isArray(breadcrumbs) ? (
        <Breadcrumbs items={breadcrumbs} />
      ) : (
        breadcrumbs
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-govt-green tracking-tight">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-normal">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {meta && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-gray-600">
          {meta}
        </div>
      )}

      {children && <div className="pt-2">{children}</div>}
    </header>
  )
}
