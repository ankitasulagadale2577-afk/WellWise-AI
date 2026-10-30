// Health illustrations as inline SVG (no external images needed).
export function HeroArt() {
  return (
    <svg viewBox="0 0 480 440" role="img" aria-label="A friendly doctor with a stethoscope surrounded by health icons">
      <ellipse cx="240" cy="235" rx="215" ry="195" fill="#E3F5EE" />
      <circle cx="410" cy="80" r="44" fill="#FFEDE5" /><circle cx="64" cy="350" r="32" fill="#FFF6D9" />
      <path d="M130 430c0-84 44-136 110-136s110 52 110 136z" fill="#fff" stroke="#16323A" strokeWidth="3" />
      <path d="M212 296l28 54 28-54z" fill="#2A9D78" />
      <rect x="222" y="262" width="36" height="38" rx="12" fill="#F2C6A0" />
      <circle cx="240" cy="226" r="46" fill="#F2C6A0" />
      <path d="M194 222c0-34 26-54 54-48 22 4 38 22 34 48-10-18-26-26-46-24-18 2-32 8-42 24z" fill="#16323A" />
      <circle cx="224" cy="230" r="3.5" fill="#16323A" /><circle cx="256" cy="230" r="3.5" fill="#16323A" />
      <path d="M226 246q14 12 28 0" stroke="#16323A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M198 304c-16 42 6 74 42 74" stroke="#5B8DEF" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="244" cy="380" r="10" fill="#5B8DEF" />
      <rect x="284" y="340" width="36" height="36" rx="9" fill="#2A9D78" />
      <path d="M302 347v22M291 358h22" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <g>
        <rect x="26" y="86" width="150" height="68" rx="16" fill="#fff" stroke="#E3EAE6" />
        <path d="M40 126h28l10-22 14 40 12-28h28" stroke="#E5484D" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="40" y="104" fontSize="11" fill="#587078">Heart rate</text>
      </g>
      <g>
        <rect x="320" y="170" width="140" height="64" rx="16" fill="#fff" stroke="#E3EAE6" />
        <rect x="336" y="192" width="48" height="20" rx="10" fill="#FF9E7A" transform="rotate(-25 360 202)" />
        <rect x="360" y="188" width="24" height="20" rx="10" fill="#F7C948" transform="rotate(-25 372 198)" />
        <text x="394" y="198" fontSize="11" fill="#587078">Next</text><text x="394" y="214" fontSize="13" fontWeight="700" fill="#16323A">8:00 PM</text>
      </g>
      <g>
        <rect x="40" y="240" width="130" height="62" rx="16" fill="#fff" stroke="#E3EAE6" />
        <circle cx="68" cy="271" r="16" fill="#FDE8E8" /><path d="M68 262v18M59 271h18" stroke="#E5484D" strokeWidth="4" strokeLinecap="round" />
        <text x="94" y="268" fontSize="11" fill="#587078">Emergency</text><text x="94" y="286" fontSize="15" fontWeight="700" fill="#E5484D">112</text>
      </g>
      <g>
        <rect x="300" y="46" width="150" height="56" rx="16" fill="#fff" stroke="#E3EAE6" />
        <text x="316" y="70" fontSize="12" fill="#16323A">नमस्ते · Hello</text><text x="316" y="88" fontSize="12" fill="#16323A">ನಮಸ್ಕಾರ · नमस्कार</text>
      </g>
    </svg>
  )
}
export function PassportArt() {
  return (
    <svg viewBox="0 0 440 360" role="img" aria-label="A phone listening to a voice and producing a doctor summary">
      <rect x="10" y="20" width="420" height="320" rx="36" fill="#FFF6D9" />
      <rect x="60" y="44" width="150" height="280" rx="26" fill="#fff" stroke="#16323A" strokeWidth="4" />
      <rect x="76" y="70" width="118" height="30" rx="12" fill="#E3F5EE" /><rect x="96" y="112" width="98" height="30" rx="12" fill="#F2F5F3" />
      <circle cx="135" cy="276" r="26" fill="#2A9D78" /><rect x="128" y="262" width="14" height="22" rx="7" fill="#fff" />
      <path d="M232 170q20-26 0-52M250 182q32-38 0-76" stroke="#2A9D78" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="276" y="70" width="130" height="190" rx="14" fill="#fff" stroke="#E3EAE6" strokeWidth="2" />
      <rect x="292" y="88" width="64" height="9" rx="4" fill="#16323A" />
      <g fill="#C9D8D3"><rect x="292" y="114" width="98" height="7" rx="3" /><rect x="292" y="132" width="86" height="7" rx="3" /><rect x="292" y="150" width="98" height="7" rx="3" /><rect x="292" y="168" width="70" height="7" rx="3" /></g>
      <circle cx="372" cy="226" r="20" fill="#2A9D78" /><path d="M362 226l7 7 13-14" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
const T = ({ bg, children }) => <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" fill={bg} />{children}</svg>
export const HeartArt = () => <T bg="#FDE8E8"><path d="M80 90C40 62 40 30 62 28c10 0 16 6 18 12 2-6 8-12 18-12 22 2 22 34-18 62z" fill="#E5484D" /><path d="M36 60h26l8-14 12 30 8-16h30" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></T>
export const AppleArt = () => <T bg="#E3F5EE"><path d="M80 38c-18-12-38 0-34 26 3 20 16 36 34 28 18 8 31-8 34-28 4-26-16-38-34-26z" fill="#2A9D78" /><path d="M80 38c0-10 6-18 14-22" stroke="#16323A" strokeWidth="4" fill="none" strokeLinecap="round" /><path d="M86 30c8-6 18-4 20 2-8 4-16 4-20-2z" fill="#1B7A5C" /></T>
export const ShieldArt = () => <T bg="#E7EFFE"><path d="M80 16l36 12v30c0 22-16 38-36 46-20-8-36-24-36-46V28z" fill="#5B8DEF" /><path d="M80 40v36M62 58h36" stroke="#fff" strokeWidth="7" strokeLinecap="round" /></T>
export const KitArt = () => <T bg="#FFF6D9"><rect x="38" y="34" width="84" height="58" rx="12" fill="#E5484D" /><rect x="62" y="22" width="36" height="16" rx="6" fill="none" stroke="#16323A" strokeWidth="5" /><path d="M80 48v30M65 63h30" stroke="#fff" strokeWidth="7" strokeLinecap="round" /></T>
