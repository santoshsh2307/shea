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

  const [advancedFilters, setAdvancedFilters] = useState([
    { field: "", operator: "contains", value: "" }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // ================= FILTER =================

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
    col => col.key === "action" || visibleColumns.includes(col.dataIndex)
  );

  return (
    <>
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