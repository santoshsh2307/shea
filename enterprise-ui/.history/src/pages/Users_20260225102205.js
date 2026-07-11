import React, { useState, useMemo } from "react";
import {
  Table,
  Select,
  Input,
  Row,
  Col,
  Card,
  Dropdown,
  Button,
  Space,
  Tag
} from "antd";
import { SettingOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Search } = Input;

export default function Users() {

  // ================= HARD CODED DATA =================
  const [users] = useState([
    {
      key: 1,
      name: "Santosh",
      dob: "1995-06-10",
      star: "Ashwini",
      education: "B.Tech",
      occupation: "Software Engineer",
      contactNumber: "9876543210",
      bloodGroup: "O+",
    },
    {
      key: 2,
      name: "Ravi",
      dob: "1993-03-15",
      star: "Rohini",
      education: "MBA",
      occupation: "Manager",
      contactNumber: "9876501234",
      bloodGroup: "A+",
    }
  ]);

  const [searchText, setSearchText] = useState("");
  const [occupationFilter, setOccupationFilter] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState([
    "name",
    "occupation",
    "education",
    "contactNumber"
  ]);

  // ================= FILTER LOGIC =================
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchMatch =
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.education.toLowerCase().includes(searchText.toLowerCase());

      const occupationMatch = occupationFilter
        ? user.occupation === occupationFilter
        : true;

      return searchMatch && occupationMatch;
    });
  }, [users, searchText, occupationFilter]);

  // ================= ALL COLUMNS =================
  const allColumns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: "Occupation",
      dataIndex: "occupation",
      render: (occ) => <Tag color="blue">{occ}</Tag>
    },
    {
      title: "Education",
      dataIndex: "education"
    },
    {
      title: "Contact",
      dataIndex: "contactNumber"
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (bg) => <Tag color="green">{bg}</Tag>
    }
  ];

  const columns = allColumns.filter(col =>
    visibleColumns.includes(col.dataIndex)
  );

  // ================= COLUMN DROPDOWN =================
  const columnMenu = (
    <div style={{ padding: 10 }}>
      {allColumns.map(col => (
        <div key={col.dataIndex}>
          <input
            type="checkbox"
            checked={visibleColumns.includes(col.dataIndex)}
            onChange={(e) => {
              if (e.target.checked) {
                setVisibleColumns(prev => [...prev, col.dataIndex]);
              } else {
                setVisibleColumns(prev =>
                  prev.filter(c => c !== col.dataIndex)
                );
              }
            }}
          />
          <span style={{ marginLeft: 8 }}>{col.title}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: 24 }}>

      <Card
        title="User Management"
        extra={
          <Dropdown overlay={columnMenu} trigger={["click"]}>
            <Button icon={<SettingOutlined />}>
              Columns
            </Button>
          </Dropdown>
        }
      >

        {/* FILTER BAR */}
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Search
              placeholder="Search by name or education"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>

          <Col span={6}>
            <Select
              placeholder="Filter by Occupation"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => setOccupationFilter(value)}
            >
              {[...new Set(users.map(u => u.occupation))].map(occ => (
                <Option key={occ} value={occ}>{occ}</Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* TABLE */}
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: 5 }}
        />

      </Card>
    </div>
  );
}