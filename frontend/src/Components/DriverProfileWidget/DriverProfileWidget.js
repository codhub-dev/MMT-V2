import React, { useState } from 'react';
import { Modal, Button, List, Avatar, Typography, Space, Form, Input, Upload, message, Select } from 'antd';
import { UserOutlined, PlusOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const THEME_GREEN = "#1a7f37";

const initialDrivers = [
  {
    id: 1,
    name: 'Brinda S',
    contact: '9876543210',
    age: 32,
    experience: '5 years',
    license: 'DL123456',
    gender: 'Female',
    photo: 'https://randomuser.me/api/portraits/women/32.jpg'
  },
  {
    id: 2,
    name: 'Rahul K',
    contact: '9123456789',
    age: 29,
    experience: '3 years',
    license: 'DL654321',
    gender: 'Male',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  // Add more drivers as needed
];

const DriverProfileWidget = () => {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [photoUrl, setPhotoUrl] = useState('');
  const [editPhotoUrl, setEditPhotoUrl] = useState('');

  const showDriverDetails = (driver) => {
    setSelectedDriver(driver);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedDriver(null);
  };

  const handleAddDriver = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalVisible(false);
    form.resetFields();
    setPhotoUrl('');
  };

  const handleAddDriverSubmit = (values) => {
    const newDriver = {
      ...values,
      id: drivers.length + 1,
      photo: photoUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'
    };
    setDrivers([...drivers, newDriver]);
    setIsAddModalVisible(false);
    form.resetFields();
    setPhotoUrl('');
  };

  // Edit functionality
  const handleEditDriver = () => {
    editForm.setFieldsValue(selectedDriver);
    setEditPhotoUrl(selectedDriver.photo);
    setIsEditModalVisible(true);
    setIsModalVisible(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
    setEditPhotoUrl('');
    setSelectedDriver(null);
  };

  const handleEditDriverSubmit = (values) => {
    const updatedDriver = {
      ...selectedDriver,
      ...values,
      photo: editPhotoUrl || selectedDriver.photo
    };
    setDrivers(drivers.map(d => d.id === selectedDriver.id ? updatedDriver : d));
    setIsEditModalVisible(false);
    editForm.resetFields();
    setEditPhotoUrl('');
    setSelectedDriver(updatedDriver);
    setIsModalVisible(true); 
  };

  // Handle photo upload for add
  const uploadProps = {
    beforeUpload: file => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
        return Upload.LIST_IGNORE;
      }
      const reader = new FileReader();
      reader.onload = e => setPhotoUrl(e.target.result);
      reader.readAsDataURL(file);
      return false;
    },
    showUploadList: false,
    accept: "image/*"
  };

  // Handle photo upload for edit
  const editUploadProps = {
    beforeUpload: file => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
        return Upload.LIST_IGNORE;
      }
      const reader = new FileReader();
      reader.onload = e => setEditPhotoUrl(e.target.result);
      reader.readAsDataURL(file);
      return false;
    },
    showUploadList: false,
    accept: "image/*"
  };

  return (
    <div className="driver-profile-card" style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "18px 22px",
      margin: "24px 0",
      boxShadow: "0 2px 8px rgba(22,119,255,0.07)",
      width: 540,
      minWidth: 320,
      maxWidth: "100%",
      height: 400, 
      overflowY: "auto", 
      display: "inline-block"
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <b style={{
          margin: 0,
          color: "#222",
          fontSize: "16px", 
          fontWeight: 700,  
          letterSpacing: "0.2px"
        }}>
          Driver Profiles
        </b>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          size="small"
          onClick={handleAddDriver}
          style={{ borderRadius: 14, background: THEME_GREEN, fontWeight: 500, border: "none", fontSize: "12px", padding: "0 12px" }}
        >
          Add
        </Button>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={drivers}
        renderItem={driver => (
          <List.Item
            style={{
              cursor: 'pointer',
              borderRadius: "18px", 
              transition: 'background 0.2s',
              marginBottom: 0,
              padding: "6px 0",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
            onClick={() => showDriverDetails(driver)}
            className="driver-list-item"
          >
            <Space align="center" size="small">
              <Avatar
                src={driver.photo}
                icon={!driver.photo && <UserOutlined />}
                size={48} 
                style={{ backgroundColor: THEME_GREEN, color: "#fff" }}
              />
              <div>
                <span style={{
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#222",
                  letterSpacing: "0.2px"
                }}>
                  {driver.name}
                </span>
                <br />
                <span style={{
                  fontSize: "12px",
                  color: "#939393",
                  fontWeight: 400
                }}>
                  {driver.contact}
                </span>
              </div>
            </Space>
            <span
              style={{
                fontSize: 18,
                color: THEME_GREEN,
                fontWeight: 700,
                marginLeft: 12,
                padding: "0 8px", 
                background: "none", 
                borderRadius: 0,   
                display: "inline-block"
              }}
            >
                
            </span>
          </List.Item>
        )}
      />
      {/* Driver Details Modal */}
      <Modal
        title={
          <span style={{ fontWeight: 600, fontSize: 20, color: "#222" }}> 
            {selectedDriver?.name}'s Details
          </span>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="edit" icon={<EditOutlined />} style={{ borderRadius: 24, background: THEME_GREEN, border: "none", marginRight: 8 }} onClick={handleEditDriver}>
            Edit
          </Button>,
          <Button key="close" type="primary" style={{ borderRadius: 24, background: THEME_GREEN, border: "none" }} onClick={handleModalClose}>
            Close
          </Button>
        ]}
        centered
        bodyStyle={{ fontSize: 16, padding: 24, background: "#fff" }} 
      >
        {selectedDriver && (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}> 
            <Avatar
              src={selectedDriver.photo || "https://randomuser.me/api/portraits/lego/1.jpg"}
              size={120}
              shape="square"
              style={{
                marginRight: 24,
                background: THEME_GREEN,
                width: "96px",
                height: "120px", // 4:5 ratio
                objectFit: "cover"
              }}
            />
            <div style={{ textAlign: "left", flex: 1 }}>
              <Text><b>Name:</b> {selectedDriver.name}</Text><br />
              <Text><b>Gender:</b> {selectedDriver.gender}</Text><br />
              <Text><b>Contact:</b> {selectedDriver.contact}</Text><br />
              <Text><b>Age:</b> {selectedDriver.age}</Text><br />
              <Text><b>Experience:</b> {selectedDriver.experience}</Text><br />
              <Text><b>License:</b> {selectedDriver.license}</Text>
            </div>
          </div>
        )}
      </Modal>
      {/* Add Driver Modal */}
      <Modal
        title={
          <span style={{ fontWeight: 600, fontSize: 20, color: THEME_GREEN }}>
            Add New Driver
          </span>
        }
        open={isAddModalVisible}
        onCancel={handleAddModalClose}
        footer={null}
        centered
        bodyStyle={{ fontSize: 16, padding: 24, background: "#fff" }} 
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddDriverSubmit}
        >
          <Form.Item label="Photo" name="photo">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload Passport Photo</Button>
            </Upload>
            {photoUrl && (
              <Avatar
                src={photoUrl}
                shape="square"
                size={80}
                style={{
                  marginTop: 12,
                  width: "64px",
                  height: "80px", 
                  objectFit: "cover",
                  background: THEME_GREEN
                }}
              />
            )}
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter driver name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select placeholder="Select gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Contact"
            name="contact"
            rules={[{ required: true, message: 'Please enter contact number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: 'Please enter age' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Experience"
            name="experience"
            rules={[{ required: true, message: 'Please enter experience' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="License"
            name="license"
            rules={[{ required: true, message: 'Please enter license number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleAddModalClose} style={{ borderRadius: 24 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" style={{ borderRadius: 24, background: THEME_GREEN, border: "none" }}>
                Add Driver
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Edit Driver Modal */}
      <Modal
        title={
          <span style={{ fontWeight: 600, fontSize: 20, color: THEME_GREEN }}>
            Edit Driver
          </span>
        }
        open={isEditModalVisible}
        onCancel={handleEditModalClose}
        footer={null}
        centered
        bodyStyle={{ fontSize: 16, padding: 24, background: "#fff" }} 
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditDriverSubmit}
        >
          <Form.Item label="Photo" name="photo">
            <Upload {...editUploadProps}>
              <Button icon={<UploadOutlined />}>Upload Passport Photo</Button>
            </Upload>
            {editPhotoUrl && (
              <Avatar
                src={editPhotoUrl}
                shape="square"
                size={80}
                style={{
                  marginTop: 12,
                  width: "64px",
                  height: "80px", 
                  objectFit: "cover",
                  background: THEME_GREEN
                }}
              />
            )}
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter driver name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select placeholder="Select gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Contact"
            name="contact"
            rules={[{ required: true, message: 'Please enter contact number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: 'Please enter age' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Experience"
            name="experience"
            rules={[{ required: true, message: 'Please enter experience' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="License"
            name="license"
            rules={[{ required: true, message: 'Please enter license number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleEditModalClose} style={{ borderRadius: 24 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" style={{ borderRadius: 24, background: THEME_GREEN, border: "none" }}>
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <style>
        {`
          .driver-list-item:hover {
            background: #e0e0e0 !important;
          }
        `}
      </style>
    </div>
  );
};

export default DriverProfileWidget;