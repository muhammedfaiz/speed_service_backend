import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import Card from "../../ui/Card";
import Avatar from "../../ui/Avatar";
import Badge from "../../ui/Badge";

// TEMP sample data — no public "list professionals" endpoint exists yet server-side.
// Shape mirrors the Employee model's likely public fields so this is a drop-in
// fetch swap once such an endpoint is added (e.g. userService.getFeaturedProfessionals()).
const SAMPLE_PROFESSIONALS = [
  { id: "sample-1", name: "James Carter", role: "Electrician", rating: 4.9, completedJobs: 214, badge: "Top Rated" },
  { id: "sample-2", name: "Priya Nair", role: "Home Cleaner", rating: 4.8, completedJobs: 187, badge: "Top Rated" },
  { id: "sample-3", name: "Daniel Kim", role: "Plumber", rating: 4.9, completedJobs: 256, badge: "Most Booked" },
  { id: "sample-4", name: "Sarah Lopez", role: "AC Technician", rating: 4.7, completedJobs: 143, badge: "Rising Star" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const FeaturedProfessionals = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-fg font-display sm:text-4xl">Featured Professionals</h2>
          <p className="mt-4 text-lg text-fg-muted">
            Meet some of our highest-rated, most trusted experts.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SAMPLE_PROFESSIONALS.map((pro) => (
            <motion.div key={pro.id} variants={fadeUp}>
              <Card className="text-center">
                <Avatar name={pro.name} size="xl" ring className="mx-auto" />
                <h3 className="mt-4 text-base font-semibold text-fg font-display">{pro.name}</h3>
                <p className="text-sm text-fg-muted">{pro.role}</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-amber-500">
                  <Star size={15} fill="currentColor" strokeWidth={0} />
                  <span className="text-sm font-medium text-fg">{pro.rating}</span>
                  <span className="text-xs text-fg-subtle">({pro.completedJobs} jobs)</span>
                </div>
                <Badge variant="accent" icon={BadgeCheck} className="mt-4">
                  {pro.badge}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProfessionals;
