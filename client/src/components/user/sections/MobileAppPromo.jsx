import { motion } from "framer-motion";
import { Smartphone, Bell, MapPin, Star } from "lucide-react";
import Button from "../../ui/Button";

const MobileAppPromo = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] gradient-brand px-8 py-16 sm:px-16">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white font-display sm:text-4xl">
              Take Speed Service with you
            </h2>
            <p className="mt-4 max-w-md text-lg text-white/85">
              Track your bookings live, chat with your professional, and manage payments — all from your pocket.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="secondary" size="lg" className="!bg-white !text-primary-700" icon={Smartphone}>
                App Store
              </Button>
              <Button variant="outline" size="lg" className="!border-white/40 !bg-white/10 !text-white hover:!bg-white/20" icon={Smartphone}>
                Google Play
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto h-72 w-56 sm:h-80 sm:w-64"
          >
            <div className="absolute inset-0 rounded-[2.5rem] border-4 border-white/30 bg-white/10 backdrop-blur-sm shadow-elevated" />
            <div className="absolute inset-4 flex flex-col gap-3 rounded-[1.8rem] bg-white p-4">
              <div className="flex items-center gap-2 text-primary">
                <MapPin size={16} />
                <div className="h-2 flex-1 rounded-full bg-slate-100" />
              </div>
              <div className="mt-2 h-20 rounded-xl bg-slate-50" />
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                  <Star size={14} fill="currentColor" strokeWidth={0} />
                </span>
                <div className="h-2 flex-1 rounded-full bg-slate-100" />
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-50 text-secondary">
                  <Bell size={14} />
                </span>
                <div className="h-2 flex-1 rounded-full bg-slate-100" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppPromo;
