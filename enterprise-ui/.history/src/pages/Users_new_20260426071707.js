import React, { useState, useEffect, useMemo } from "react";
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
  Drawer,
  Spin
} from "antd";
import {
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined
} from "@ant-design/icons";
import CreateUser from "./CreateUser_new";
import UserEditModal from "./UserEditModal";
import { jsPDF } from "jspdf";
import { getAllUsers, getUserById, deleteUser as deleteUserAPI, uploadUserPhotos } from "../api/userService";

import photo1 from "/Users/admin/Desktop/project/enterprise-ui/src/assests/photos/photo1.jpg";
import photo2 from "/Users/admin/Desktop/project/enterprise-ui/src/assests/photos/photo2.jpg";
import photo3 from "/Users/admin/Desktop/project/enterprise-ui/src/assests/photos/photo3.jpg";

const { Search } = Input;
const { Option } = Select;

export default function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [visibleColumns, setVisibleColumns] = useState([
    "firstName",
    "lastName",
    "contactNumber",
    "occupation",
    "education",
    "bloodGroup",
    "membershipType",
    "photo"
  ]);

  const [advancedFilters, setAdvancedFilters] = useState([
    { field: "", operator: "contains", value: "" }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photoUploadFiles, setPhotoUploadFiles] = useState([]);
  const [photoModalLoading, setPhotoModalLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);

  // ================= LOAD USERS FROM BACKEND =================

  useEffect(() => {
    fetchUsers();
    // Get current logged-in user
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUserInfo(JSON.parse(userStr));
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      // Convert API response to table format with key field
      const usersWithKey = response.data.map((user, index) => ({
        ...user,
        key: user.id
      }));
      setUsers(usersWithKey);
      message.success("Users loaded successfully");
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users - Backend may not be running");
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER LOGIC =================

  const filteredUsers = useMemo(() => {
    return users.filter(user => {

      const globalMatch =
        Object.values(user)
          .map(v => String(v))
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

  const handleDelete = async (userId) => {
    try {
      await deleteUserAPI(userId);
      setUsers(prev => prev.filter(user => user.key !== userId));
      message.success("User deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete user");
    }
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
    { title: "ID", dataIndex: "id" },
    { title: "Username", dataIndex: "username" },
    { title: "Email", dataIndex: "email" },
    { title: "First Name", dataIndex: "firstName" },
    { title: "Last Name", dataIndex: "lastName" },
    { title: "Contact", dataIndex: "contactNumber" },
    { title: "Occupation", dataIndex: "occupation", render: (occ) => occ ? <Tag color="geekblue">{occ}</Tag> : "-" },
    { title: "Education", dataIndex: "education" },
    {
      title: "Photo",
      dataIndex: "photo",
      render: (photo) => photo ? (
        <img
          src={`http://localhost:8080/api/uploads/photos/${photo}`}
          alt="User Photo"
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }}
        />
      ) : (
        <span style={{ color: '#999' }}>No Photo</span>
      )
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (bg) => bg ? <Tag color="blue">{bg}</Tag> : "-"
    },
    {
      title: "Membership",
      dataIndex: "membershipType",
      render: (type) => type ? (
        <Tag color={type === "Free" ? "red" : "green"} style={{ fontWeight: "bold" }}>
          {type}
        </Tag>
      ) : "-"
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      )
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space>
          {/* Edit - Only for Admin */}
          {currentUserInfo?.username === "admin" && (
            <EditOutlined
              style={{ color: "#1890ff", cursor: "pointer" }}
              title="Edit User (Admin Only)"
              onClick={() => {
                setEditingUser(record);
                setIsEditModalOpen(true);
              }}
            />
          )}

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

          <Button onClick={() => window.print()}>Print</Button>
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
    <Spin spinning={loading}>
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

        <Col>
          <Button onClick={fetchUsers} type="default">
            Refresh
          </Button>
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
            setIsModalVisible(false);
            setEditingUser(null);
            fetchUsers();
          }}
        />
      </Modal>

      {/* Edit User Modal - Admin Only */}
      <Modal
        title="Edit User"
        open={isEditModalOpen}
        footer={null}
        width="85%"
        destroyOnClose
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
      >
        {editingUser && (
          <UserEditModal
            user={editingUser}
            onSuccess={(updatedUser) => {
              setIsEditModalOpen(false);
              setEditingUser(null);
              fetchUsers();
            }}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingUser(null);
            }}
          />
        )}
      </Modal>

      <Modal
        title={`Photos of ${selectedUser?.firstName || ""} ${selectedUser?.lastName || ""}`}
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
    </Spin>
  );
}
