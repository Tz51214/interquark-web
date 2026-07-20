import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="mb-2 font-display text-3xl font-bold text-ink">Terms of Service</h1>
        <p className="mb-10 font-body text-sm text-slate-500">Last updated: [DATE]</p>

        <div className="flex flex-col gap-8 font-body text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">1. Who we are</h2>
            <p>
              These Terms of Service govern your use of the Interquark website and services,
              operated by <strong>[COMPANY LEGAL NAME]</strong>, a company registered in England
              and Wales under company number <strong>[COMPANY NUMBER]</strong>, with its
              registered office at <strong>[REGISTERED ADDRESS]</strong> ("we", "us", "our").
              You can contact us at <strong>[CONTACT EMAIL]</strong>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">2. Our services</h2>
            <p>
              We provide web development, security, migration, growth, and SaaS platform
              services, delivered by our team and vetted freelance developers, as described on
              our website. Specific deliverables, timelines, and pricing for each service are
              set out at the point of purchase.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">3. Orders and payment</h2>
            <p>
              By placing an order, you agree to pay the price shown at checkout. Payments are
              processed securely by Stripe or PayPal; we do not store your card details. Prices
              are shown in GBP unless stated otherwise and are inclusive of any applicable VAT
              where required by UK law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">
              4. Your right to cancel (Consumer Contracts Regulations 2013)
            </h2>
            <p>
              If you are a consumer ordering from within the UK, you generally have the right to
              cancel your order within 14 days of purchase without giving a reason. However, if
              you ask us to begin work during this period and we do so with your express consent,
              you acknowledge that your right to a full refund may be reduced in proportion to
              the work already carried out, in line with the Regulations.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">5. Refunds</h2>
            <p>
              Refund requests are reviewed on a case-by-case basis. Where a refund is approved,
              it is issued to the original payment method via Stripe or PayPal. This does not
              affect your statutory rights under UK consumer law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">
              6. Subscriptions (freelancer memberships)
            </h2>
            <p>
              Freelancer membership plans are billed on a recurring basis at the interval shown
              at signup. You may cancel at any time; cancellation takes effect at the end of the
              current billing period, and no partial refunds are given for the remainder of that
              period unless required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">7. Intellectual property</h2>
            <p>
              Unless otherwise agreed in writing, ownership of custom code, designs, and other
              deliverables created for you transfers to you upon payment in full. We retain the
              right to use general knowledge, techniques, and non-confidential components
              developed during the engagement.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">8. Limitation of liability</h2>
            <p>
              To the extent permitted by law, our liability for any claim arising from these
              Terms is limited to the amount you paid for the relevant service. We are not liable
              for indirect or consequential losses. Nothing in these Terms excludes or limits
              liability for death, personal injury caused by negligence, or fraud.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">9. Governing law</h2>
            <p>
              These Terms are governed by the laws of England and Wales, and any disputes will be
              subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">10. Contact</h2>
            <p>
              Questions about these Terms can be sent to <strong>[CONTACT EMAIL]</strong>.
            </p>
          </section>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
