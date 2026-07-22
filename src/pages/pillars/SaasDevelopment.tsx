import PillarPage from "../../components/PillarPage";

export default function SaasDevelopment() {
  return (
    <PillarPage
      path="/saas-development"
      eyebrow="SaaS Development"
      headline="SaaS platforms built to scale from day one"
      subhead="Multi-tenant architecture, subscription billing, and the infrastructure to grow — built right the first time."
      intro="Building a SaaS product means getting the fundamentals right early: authentication, billing, multi-tenancy, and an architecture that won't need a rewrite once you have real customers. Interquark's vetted developers have shipped production SaaS platforms across industries, from early-stage MVPs to systems handling real subscription revenue."
      sections={[
        { title: "Multi-tenant architecture", desc: "Data isolation and scalability built in from the start, not retrofitted later." },
        { title: "Subscription billing", desc: "Stripe, PayPal, or your preferred gateway, with tiered plans, trials, and upgrades handled correctly." },
        { title: "User authentication & roles", desc: "Secure sign-up, role-based access, and team/organization structures where needed." },
        { title: "API-first design", desc: "Built so your platform can integrate with other tools from day one." },
      ]}
      faqs={[
        {
          q: "How long does a SaaS MVP typically take?",
          a: "Depends on scope, but most focused MVPs are delivered in weeks, not months — we scope tightly with you first.",
        },
        {
          q: "Do you handle ongoing maintenance after launch?",
          a: "Yes — we offer retainer-based support for security updates, monitoring, and continued feature development.",
        },
      ]}
      metaTitle="SaaS Development Services | Interquark"
      metaDescription="SaaS platform development — multi-tenant architecture, subscription billing, and scalable infrastructure, built by vetted developers."
    />
  );
}
