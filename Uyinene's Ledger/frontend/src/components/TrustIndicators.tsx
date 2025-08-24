import { Shield, Lock, Clock, CheckCircle, FileCheck } from "lucide-react";

const TrustIndicators = () => {
  const indicators = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "256-bit encryption protects your sensitive information"
    },
    {
      icon: Lock,
      title: "Chain of Custody",
      description: "Every action is logged with timestamps for legal admissibility"
    },
    {
      icon: Clock,
      title: "Timestamped Evidence",
      description: "All uploads include verifiable timestamps and metadata"
    },
    {
      icon: CheckCircle,
      title: "Court-Ready",
      description: "Formatted for legal proceedings and evidence submission"
    },
    {
      icon: FileCheck,
      title: "Secure Storage",
      description: "Encrypted cloud storage with automated backups"
    }
  ];

  return (
    <div className="py-16 bg-gradient-trust">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Built for Your Safety & Legal Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every feature is designed with victims' security and legal admissibility in mind
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {indicators.slice(0, 3).map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div key={index} className="bg-card rounded-xl p-6 shadow-gentle hover:shadow-trust transition-shadow">
                <div className="flex items-center mb-4">
                  <Icon className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-lg font-semibold text-foreground">{indicator.title}</h3>
                </div>
                <p className="text-muted-foreground">{indicator.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
          {indicators.slice(3).map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div key={index + 3} className="bg-card rounded-xl p-6 shadow-gentle hover:shadow-trust transition-shadow">
                <div className="flex items-center mb-4">
                  <Icon className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-lg font-semibold text-foreground">{indicator.title}</h3>
                </div>
                <p className="text-muted-foreground">{indicator.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;