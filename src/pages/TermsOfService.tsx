import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 size-4" />
            Back to Login
          </Button>
        </Link>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using the International Nursery and Primary School (INPS) Portal, you agree to be bound by these 
              Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              The INPS Portal is an online platform designed to facilitate school management, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Student enrollment and record management</li>
              <li>Academic performance tracking</li>
              <li>Fee payment processing</li>
              <li>Staff and parent communication</li>
              <li>Assignment and curriculum management</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
            <h3 className="text-lg font-medium mb-2">3.1 Account Security</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>You are responsible for maintaining the confidentiality of your login credentials</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 mt-4">3.2 Acceptable Use</h3>
            <p className="text-muted-foreground mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to the system</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Transmit any harmful or inappropriate content</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Data Accuracy</h2>
            <p className="text-muted-foreground">
              Users are responsible for ensuring that all information provided to the INPS Portal is accurate, complete, and current. 
              The school reserves the right to verify and update any information provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Privacy</h2>
            <p className="text-muted-foreground">
              Your use of the INPS Portal is also governed by our Privacy Policy. Please review our Privacy Policy, 
              which also governs the service and describes how we collect, use, and protect your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content, features, and functionality of the INPS Portal are owned by International Nursery and Primary School 
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the fullest extent permitted by law, INPS shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate your access to the INPS Portal at any time, with or without cause, 
              with or without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Modifications</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Your continued use of the service after such modifications 
              constitutes your acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms of Service shall be governed by and construed in accordance with the laws of Nigeria. 
              Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Nigeria.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> echika911@gmail.com</p>
              <p><strong>Phone:</strong> +234 815 262 2017</p>
              <p><strong>Address:</strong> Trans-Ekulu Enugu</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
