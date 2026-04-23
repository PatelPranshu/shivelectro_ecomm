import React from "react";
import SEO from "@/components/common/SEO";

function TermsConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SEO
        title="Terms & Conditions | Shiv Electronics"
        description="Terms and conditions for using Shiv Electronics website and services. Read about our rules, regulations, and user agreements."
        canonicalUrl="/shop/terms-conditions"
      />
      
      {/* Hero Section */}
      <div className="bg-white border-b py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our services.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-16 flex-1">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border space-y-10 text-gray-700 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
            <p>
              By accessing or using our website, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access the service. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">2. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Shiv Electronics and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Shiv Electronics.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">4. Purchases & Payments</h2>
            <p>
              If you wish to purchase any product or service made available through the Service, you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
            </p>
            <p>
              We use third-party services for payment processing (e.g., payment processors like Razorpay). We will not store or collect your payment card details. That information is provided directly to our third-party payment processors.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">5. Shipping & Returns</h2>
            <p>
              Shipping times may vary based on your location and the availability of the product. We strive to process all orders within 24-48 hours. Our return and refund policy is governed by our commitment to customer satisfaction; please contact us directly for any issues with your order.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">6. Limitation of Liability</h2>
            <p>
              In no event shall Shiv Electronics, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">7. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of Gujarat, India, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">8. Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <strong>yogeshshiv633@gmail.com</strong>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default TermsConditionsPage;
