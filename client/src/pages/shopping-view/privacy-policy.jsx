import React from "react";
import SEO from "@/components/common/SEO";

function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SEO
        title="Privacy Policy | Shiv Electronics"
        description="Privacy policy of Shiv Electronics. Learn how we collect, use, and protect your personal information."
        canonicalUrl="/shop/privacy-policy"
      />
      
      {/* Hero Section */}
      <div className="bg-white border-b py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Last updated: April 23, 2026. Your privacy is important to us.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-16 flex-1">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border space-y-10 text-gray-700 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
            <p>
              Welcome to Shiv Electronics. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at yogeshshiv633@gmail.com.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
            <p>
              We collect personal information that you provide to us such as name, address, contact information, passwords and security data, and payment information. We collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products and services, when participating in activities on the Services or otherwise contacting us.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Info:</strong> Name, Email, Phone Number, and Shipping/Billing Address.</li>
              <li><strong>Credentials:</strong> Passwords and similar security information used for authentication and account access.</li>
              <li><strong>Payment Data:</strong> We collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument. All payment data is stored by our payment processor (Razorpay).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To send you marketing and promotional communications.</li>
              <li>To fulfill and manage your orders.</li>
              <li>To post testimonials with your consent.</li>
              <li>To deliver targeted advertising to you.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">4. Will Your Information Be Shared?</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share data based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, Legal Obligations, and Vital Interests.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">5. How Long Do We Keep Your Information?</h2>
            <p>
              We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy unless otherwise required by law. When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">6. How Do We Keep Your Information Safe?</h2>
            <p>
              We aim to protect your personal information through a system of organizational and technical security measures. We have implemented appropriate internal security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">7. Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may email us at <strong>yogeshshiv633@gmail.com</strong> or by post to:
            </p>
            <p className="bg-gray-50 p-4 rounded-lg border border-dashed text-sm">
              Shiv Electronics<br />
              Mahalaxmi Ind. Estate, B/H Bhagvati CNG Pump,<br />
              Near Bij Nigam Office, Khed-Tasiya Road, Motipura,<br />
              Himatnagar, Gujarat 383001, India.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
