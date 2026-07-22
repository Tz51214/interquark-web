import PillarPage from "../../components/PillarPage";

export default function AiDevelopment() {
  return (
    <PillarPage
      path="/ai-development"
      eyebrow="AI Development"
      headline="AI features that solve real problems, not add buzzwords"
      subhead="Chatbots, automation, and AI integrations built to actually work in production."
      intro="AI is genuinely useful when it's applied to a specific, real problem — not bolted on as a feature checkbox. Interquark's developers build AI-powered features grounded in your actual use case: customer support automation, content generation, data processing, and integrations with the major AI providers."
      sections={[
        { title: "AI chatbots & support automation", desc: "Trained on your actual content, integrated into your existing systems." },
        { title: "Workflow automation", desc: "Use AI to handle repetitive tasks accurately, freeing up your team's time." },
        { title: "AI API integrations", desc: "OpenAI, Anthropic, and other providers, integrated correctly and cost-consciously." },
        { title: "Custom AI-powered features", desc: "Purpose-built AI functionality specific to your product, not a generic wrapper." },
      ]}
      faqs={[
        {
          q: "Do I need my own AI provider account?",
          a: "Usually yes, since API usage is billed directly to you — we help you set this up correctly and keep costs predictable.",
        },
      ]}
      metaTitle="AI Development Services | Interquark"
      metaDescription="AI development — chatbots, automation, and custom AI integrations built by vetted developers, grounded in real business use cases."
    />
  );
}
