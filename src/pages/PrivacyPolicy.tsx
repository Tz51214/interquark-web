import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="mb-2 font-display text-3xl font-bold text-ink">Privacy Policy</h1>
        <p className="mb-10 font-body text-sm text-slate-500">Last updated: [DATE]</p>

        <div className="flex flex-col gap-8 font-body text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">1. Who we are</h2>
            <p>
              This Privacy Policy explains how <strong>[COMPANY LEGAL NAME]</strong> ("we", "us",
              "our"), registered in England and Wales under company number{" "}
              <strong>[COMPANY NUMBER]</strong>, collects, uses, and protects your personal data
              when you use the Interquark website and services. We are the data controller for
              the purposes of the UK GDPR and Data Protection Act 2018.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">
              2. What data we collect
            </h2>
            <ul className="ml-5 flex list-disc flex-col gap-1.5">
              <li>Account details: name, email address, password (stored securely, hashed)</li>
              <li>Order and billing information: services purchased, order history, invoices</li>
              <li>
                Payment information: processed directly by Stripe and PayPal — we do not store
                your card details on our servers
              </li>
              <li>Project communications: messages and file attachments sent through your portal</li>
              <li>Technical data: IP address, browser type, and device information</li>
              <li>Cookies: see Section 6 below</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">
              3. How we use your data
            </h2>
            <p>We use your data to:</p>
            <ul className="ml-5 mt-2 flex list-disc flex-col gap-1.5">
              <li>Create and manage your account</li>
              <li>Process orders, subscriptions, and payments</li>
              <li>Deliver the services you've purchased and communicate with you about them</li>
              <li>Send order confirmations, invoices, and service-related emails</li>
              <li>Improve our website and services</li>
              <li>Comply with our legal obligations, including tax and accounting requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">
              4. Legal basis for processing
            </h2>
            <p>
              We process your data under the following legal bases: performance of a contract
              (fulfilling your order), legitimate interests (improving our services, preventing
              fraud), consent (where you've explicitly agreed, e.g. certain cookies), and legal
              obligation (tax and accounting records).
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">
              5. Sharing your data
            </h2>
            <p>We share your data only with:</p>
            <ul className="ml-5 mt-2 flex list-disc flex-col gap-1.5">
              <li>Payment processors (Stripe, PayPal) to process transactions</li>
              <li>The freelance developer assigned to your project, for the purpose of delivering it</li>
              <li>Service providers who help us run our infrastructure (hosting, email delivery)</li>
              <li>Law enforcement or regulators, where required by law</li>
            </ul>
            <p className="mt-2">We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">6. Cookies</h2>
            <p>
              We use essential cookies required for the site to function (e.g. keeping you signed
              in, remembering items in your cart). We do not currently use non-essential tracking
              or advertising cookies. If this changes, we will update this policy and request
              your consent where required under the Privacy and Electronic Communications
              Regulations (PECR).
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">
              7. Data retention
            </h2>
            <p>
              We retain your account and order data for as long as your account is active, and
              for a period afterward as required for tax and accounting purposes (typically 6
              years under UK law). You can request deletion of your account at any time, subject
              to these legal retention requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">8. Your rights</h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="ml-5 mt-2 flex list-disc flex-col gap-1.5">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data ("right to be forgotten")</li>
              <li>Object to or restrict certain processing</li>
              <li>Request a copy of your data in a portable format</li>
              <li>Withdraw consent at any time, where processing is based on consent</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at <strong>[CONTACT EMAIL]</strong>. You
              also have the right to lodge a complaint with the Information Commissioner's Office
              (ICO) at ico.org.uk.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">9. Data security</h2>
            <p>
              We use industry-standard measures to protect your data, including encrypted
              connections (HTTPS), hashed passwords, and access controls. No method of
              transmission over the internet is 100% secure, but we work to protect your
              information to the best of our ability.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">
              10. International transfers
            </h2>
            <p>
              As we work with freelancers and customers internationally, your data may be
              processed outside the UK. Where this happens, we take steps to ensure an
              adequate level of protection, in line with UK GDPR requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">11. Contact</h2>
            <p>
              Questions about this Privacy Policy or your data can be sent to{" "}
              <strong>[CONTACT EMAIL]</strong>.
            </p>
          </section>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
