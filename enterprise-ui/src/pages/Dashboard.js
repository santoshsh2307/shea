import React, { useState, useMemo, useEffect } from "react";
import { Card, Row, Col, Statistic, Spin, Grid } from "antd";
import {
  TeamOutlined,
  CrownOutlined
} from "@ant-design/icons";
import { getAllUsers } from "../api/userService";
import Users from "./Users_new";

export default function Dashboard() {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  return (
    <Spin spinning={loading}>
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
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

      <Card title="SHEA Members Overview" bodyStyle={{ padding: isMobile ? 12 : 24 }}>
        <Users users={users} setUsers={setUsers} />
      </Card>
    </Spin>
  );
}