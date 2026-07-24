import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Users, Clock3, ShieldCheck, Wrench, Home as HomeIcon, Sparkles } from "lucide-react";
import Button from "../../ui/Button";
import Card from "../../ui/Card";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute top-32 -right-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl animate-blob-delay" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-blob" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700"
          >
            <Sparkles size={15} /> Trusted by thousands every month
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-4xl font-bold leading-tight tracking-tight text-fg font-display sm:text-5xl lg:text-6xl"
          >
            Home Services{" "}
            <span className="text-gradient-brand">You Can Trust</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-lg text-lg leading-relaxed text-fg-muted">
            Book verified electricians, plumbers, cleaners, AC technicians and more in minutes.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg" icon={ShieldCheck} onClick={() => navigate("/services")}>
              Book a Service
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/employee/application")}>
              Become a Professional
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
              ))}
              <span className="ml-2 text-sm font-medium text-fg">5.0 rating</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <p className="text-sm font-medium text-fg-muted">5000+ happy customers</p>
          </motion.div>
        </motion.div>

        <div className="relative hidden h-[28rem] lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-80 w-80 items-center justify-center rounded-[2.5rem] bg-white shadow-elevated"
            >
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full gradient-brand">
                <HomeIcon size={96} className="text-white" strokeWidth={1.5} />
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -right-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-white shadow-elevated"
                >
                  <Wrench size={28} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
            transition={{ opacity: { delay: 0.6 }, x: { delay: 0.6 }, y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
            className="absolute left-0 top-6"
          >
            <Card padding="sm" className="flex items-center gap-3 !rounded-2xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Star size={20} fill="currentColor" strokeWidth={0} />
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">5000+ Happy Customers</p>
                <p className="text-xs text-fg-muted">★★★★★ rated service</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
            transition={{ opacity: { delay: 0.8 }, x: { delay: 0.8 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
            className="absolute right-0 top-40"
          >
            <Card padding="sm" className="flex items-center gap-3 !rounded-2xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary">
                <Clock3 size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">15 Minute Response</p>
                <p className="text-xs text-fg-muted">Fast dispatch, every time</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -10, 0] }}
            transition={{ opacity: { delay: 1 }, y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" } }}
            className="absolute bottom-2 left-10"
          >
            <Card padding="sm" className="flex items-center gap-3 !rounded-2xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <Users size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">Certified Professionals</p>
                <p className="text-xs text-fg-muted">Background-verified experts</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
