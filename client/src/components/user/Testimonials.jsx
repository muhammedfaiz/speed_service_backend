import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Card from "../ui/Card";
import Avatar from "../ui/Avatar";

const TESTIMONIALS = [
  {
    name: "Alice Johnson",
    role: "Verified Customer",
    feedback: "Speed Service made my life so much easier! Highly recommended.",
    rating: 5,
  },
  {
    name: "Mark Thompson",
    role: "Verified Customer",
    feedback: "Very professional and on time. Great experience overall.",
    rating: 5,
  },
  {
    name: "Bob Brown",
    role: "Verified Customer",
    feedback: "Friendly and attentive staff. Highly recommend!",
    rating: 4,
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

const Testimonials = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-fg font-display sm:text-4xl">What Our Clients Say</h2>
          <p className="mt-4 text-lg text-fg-muted">Real experiences from real customers.</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div key={testimonial.name} variants={fadeUp}>
              <Card className="h-full">
                <Quote className="text-primary-100" size={32} fill="currentColor" strokeWidth={0} />
                <p className="mt-3 text-fg-muted leading-relaxed">&ldquo;{testimonial.feedback}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar name={testimonial.name} size="md" />
                  <div>
                    <p className="font-semibold text-fg">{testimonial.name}</p>
                    <p className="text-xs text-fg-muted">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
