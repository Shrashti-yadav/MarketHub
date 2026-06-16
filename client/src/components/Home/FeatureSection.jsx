import {
  Shield,
  CreditCard,
  Star,
  Search,
} from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: Search,
      title: "AI Product Search",
      description:
        "Find products quickly using intelligent AI-powered search."
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description:
        "Stripe integration ensures safe and secure online transactions."
    },
    {
      icon: Star,
      title: "Ratings & Reviews",
      description:
        "Customers can share ratings and reviews for products."
    },
    {
      icon: Shield,
      title: "Protected Accounts",
      description:
        "Secure authentication and authorization for users and admins."
    }
  ];

  return (
    <section className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="glass-card p-6 text-center hover:glow-on-hover animate-smooth"
          >
            <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
              <feature.icon className="w-8 h-8 text-primary-foreground" />
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              {feature.title}
            </h3>

            <p className="text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;