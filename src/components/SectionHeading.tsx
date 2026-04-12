interface Props {
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ label, title, subtitle }: Props) {
  return (
    <div className="mb-16">
      <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#7c6af7] mb-3">
        {label}
      </span>
      <h2 className="text-4xl sm:text-5xl font-bold text-[#e2e8f0] leading-tight mb-4">{title}</h2>
      {subtitle && <p className="text-[#6b7280] text-lg max-w-xl">{subtitle}</p>}
    </div>
  );
}
