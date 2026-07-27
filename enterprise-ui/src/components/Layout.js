import React, { useState, useMemo, useEffect } from "react";
import { Layout, Menu, Badge, Dropdown, Button, Drawer, Grid } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllUsers } from "../api/userService";

const { Header, Sider, Content } = Layout;

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      const usersWithKey = response.data.map((user) => ({
        ...user,
        key: user.id
      }));
      setUsers(usersWithKey);
    } catch (error) {
      console.error("Error fetching users:", error);
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
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Get current selected key based on path
  const currentKey = menuItems.find(item => item.path === location.pathname)?.key || "dashboard";

  const navigationMenu = (
    <>
      <div style={{ height: 32, margin: 16, background: "rgba(255, 255, 255, 0.2)", borderRadius: 6 }} />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[currentKey]}
        items={menuItems}
        onClick={onMenuClick}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile && (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          {navigationMenu}
        </Sider>
      )}

      {isMobile && (
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          bodyStyle={{ padding: 0, background: "#001529" }}
          width={260}
        >
          {navigationMenu}
        </Drawer>
      )}

      <Layout>
        <Header
          style={{
            padding: "0 12px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {isMobile ? (
            <Button type="text" icon={<MenuOutlined />} onClick={() => setMobileMenuOpen(true)} />
          ) : (
            <div />
          )}
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
            <Button type="text" style={{ maxWidth: isMobile ? 170 : 240 }}>
              {currentUser?.username || "User"} <UserOutlined />
            </Button>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: isMobile ? "12px 8px" : "24px 16px",
            padding: isMobile ? 12 : 24,
            background: "#fff",
            overflowX: "auto"
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}