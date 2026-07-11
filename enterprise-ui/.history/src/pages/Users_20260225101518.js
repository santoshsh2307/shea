import React, { useState } from "react";
import { Table, Button, Modal } from "antd";
import CreateUser from "./CreateUser";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
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
      title: "Photo",
      dataIndex: "photo",
      render: (photo) =>
        photo ? (
          <img src={photo} alt="user" style={{ width: 50 }} />
        ) : (
          "No Photo"
        ),
    },

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

  return (
    <div style={{ padding: 20 }}>
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => setIsModalVisible(true)}
      >
        New User
      </Button>

      <Table
        dataSource={users}
        columns={columns}
        scroll={{ x: 2000 }}
      />

      <Modal
        title="Create User"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width="80%"
        destroyOnClose
      >
        <CreateUser
          onSuccess={(newUser) => {
            setUsers((prev) => [...prev, newUser]);
            setIsModalVisible(false);
          }}
        />
      </Modal>
    </div>
  );
}