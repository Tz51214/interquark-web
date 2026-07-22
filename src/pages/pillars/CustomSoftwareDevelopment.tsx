import PillarPage from "../../components/PillarPage";

export default function CustomSoftwareDevelopment() {
  return (
    <PillarPage
      path="/custom-software-development"
      eyebrow="Custom Software Development"
      headline="Software built around how your business actually works"
      subhead="Not an off-the-shelf tool bent out of shape — a system designed for your exact process."
      intro="Off-the-shelf software is built for the average case. When your workflow doesn't fit that mold, you're left working around the tool instead of it working for you. Interquark builds custom systems — internal tools, automation, integrations — designed specifically around how your business operates."
      sections={[
        { title: "Internal tools & dashboards", desc: "Purpose-built systems for your team, not generic templates." },
        { title: "Process automation", desc: "Replace manual, repetitive work with systems that handle it correctly, every time." },
        { title: "Legacy system integration", desc: "Connect old and new systems without a disruptive full rebuild." },
        { title: "Data pipelines & reporting", desc: "Get the numbers you actually need, in a format your team can use." },
      ]}
      faqs={[
        {
          q: "What if I'm not sure exactly what I need built?",
          a: "That's normal — we start with a scoping conversation to turn a rough idea into a clear technical plan.",
        },
      ]}
      metaTitle="Custom Software Development | Interquark"
      metaDescription="Custom software built around your business — internal tools, automation, integrations, and data systems from vetted developers."
    />
  );
}
