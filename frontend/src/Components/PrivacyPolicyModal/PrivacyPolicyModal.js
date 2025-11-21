import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const PrivacyPolicyModal = forwardRef(({}, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const hideModal = () => {
    setIsModalOpen(false);
  }
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useImperativeHandle(ref, () => ({
    showModal,
    hideModal,
  }));

  return (
    <Modal
      title="Privacy Policy"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}l
    >
      <div className="mt-4 p-2" style={{ fontFamily: 'Arial, sans-serif', textAlign: 'justify' }}>
        <b>Information We Collect</b>
        <ul>
          <li><strong>Personal Info:</strong> Name, email, phone number.</li>
          <li><strong>Truck Data:</strong> Expenses, maintenance, and operational details you provide.</li>
          <li><strong>Usage Data:</strong> Interaction data, IP addresses, and cookies.</li>
          <li><strong>Location Data:</strong> If enabled, for location-based features.</li>
        </ul>

        <b>How We Use Your Information</b>
        <ul>
          <li><strong>Service Provision:</strong> To operate and improve our platform.</li>
          <li><strong>Communication:</strong> For account updates and support.</li>
          <li><strong>Analytics:</strong> To understand usage patterns.</li>
          <li><strong>Support:</strong> To respond to your inquiries.</li>
        </ul>

        <b>Sharing Your Information</b>
        <ul>
          <li><strong>Service Providers:</strong> With third-party services aiding our operations.</li>
          <li><strong>Legal Compliance:</strong> If required by law.</li>
          <li><strong>Business Transfers:</strong> In case of a merger or sale.</li>
        </ul>

        <b>Data Security</b>
        <p>We use security measures to protect your information but cannot guarantee complete security.</p>

        <b>Your Rights</b>
        <ul>
          <li><strong>Access & Correction:</strong> Update your personal information through your account.</li>
          <li><strong>Opt-Out:</strong> Unsubscribe from promotional communications.</li>
          <li><strong>Deletion:</strong> Request account deletion by contacting us.</li>
        </ul>

        <b>Third-Party Links</b>
        <p>We are not responsible for the privacy practices of other sites linked from our platform.</p>

        <b>Children’s Privacy</b>
        <p>Our platform is not for children under 13. We do not knowingly collect their data.</p>

        <b>Changes</b>
        <p>We may update this policy and will notify you via our platform.</p>
<hr></hr>
        <p>For questions, contact us at:</p>
        <p><strong>Manage My Truck (MMT)</strong></p>
        <p>Email: dev.codhub@gmail.com</p>

        <p>Thank you for using Manage My Truck (MMT). We are committed to protecting your privacy.</p>
      </div>
    </Modal>
  );
});

export default PrivacyPolicyModal;
