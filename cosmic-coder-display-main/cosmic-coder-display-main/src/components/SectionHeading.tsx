const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-16">
    <h2 className="text-4xl md:text-5xl font-bold font-display text-gradient-cyan mb-4">{title}</h2>
    {subtitle && <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{subtitle}</p>}
    <div className="mt-6 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple" />
  </div>
);

export default SectionHeading;
