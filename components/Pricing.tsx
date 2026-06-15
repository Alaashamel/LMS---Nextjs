"use client";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for exploring courses and tracking your learning basics.",
    features: ["Browse public courses", "Save favorite courses", "Basic learning progress"],
    cta: "Start Learning",
  },
  {
    name: "Pro Learner",
    price: "$19",
    description: "For students who want structured learning, certificates, and progress insights.",
    features: ["Premium course access", "Certificates", "Progress analytics", "Priority support"],
    cta: "Upgrade Plan",
    highlighted: true,
  },
  {
    name: "Teams",
    price: "$49",
    description: "For small teams and academies managing multiple learners.",
    features: ["Team dashboard", "Learner reports", "Admin controls", "Custom onboarding"],
    cta: "Contact Sales",
  },
];

export function Pricing() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="rounded-full border px-4 py-2 text-sm font-medium">
            Simple Pricing
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            Choose the plan that fits your learning journey
          </h2>

          <p className="mt-4 text-muted-foreground">
            Flexible plans designed for individual learners, professionals, and teams.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl ${
                plan.highlighted
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute right-6 top-6 rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground">
                  Popular
                </span>
              )}

              <h3 className="text-2xl font-bold">{plan.name}</h3>

              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                {plan.price !== "Free" && (
                  <span className="mb-2 text-sm opacity-80">/month</span>
                )}
              </div>

              <p className="mt-5 text-sm leading-7 opacity-80">
                {plan.description}
              </p>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs text-foreground">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full rounded-2xl px-5 py-3 font-semibold transition ${
                  plan.highlighted
                    ? "bg-background text-foreground hover:opacity-90"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;