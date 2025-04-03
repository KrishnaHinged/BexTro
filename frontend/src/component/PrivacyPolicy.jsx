import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-200 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Last Updated: March 26, 2025
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            1. Introduction
          </h2>
          <p className="text-gray-600">
            Welcome to BeXtro, a gamified platform designed to help you achieve your goals through challenges and rewards. At BeXtro, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, share, and protect your data when you use our website and services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            2. Information We Collect
          </h2>
          <p className="text-gray-600">
            We collect the following types of information to provide and improve our services:
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            <li>
              <strong>Personal Information:</strong> When you sign up, we collect your full name, username, email address, password, and gender. You may also choose to upload a profile photo.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect information about how you interact with BeXtro, such as the challenges you participate in, your progress, and your activity on the platform (e.g., messages, notifications).
            </li>
            <li>
              <strong>Device Information:</strong> We may collect information about the device you use to access BeXtro, including your IP address, browser type, and operating system.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies to store session information (e.g., to keep you logged in) and to track usage patterns for analytics purposes. You can manage cookie preferences in your browser settings.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-600">
            We use your information to:
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            <li>Provide and personalize your BeXtro experience, including challenges, rewards, and notifications.</li>
            <li>Authenticate your account and keep you logged in using session storage.</li>
            <li>Communicate with you, such as sending email updates or responding to support inquiries.</li>
            <li>Analyze usage patterns to improve our platform and develop new features.</li>
            <li>Ensure the security of our platform and prevent fraudulent activity.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            4. How We Share Your Information
          </h2>
          <p className="text-gray-600">
            We do not sell your personal information. We may share your information in the following cases:
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            <li>
              <strong>With Service Providers:</strong> We may share your data with third-party service providers (e.g., email services, analytics tools) to help us operate and improve BeXtro. These providers are bound by confidentiality agreements.
            </li>
            <li>
              <strong>For Legal Reasons:</strong> We may disclose your information if required by law or to protect the rights, safety, or property of BeXtro, our users, or the public.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may share your information with other users (e.g., in leaderboards or social features) if you opt in to such features.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            5. Data Security
          </h2>
          <p className="text-gray-600">
            We take reasonable measures to protect your data, including encryption of sensitive information (e.g., passwords) and secure storage of session data. However, no system is completely secure, and we cannot guarantee the absolute security of your information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            6. Your Rights and Choices
          </h2>
          <p className="text-gray-600">
            You have the following rights regarding your data:
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            <li>
              <strong>Access and Update:</strong> You can access and update your profile information (e.g., full name, username, profile photo) in the Profile tab.
            </li>
            <li>
              <strong>Delete Your Account:</strong> You can request to delete your account by contacting us at support@bextro.com. We will delete your data within 30 days, except where required by law.
            </li>
            <li>
              <strong>Cookies:</strong> You can disable cookies in your browser settings, but this may affect your experience on BeXtro.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            7. Data Retention
          </h2>
          <p className="text-gray-600">
            We retain your data for as long as your account is active or as needed to provide our services. If you delete your account, we will remove your personal information, but we may retain anonymized data for analytics purposes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            8. Children’s Privacy
          </h2>
          <p className="text-gray-600">
            BeXtro is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected such information, we will delete it immediately.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            9. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. If we make significant changes, we will notify you via email or a notice on our website. Your continued use of BeXtro after such changes constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            10. Contact Us
          </h2>
          <p className="text-gray-600">
            If you have any questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-600 mt-2">
            Email: <a href="mailto:support@bextro.com" className="text-blue-600 hover:underline">support@bextro.com</a><br />
            Phone: +1 234 567 890
          </p>
        </section>

        <div className="text-center">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;