import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

const techStack = ["React", "Node.js", "TypeScript", "Python", "PostgreSQL", "AWS", "Docker", "MongoDB"];

const AboutSection = () => {
  return (
    <section id="about" className="relative section-padding">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <SectionHeading title="About Me" subtitle="A passionate developer building the future of the web" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <ScrollReveal delay={0.2}>
            <div className="glass-card p-8 space-y-5">
              <p className="text-muted-foreground leading-relaxed">
                I'm Dhivagar, a Full Stack Developer with a passion for creating elegant, 
                high-performance web applications. With expertise spanning frontend to backend, 
                I bring ideas to life through clean code and thoughtful design.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I specialize in building scalable applications using modern JavaScript frameworks, 
                cloud infrastructure, and cutting-edge development practices. Every project I tackle 
                is an opportunity to push boundaries and deliver exceptional user experiences.
              </p>
              <div className="pt-4 flex items-center gap-4">
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple" />
                <span className="text-primary font-mono text-sm">3+ Years of Experience</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="grid grid-cols-2 gap-3">
              {techStack.map((tech) => (
                <div
                  key={tech}
                  className="glass-card-hover p-4 text-center font-mono text-sm text-muted-foreground"
                >
                  {tech}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
