import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

const credentials = [
  { year: "2024", title: "AWS Solutions Architect", org: "Amazon Web Services", type: "certification" },
  { year: "2023", title: "B.Tech in Computer Science", org: "University of Technology", type: "education" },
  { year: "2023", title: "Meta Frontend Developer", org: "Meta / Coursera", type: "certification" },
  { year: "2022", title: "Full Stack Web Development", org: "freeCodeCamp", type: "certification" },
  { year: "2021", title: "Higher Secondary Education", org: "Central Board of Education", type: "education" },
];

const CredentialsSection = () => {
  return (
    <section id="credentials" className="relative section-padding">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <SectionHeading title="Credentials" subtitle="My educational journey and professional certifications" />
        </ScrollReveal>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan/50 via-neon-purple/50 to-transparent" />

          <div className="space-y-12">
            {credentials.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className={`relative flex items-start gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary neon-glow-cyan z-10" />

                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-[45%] ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="glass-card-hover p-6">
                      <span className="text-primary font-mono text-xs tracking-wider">{item.year}</span>
                      <h3 className="font-display text-lg font-bold text-foreground mt-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{item.org}</p>
                      <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-mono border border-border text-muted-foreground capitalize">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CredentialsSection;
