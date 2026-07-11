import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  Row,
  Col,
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DownloadOutlined } from "@ant-design/icons";

import photo1 from "/Users/admin/Desktop/project/enterprise-ui/src/assests/photos/photo1.jpg";
import photo2 from "/Users/admin/Desktop/project/enterprise-ui/src/assests/photos/photo2.jpg";
import photo3 from "/Users/admin/Desktop/project/enterprise-ui/src/assests/photos/photo3.jpg";

const { Search } = Input;
const { Option } = Select;

export default function Users({ users, setUsers }) {

  const [searchText, setSearchText] = useState("");

  const [visibleColumns, setVisibleColumns] = useState([
    "name",
    "contactNumber",
    "occupation",
    "education",
    "bloodGroup",
    "membershipType"
  ]);

  const generateProfilePDF = (user) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("User Profile", 14, 20);

  doc.setFontSize(12);

  const userData = Object.entries(user)
    .filter(([key]) => key !== "key")
    .map(([key, value]) => [key, String(value)]);

  autoTable(doc, {
    startY: 30,
    head: [["Field", "Value"]],
    body: userData,
  });

  doc.save(`${user.name}_Profile.pdf`);
};



  const [advancedFilters, setAdvancedFilters] = useState([
    { field: "", operator: "contains", value: "" }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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
      render: (bg) => <Tag color="blue">{bg}</Tag>
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
      render: (occ) => <Tag color="geekblue">{occ}</Tag>
    },
    { title: "Job Type", dataIndex: "jobType" },
    { title: "PF Details", dataIndex: "pfDetails" },
    { title: "Experience", dataIndex: "experience" },
    { title: "Office Address", dataIndex: "officeAddress" },
    { title: "Children Education", dataIndex: "childrenEducation" },
    {
      title: "Membership",
      dataIndex: "membershipType",
      render: (type) => (
        <Tag color={type === "Free" ? "red" : "green"} style={{ fontWeight: "bold" }}>
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

      {/* Edit */}
      <EditOutlined
        style={{ color: "#1890ff", cursor: "pointer" }}
        onClick={() => openEditModal(record)}
      />

      {/* Delete */}
      <Popconfirm
        title="Are you sure to delete?"
        onConfirm={() => handleDelete(record.key)}
      >
        <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
      </Popconfirm>

      {/* Photos Button */}
      <Button
        size="small"
        onClick={() => {
          setSelectedUser(record);
          setCurrentPhotoIndex(0);
          setIsPhotoModalOpen(true);
        }}
      >
        Photos
      </Button>

      <DownloadOutlined
    style={{ color: "green", cursor: "pointer" }}
    onClick={() => generateProfilePDF(record)}
  />

    </Space>
  )
}
  ];

  const columns = allColumns.filter(
    col => col.key === "action" || visibleColumns.includes(col.dataIndex)
  );
  
  const getUserPhotos = () => {
  return [photo1, photo2, photo3];
};

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
    <>
      <Row style={{ marginBottom: 20 }} gutter={10}>
        <Col span={6}>
          <Search
            placeholder="Search anything..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>

        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            New User
          </Button>
        </Col>

        <Col>
          <Button icon={<FilterOutlined />} onClick={() => setIsFilterDrawerOpen(true)}>
            Filters
          </Button>
        </Col>

        <Col>
          <Dropdown menu={{ items: columnItems }} trigger={["click"]}>
            <Button icon={<SettingOutlined />}>Columns</Button>
          </Dropdown>
        </Col>
      </Row>

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="key"
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 5 }}
        rowClassName={(record) =>
          record.membershipType === "Free"
            ? "free-member-row"
            : ""
        }
      />

      {/* ================= ADVANCED FILTER DRAWER ================= */}

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

      <Modal
        title={editingUser ? "Edit User" : "Create User"}
        open={isModalVisible}
        footer={null}
        width="85%"
        destroyOnClose
        onCancel={() => setIsModalVisible(false)}
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
            } else {
              setUsers(prev => [...prev, data]);
            }
            setIsModalVisible(false);
            setEditingUser(null);
          }}
        />
      </Modal>

   <Modal
  title={`Photos of ${selectedUser?.name || ""}`}
  open={isPhotoModalOpen}
  footer={null}
  onCancel={() => setIsPhotoModalOpen(false)}
  width={650}
  centered
>
  {selectedUser && (
    <>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img
          src={getUserPhotos()[currentPhotoIndex]}
          alt="user"
          style={{
            width: "100%",
            maxHeight: 450,
            objectFit: "contain",
            borderRadius: 8
          }}
        />
      </div>

      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <Button
          disabled={currentPhotoIndex === 0}
          onClick={() => setCurrentPhotoIndex(prev => prev - 1)}
          style={{ marginRight: 10 }}
        >
          Previous
        </Button>

        <Button
          disabled={currentPhotoIndex === getUserPhotos().length - 1}
          onClick={() => setCurrentPhotoIndex(prev => prev + 1)}
          style={{ marginRight: 10 }}
        >
          Next
        </Button>

        {/* Download Button */}
        <a
          href={getUserPhotos()[currentPhotoIndex]}
          download
        >
          <Button type="primary">
            Download
          </Button>
        </a>
      </div>

      <div style={{ textAlign: "center", color: "#888" }}>
        Photo {currentPhotoIndex + 1} of {getUserPhotos().length}
      </div>
    </>
  )}
</Modal>
      <style>
        {`
          .free-member-row {
            background-color: #fff2f0 !important;
          }
        `}
      </style>
    </>
  );
}