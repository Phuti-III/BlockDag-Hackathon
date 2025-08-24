"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ArrowRight, Heart, Users, Scale } from "lucide-react";
import TrustIndicators from "@/components/TrustIndicators";
import heroImage from "@/components/images/hero-image.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-trust overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Document Your Truth
                  <span className="text-primary block">Safely & Securely</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  A secure platform designed with care to help you collect and organize evidence 
                  for legal proceedings in a safe, supportive environment.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-trust">
                    Get Started Safely
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-soft">
                  Login
                </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2 text-trust">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium">Bank-Level Security</span>
                </div>
                <div className="flex items-center space-x-2 text-verified">
                  <Scale className="h-5 w-5" />
                  <span className="text-sm font-medium">Court-Admissible</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={heroImage.src}
                alt="Safe and secure evidence documentation"
                className="rounded-2xl shadow-trust w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Victims Choose SafeEvidence</h2>
            <p className="text-xl text-muted-foreground">Designed with your safety, privacy, and legal success in mind</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border shadow-gentle hover:shadow-trust transition-all">
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Victim-Centered Design</h3>
                <p className="text-muted-foreground">
                  Built with input from survivors and legal experts to create a truly supportive experience
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border shadow-gentle hover:shadow-trust transition-all">
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Maximum Security</h3>
                <p className="text-muted-foreground">
                  Military-grade encryption ensures your sensitive documents remain completely private
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border shadow-gentle hover:shadow-trust transition-all">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-secondary-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Legal Support</h3>
                <p className="text-muted-foreground">
                  Features designed specifically for legal admissibility and court proceedings
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <TrustIndicators />

      {/* Call to Action */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
            Take the First Step Towards Justice
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            You deserve to be heard and believed. Start documenting your truth in a safe, 
            secure environment designed just for you.
          </p>
          <Link href="/register">
            <Button size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Begin Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
