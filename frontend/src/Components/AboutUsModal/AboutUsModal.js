import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const AboutUsModal = forwardRef(({}, ref) => {
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
      title="About Us"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <div className="mt-4 p-2" style={{textAlign: 'justify'}}>
        <p>
          <strong>Manage My Truck (MMT)</strong> is a comprehensive platform
          designed to help you manage your truck's expenses, profits, costs,
          maintenance, and more. MMT provides an intuitive interface
          for efficient truck management.
        </p>
        <h5>Features</h5>
        <ul>
          <li>
            <strong>Expense Tracking:</strong> Monitor and categorize all your
            truck-related expenses.
          </li>
          <li>
            <strong>Profit Analysis:</strong> Analyze your profits over
            different periods.
          </li>
          <li>
            <strong>Cost Management:</strong> Track and manage costs associated
            with truck operation and maintenance.
          </li>
          <li>
            <strong>User-Friendly Interface:</strong> Intuitive and responsive
            UI developed with React.
          </li>
        </ul>
      </div>
    </Modal>
  );
});

export default AboutUsModal;
