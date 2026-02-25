import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

const projects = [
  {
    title: "AI Dashboard Platform",
    description: "Real-time analytics dashboard with AI-powered insights, built for enterprise-scale data visualization.",
    tags: ["React", "Python", "TensorFlow", "AWS"],
  },
  {
    title: "E-Commerce Ecosystem",
    description: "Full-stack marketplace with payment processing, inventory management, and recommendation engine.",
    tags: ["Next.js", "Node.js", "Stripe", "PostgreSQL"],
  },
  {
    title: "DevOps Automation Suite",
    description: "CI/CD pipeline manager with container orchestration and real-time monitoring capabilities.",
    tags: ["Docker", "Kubernetes", "Go", "Grafana"],
  },
  {
    title: "Social Media Analytics",
    description: "Cross-platform social media tracker with sentiment analysis and automated reporting.",
    tags: ["React", "GraphQL", "MongoDB", "NLP"],
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative section-padding">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <SectionHeading title="Projects" subtitle="Selected work that showcases my expertise" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.12}>
              <div className="glass-card-hover neon-border-animated p-8 h-full flex flex-col cursor-pointer group">
                <div className="w-full h-40 rounded-lg bg-muted/30 mb-6 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 flex items-center justify-center">
                    <span className="text-3xl font-display font-bold text-muted-foreground/20 group-hover:text-primary/30 transition-colors duration-500">
                      {project.title.split(" ").map(w => w[0]).join("")}
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-mono border border-border text-muted-foreground bg-muted/30"
                    >
                      {tag}
                    </span>
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

export default ProjectsSection;
