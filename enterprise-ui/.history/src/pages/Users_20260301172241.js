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

export default function Users() {

  // ================= DATA =================
  // const [users, setUsers] = useState([
  //   {
  //     key: 1,
  //     name: "Santosh",
  //     dob: "1995-06-10",
  //     birthDay: "Monday",
  //     birthTime: "10:30 AM",
  //     homeGod: "Shiva",
  //     star: "Ashwini",
  //     bedaga: "XYZ",
  //     resemblance: "Fair",
  //     height: "5.8",
  //     weight: "70",
  //     bloodGroup: "O+",
  //     contactNumber: "9876543210",
  //     altContactNumber: "9000000000",
  //     hobbies: "Reading",
  //     fatherDetails: "Farmer",
  //     motherDetails: "Homemaker",
  //     siblings: "1 Brother",
  //     caste: "Lingayat",
  //     currentAddress: "Bangalore",
  //     permanentAddress: "Hubli",
  //     fatherRelatives: "Uncle",
  //     motherRelatives: "Aunt",
  //     education: "B.Tech",
  //     occupation: "Software Engineer",
  //     jobType: "Private",
  //     pfDetails: "PF123",
  //     experience: "5",
  //     officeAddress: "Electronic City",
  //     childrenEducation: "N/A"
  //   }
  // ]);

  const generateUsers = () => {
  const names = [
    "Santosh", "Ravi", "Kiran", "Amit", "Suresh",
    "Mahesh", "Anil", "Vijay", "Rahul", "Deepak",
    "Arjun", "Manoj", "Naveen", "Prakash", "Rohit",
    "Ganesh", "Shiva", "Harish", "Tejas", "Varun"
  ];

  return names.map((name, index) => ({
    key: index + 1,
    name,
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
    contactNumber: `98765432${index.toString().padStart(2, "0")}`,
    altContactNumber: `90000000${index.toString().padStart(2, "0")}`,
    hobbies: "Reading, Music",
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
    childrenEducation: "N/A"
  }));
};

const [users, setUsers] = useState(generateUsers());

  const [searchText, setSearchText] = useState("");
  const [visibleColumns, setVisibleColumns] = useState([
    "name",
    "occupation",
    "education",
    "contactNumber"
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
    setEditingUser(record);
    setIsModalVisible(true);
  };

  // ================= ALL COLUMNS =================
  const allColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "DOB", dataIndex: "dob" },
    { title: "Birth Day", dataIndex: "birthDay" },
    { title: "Birth Time", dataIndex: "birthTime" },
    { title: "Home God", dataIndex: "homeGod" },
    { title: "Star", dataIndex: "star" },
    { title: "Bedaga", dataIndex: "bedaga" },
    { title: "Resemblance", dataIndex: "resemblance" },
    { title: "Height", dataIndex: "height" },
    { title: "Weight", dataIndex: "weight" },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (bg) => <Tag color="green">{bg}</Tag>
    },
    { title: "Contact", dataIndex: "contactNumber" },
    { title: "Alt Contact", dataIndex: "altContactNumber" },
    { title: "Hobbies", dataIndex: "hobbies" },
    { title: "Father Details", dataIndex: "fatherDetails" },
    { title: "Mother Details", dataIndex: "motherDetails" },
    { title: "Siblings", dataIndex: "siblings" },
    { title: "Caste", dataIndex: "caste" },
    { title: "Current Address", dataIndex: "currentAddress" },
    { title: "Permanent Address", dataIndex: "permanentAddress" },
    { title: "Father Relatives", dataIndex: "fatherRelatives" },
    { title: "Mother Relatives", dataIndex: "motherRelatives" },
    { title: "Education", dataIndex: "education" },
    {
      title: "Occupation",
      dataIndex: "occupation",
      render: (occ) => <Tag color="blue">{occ}</Tag>
    },
    { title: "Job Type", dataIndex: "jobType" },
    { title: "PF Details", dataIndex: "pfDetails" },
    { title: "Experience", dataIndex: "experience" },
    { title: "Office Address", dataIndex: "officeAddress" },
    { title: "Children Education", dataIndex: "childrenEducation" },
    {
      title: "Action",
      key: "action",
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

            <Button
              icon={<FilterOutlined />}
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              Filters
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
          scroll={{ x: 3500 }}
          pagination={{ pageSize: 5 }}
          size="small"
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
                  <Select.Option key={field} value={field}>
                    {field}
                  </Select.Option>
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
              <Select.Option value="contains">Contains</Select.Option>
              <Select.Option value="equals">Equals</Select.Option>
              <Select.Option value="startsWith">Starts With</Select.Option>
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

        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            type="dashed"
            block
            onClick={() =>
              setAdvancedFilters(prev => [
                ...prev,
                { field: "", operator: "contains", value: "" }
              ])
            }
          >
            Add Filter
          </Button>

          <Button
            block
            onClick={() =>
              setAdvancedFilters([
                { field: "", operator: "contains", value: "" }
              ])
            }
          >
            Reset Filters
          </Button>
        </Space>
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

    </div>
  );
}