const platforms = [
  "Magento",
  "Shopify",
  "WooCommerce",
  "WordPress",
  "Custom SaaS",
  "AI Development",
  "Software Development",
  "Cloud & Cybersecurity",
  "Website Maintenance",
];
// Duplicated once so the loop is seamless.
const track = [...platforms, ...platforms];

export default function PlatformMarquee() {
  return (
    <div className="overflow-hidden border-t border-line bg-ink py-4">
      <div className="marquee-track">
        {track.map((p, i) => (
          <span
            key={i}
            className="mx-6 whitespace-nowrap font-display text-2xl font-bold text-white/10"
          >
            {p} <span className="text-signal/30">&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
