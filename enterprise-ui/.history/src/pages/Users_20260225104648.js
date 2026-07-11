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
  Tag,
  Checkbox,
  Modal,
  Space,
  Popconfirm,
  message
} from "antd";
import {
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import CreateUser from "./CreateUser";

const { Option } = Select;
const { Search } = Input;

export default function Users() {

  // ================= DATA =================
  const [users, setUsers] = useState([
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

  // ===== NEW FILTER STATES =====
  const [nameFilter, setNameFilter] = useState("");
  const [educationFilter, setEducationFilter] = useState("");
  const [selectedOccupations, setSelectedOccupations] = useState([]);

  const [visibleColumns, setVisibleColumns] = useState([
    "name",
    "occupation",
    "education",
    "contactNumber"
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // ================= FILTER LOGIC =================
  const filteredUsers = useMemo(() => {
    return users.filter(user => {

      const globalSearchMatch =
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.education.toLowerCase().includes(searchText.toLowerCase());

      const dropdownOccupationMatch = occupationFilter
        ? user.occupation === occupationFilter
        : true;

      const checkboxOccupationMatch =
        selectedOccupations.length > 0
          ? selectedOccupations.includes(user.occupation)
          : true;

      const nameMatch = user.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

      const educationMatch = user.education
        .toLowerCase()
        .includes(educationFilter.toLowerCase());

      return (
        globalSearchMatch &&
        dropdownOccupationMatch &&
        checkboxOccupationMatch &&
        nameMatch &&
        educationMatch
      );
    });
  }, [
    users,
    searchText,
    occupationFilter,
    selectedOccupations,
    nameFilter,
    educationFilter
  ]);

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
    setEditingUser(record);
    setIsModalVisible(true);
  };

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
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const columns = allColumns.filter(
    col =>
      col.key === "action" || visibleColumns.includes(col.dataIndex)
  );

  // ================= COLUMN TOGGLE =================
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

  return (
    <div style={{ padding: 24 }}>

      <Card
        title="User Management"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              New User
            </Button>

            <Dropdown
              menu={{ items: columnItems }}
              trigger={["click"]}
            >
              <Button icon={<SettingOutlined />}>
                Columns
              </Button>
            </Dropdown>
          </Space>
        }
      >

        {/* FILTER BAR */}
        <Row gutter={16} style={{ marginBottom: 20 }}>

          <Col span={6}>
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

          {/* NEW NAME FILTER */}
          <Col span={6}>
            <Input
              placeholder="Filter by Name"
              allowClear
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </Col>

          {/* NEW EDUCATION FILTER */}
          <Col span={6}>
            <Input
              placeholder="Filter by Education"
              allowClear
              onChange={(e) => setEducationFilter(e.target.value)}
            />
          </Col>

        </Row>

        {/* NEW CHECKBOX OCCUPATION FILTER */}
        <Row style={{ marginBottom: 20 }}>
          <Col span={24}>
            <Checkbox.Group
              options={[...new Set(users.map(u => u.occupation))]}
              onChange={(values) => setSelectedOccupations(values)}
            />
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

      {/* ================= MODAL ================= */}
      <Modal
        title={editingUser ? "Edit User" : "Create User"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width="80%"
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

    </div>
  );
}