import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Modal } from "antd";
import { MailIcon } from "@primer/octicons-react";

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
            color: '#1890ff',
            fontSize: '24px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            🆘 Get Help & Support
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={650}
        centered
        style={{ borderRadius: '16px' }}
      >
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderRadius: '12px',
          margin: '-24px -24px 0 -24px'
        }}>

          {/* Hero Section */}
          <div style={{
            background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '24px',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
            <h2 style={{
              color: 'white',
              margin: '0 0 12px 0',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              We're Here to Help!
            </h2>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.5',
              margin: 0,
              opacity: 0.95
            }}>
              Need assistance with Manage My Truck? Our support team is ready to help you succeed.
            </p>
          </div>

          {/* Contact Options */}
          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{
              color: '#1890ff',
              marginBottom: '24px',
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              📞 Contact Our Support Team
            </h3>

            <div style={{ display: 'grid', gap: '20px' }}>

              {/* Phone Support */}
              <div style={{
                padding: '20px',
                borderLeft: '5px solid #f5222d',
                background: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>📞</span>
                  <strong style={{ color: '#f5222d', fontSize: '18px' }}>Phone Support</strong>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#555', lineHeight: '1.5' }}>
                  Call our helpline for immediate assistance. Our support team is available to help you resolve issues quickly.
                </p>
                <a
                  href="tel:+918921581287"
                  style={{
                    textDecoration: "none",
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: '#f5222d',
                    color: 'white',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📱 +91 8921581287
                </a>
              </div>

              {/* Email Support */}
              <div style={{
                padding: '20px',
                borderLeft: '5px solid #1890ff',
                background: 'linear-gradient(135deg, #f0f5ff 0%, #bae7ff 100%)',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <MailIcon size={24} style={{ color: '#1890ff' }} />
                  <strong style={{ color: '#1890ff', fontSize: '18px' }}>Email Support</strong>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#555', lineHeight: '1.5' }}>
                  Get detailed help and technical support via email. We typically respond within 24 hours.
                </p>
                <a
                  href="mailto:dev.codhub@gmail.com?subject=MMT Support Request&body=Hello MMT Support Team,%0A%0APlease describe your issue or question:%0A%0A"
                  style={{
                    textDecoration: "none",
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: '#1890ff',
                    color: 'white',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📧 dev.codhub@gmail.com
                </a>
              </div>

              {/* FAQ Section */}
              <div style={{
                padding: '20px',
                borderLeft: '5px solid #52c41a',
                background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>❓</span>
                  <strong style={{ color: '#52c41a', fontSize: '18px' }}>Frequently Asked Questions</strong>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#555', lineHeight: '1.5' }}>
                  Find quick answers to common questions about expense tracking, profit analysis, and platform features.
                </p>
                <Button
                  type="primary"
                  style={{
                    background: '#52c41a',
                    borderColor: '#52c41a',
                    fontWeight: 'bold'
                  }}
                >
                  📚 View FAQ
                </Button>
              </div>

              {/* Documentation */}
              <div style={{
                padding: '20px',
                borderLeft: '5px solid #fa8c16',
                background: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>📖</span>
                  <strong style={{ color: '#fa8c16', fontSize: '18px' }}>User Documentation</strong>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#555', lineHeight: '1.5' }}>
                  Comprehensive guides and tutorials to help you make the most of Manage My Truck.
                </p>
                <Button
                  type="primary"
                  style={{
                    background: '#fa8c16',
                    borderColor: '#fa8c16',
                    fontWeight: 'bold'
                  }}
                >
                  📋 Read Docs
                </Button>
              </div>

              {/* Live Chat */}
              <div style={{
                padding: '20px',
                borderLeft: '5px solid #722ed1',
                background: 'linear-gradient(135deg, #f9f0ff 0%, #d3adf7 100%)',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>💬</span>
                  <strong style={{ color: '#722ed1', fontSize: '18px' }}>Live Chat Support</strong>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#555', lineHeight: '1.5' }}>
                  Get instant help through our live chat system. Available during business hours.
                </p>
                <Button
                  type="primary"
                  style={{
                    background: '#722ed1',
                    borderColor: '#722ed1',
                    fontWeight: 'bold'
                  }}
                >
                  💬 Start Chat
                </Button>
              </div>

            </div>
          </div>

          {/* Support Hours */}
          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            padding: '20px',
            background: 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
            borderRadius: '12px',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(82, 196, 26, 0.3)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏰</div>
            <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '18px' }}>
              Support Hours
            </h3>
            <p style={{ margin: 0, opacity: 0.95, fontSize: '14px' }}>
              Monday - Friday: 9:00 AM - 6:00 PM (EST) | Weekend: Email support only
            </p>
          </div>

        </div>
      </Modal>
    </>
  );
});
export default GetHelpModal;
