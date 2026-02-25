import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

const skillCategories = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Redux"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "Python", "Django", "GraphQL", "REST APIs"],
  },
  {
    title: "Database & Cloud",
    skills: ["PostgreSQL", "MongoDB", "Redis", "AWS", "Docker", "Firebase"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="relative section-padding">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <SectionHeading title="Skills" subtitle="Technologies I work with to build powerful applications" />
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((cat, i) => (
            <ScrollReveal key={cat.title} delay={i * 0.15}>
              <div className="glass-card p-8 h-full neon-border-animated">
                <h3 className="font-display text-xl font-bold text-primary mb-6">{cat.title}</h3>
                <div className="space-y-3">
                  {cat.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-neon-cyan/50 group-hover:bg-neon-cyan group-hover:shadow-[0_0_8px_hsl(var(--neon-cyan))] transition-all duration-300" />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-sm">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
