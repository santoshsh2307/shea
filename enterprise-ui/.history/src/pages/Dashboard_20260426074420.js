import React, { useState, useMemo, useEffect } from "react";
import { Card, Row, Col, Statistic, Badge, Dropdown, Button, Spin } from "antd";
import {
  TeamOutlined,
  CrownOutlined,
  UserOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../api/userService";
import Users from "./Users_new";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      const usersWithKey = response.data.map((user) => ({
        ...user,
        key: user.id
      }));
      setUsers(usersWithKey);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===== Dynamic Counts =====
  const stats = useMemo(() => {
    return {
      total: users.length,
      free: users.filter(u => u.membershipType === "Free").length,
      premium: users.filter(u => u.membershipType === "Premium").length
    };
  }, [users]);

  // ===== Menu Items =====
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/dashboard"
    },
    {
      key: "members",
      icon: <UserOutlined />,
      label: (
        <Badge count={stats.total} offset={[10, 0]}>
          Members
        </Badge>
      ),
      path: "/users"
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "My Profile",
      path: "/profile"
    },
    {
      key: "services",
      icon: <AppstoreOutlined />,
      label: "Services",
      path: "/services"
    }
  ];

  // ===== Handle Menu Click =====
  const onMenuClick = ({ key }) => {
    const selected = menuItems.find(item => item.key === key);
    if (selected?.path) {
      navigate(selected.path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const profileMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile")
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout
    }
  ];

  return (
    <Spin spinning={loading}>
      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Members"
              value={stats.total}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Free Members"
              value={stats.free}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Premium Members"
              value={stats.premium}
              prefix={<CrownOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="SHEA Members Overview">
        <Users users={users} setUsers={setUsers} />
      </Card>
    </Spin>
  );
}