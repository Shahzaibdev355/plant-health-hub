import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Eye, Globe, Users } from "lucide-react";

export const MissionVisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="mission" className="section bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-background text-foreground text-sm font-medium mb-4">
            Our Purpose
          </span>
          <h2 className="section-title">Mission & Vision</h2>
          <p className="section-subtitle mx-auto">
            Committed to sustainable agriculture and food security through
            innovative technology solutions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-card"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 mb-6 flex items-center justify-center">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Our Mission
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              To empower farmers and agricultural communities worldwide with
              accessible, accurate, and affordable plant disease detection
              technology. We believe that early disease identification is crucial
              for protecting crop yields and ensuring food security.
            </p>
            <ul className="space-y-3">
              {[
                "Democratize access to agricultural AI technology",
                "Reduce crop losses through early detection",
                "Support sustainable farming practices",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-card"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 mb-6 flex items-center justify-center">
              <Eye className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Our Vision
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              To create a world where no crop is lost to preventable diseases. We
              envision a future where every farmer, regardless of their resources
              or location, has access to advanced plant health monitoring tools
              that help them protect their livelihoods.
            </p>
            <ul className="space-y-3">
              {[
                "Global reach with local impact",
                "Continuous innovation in plant health AI",
                "Building resilient agricultural communities",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Globe, title: "Sustainability", desc: "Eco-friendly solutions" },
            { icon: Users, title: "Accessibility", desc: "Technology for all" },
            { icon: Target, title: "Accuracy", desc: "Reliable results" },
            { icon: Eye, title: "Transparency", desc: "Open and honest" },
          ].map((value) => (
            <div
              key={value.title}
              className="text-center p-6 rounded-xl bg-background border border-border"
            >
              <value.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-1">
                {value.title}
              </h4>
              <p className="text-sm text-muted-foreground">{value.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
