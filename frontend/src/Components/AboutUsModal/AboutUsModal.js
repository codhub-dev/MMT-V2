import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";
import { TruckOutlined, DollarOutlined, LineChartOutlined, RocketOutlined } from "@ant-design/icons";

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
            background: 'linear-gradient(135deg, #0a3d2f, #1aa54b)',
            margin: '-20px -24px 20px -24px',
            padding: '24px',
            color: 'white',
            borderRadius: '8px 8px 0 0'
          }}>
            <TruckOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>About Manage My Truck</div>
          </div>
        }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={550}
      centered
      zIndex={1600}
    >
      <div style={{ padding: '8px 0' }}>

        {/* Mission Statement */}
        <div style={{
          padding: '20px',
          background: '#f0f9f4',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.6',
            margin: 0,
            color: '#0a3d2f'
          }}>
            Your comprehensive platform for efficient truck fleet management, expense tracking, and profit optimization.
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>

          <div style={{
            padding: '20px',
            borderLeft: '4px solid #1aa54b',
            background: '#f0f9f4',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <DollarOutlined style={{ fontSize: '24px', color: '#1aa54b', marginRight: '12px' }} />
              <strong style={{ color: '#0a3d2f', fontSize: '18px' }}>Smart Expense Tracking</strong>
            </div>
            <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>
              Monitor all truck expenses with detailed insights and real-time reporting.
            </p>
          </div>

          <div style={{
            padding: '20px',
            borderLeft: '4px solid #1aa54b',
            background: '#f0f9f4',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <LineChartOutlined style={{ fontSize: '24px', color: '#1aa54b', marginRight: '12px' }} />
              <strong style={{ color: '#0a3d2f', fontSize: '18px' }}>Profit Analysis</strong>
            </div>
            <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>
              Analyze profits with interactive charts and predictive insights.
            </p>
          </div>

          <div style={{
            padding: '20px',
            borderLeft: '4px solid #1aa54b',
            background: '#f0f9f4',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <RocketOutlined style={{ fontSize: '24px', color: '#1aa54b', marginRight: '12px' }} />
              <strong style={{ color: '#0a3d2f', fontSize: '18px' }}>Modern Interface</strong>
            </div>
            <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>
              Responsive design with mobile-first approach for seamless operation.
            </p>
          </div>

        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #0a3d2f, #1aa54b)',
          borderRadius: '8px',
          color: '#fff'
        }}>
          <strong style={{ color: 'white', fontSize: '16px' }}>
            Transform Your Truck Business Today!
          </strong>
          <p style={{ margin: '8px 0 0 0', opacity: 0.95, fontSize: '14px' }}>
            Start managing your fleet more efficiently
          </p>
        </div>

      </div>
    </Modal>
  );
});

export default AboutUsModal;
