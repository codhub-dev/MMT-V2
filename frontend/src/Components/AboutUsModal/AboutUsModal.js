import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const AboutUsModal = forwardRef((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => {
    setIsModalOpen(false);
  }
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  useImperativeHandle(ref, () => ({
    showModal,
    hideModal,
  }));

  return (
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
          🚛 About Manage My Truck
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={700}
      centered
      style={{ borderRadius: '16px' }}
    >
      <div style={{
        padding: '24px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '12px',
        margin: '-24px -24px 0 -24px'
      }}>

        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '24px',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚛</div>
          <h2 style={{
            color: 'white',
            margin: '0 0 16px 0',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            Manage My Truck (MMT)
          </h2>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.6',
            margin: 0,
            opacity: 0.95
          }}>
            Your comprehensive platform for efficient truck fleet management,
            expense tracking, and profit optimization.
          </p>
        </div>

        {/* Features Grid */}
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
            fontSize: '22px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            ✨ Key Features & Benefits
          </h3>

          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{
              padding: '20px',
              borderLeft: '5px solid #52c41a',
              background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>💰</span>
                <strong style={{ color: '#52c41a', fontSize: '18px' }}>Smart Expense Tracking</strong>
              </div>
              <p style={{ margin: 0, color: '#555', lineHeight: '1.5' }}>
                Monitor and categorize all your truck-related expenses with detailed insights,
                automated calculations, and real-time reporting for better financial control.
              </p>
            </div>

            <div style={{
              padding: '20px',
              borderLeft: '5px solid #1890ff',
              background: 'linear-gradient(135deg, #f0f5ff 0%, #bae7ff 100%)',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>📊</span>
                <strong style={{ color: '#1890ff', fontSize: '18px' }}>Advanced Profit Analysis</strong>
              </div>
              <p style={{ margin: 0, color: '#555', lineHeight: '1.5' }}>
                Analyze your profits over different periods with interactive charts,
                trend analysis, and predictive insights to maximize your earnings.
              </p>
            </div>

            <div style={{
              padding: '20px',
              borderLeft: '5px solid #fa8c16',
              background: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>🔧</span>
                <strong style={{ color: '#fa8c16', fontSize: '18px' }}>Comprehensive Cost Management</strong>
              </div>
              <p style={{ margin: 0, color: '#555', lineHeight: '1.5' }}>
                Track and manage all costs associated with truck operation, maintenance,
                fuel, and logistics with automated alerts and optimization suggestions.
              </p>
            </div>

            <div style={{
              padding: '20px',
              borderLeft: '5px solid #722ed1',
              background: 'linear-gradient(135deg, #f9f0ff 0%, #d3adf7 100%)',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>🎨</span>
                <strong style={{ color: '#722ed1', fontSize: '18px' }}>Intuitive User Experience</strong>
              </div>
              <p style={{ margin: 0, color: '#555', lineHeight: '1.5' }}>
                Modern, responsive interface built with React, featuring mobile-first design,
                dark mode support, and accessibility compliance for seamless operation.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          padding: '24px',
          background: 'linear-gradient(135deg, #1890ff 0%, #52c41a 100%)',
          borderRadius: '12px',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(24, 144, 255, 0.3)'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚀</div>
          <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '20px' }}>
            Ready to Transform Your Truck Business?
          </h3>
          <p style={{ margin: 0, opacity: 0.95, fontSize: '16px' }}>
            Start managing your fleet more efficiently and profitably today!
          </p>
        </div>

      </div>
    </Modal>
  );
});

export default AboutUsModal;
