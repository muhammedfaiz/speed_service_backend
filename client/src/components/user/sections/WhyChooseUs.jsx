import { motion } from "framer-motion";
import { ShieldCheck, Timer, BadgeDollarSign, HeartHandshake } from "lucide-react";
import Card from "../../ui/Card";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    description: "Every professional is background-checked and certified before joining the platform.",
    color: "text-primary bg-primary-50",
  },
  {
    icon: Timer,
    title: "Fast Response",
    description: "Get matched with an available expert in minutes, not days.",
    color: "text-secondary bg-secondary-50",
  },
  {
    icon: BadgeDollarSign,
    title: "Transparent Pricing",
    description: "Upfront quotes with no hidden fees — know the cost before you book.",
    color: "text-accent-600 bg-accent-50",
  },
  {
    icon: HeartHandshake,
    title: "Satisfaction Guaranteed",
    description: "Not happy with the service? We'll make it right, every time.",
    color: "text-amber-600 bg-amber-50",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const WhyChooseUs = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-fg font-display sm:text-4xl">Why Choose Speed Service</h2>
        <p className="mt-4 text-lg text-fg-muted">
          Built to make booking trustworthy home services effortless.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {REASONS.map((reason) => (
          <motion.div key={reason.title} variants={fadeUp}>
            <Card className="h-full text-center">
              <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${reason.color}`}>
                <reason.icon size={26} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-fg font-display">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{reason.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WhyChooseUs;
