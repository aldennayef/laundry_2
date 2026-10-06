import type { SVGProps } from 'react'

/**
 * Set ikon SVG garis (mirip Lucide/Heroicons). Dipakai menggantikan emoji
 * agar tampilan terasa premium dan konsisten (sesuai guideline UI/UX skill).
 */
export type IconName =
  | 'truck'
  | 'clock'
  | 'sparkles'
  | 'star'
  | 'ticket'
  | 'message'
  | 'check'
  | 'arrowRight'
  | 'arrowUpRight'
  | 'shield'
  | 'leaf'
  | 'mapPin'
  | 'phone'
  | 'mail'
  | 'menu'
  | 'close'
  | 'quote'
  | 'shirt'
  | 'sparkle'
  | 'chevronDown'
  | 'home'
  | 'search'
  | 'bell'
  | 'logout'
  | 'user'
  | 'layers'

const PATHS: Record<IconName, { d: string; fill?: boolean }[]> = {
  truck: [
    { d: 'M3 7h11v9H3z' },
    { d: 'M14 10h4l3 3v3h-7z' },
    { d: 'M7.5 19a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z' },
    { d: 'M17.5 19a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z' },
  ],
  clock: [
    { d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z' },
    { d: 'M12 7v5l3 2' },
  ],
  sparkles: [
    { d: 'M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z' },
    { d: 'M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z' },
  ],
  star: [
    { d: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z' },
  ],
  ticket: [
    { d: 'M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z' },
    { d: 'M14 6v12' },
  ],
  message: [
    { d: 'M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z' },
  ],
  check: [{ d: 'M5 12.5l4.5 4.5L19 7' }],
  arrowRight: [
    { d: 'M4 12h16' },
    { d: 'M14 6l6 6-6 6' },
  ],
  arrowUpRight: [
    { d: 'M7 17L17 7' },
    { d: 'M8 7h9v9' },
  ],
  shield: [
    { d: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z' },
    { d: 'M9 12l2 2 4-4' },
  ],
  leaf: [
    { d: 'M5 19c0-7 5-13 14-13 0 8-5 13-11 13' },
    { d: 'M5 19c1-4 4-7 8-8' },
  ],
  mapPin: [
    { d: 'M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z' },
    { d: 'M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z' },
  ],
  phone: [
    { d: 'M6 3h3l1.5 4.5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2L20 14v3a2 2 0 0 1-2 2A15 15 0 0 1 4 5a2 2 0 0 1 2-2Z' },
  ],
  mail: [
    { d: 'M4 6h16v12H4z' },
    { d: 'M4 7l8 6 8-6' },
  ],
  menu: [{ d: 'M4 7h16M4 12h16M4 17h16' }],
  close: [{ d: 'M6 6l12 12M18 6L6 18' }],
  quote: [
    { d: 'M9 7H5v6h4v4H5' },
    { d: 'M19 7h-4v6h4v4h-4' },
  ],
  shirt: [
    { d: 'M9 4l3 2 3-2 4 2-2 4-1-.5V20H8V9.5L7 10 5 6l4-2Z' },
  ],
  sparkle: [
    { d: 'M12 4l1.8 4.9L18.5 11l-4.7 2.1L12 18l-1.8-4.9L5.5 11l4.7-2.1L12 4Z' },
  ],
  chevronDown: [{ d: 'M6 9l6 6 6-6' }],
  home: [
    { d: 'M4 10.5 12 4l8 6.5' },
    { d: 'M6 10v9h12v-9' },
    { d: 'M10 19v-5h4v5' },
  ],
  search: [
    { d: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z' },
    { d: 'M20 20l-3.5-3.5' },
  ],
  bell: [
    { d: 'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z' },
    { d: 'M10.5 19a1.8 1.8 0 0 0 3 0' },
  ],
  logout: [
    { d: 'M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3' },
    { d: 'M15 8l4 4-4 4' },
    { d: 'M19 12H9' },
  ],
  user: [
    { d: 'M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z' },
    { d: 'M5 20a7 7 0 0 1 14 0' },
  ],
  layers: [
    { d: 'M12 3l9 5-9 5-9-5 9-5Z' },
    { d: 'M3 13l9 5 9-5' },
  ],
}

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 24, className = '', ...props }: IconProps) {
  const paths = PATHS[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {paths.map((p, i) => (
        <path key={i} d={p.d} />
      ))}
    </svg>
  )
}
