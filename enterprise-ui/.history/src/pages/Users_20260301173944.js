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

  // ================= GENERATE FULL DATA =================

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
  const [searchText, setSearchText] = useState("");

  // ✅ Important columns default (others hidden but available)
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

  // ================= ALL ORIGINAL COLUMNS (NOTHING REMOVED) =================

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

  return (
    <div style={{ width: "100%", padding: 10 }}>

      <Card title="User Management" style={{ width: "100%" }}>

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

      </Card>

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