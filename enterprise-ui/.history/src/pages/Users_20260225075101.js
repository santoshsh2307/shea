import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import CreateUser from "./CreateUser";

export default function Users() {
  const [users, setUsers] = useState([
    { key: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { key: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form] = Form.useForm();

  const openModal = (user = null) => {
    setEditingUser(user);
    form.setFieldsValue(user || { name: "", email: "", role: "" });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        setUsers(prev => prev.map(u => (u.key === editingUser.key ? { ...editingUser, ...values } : u)));
        message.success("User updated successfully");
      } else {
        const newUser = { key: Date.now(), ...values };
        setUsers(prev => [...prev, newUser]);
        message.success("User created successfully");
      }
      setIsModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    });
  };

  const handleDelete = (key) => {
    setUsers(prev => prev.filter(u => u.key !== key));
    message.success("User deleted successfully");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.key)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" style={{ marginBottom: 20 }} onClick={() => openModal()}>
        New User
      </Button>

      <Table dataSource={users} columns={columns} />

      <Modal
  title="Create User"
  open={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={null}
  width="20"
  style={{ top: 20 }}
  destroyOnClose
>
  <CreateUser />
</Modal>
    </div>
  );
}
