/**
 * components/icons/index.tsx
 * -----------------------------------------------------------------------
 * ชุดไอคอนเส้น (line icon) แบบ SVG inline ล้วนๆ ใช้แทนอิโมจิทั้งหมดในแอป
 * ทุกตัวรับ prop `className` เพื่อกำหนดขนาด/สี (ใช้ currentColor)
 * -----------------------------------------------------------------------
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v9h12v-9" /></svg>
);

export const CompassIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><path d="m14.8 9.2-1.8 4.6-4.6 1.8 1.8-4.6Z" /></svg>
);

export const LocationIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.4" /></svg>
);

export const DocumentIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5H7A.5.5 0 0 1 6.5 20V4a.5.5 0 0 1 .5-.5Z" /><path d="M14 3.5V8h4.2" /></svg>
);

export const SettingsIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="3.2" /><path d="M19.4 13.5a1.8 1.8 0 0 0 .4 2l.1.1a1.8 1.8 0 1 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1.1 1.7v.2a1.8 1.8 0 1 1-3.6 0v-.1a1.8 1.8 0 0 0-1.2-1.7 1.8 1.8 0 0 0-2 .4l-.1.1a1.8 1.8 0 1 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.7-1.1h-.2a1.8 1.8 0 1 1 0-3.6h.1a1.8 1.8 0 0 0 1.7-1.2 1.8 1.8 0 0 0-.4-2l-.1-.1A1.8 1.8 0 1 1 7.3 3l.1.1a1.8 1.8 0 0 0 2 .4h.1A1.8 1.8 0 0 0 10.5 1.8v-.2a1.8 1.8 0 1 1 3.6 0v.1a1.8 1.8 0 0 0 1.1 1.7h.1a1.8 1.8 0 0 0 2-.4l.1-.1a1.8 1.8 0 1 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0-.4 2v.1a1.8 1.8 0 0 0 1.7 1.1h.2a1.8 1.8 0 1 1 0 3.6h-.1a1.8 1.8 0 0 0-1.7 1.1Z" /></svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);

export const BellIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z" /><path d="M10 18.5a2 2 0 0 0 4 0" /></svg>
);

export const SunIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4.5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <line key={a} x1="12" y1="2.5" x2="12" y2="5" transform={`rotate(${a} 12 12)`} />
    ))}
  </svg>
);

export const CloudIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M7 17.5a4 4 0 0 1 .7-7.95A5.5 5.5 0 0 1 18 11a3.5 3.5 0 0 1-.5 6.5H7Z" /></svg>
);

export const CloudSunIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="8" cy="7.5" r="2.6" />
    <path d="M9 16.5a3.6 3.6 0 0 1 .8-7.1A5 5 0 0 1 19 11a3.3 3.3 0 0 1-.4 6.5H9Z" transform="translate(1 1)" />
  </svg>
);

export const CloudRainIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 14.5a4 4 0 0 1 .7-7.95A5.5 5.5 0 0 1 18 8a3.5 3.5 0 0 1-.5 6.5H7Z" />
    <path d="M9 18.5 8 21M13 18.5l-1 2.5M17 18.5l-1 2.5" />
  </svg>
);

export const CloudLightningIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 13.5a4 4 0 0 1 .7-7.95A5.5 5.5 0 0 1 18 7a3.5 3.5 0 0 1-.5 6.5H7Z" />
    <path d="m13 15-2.5 4.5h2.5L11 23" />
  </svg>
);

export const FogIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 9.5h14M4 13h16M6 16.5h12M8 20h8" /></svg>
);

export const WindIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 8h11.5a2.5 2.5 0 1 0-2.1-3.9M3 13h14.5a2.5 2.5 0 1 1-2.1 3.9M3 17.5h8.5" /></svg>
);

export const DropletIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3s6 6.8 6 11a6 6 0 0 1-12 0c0-4.2 6-11 6-11Z" /></svg>
);

export const GaugeIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="13" r="8" /><path d="M12 13 15.5 9M8 13h.01" /></svg>
);

export const EyeIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.6" /></svg>
);

export const StarIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"}>
    <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 17l-5.2 2.8 1-5.9-4.3-4.2 5.9-.8Z" />
  </svg>
);

export const LinkIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9.5 14.5 14.5 9.5" /><path d="M11 7.5 12.6 5.9a3.2 3.2 0 0 1 4.5 4.5L15.5 12" /><path d="M13 16.5 11.4 18.1a3.2 3.2 0 0 1-4.5-4.5L8.5 12" /></svg>
);

export const ImageIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m5 18 4.5-5 3.5 3.5 2.5-3 4.5 4.5" /></svg>
);

export const AlertTriangleIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 4 21.5 20H2.5Z" /><path d="M12 10v4.5M12 17.5h.01" /></svg>
);

export const CoffeeIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4Z" /><path d="M16 10.5h1.5a2.2 2.2 0 0 1 0 4.4H16M8 3.5c-.6.8-.6 1.4 0 2.2M12 3.5c-.6.8-.6 1.4 0 2.2" /></svg>
);

export const UmbrellaIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3C7 3 3 7.3 3 11.5h18C21 7.3 17 3 12 3Z" /><path d="M12 11.5V19a2 2 0 0 1-3.5 1.3M12 3v-.5" /></svg>
);

export const WavesIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M2.5 9c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" /><path d="M2.5 15c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" /></svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m9 5 7 7-7 7" /></svg>
);

export const LockIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);

export const ResetIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" /><path d="M3.5 4.5v4.8h4.8" /></svg>
);

export const MoonIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 6.7 6.7 0 0 0 20 14.5Z" /></svg>
);

/** เลือกไอคอนสภาพอากาศจากรหัส WMO weather_code ของ Open-Meteo */
export function weatherIconFor(code: number) {
  if (code === 0) return SunIcon;
  if (code === 1 || code === 2) return CloudSunIcon;
  if (code === 3) return CloudIcon;
  if (code === 45 || code === 48) return FogIcon;
  if (code >= 51 && code < 70) return CloudRainIcon;
  if (code >= 80 && code < 83) return CloudRainIcon;
  if (code >= 95) return CloudLightningIcon;
  return CloudIcon;
}
