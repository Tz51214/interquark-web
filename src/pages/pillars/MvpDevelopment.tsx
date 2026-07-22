import PillarPage from "../../components/PillarPage";

export default function MvpDevelopment() {
  return (
    <PillarPage
      path="/mvp-development"
      eyebrow="MVP Development"
      headline="Get your MVP built and in front of real users"
      subhead="Focused, fast MVP development — the core of your idea, built properly, without unnecessary scope."
      intro="An MVP needs to prove your idea works, not include every feature you'll ever want. Interquark helps founders scope a genuinely minimal, focused product, then builds it properly — real authentication, a real database, real infrastructure — so you can get in front of users quickly without cutting corners on the fundamentals."
      sections={[
        { title: "Focused scoping", desc: "We help you cut scope to what actually needs to exist for launch." },
        { title: "Fast, iterative delivery", desc: "See progress quickly, adjust as you learn from real users." },
        { title: "Built to extend", desc: "A real foundation — not throwaway code you'll need to rebuild after launch." },
        { title: "Launch-ready infrastructure", desc: "Real hosting, real domain, real payment processing — genuinely ready for users." },
      ]}
      faqs={[
        {
          q: "What if my MVP succeeds and I need to scale it?",
          a: "That's the goal — we build MVPs on solid foundations specifically so they can grow into the full product, not need a rewrite.",
        },
      ]}
      metaTitle="MVP Development Services | Interquark"
      metaDescription="MVP development for founders — focused scoping, fast delivery, and a real technical foundation, built by vetted developers."
    />
  );
}
