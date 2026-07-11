import React, { useState, useMemo } from "react";
import { Layout, Menu, Card, Row, Col, Statistic, Badge, Dropdown, Button } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  CrownOutlined,
  UserOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Users from "./Users";

const { Header, Sider, Content } = Layout;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  // ===== Generate Initial Data =====
  const generateUsers = (count = 30) => {
    return Array.from({ length: count }, (_, index) => ({
      key: index + 1,
      name: `User ${index + 1}`,
      dob: `199${index % 10}-0${(index % 9) + 1}-15`,
      birthDay: "Monday",
      birthTime: "10:30 AM",
      homeGod: "Shiva",
      star: "Ashwini",
      bedaga: "XYZ",
      resemblance: "Fair",
      height: "5.8",
      weight: "70",
      bloodGroup: index % 2 === 0 ? "O+" : "A+",
      contactNumber: `9876543${100 + index}`,
      altContactNumber: `9000000${100 + index}`,
      hobbies: "Reading",
      fatherDetails: "Farmer",
      motherDetails: "Homemaker",
      siblings: "1 Brother",
      caste: "Lingayat",
      currentAddress: "Bangalore",
      permanentAddress: "Hubli",
      fatherRelatives: "Uncle",
      motherRelatives: "Aunt",
      education: index % 2 === 0 ? "B.Tech" : "MBA",
      occupation: index % 2 === 0 ? "Software Engineer" : "Manager",
      jobType: index % 2 === 0 ? "Private" : "Government",
      pfDetails: `PF10${index}`,
      experience: `${2 + (index % 8)}`,
      officeAddress: "Electronic City",
      childrenEducation: "N/A",
      membershipType: index % 3 === 0 ? "Free" : "Premium"
    }));
  };

  const [users, setUsers] = useState(generateUsers(30));

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
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            color: "white",
            fontSize: 20,
            textAlign: "center",
            margin: 16
          }}
        >
          SHEA Admin
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          onClick={onMenuClick}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#001529",
            color: "white",
            fontSize: 20,
            paddingLeft: 20,
            paddingRight: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>SHEA Enterprise Dashboard</div>
          <div>
            {currentUser && (
              <Dropdown menu={{ items: profileMenuItems }} trigger={["click"]}>            
                <Button type="primary" ghost>
                  {currentUser.firstName} {currentUser.lastName}
                </Button>
              </Dropdown>
            )}
          </div>
        </Header>

        <Content style={{ margin: "20px" }}>
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
        </Content>
      </Layout>
    </Layout>
  );
}