import { ReactNode } from "react";

interface Props {
  id: string;
  children: ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, children, className = "" }: Props) {
  return (
    <section id={id} className={`py-24 px-6 max-w-6xl mx-auto ${className}`}>
      {children}
    </section>
  );
}
