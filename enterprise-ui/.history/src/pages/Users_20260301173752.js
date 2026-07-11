import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  Row,
  Col,
  Card,
  Dropdown,
  Button,
  Tag,
  Checkbox,
  Modal,
  Space,
  Popconfirm,
  message,
  Select,
  Drawer
} from "antd";
import {
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined
} from "@ant-design/icons";
import CreateUser from "./CreateUser";

const { Search } = Input;
const { Option } = Select;

export default function Users() {

  // ================= GENERATE DATA =================

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
      education: index % 2 === 0 ? "B.Tech" : "MBA",
      occupation: index % 2 === 0 ? "Software Engineer" : "Manager",
      jobType: "Private",
      experience: `${2 + (index % 8)}`,
      membershipType: index % 3 === 0 ? "Free" : "Premium"
    }));
  };

  const [users, setUsers] = useState(generateUsers(30));
  const [searchText, setSearchText] = useState("");

  // ✅ Important columns by default
  const [visibleColumns, setVisibleColumns] = useState([
    "name",
    "contactNumber",
    "occupation",
    "education",
    "bloodGroup",
    "membershipType"
  ]);

  const [advancedFilters, setAdvancedFilters] = useState([
    { field: "", operator: "contains", value: "" }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // ================= FILTER LOGIC =================

  const filteredUsers = useMemo(() => {
    return users.filter(user => {

      const globalMatch =
        Object.values(user)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase());

      const advancedMatch = advancedFilters.every(filter => {
        if (!filter.field || !filter.value) return true;

        const userValue = String(user[filter.field] || "").toLowerCase();
        const filterValue = filter.value.toLowerCase();

        switch (filter.operator) {
          case "equals":
            return userValue === filterValue;
          case "startsWith":
            return userValue.startsWith(filterValue);
          default:
            return userValue.includes(filterValue);
        }
      });

      return globalMatch && advancedMatch;
    });
  }, [users, searchText, advancedFilters]);

  // ================= ACTIONS =================

  const handleDelete = (key) => {
    setUsers(prev => prev.filter(user => user.key !== key));
    message.success("User deleted successfully");
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalVisible(true);
  };

  const openEditModal = (record) => {
    setEditingUser({ ...record });
    setIsModalVisible(true);
  };

  // ================= ALL COLUMNS =================

  const allColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "DOB", dataIndex: "dob" },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (bg) => <Tag color="blue">{bg}</Tag>
    },
    { title: "Contact", dataIndex: "contactNumber" },
    { title: "Education", dataIndex: "education" },
    {
      title: "Occupation",
      dataIndex: "occupation",
      render: (occ) => <Tag color="geekblue">{occ}</Tag>
    },
    {
      title: "Membership",
      dataIndex: "membershipType",
      render: (type) => (
        <Tag
          color={type === "Free" ? "red" : "green"}
          style={{ fontWeight: "bold" }}
        >
          {type}
        </Tag>
      )
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <EditOutlined
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const columns = allColumns.filter(
    col =>
      col.key === "action" ||
      visibleColumns.includes(col.dataIndex)
  );

  const columnItems = allColumns
    .filter(col => col.dataIndex)
    .map(col => ({
      key: col.dataIndex,
      label: (
        <Checkbox
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
        >
          {col.title}
        </Checkbox>
      )
    }));

  // ================= RETURN =================

  return (
    <div style={{ width: "100%", padding: 10 }}>

      <Card
        title="User Management"
        style={{ width: "100%" }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              New User
            </Button>

            <Button
              icon={<FilterOutlined />}
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              Filters
            </Button>

            <Dropdown menu={{ items: columnItems }} trigger={["click"]}>
              <Button icon={<SettingOutlined />}>
                Columns
              </Button>
            </Dropdown>
          </Space>
        }
      >

        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Search
              placeholder="Search anything..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
        </Row>

        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="key"
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 5 }}
          size="small"
          rowClassName={(record) =>
            record.membershipType === "Free"
              ? "free-member-row"
              : ""
          }
        />

      </Card>

      {/* FILTER DRAWER */}

      <Drawer
        title="Advanced Filters"
        placement="right"
        width={400}
        onClose={() => setIsFilterDrawerOpen(false)}
        open={isFilterDrawerOpen}
      >
        {advancedFilters.map((filter, index) => (
          <div key={index} style={{ marginBottom: 20 }}>

            <Select
              placeholder="Select Field"
              style={{ width: "100%", marginBottom: 10 }}
              value={filter.field}
              onChange={(value) => {
                const newFilters = [...advancedFilters];
                newFilters[index].field = value;
                setAdvancedFilters(newFilters);
              }}
            >
              {Object.keys(users[0] || {}).map(field =>
                field !== "key" && (
                  <Option key={field} value={field}>
                    {field}
                  </Option>
                )
              )}
            </Select>

            <Select
              value={filter.operator}
              style={{ width: "100%", marginBottom: 10 }}
              onChange={(value) => {
                const newFilters = [...advancedFilters];
                newFilters[index].operator = value;
                setAdvancedFilters(newFilters);
              }}
            >
              <Option value="contains">Contains</Option>
              <Option value="equals">Equals</Option>
              <Option value="startsWith">Starts With</Option>
            </Select>

            <Input
              placeholder="Enter value"
              value={filter.value}
              onChange={(e) => {
                const newFilters = [...advancedFilters];
                newFilters[index].value = e.target.value;
                setAdvancedFilters(newFilters);
              }}
              style={{ marginBottom: 10 }}
            />

            <Button
              danger
              block
              onClick={() =>
                setAdvancedFilters(prev =>
                  prev.filter((_, i) => i !== index)
                )
              }
            >
              Remove
            </Button>
          </div>
        ))}
      </Drawer>

      {/* CREATE / EDIT MODAL */}

      <Modal
        title={editingUser ? "Edit User" : "Create User"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width="85%"
        destroyOnClose
      >
        <CreateUser
          initialValues={editingUser}
          onSuccess={(data) => {
            if (editingUser) {
              setUsers(prev =>
                prev.map(user =>
                  user.key === editingUser.key ? data : user
                )
              );
              message.success("User updated successfully");
            } else {
              setUsers(prev => [...prev, data]);
              message.success("User created successfully");
            }
            setIsModalVisible(false);
            setEditingUser(null);
          }}
        />
      </Modal>

      {/* FREE MEMBER ROW STYLE */}
      <style>
        {`
          .free-member-row {
            background-color: #fff2f0 !important;
          }
        `}
      </style>

    </div>
  );
}