import React, { useState, useMemo, useEffect } from "react";
import { Layout, Menu, Badge, Dropdown, Button } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllUsers } from "../api/userService";

const { Header, Sider, Content } = Layout;

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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

  // Get current selected key based on path
  const currentKey = menuItems.find(item => item.path === location.pathname)?.key || "dashboard";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, background: "rgba(255, 255, 255, 0.2)" }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentKey]}
          items={menuItems}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 20 }}>
          <div />
          <Dropdown
            menu={{
              items: [
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Logout",
                  onClick: handleLogout
                }
              ]
            }}
            placement="bottomRight"
          >
            <Button type="text">
              {currentUser?.username || "User"} <UserOutlined />
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}