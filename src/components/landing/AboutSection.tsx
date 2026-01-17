import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Camera, Brain, FileText, Sprout } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Upload Photo",
    description: "Take a clear photo of your plant's affected area",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced AI analyzes the image for disease patterns",
  },
  {
    icon: FileText,
    title: "Get Diagnosis",
    description: "Receive detailed information about the detected disease",
  },
  {
    icon: Sprout,
    title: "Take Action",
    description: "Follow recommended treatments to restore plant health",
  },
];

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            About PlantGuard
          </span>
          <h2 className="section-title">
            Advanced Technology for Healthier Plants
          </h2>
          <p className="section-subtitle mx-auto">
            PlantGuard combines cutting-edge artificial intelligence with deep
            agricultural expertise to help farmers, gardeners, and plant
            enthusiasts identify and address plant diseases quickly and accurately.
          </p>
        </motion.div>

        {/* How It Works */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="relative bg-card rounded-xl p-6 border border-border shadow-soft card-hover text-center"
            >
              {/* Step Number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {index + 1}
              </div>

              <div className="w-14 h-14 rounded-xl bg-accent mx-auto mb-4 flex items-center justify-center">
                <step.icon className="w-7 h-7 text-primary" />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "50+", label: "Plant Diseases" },
            { value: "95%", label: "Accuracy Rate" },
            { value: "10K+", label: "Plants Analyzed" },
            { value: "24/7", label: "Availability" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
