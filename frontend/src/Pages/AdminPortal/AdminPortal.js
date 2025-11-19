import React, { useEffect, useState } from "react";
import "../../App.css";
import {
  Table,
  Button,
  Card,
  Typography,
  message,
  Input,
  Space,
  Tag,
  Row,
  Col,
  Select,
  Popconfirm,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  UserAddOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Axios } from "../../Config/Axios/Axios";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function AdminPortal() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("/api/v1/app/admin/getAlluser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const filteredUsers = res.data.users.filter((user) => !user.isAdmin).map((user) => ({ ...user, id: user._id }));
      setUsers(filteredUsers);
    } catch (err) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const manageSubscription = async (userId, action) => {
    try {
      await Axios.put(
        `/api/v1/app/admin/manageSubscription`,
        { userId },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isSubscribed: !user.isSubscribed } : user
        )
      );
      message.success(
        `User successfully ${action === "subscribe" ? "subscribed" : "unsubscribed"}`
      );
    } catch (err) {
      message.error("Failed to update subscription status");
    }
  };

  const confirmAction = (userId, action) => {
    manageSubscription(userId, action);
  };

  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>Name</div>,
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: <div style={{ textAlign: "center" }}>Email</div>,
      dataIndex: "email",
      key: "email",
    },
    {
      title: <div style={{ textAlign: "center" }}>Created On</div>,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Text>
          {date?.split("T")[0]}{" "}
          <Text type="secondary">{date?.split("T")[1]?.split(".")[0]}</Text>
        </Text>
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Status</div>,
      key: "status",
      render: (_, record) =>
        record.isSubscribed ? (
          <Tag icon={<CheckCircleOutlined />} style={{ width: "100%", textAlign: "center" }} color="success">
            Subscribed
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} style={{ width: "100%", textAlign: "center" }} color="error">
            Unsubscribed
          </Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) =>
        record.isSubscribed ? (
          <Popconfirm
            title="Are you sure you want to unsubscribe this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => confirmAction(record.id, "unsubscribe")}
            placement="topRight"
          >
            <Button type="primary" danger style={{ width: "100%" }} icon={<CloseCircleOutlined />}>
              Unsubscribe
            </Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            title="Are you sure you want to subscribe this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => confirmAction(record.id, "subscribe")}
            placement="topRight"
          >
            <Button type="primary" style={{ width: "100%" }} icon={<UserAddOutlined />}>
              Subscribe
            </Button>
          </Popconfirm>
        ),
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "subscribed"
          ? user.isSubscribed
          : !user.isSubscribed;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="d-flex flex-column">
        <b style={{ fontSize: "26px" }}>Admin Dashboard</b>
        <span style={{ fontSize: "14px", color: "#939393" }}>Manage users & subscriptions</span>
      </div>

      <Card
        bordered={false}
        style={{
          marginBottom: "1.5rem",
          marginTop: "1.5rem",
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <Row gutter={[16, 16]} align="middle" className="w-100">
          <Col flex="1">
            <Search
              placeholder="Search users by name"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={(value) => setSearchTerm(value)}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col className="pe-0">
            <Space style={{ width: "100%" }} align="center">
              <Select
                size="large"
                value={filter}
                onChange={(value) => setFilter(value)}
                style={{ width: "100%" }}
              >
                <Option value="all">All Users</Option>
                <Option value="subscribed">Subscribed</Option>
                <Option value="unsubscribed">Unsubscribed</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button
              icon={<ReloadOutlined />}
              type="default"
              size="large"
              onClick={fetchUsers}
              loading={loading}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >
        <Table
          bordered
          dataSource={filteredUsers.map((user) => ({ ...user, key: user.id }))}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          style={{ background: "white" }}
        />
      </Card>
    </div>
  );
}