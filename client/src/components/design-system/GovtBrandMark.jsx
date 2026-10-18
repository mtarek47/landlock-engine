/**
 * GovtBrandMark Component
 * 
 * Official LandLock Engine emblem wrapper component.
 * Uses the supplied /landlock-logo.png source asset.
 */
import BrandLogo from '../BrandLogo'

export default function GovtBrandMark({ size = 'md', className = '', ...props }) {
  return <BrandLogo size={size} className={className} {...props} />
}
