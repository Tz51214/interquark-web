import PillarPage from "../../components/PillarPage";

export default function WebApplicationDevelopment() {
  return (
    <PillarPage
      path="/web-application-development"
      eyebrow="Web Application Development"
      headline="Web applications built to be fast, secure, and maintainable"
      subhead="Custom web apps — not templates — for businesses that need something built right."
      intro="A web application is more than a website — it needs real logic, secure authentication, a proper database, and an architecture that can grow. Interquark builds custom web applications using modern frameworks, matched to what your product actually needs rather than a one-size-fits-all template."
      sections={[
        { title: "Custom frontend & backend", desc: "Built with modern frameworks, matched to your specific requirements." },
        { title: "Secure authentication", desc: "Proper user accounts, role-based access, and industry-standard security practices." },
        { title: "Database design", desc: "A data structure that fits your actual use case, built to scale correctly." },
        { title: "Deployment & hosting setup", desc: "Your application, live on real infrastructure, configured correctly from the start." },
      ]}
      faqs={[
        {
          q: "Can you take over an existing web application?",
          a: "Yes — we regularly take on existing codebases, whether for new features, fixes, or a full rebuild.",
        },
      ]}
      metaTitle="Web Application Development | Interquark"
      metaDescription="Custom web application development — secure, scalable, and built by vetted developers using modern frameworks."
    />
  );
}
