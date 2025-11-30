import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Button } from "antd";
import { MailOutlined, QuestionCircleOutlined, FileTextOutlined, MessageOutlined } from "@ant-design/icons";

const GetHelpModal = forwardRef((props, ref) => {
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
    <>
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
            <QuestionCircleOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Get Help & Support</div>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={500}
        centered
        zIndex={1600}
      >
        <div style={{ padding: '8px 0' }}>
          {/* Contact Options */}
          <div style={{ display: 'grid', gap: '16px' }}>

            {/* Email Support */}
            <div style={{
              padding: '20px',
              borderLeft: '4px solid #1aa54b',
              background: '#f0f9f4',
              borderRadius: '8px',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <MailOutlined style={{ fontSize: '24px', color: '#1aa54b', marginRight: '12px' }} />
                <strong style={{ color: '#0a3d2f', fontSize: '18px' }}>Email Support</strong>
              </div>
              <p style={{ margin: '0 0 16px 0', color: '#555', lineHeight: '1.5', fontSize: '14px' }}>
                Get comprehensive assistance from our support team.
              </p>
              <Button
                type="primary"
                href="mailto:dev.codhub@gmail.com?subject=MMT Support Request"
                icon={<MailOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #0a3d2f, #1aa54b)',
                  border: 'none',
                  borderRadius: '6px'
                }}
              >
                Contact Support
              </Button>
            </div>

            {/* FAQ Section */}
            <div style={{
              padding: '20px',
              borderLeft: '4px solid #1aa54b',
              background: '#f0f9f4',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <QuestionCircleOutlined style={{ fontSize: '24px', color: '#1aa54b', marginRight: '12px' }} />
                <strong style={{ color: '#0a3d2f', fontSize: '18px' }}>FAQs</strong>
              </div>
              <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>
                Find quick answers to common questions.
              </p>
            </div>

            {/* Documentation */}
            <div style={{
              padding: '20px',
              borderLeft: '4px solid #1aa54b',
              background: '#f0f9f4',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <FileTextOutlined style={{ fontSize: '24px', color: '#1aa54b', marginRight: '12px' }} />
                <strong style={{ color: '#0a3d2f', fontSize: '18px' }}>Documentation</strong>
              </div>
              <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>
                Access detailed guides and tutorials.
              </p>
            </div>

          </div>

          {/* Support Hours */}
          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            padding: '16px',
            background: 'linear-gradient(135deg, #0a3d2f, #1aa54b)',
            borderRadius: '8px',
            color: '#fff'
          }}>
            <strong style={{ color: 'white', fontSize: '14px' }}>Support Hours:</strong>
            <div style={{ marginTop: '4px', opacity: 0.95, fontSize: '13px' }}>
              Monday - Friday: 9 AM - 6 PM (EST)
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
});
export default GetHelpModal;
