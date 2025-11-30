import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";
import { LockOutlined, SafetyOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";

const PrivacyPolicyModal = forwardRef((props, ref) => {
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
      title={
        <div style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, #0a3d2f, #1aa54b)',
          margin: '-20px -24px 20px -24px',
          padding: '24px',
          color: 'white',
          borderRadius: '8px 8px 0 0'
        }}>
          <LockOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
          <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Privacy Policy</div>
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      bodyStyle={{ maxHeight: '65vh', overflow: 'auto' }}
      zIndex={1600}
    >
      <div style={{ padding: '8px 0' }}>

        {/* Key Points */}
        <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>

          {/* Data Collection */}
          <div style={{
            padding: '20px',
            borderLeft: '4px solid #1aa54b',
            background: '#f0f9f4',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <EyeOutlined style={{ fontSize: '24px', color: '#1aa54b', marginRight: '12px' }} />
              <strong style={{ color: '#0a3d2f', fontSize: '18px' }}>What We Collect</strong>
            </div>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#555', fontSize: '14px' }}>
              <li>Account info (name, email)</li>
              <li>Truck & expense data</li>
              <li>Usage analytics</li>
            </ul>
          </div>

          {/* Data Usage */}
          <div style={{
            padding: '20px',
            borderLeft: '4px solid #1aa54b',
            background: '#f0f9f4',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <SafetyOutlined style={{ fontSize: '24px', color: '#1aa54b', marginRight: '12px' }} />
              <strong style={{ color: '#0a3d2f', fontSize: '18px' }}>How We Use It</strong>
            </div>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#555', fontSize: '14px' }}>
              <li>Provide and improve our service</li>
              <li>Send important updates</li>
              <li>Analyze usage patterns</li>
            </ul>
          </div>

          {/* Your Rights */}
          <div style={{
            padding: '20px',
            borderLeft: '4px solid #1aa54b',
            background: '#f0f9f4',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <DeleteOutlined style={{ fontSize: '24px', color: '#1aa54b', marginRight: '12px' }} />
              <strong style={{ color: '#0a3d2f', fontSize: '18px' }}>Your Rights</strong>
            </div>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#555', fontSize: '14px' }}>
              <li>Access & update your data</li>
              <li>Opt-out of communications</li>
              <li>Request account deletion</li>
            </ul>
          </div>

          {/* Security */}
          <div style={{
            padding: '16px',
            background: '#f0f9f4',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#0a3d2f', fontSize: '14px' }}>
              <strong>🔒 Your data is encrypted</strong> and protected with industry-standard security measures.
            </p>
          </div>

        </div>

        {/* Contact Section */}
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #0a3d2f, #1aa54b)',
          borderRadius: '8px',
          color: '#fff'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
            <strong>Questions?</strong> Contact us at:
          </div>
          <div style={{ fontSize: '14px', opacity: 0.95 }}>
            dev.codhub@gmail.com
          </div>
          <div style={{ fontSize: '12px', marginTop: '12px', opacity: 0.8 }}>
          </div>
        </div>

      </div>
    </Modal>
  );
});

export default PrivacyPolicyModal;
