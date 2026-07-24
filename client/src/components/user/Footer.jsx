import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, MessageCircle, Camera, Briefcase, Send, Zap } from "lucide-react";
import Button from "../ui/Button";
import { showSuccessToast } from "../ui/Toast";

const FOOTER_LINKS = {
  Company: [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "About Us", to: "/" },
  ],
  Support: [
    { label: "Contact Us", to: "/" },
    { label: "Help Center", to: "/" },
    { label: "Bookings", to: "/bookings" },
  ],
  Careers: [
    { label: "Become a Professional", to: "/employee/application" },
    { label: "Employee Login", to: "/employee/login" },
  ],
};

const SOCIALS = [
  { icon: Globe, href: "#", label: "Facebook" },
  { icon: MessageCircle, href: "#", label: "Twitter" },
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Briefcase, href: "#", label: "LinkedIn" },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  // No newsletter backend endpoint exists yet — this only confirms intent client-side.
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showSuccessToast("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <footer className="mt-20 bg-fg px-4 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white font-display">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
              <Zap size={18} className="text-white" fill="currentColor" />
            </span>
            Speed Service
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Book verified, background-checked professionals for every home service — fast, transparent, and reliable.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">{heading}</h4>
            <ul className="mt-4 space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Newsletter</h4>
          <p className="mt-4 text-sm text-slate-400">Get updates on new services and offers.</p>
          <form onSubmit={handleSubscribe} className="mt-4 flex items-center gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 shadow-soft outline-none focus:border-primary/60"
            />
            <Button type="submit" size="sm" icon={Send} className="!px-3.5" aria-label="Subscribe" />
          </form>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 py-6 text-sm text-slate-400 sm:flex-row">
        <p>© {new Date().getFullYear()} Speed Service. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="" className="transition-colors hover:text-white">
            Privacy Policy
          </Link>
          <Link to="" className="transition-colors hover:text-white">
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
