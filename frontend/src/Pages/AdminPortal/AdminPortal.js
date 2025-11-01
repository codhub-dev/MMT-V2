import React, { useEffect, useState } from "react";
import { Table, Button, Card, Typography, message, Input, Space } from "antd";
import axios from "axios";
import { Axios } from "../../Config/Axios/Axios";

const { Title, Text } = Typography;
const { Search } = Input;

export default function AdminPortal() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await Axios.get("/api/v1/app/admin/getAlluser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Filter out ADMINs
      const filteredUsers = res.data.users.filter((user) => !user.isAdmin);

      setUsers(filteredUsers);
    } catch (err) {
      message.error("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const manageSubscription = async (userId) => {
    try {
      await Axios.put(
        `/api/v1/app/admin/manageSubscription`,
        {
          userId: userId,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isSubscribed: true } : user
        )
      );
      message.success("User subscribtion status updated");
    } catch (err) {
      message.error("Failed to update subscribtion status");
      console.error(err);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Creation Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date?.split("T")[0],
    },
    {
      title: "Creation Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (time) => time?.split("T")[1]?.split(".")[0],
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        if (record.isSubscribed) {
          return <Text type="success">Subscribed</Text>;
        } else {
          return <Text type="danger">Unsubscribed</Text>;
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (record.isSubscribed) {
          return (
            <Button type="primary" danger onClick={() => manageSubscription(record.id)}>
              Unsubscribe 
            </Button>
          );
        } else {
          return (
            <Button type="primary" onClick={() => manageSubscription(record.id)}>
              Subscribe 
            </Button>
          );
        }
      },
    },
  ];

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  return (
    <div
      className="rounded"
      style={{
        padding: "2rem",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Card style={{ marginBottom: "2rem" }}>
        <Title
          level={2}
          style={{ textAlign: "center", color: "#1890ff", fontWeight: 800 }}
        >
          Admin Dashboard
        </Title>
      </Card>

      <Card style={{ marginBottom: "1rem" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Search
            placeholder="Search by name"
            allowClear
            enterButton
            onSearch={(value) => setSearchTerm(value)}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Space>
      </Card>

      <Card>
        <Table
          dataSource={filteredUsers.map((user) => ({ ...user, key: user.id }))}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 15 }}
        />
      </Card>
    </div>
  );
}
