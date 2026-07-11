import React, { useState } from "react";
import { Table, Button, Modal, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CreateUser from "./CreateUser";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // ================= OPEN MODAL =================
  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  // ================= DELETE =================
  const handleDelete = (key) => {
    setUsers(prev => prev.filter(u => u.key !== key));
    message.success("User deleted successfully");
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Occupation", dataIndex: "occupation" },
    { title: "Education", dataIndex: "education" },
    { title: "Contact", dataIndex: "contactNumber" },

    {
      title: "Photo",
      dataIndex: "photo",
      render: (photo) =>
        photo ? (
          <img src={photo} alt="user" style={{ width: 40, borderRadius: 6 }} />
        ) : "—",
    },

    {
      title: "Action",
      render: (_, record) => (
        <>
          <EditOutlined
            style={{ color: "#1890ff", marginRight: 15, cursor: "pointer" }}
            onClick={() => openModal(record)}
          />

          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => openModal()}
      >
        New User
      </Button>

      <Table dataSource={users} columns={columns} rowKey="key" />

      <Modal
        title={editingUser ? "Edit User" : "Create User"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
        }}
        footer={null}
        width="80%"
        destroyOnClose
      >
        <CreateUser
          initialValues={editingUser}
          onSuccess={(data) => {
            if (editingUser) {
              // UPDATE
              setUsers(prev =>
                prev.map(u =>
                  u.key === editingUser.key ? { ...editingUser, ...data } : u
                )
              );
              message.success("User updated successfully");
            } else {
              // CREATE
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