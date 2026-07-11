import React, { useState, useMemo } from "react";
import { Table, Button, Select, Checkbox, Row, Col, Card } from "antd";

const { Option } = Select;

export default function Users() {

  // ================= HARD CODED DATA =================
  const [users] = useState([
    {
      key: 1,
      name: "Santosh",
      dob: "1995-06-10",
      birthDay: "Monday",
      star: "Ashwini",
      bedaga: "XYZ",
      height: "5.8",
      weight: "70",
      bloodGroup: "O+",
      education: "B.Tech",
      occupation: "Software Engineer",
      contactNumber: "9876543210",
      latitude: 12.9716,
      longitude: 77.5946,
    },
    {
      key: 2,
      name: "Ravi",
      dob: "1993-03-15",
      birthDay: "Friday",
      star: "Rohini",
      bedaga: "ABC",
      height: "5.6",
      weight: "65",
      bloodGroup: "A+",
      education: "MBA",
      occupation: "Manager",
      contactNumber: "9876501234",
    }
  ]);

  // ================= FILTER STATE =================
  const [occupationFilter, setOccupationFilter] = useState(null);

  // ================= COLUMN VISIBILITY =================
  const [visibleColumns, setVisibleColumns] = useState([
    "name",
    "occupation",
    "education",
    "contactNumber",
  ]);

  // ================= FILTER LOGIC =================
  const filteredUsers = useMemo(() => {
    if (!occupationFilter) return users;
    return users.filter(user => user.occupation === occupationFilter);
  }, [users, occupationFilter]);

  // ================= ALL COLUMNS =================
  const allColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "DOB", dataIndex: "dob" },
    { title: "Birth Day", dataIndex: "birthDay" },
    { title: "Star", dataIndex: "star" },
    { title: "Bedaga", dataIndex: "bedaga" },
    { title: "Height", dataIndex: "height" },
    { title: "Weight", dataIndex: "weight" },
    { title: "Blood Group", dataIndex: "bloodGroup" },
    { title: "Education", dataIndex: "education" },
    { title: "Occupation", dataIndex: "occupation" },
    { title: "Contact", dataIndex: "contactNumber" },
    {
      title: "Location",
      render: (_, record) =>
        record.latitude ? (
          <a
            href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Map
          </a>
        ) : (
          "Not Captured"
        ),
    },
  ];

  // ================= APPLY COLUMN VISIBILITY =================
  const columns = allColumns.filter(col =>
    visibleColumns.includes(col.dataIndex)
  );

  return (
    <div style={{ padding: 20 }}>

      <Card style={{ marginBottom: 20 }}>

        <Row gutter={16}>

          {/* Occupation Filter */}
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

          {/* Column Hide / Show */}
          <Col span={12}>
            <Checkbox.Group
              options={allColumns
                .filter(col => col.dataIndex)
                .map(col => ({
                  label: col.title,
                  value: col.dataIndex
                }))
              }
              value={visibleColumns}
              onChange={(checkedValues) => setVisibleColumns(checkedValues)}
            />
          </Col>

        </Row>

      </Card>

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="key"
        scroll={{ x: 1200 }}
      />

    </div>
  );
}