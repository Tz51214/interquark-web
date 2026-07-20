export interface TierOption {
  price: number;
  features: string[];
}

export interface CatalogItem {
  id: string;
  sku: string;
  name: string;
  badge: "flagship" | null;
  desc: string;
  tiers: Record<string, TierOption>;
}

export type CatalogSection =
  | "webdev"
  | "security"
  | "migrations"
  | "growth"
  | "saas"
  | "retainer"
  | "ai"
  | "software"
  | "cloud"
  | "maintenance";

export const catalog: Record<CatalogSection, CatalogItem[]> = {
  webdev: [
    {
      id: "wp-01",
      sku: "ZWS-WP-01",
      name: "WordPress Business Site",
      badge: null,
      desc: "6–8 page brochure site, mobile-responsive, contact forms, basic SEO. Clean and fast.",
      tiers: {
        "Standard (7 days)": {
          price: 300,
          features: [
            "6–8 custom-designed pages",
            "Mobile-responsive layout",
            "Contact form",
            "Basic on-page SEO",
            "7-day delivery",
          ],
        },
        "Rush (3 days)": {
          price: 450,
          features: [
            "6–8 custom-designed pages",
            "Mobile-responsive layout",
            "Contact form + enquiry form",
            "Basic on-page SEO",
            "3-day priority delivery",
            "One extra revision round",
          ],
        },
      },
    },
    {
      id: "wc-01",
      sku: "ZWS-WC-01",
      name: "WooCommerce Store Build",
      badge: null,
      desc: "Full store setup: catalog, payments, shipping rules, and a theme customized to your brand.",
      tiers: {
        Standard: {
          price: 600,
          features: [
            "Product catalog setup",
            "Stripe/PayPal integration",
            "Shipping zones and rules",
            "Pre-built theme, brand colors applied",
            "Order management setup",
          ],
        },
        "With custom theme dev": {
          price: 950,
          features: [
            "Product catalog setup",
            "Stripe/PayPal integration",
            "Shipping zones and rules",
            "Fully custom-coded theme",
            "Order management setup",
            "Bespoke homepage layout",
          ],
        },
      },
    },
    {
      id: "sh-01",
      sku: "ZWS-SH-01",
      name: "Shopify Store Build",
      badge: null,
      desc: "Store setup, product catalog, payment gateway, and app integrations for dropshipping or D2C.",
      tiers: {
        "Standard theme": {
          price: 800,
          features: [
            "Shopify store setup",
            "Product catalog and collections",
            "Payment gateway configuration",
            "Pre-built theme customization",
            "Basic app integrations",
          ],
        },
        "Custom theme build": {
          price: 1400,
          features: [
            "Shopify store setup",
            "Product catalog and collections",
            "Payment gateway configuration",
            "Fully custom theme design and build",
            "Advanced app integrations (dropshipping/D2C)",
            "Checkout optimization",
          ],
        },
      },
    },
    {
      id: "mg-01",
      sku: "ZWS-MG-01",
      name: "Magento 2 / Adobe Commerce Build",
      badge: "flagship",
      desc: "Full enterprise build: custom theme, payment gateways (Braintree, Stripe, JazzCash, Easypaisa), AWS infra.",
      tiers: {
        "Starter store": {
          price: 2500,
          features: [
            "Magento 2 setup on AWS",
            "Single payment gateway integration",
            "Semi-custom theme",
            "Core catalog and category structure",
            "Basic performance configuration",
          ],
        },
        "Full enterprise build": {
          price: 6000,
          features: [
            "Magento 2 setup on AWS",
            "Multi-gateway integration (Braintree, Stripe, JazzCash, Easypaisa)",
            "Fully custom theme",
            "Advanced catalog architecture",
            "Performance tuning for scale",
            "Admin training handover",
          ],
        },
      },
    },
  ],
  security: [
    {
      id: "sec-01",
      sku: "ZWS-SEC-01",
      name: "Magecart Remediation & Audit",
      badge: "flagship",
      desc: "Full skimmer detection, malicious code removal, checkout integrity check, and hardening report.",
      tiers: {
        "Standard audit": {
          price: 250,
          features: [
            "Skimmer/Magecart detection scan",
            "Malicious code removal",
            "Checkout integrity check",
            "Written hardening report",
          ],
        },
        "Emergency (24–48hr)": {
          price: 450,
          features: [
            "Skimmer/Magecart detection scan",
            "Malicious code removal",
            "Checkout integrity check",
            "Written hardening report",
            "24–48hr priority turnaround",
            "Post-cleanup monitoring setup",
          ],
        },
      },
    },
    {
      id: "sec-02",
      sku: "ZWS-SEC-02",
      name: "Malware Removal & Hardening",
      badge: null,
      desc: "Clean infected core files and plugins, patch vulnerabilities, and lock down admin access.",
      tiers: {
        Standard: {
          price: 200,
          features: [
            "Core and plugin file scan",
            "Malware and backdoor removal",
            "Known vulnerability patching",
            "Admin access lockdown",
          ],
        },
        "With ongoing monitoring": {
          price: 350,
          features: [
            "Core and plugin file scan",
            "Malware and backdoor removal",
            "Known vulnerability patching",
            "Admin access lockdown",
            "30 days of ongoing monitoring",
            "Firewall rule configuration",
          ],
        },
      },
    },
    {
      id: "sec-03",
      sku: "ZWS-SEC-03",
      name: "Security Patches (All Platforms)",
      badge: null,
      desc: "Regular core, plugin, and dependency patching for Magento, Shopify, WooCommerce, WordPress, or custom builds — closing known vulnerabilities before they're exploited.",
      tiers: {
        "One-time patch cycle": {
          price: 180,
          features: [
            "Core, plugin, and dependency patching",
            "Works across all major platforms",
            "Change log provided",
          ],
        },
        "Quarterly patch subscription": {
          price: 450,
          features: [
            "Core, plugin, and dependency patching",
            "Works across all major platforms",
            "Change log provided",
            "Patched every quarter, ongoing",
            "Vulnerability tracking and prioritization",
          ],
        },
      },
    },
  ],
  migrations: [
    {
      id: "mig-01",
      sku: "ZWS-MIG-01",
      name: "Payment Gateway Integration",
      badge: null,
      desc: "Add or fix a payment gateway (Stripe, Braintree, JazzCash, Easypaisa, Elavon/Converge) on your existing store.",
      tiers: {
        "Single gateway": {
          price: 200,
          features: [
            "One gateway setup",
            "Sandbox and live testing",
            "Webhook configuration",
          ],
        },
        "Multi-gateway + conditional rules": {
          price: 450,
          features: [
            "Multiple gateway setup",
            "Sandbox and live testing",
            "Webhook configuration",
            "Conditional routing rules by region/currency",
          ],
        },
      },
    },
    {
      id: "mig-02",
      sku: "ZWS-MIG-02",
      name: "Platform Migration & SEO Preservation",
      badge: "flagship",
      desc: "Move between WooCommerce, Shopify, or WordPress with full 301 redirects and a URL mapping file, so rankings survive the move.",
      tiers: {
        "Under 150 products": {
          price: 350,
          features: [
            "Full product/content migration",
            "301 redirect mapping",
            "URL mapping file provided",
            "Post-migration QA checklist",
          ],
        },
        "150+ products": {
          price: 700,
          features: [
            "Full product/content migration",
            "301 redirect mapping",
            "URL mapping file provided",
            "Post-migration QA checklist",
            "Bulk catalog handling for larger stores",
          ],
        },
      },
    },
  ],
  growth: [
    {
      id: "gro-01",
      sku: "ZWS-GRO-01",
      name: "Google Merchant Center Suspension Resolution",
      badge: "flagship",
      desc: "Diagnose the policy violation, fix the root cause, and submit a documented reinstatement request.",
      tiers: {
        "Diagnosis + first appeal": {
          price: 500,
          features: [
            "Policy violation diagnosis",
            "Root cause fix on your store",
            "Documented reinstatement request",
          ],
        },
        "With follow-up appeal support": {
          price: 750,
          features: [
            "Policy violation diagnosis",
            "Root cause fix on your store",
            "Documented reinstatement request",
            "Follow-up appeal if first is rejected",
            "Prevention recommendations",
          ],
        },
      },
    },
    {
      id: "gro-02",
      sku: "ZWS-GRO-02",
      name: "Server & Performance Optimization",
      badge: null,
      desc: "Cloudflare/AWS tuning, caching, and database optimization to speed up a slow or overloaded store.",
      tiers: {
        "Standard tune-up": {
          price: 300,
          features: [
            "Cloudflare/AWS configuration tuning",
            "Caching layer setup",
            "Before/after speed benchmarks",
          ],
        },
        "Full infra review": {
          price: 600,
          features: [
            "Cloudflare/AWS configuration tuning",
            "Caching layer setup",
            "Before/after speed benchmarks",
            "Database query optimization",
            "Full infrastructure audit report",
          ],
        },
      },
    },
    {
      id: "gro-03",
      sku: "ZWS-GRO-03",
      name: "SEO & SEM Setup (All Platforms)",
      badge: null,
      desc: "On-page SEO audit and fixes, Google Ads/SEM campaign setup, and conversion tracking — for Magento, Shopify, WooCommerce, or WordPress.",
      tiers: {
        "SEO audit + fixes": {
          price: 350,
          features: [
            "Full on-page SEO audit",
            "Technical SEO fixes",
            "Works across all major platforms",
          ],
        },
        "SEO + SEM campaign setup": {
          price: 700,
          features: [
            "Full on-page SEO audit",
            "Technical SEO fixes",
            "Works across all major platforms",
            "Google Ads/SEM campaign setup",
            "Conversion tracking configuration",
          ],
        },
      },
    },
    {
      id: "gro-04",
      sku: "ZWS-GRO-04",
      name: "Email Infrastructure Setup",
      badge: null,
      desc: "Configure transactional email via AWS SES or your provider of choice — domain verification, SPF/DKIM/DMARC, and deliverability tuning.",
      tiers: {
        "Single domain": {
          price: 150,
          features: [
            "AWS SES or provider setup",
            "Domain verification",
            "SPF/DKIM/DMARC configuration",
          ],
        },
        "Multi-domain + monitoring": {
          price: 350,
          features: [
            "AWS SES or provider setup",
            "Domain verification",
            "SPF/DKIM/DMARC configuration",
            "Multiple domains configured",
            "Ongoing deliverability monitoring",
          ],
        },
      },
    },
  ],
  saas: [
    {
      id: "saas-01",
      sku: "ZWS-SAAS-01",
      name: "Multi-Tenant SaaS / ERP Platform",
      badge: "flagship",
      desc: "Custom-built multi-tenant platform: RBAC, ledger and invoicing, admin dashboard, and API layer.",
      tiers: {
        "Starter (single module)": {
          price: 5000,
          features: [
            "Single core module built",
            "Basic role-based access control",
            "Admin dashboard",
            "REST API for that module",
          ],
        },
        "Full platform build": {
          price: 12000,
          features: [
            "Multi-tenant architecture",
            "Full role-based access control (RBAC)",
            "Ledger and invoicing system",
            "Admin dashboard",
            "Full REST API layer",
            "Custom module development",
          ],
        },
      },
    },
    {
      id: "saas-02",
      sku: "ZWS-SAAS-02",
      name: "White-Label Ordering Platform",
      badge: null,
      desc: "Storefront and admin dashboard for restaurants or retail, branded for resale to your own clients.",
      tiers: {
        "Single-tenant license": {
          price: 3000,
          features: [
            "Customer-facing storefront",
            "Admin management dashboard",
            "White-labeled for one business",
            "Order and payment processing",
          ],
        },
        "Multi-tenant white-label": {
          price: 7500,
          features: [
            "Customer-facing storefront",
            "Admin management dashboard",
            "White-labeled for resale",
            "Order and payment processing",
            "Multi-tenant support for reselling to multiple clients",
          ],
        },
      },
    },
    {
      id: "saas-03",
      sku: "ZWS-SAAS-03",
      name: "Custom Subscription & Customer Portal",
      badge: "flagship",
      desc: "Subscription billing built on Stripe and PayPal, plus a branded customer dashboard for order history, invoices, project status, and support — works with any platform.",
      tiers: {
        "Subscription checkout only": {
          price: 1800,
          features: [
            "Stripe and PayPal subscription billing",
            "Checkout flow",
            "Basic billing management",
          ],
        },
        "Full portal + dashboard": {
          price: 4200,
          features: [
            "Stripe and PayPal subscription billing",
            "Branded customer dashboard",
            "Order history and invoices",
            "Project status tracking",
            "Built-in support messaging",
          ],
        },
      },
    },
  ],
  retainer: [
    {
      id: "ret-01",
      sku: "ZWS-RET-01",
      name: "Store Maintenance Retainer",
      badge: "flagship",
      desc: "Ongoing fixes, small feature additions, security monitoring, and priority response — billed monthly.",
      tiers: {
        "Basic (up to 5 hrs/mo)": {
          price: 150,
          features: [
            "Up to 5 hours of work per month",
            "Bug fixes",
            "Security monitoring",
            "Standard response time",
          ],
        },
        "Priority (up to 15 hrs/mo)": {
          price: 400,
          features: [
            "Up to 15 hours of work per month",
            "Bug fixes and small feature additions",
            "Security monitoring",
            "Priority response time",
          ],
        },
      },
    },
  ],

  ai: [
    {
      id: "ai-01",
      sku: "ZWS-AI-01",
      name: "AI Chatbot Integration",
      badge: null,
      desc: "Add a chatbot to your store or site — from simple FAQ automation to a fully AI-powered assistant that understands customer queries.",
      tiers: {
        "Rule-based FAQ bot": {
          price: 400,
          features: [
            "Pre-set FAQ and order-status responses",
            "Embedded widget on your site",
            "Basic conversation flow setup",
          ],
        },
        "AI-powered assistant": {
          price: 900,
          features: [
            "AI-powered natural language responses",
            "Trained on your product catalog and policies",
            "Handoff to human support when needed",
            "Embedded widget on your site",
          ],
        },
      },
    },
    {
      id: "ai-02",
      sku: "ZWS-AI-02",
      name: "Store Automation & AI Agents",
      badge: "flagship",
      desc: "Automate repetitive store operations — inventory alerts, order triage, customer follow-ups — with AI agents built around your workflow.",
      tiers: {
        "Single automation": {
          price: 600,
          features: [
            "One automated workflow (e.g. inventory alerts or order triage)",
            "Integration with your existing platform",
            "Basic monitoring dashboard",
          ],
        },
        "Multi-agent setup": {
          price: 1500,
          features: [
            "Multiple automated workflows",
            "Integration across platform and email/messaging",
            "Monitoring dashboard with alerts",
            "One month of tuning included",
          ],
        },
      },
    },
  ],
  software: [
    {
      id: "sw-01",
      sku: "ZWS-SW-01",
      name: "Full-Stack Web Application",
      badge: "flagship",
      desc: "A custom-built web application from the ground up — not a template, not a page builder. Built to your exact spec.",
      tiers: {
        "MVP build": {
          price: 3000,
          features: [
            "Core functionality built to spec",
            "Database design and setup",
            "Basic admin interface",
            "Deployed to your hosting",
          ],
        },
        "Full production build": {
          price: 8000,
          features: [
            "Full feature set built to spec",
            "Database design and setup",
            "Admin dashboard with role-based access",
            "API layer for future integrations",
            "Deployed with CI/CD pipeline",
          ],
        },
      },
    },
    {
      id: "sw-02",
      sku: "ZWS-SW-02",
      name: "Custom API & Third-Party Integrations",
      badge: null,
      desc: "Connect your store or platform to external services — accounting software, CRMs, shipping providers, or your own internal tools.",
      tiers: {
        "Single integration": {
          price: 350,
          features: [
            "One third-party integration",
            "Authentication and error handling",
            "Basic testing",
          ],
        },
        "Multi-integration": {
          price: 800,
          features: [
            "Multiple third-party integrations",
            "Authentication and error handling",
            "Retry logic and monitoring",
            "Documentation provided",
          ],
        },
      },
    },
  ],
  cloud: [
    {
      id: "cld-01",
      sku: "ZWS-CLD-01",
      name: "Cloud Infrastructure Setup",
      badge: null,
      desc: "Move your store or app to proper cloud infrastructure — AWS, Cloudflare, or your provider of choice — configured for reliability.",
      tiers: {
        "Basic setup": {
          price: 500,
          features: [
            "Cloud server provisioning",
            "SSL and domain configuration",
            "Basic firewall rules",
          ],
        },
        "Full managed infrastructure": {
          price: 1200,
          features: [
            "Cloud server provisioning",
            "SSL and domain configuration",
            "Load balancing and auto-scaling setup",
            "Automated backups",
            "Uptime monitoring",
          ],
        },
      },
    },
    {
      id: "cld-02",
      sku: "ZWS-CLD-02",
      name: "DevOps & CI/CD Pipeline Setup",
      badge: null,
      desc: "Automate your deployment process so shipping updates doesn't mean manual uploads and crossed fingers.",
      tiers: {
        "Basic pipeline": {
          price: 400,
          features: [
            "Automated build and deploy on push",
            "Single environment (production)",
          ],
        },
        "Full CI/CD with monitoring": {
          price: 900,
          features: [
            "Automated build and deploy on push",
            "Staging and production environments",
            "Automated testing step",
            "Deployment monitoring and rollback",
          ],
        },
      },
    },
  ],
  maintenance: [
    {
      id: "maint-01",
      sku: "ZWS-MAINT-01",
      name: "Bug Fixes & Troubleshooting",
      badge: null,
      desc: "A specific bug or issue on your store, fixed — no ongoing retainer required.",
      tiers: {
        "Standard fix": {
          price: 80,
          features: ["Diagnosis and fix for one issue", "Tested before handover"],
        },
        "Priority same-day": {
          price: 150,
          features: [
            "Diagnosis and fix for one issue",
            "Same-day turnaround",
            "Tested before handover",
          ],
        },
      },
    },
    {
      id: "maint-02",
      sku: "ZWS-MAINT-02",
      name: "Backup & Disaster Recovery Setup",
      badge: null,
      desc: "Make sure a server failure or bad update can't take your store down permanently.",
      tiers: {
        "One-time backup setup": {
          price: 120,
          features: ["Manual backup taken and stored securely", "Restore process documented"],
        },
        "Automated + monitored": {
          price: 280,
          features: [
            "Automated recurring backups",
            "Off-site storage",
            "Restore process documented",
            "Backup failure alerts",
          ],
        },
      },
    },
    {
      id: "maint-03",
      sku: "ZWS-MAINT-03",
      name: "Speed Optimization",
      badge: null,
      desc: "Diagnose and fix what's making your store slow — a direct factor in conversion rate and SEO ranking.",
      tiers: {
        "Standard audit + fix": {
          price: 250,
          features: [
            "Performance audit",
            "Image and asset optimization",
            "Before/after speed benchmarks",
          ],
        },
        "Deep optimization": {
          price: 500,
          features: [
            "Performance audit",
            "Image and asset optimization",
            "Database and query optimization",
            "Caching layer setup",
            "Before/after speed benchmarks",
          ],
        },
      },
    },
  ],
};

export const sectionTitles: Record<CatalogSection, string> = {
  webdev: "Web Development",
  security: "Security",
  migrations: "Migrations",
  growth: "Growth",
  saas: "SaaS & Platforms",
  retainer: "Retainers",
  ai: "AI Development",
  software: "Software Development",
  cloud: "Cloud & Cybersecurity",
  maintenance: "Website Maintenance",
};
