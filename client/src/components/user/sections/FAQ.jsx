import { motion } from "framer-motion";
import Accordion from "../../ui/Accordion";

const FAQS = [
  {
    id: "faq-1",
    question: "How do I book a service?",
    answer:
      "Browse our services, pick the one you need, choose a date and time, and confirm your booking — a verified professional will be assigned right away.",
  },
  {
    id: "faq-2",
    question: "Are the professionals background-checked?",
    answer:
      "Yes. Every professional on Speed Service goes through identity verification and background checks before they can accept bookings.",
  },
  {
    id: "faq-3",
    question: "What if I need to cancel or reschedule?",
    answer:
      "You can cancel or reschedule directly from your bookings page up until the professional is on the way, with no hassle.",
  },
  {
    id: "faq-4",
    question: "How does pricing work?",
    answer:
      "Every service shows an upfront starting price before you book, so there are never any surprise charges.",
  },
  {
    id: "faq-5",
    question: "How can I become a professional on Speed Service?",
    answer:
      "Tap \"Become a Professional\", submit your details and documents, and our team will review your application within a few days.",
  },
];

const FaqSection = () => {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-fg font-display sm:text-4xl">Frequently Asked Questions</h2>
        <p className="mt-4 text-lg text-fg-muted">Everything you need to know before you book.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-12"
      >
        <Accordion items={FAQS} />
      </motion.div>
    </section>
  );
};

export default FaqSection;
