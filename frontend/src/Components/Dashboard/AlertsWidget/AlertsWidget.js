import React, { useState, useEffect, useContext } from 'react';
import { List, Avatar, Button, Modal, Form, Input, DatePicker, Select, message, Spin, Popconfirm, Badge } from 'antd';
import {
  TruckOutlined,
  AlertOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CarOutlined,
  UserOutlined,
  SafetyOutlined,
  CreditCardOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { Axios } from '../../../Config/Axios/Axios';
import { UserContext } from '../../../App';
import moment from 'moment';

const { Option } = Select;

const THEME_GREEN = "#1a7f37";

// Alert type to icon mapping
const getAlertIcon = (type, priority) => {
  const iconStyle = {
    fontSize: 16,
    color: priority === 'urgent' ? '#ff4d4f' :
           priority === 'high' ? '#fa8c16' :
           priority === 'medium' ? '#1677ff' : '#52c41a'
  };

  const icons = {
    maintenance: <ToolOutlined style={iconStyle} />,
    delivery: <TruckOutlined style={iconStyle} />,
    license: <UserOutlined style={iconStyle} />,
    insurance: <SafetyOutlined style={iconStyle} />,
    inspection: <ExclamationCircleOutlined style={iconStyle} />,
    fuel: <CarOutlined style={iconStyle} />,
    payment: <CreditCardOutlined style={iconStyle} />,
    other: <AlertOutlined style={iconStyle} />
  };

  return icons[type] || icons.other;
};

// Format date for display
const formatAlertDate = (date) => {
  const alertDate = moment(date);
  const now = moment();
  const diffDays = alertDate.diff(now, 'days');

  if (diffDays < 0) {
    return { text: `Overdue by ${Math.abs(diffDays)} days`, isOverdue: true };
  } else if (diffDays === 0) {
    return { text: 'Due today', isDueToday: true };
  } else if (diffDays === 1) {
    return { text: 'Due tomorrow', isDueSoon: true };
  } else if (diffDays <= 7) {
    return { text: `Due in ${diffDays} days`, isDueSoon: true };
  } else {
    return { text: alertDate.format('MMM DD, YYYY'), isNormal: true };
  }
};

const AlertsWidget = () => {
  const { user } = useContext(UserContext);

  // State management
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // API Functions
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`/api/v1/app/alerts/getAllAlertsByUser/${user.userId}`, {
        params: {
          limit: 10,
          sortBy: 'alertDate',
          sortOrder: 'asc',
          isRead: false // Only show unread alerts in widget
        },
        headers: {
          authorization: `bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data && response.data.success) {
        setAlerts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      message.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const addAlert = async (alertData) => {
    try {
      setSubmitLoading(true);
      const response = await Axios.post('/api/v1/app/alerts/addAlert', {
        ...alertData,
        addedBy: user.userId,
      }, {
        headers: {
          authorization: `bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data && response.data.success) {
        message.success('Alert created successfully');
        fetchAlerts(); // Refresh the list
        return response.data.data;
      }
    } catch (error) {
      console.error('Error adding alert:', error);
      message.error(error.response?.data?.message || 'Failed to create alert');
      throw error;
    } finally {
      setSubmitLoading(false);
    }
  };

  const updateAlert = async (alertId, alertData) => {
    try {
      setSubmitLoading(true);
      const response = await Axios.put(`/api/v1/app/alerts/updateAlertById/${alertId}`, alertData, {
        headers: {
          authorization: `bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data && response.data.success) {
        message.success('Alert updated successfully');
        fetchAlerts(); // Refresh the list
        return response.data.data;
      }
    } catch (error) {
      console.error('Error updating alert:', error);
      message.error(error.response?.data?.message || 'Failed to update alert');
      throw error;
    } finally {
      setSubmitLoading(false);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      const response = await Axios.put(`/api/v1/app/alerts/markAlertAsRead/${alertId}`, {
        isRead: true
      }, {
        headers: {
          authorization: `bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data && response.data.success) {
        setAlerts(alerts.filter(alert => alert._id !== alertId));
        message.success('Alert marked as read');
      }
    } catch (error) {
      console.error('Error marking alert as read:', error);
      message.error('Failed to mark alert as read');
    }
  };

  const deleteAlert = async (alertId) => {
    try {
      const response = await Axios.delete(`/api/v1/app/alerts/deleteAlertById/${alertId}`, {
        headers: {
          authorization: `bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data && response.data.success) {
        setAlerts(alerts.filter(alert => alert._id !== alertId));
        message.success('Alert deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      message.error('Failed to delete alert');
    }
  };

  // Load alerts on component mount
  useEffect(() => {
    const loadAlerts = async () => {
      if (user && user.userId) {
        await fetchAlerts();
      }
    };

    loadAlerts();
  }, [user?.userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Event handlers
  const handleAddAlert = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalVisible(false);
    form.resetFields();
  };

  const handleAddAlertSubmit = async (values) => {
    try {
      const alertData = {
        ...values,
        alertDate: values.alertDate.toISOString()
      };

      await addAlert(alertData);
      setIsAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Error already handled in addAlert function
    }
  };

  const handleEditAlert = (alert) => {
    setSelectedAlert(alert);
    editForm.setFieldsValue({
      ...alert,
      alertDate: moment(alert.alertDate)
    });
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
    setSelectedAlert(null);
  };

  const handleEditAlertSubmit = async (values) => {
    try {
      const alertData = {
        ...values,
        alertDate: values.alertDate.toISOString()
      };

      await updateAlert(selectedAlert._id, alertData);
      setIsEditModalVisible(false);
      editForm.resetFields();
      setSelectedAlert(null);
    } catch (error) {
      // Error already handled in updateAlert function
    }
  };

  // Don't render if user is not available
  if (!user || !user.userId) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: 12,
        height: '100%',
        padding: 26,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200
      }}>
        <Spin size="large" />
      </div>
    );
  }

  const hasData = alerts && alerts.length > 0;

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        height: '100%',
        padding: 26,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <b style={{
            margin: 0,
            color: "#222",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "0.2px"
          }}>
          Alerts
          {alerts.length > 0 && (
            <Badge
              count={alerts.length}
              style={{ backgroundColor: THEME_GREEN, marginLeft: 8 }}
            />
          )}
        </b>
        <Button
          type="primary"
          icon={<PlusOutlined style={{fontSize: 15}}/>}
          size="small"
          onClick={handleAddAlert}
          style={{
            borderRadius: 16,
            background: THEME_GREEN,
            fontWeight: 500,
            border: "none",
            fontSize: "14px",
            padding: "5px 14px",
            height: 'auto'
          }}
        >
          Add
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150 }}>
          <Spin size="large" />
        </div>
      ) : hasData ? (
        <List
          itemLayout="horizontal"
          dataSource={alerts}
          renderItem={(alert) => {
            const dateInfo = formatAlertDate(alert.alertDate);
            return (
              <List.Item
                style={{ padding: '12px 0', cursor: 'pointer' }}
                actions={[
                  <Popconfirm
                    key="read"
                    title="Mark as Read"
                    description="Are you sure you want to mark this alert as read?"
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      markAsRead(alert._id);
                    }}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ style: { background: THEME_GREEN, borderColor: THEME_GREEN } }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      title="Mark as read"
                    />
                  </Popconfirm>,
                  <Button
                    key="edit"
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAlert(alert);
                    }}
                    title="Edit alert"
                  />,
                  <Popconfirm
                    key="delete"
                    title="Delete Alert"
                    description="Are you sure you want to delete this alert?"
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      deleteAlert(alert._id);
                    }}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ style: { background: '#ff4d4f', borderColor: '#ff4d4f' } }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      danger
                      title="Delete alert"
                    />
                  </Popconfirm>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{ backgroundColor: '#f5f5f5' }}
                      icon={getAlertIcon(alert.type, alert.priority)}
                    />
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 500, fontSize: 14 }}>{alert.title}</span>
                      {alert.priority === 'urgent' && (
                        <Badge status="error" text="Urgent" />
                      )}
                      {alert.priority === 'high' && (
                        <Badge status="warning" text="High" />
                      )}
                    </div>
                  }
                  description={
                    <div style={{
                      fontSize: 12,
                      color: dateInfo.isOverdue ? '#ff4d4f' :
                             dateInfo.isDueToday ? '#fa8c16' :
                             dateInfo.isDueSoon ? '#1677ff' : '#8c8c8c',
                      fontWeight: dateInfo.isOverdue || dateInfo.isDueToday ? 500 : 400
                    }}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {dateInfo.text}
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8c8c8c' }}>
          <AlertOutlined style={{ fontSize: 48, marginBottom: 16, color: '#d9d9d9' }} />
          <div>No alerts found</div>
          <div style={{ fontSize: 12, marginBottom: 16 }}>Click "Add" to create your first alert</div>
          <Button
            type="link"
            onClick={fetchAlerts}
            style={{ color: THEME_GREEN, fontSize: 12 }}
          >
            Refresh
          </Button>
        </div>
      )}

      {/* Add Alert Modal */}
      <Modal
        title="Create New Alert"
        open={isAddModalVisible}
        onCancel={handleAddModalClose}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddAlertSubmit}
        >
          <Form.Item
            label="Alert Title"
            name="title"
            rules={[{ required: true, message: 'Please enter alert title' }]}
          >
            <Input placeholder="Enter alert title" maxLength={100} />
          </Form.Item>

          <Form.Item
            label="Alert Date & Time"
            name="alertDate"
            rules={[{ required: true, message: 'Please select alert date and time' }]}
          >
            <DatePicker
              showTime
              style={{ width: '100%' }}
              placeholder="Select date and time"
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            label="Alert Type"
            name="type"
            rules={[{ required: true, message: 'Please select alert type' }]}
          >
            <Select placeholder="Select alert type">
              <Option value="maintenance">Maintenance</Option>
              <Option value="delivery">Delivery</Option>
              <Option value="license">License</Option>
              <Option value="insurance">Insurance</Option>
              <Option value="inspection">Inspection</Option>
              <Option value="fuel">Fuel</Option>
              <Option value="payment">Payment</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: 'Please select priority' }]}
            initialValue="medium"
          >
            <Select placeholder="Select priority">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="urgent">Urgent</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={handleAddModalClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitLoading}
              style={{ background: THEME_GREEN, border: "none" }}
            >
              Create Alert
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Alert Modal */}
      <Modal
        title="Edit Alert"
        open={isEditModalVisible}
        onCancel={handleEditModalClose}
        footer={null}
        centered
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditAlertSubmit}
        >
          <Form.Item
            label="Alert Title"
            name="title"
            rules={[{ required: true, message: 'Please enter alert title' }]}
          >
            <Input placeholder="Enter alert title" maxLength={100} />
          </Form.Item>

          <Form.Item
            label="Alert Date & Time"
            name="alertDate"
            rules={[{ required: true, message: 'Please select alert date and time' }]}
          >
            <DatePicker
              showTime
              style={{ width: '100%' }}
              placeholder="Select date and time"
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            label="Alert Type"
            name="type"
            rules={[{ required: true, message: 'Please select alert type' }]}
          >
            <Select placeholder="Select alert type">
              <Option value="maintenance">Maintenance</Option>
              <Option value="delivery">Delivery</Option>
              <Option value="license">License</Option>
              <Option value="insurance">Insurance</Option>
              <Option value="inspection">Inspection</Option>
              <Option value="fuel">Fuel</Option>
              <Option value="payment">Payment</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: 'Please select priority' }]}
          >
            <Select placeholder="Select priority">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="urgent">Urgent</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={handleEditModalClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitLoading}
              style={{ background: THEME_GREEN, border: "none" }}
            >
              Update Alert
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AlertsWidget;
