import { motion } from "framer-motion";
import { CalendarCheck, Users, Radar, CreditCard } from "lucide-react";
import Card from "../ui/Card";

const STEPS = [
  { icon: CalendarCheck, title: "Book", description: "Pick a service and your preferred date and time." },
  { icon: Users, title: "Choose Professional", description: "We match you with a certified, available expert." },
  { icon: Radar, title: "Track Live", description: "Follow your professional's arrival in real time." },
  { icon: CreditCard, title: "Complete Payment", description: "Pay securely once the service is done." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const HowItWorks = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-fg font-display sm:text-4xl">How It Works</h2>
        <p className="mt-4 text-lg text-fg-muted">Four simple steps to a job well done.</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {STEPS.map((step, index) => (
          <motion.div key={step.title} variants={fadeUp} className="relative">
            <Card className="h-full text-center" padding="lg">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand text-white">
                <step.icon size={26} />
              </span>
              <span className="mt-4 block text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                Step {index + 1}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-fg font-display">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{step.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default HowItWorks;
