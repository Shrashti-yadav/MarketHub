import { Users, Target, Award, Heart, ShoppingCart, CreditCard, Star } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description:
        "We focus on delivering the best shopping experience for our customers.",
    },
    {
      icon: Award,
      title: "Quality Products",
      description:
        "All products are carefully selected to ensure quality and reliability.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building trust and long-term relationships with our customers.",
    },
    {
      icon: Target,
      title: "Innovation",
      description:
        "Leveraging modern technologies and AI to improve online shopping.",
    },
  ];

  const features = [
    {
      icon: ShoppingCart,
      title: "Smart Shopping",
      description:
        "Browse, search, and purchase products with a seamless experience.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description:
        "Integrated Stripe payment gateway for secure online transactions.",
    },
    {
      icon: Star,
      title: "Product Reviews",
      description:
        "Users can share ratings and reviews to help others make informed decisions.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            About MarketHub
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A modern AI-powered e-commerce platform built with the MERN Stack,
            designed to provide a seamless, secure, and intelligent online
            shopping experience.
          </p>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-secondary rounded-xl p-6 text-center hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>

                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">
            Platform Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-secondary rounded-xl p-6 text-center hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-secondary rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            About MarketHub
          </h2>

          <p className="text-muted-foreground leading-relaxed">
            MarketHub is a full-stack e-commerce platform developed using the
            MERN Stack (MongoDB, Express.js, React.js, and Node.js). The
            platform enables users to browse products, search items using AI,
            add products to cart, place orders, make secure online payments,
            manage orders, and submit product reviews.
          </p>

          <p className="text-muted-foreground leading-relaxed mt-4">
            The project integrates Stripe Payment Gateway for secure
            transactions and provides a modern, responsive user interface for a
            smooth shopping experience across devices. MarketHub focuses on
            performance, security, scalability, and user satisfaction.
          </p>

          <p className="text-muted-foreground leading-relaxed mt-4">
            This project was built to demonstrate full-stack development
            concepts including authentication, state management with Redux,
            RESTful APIs, payment integration, cloud-based image handling, and
            real-world e-commerce workflows.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;