import React, { useState } from "react";
import { Tabs, Table, Button, Modal, Form, Input, message, Carousel, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { jsPDF } from "jspdf";

export default function Services() {
  const [activeTab, setActiveTab] = useState("progress");

  // Sample data for tables
  const [progressData, setProgressData] = useState([
    { key: 1, service: "Service A", status: "In Progress" },
  ]);
  const [problemData, setProblemData] = useState([
    { key: 1, service: "Service B", issue: "Network Problem" },
  ]);
  const [profileData, setProfileData] = useState([
    { key: 1, name: "Service Admin", role: "Manager" },
  ]);
  const [eventsData, setEventsData] = useState([
    { key: 1, event: "Maintenance", date: "2025-12-30", description: "System maintenance and updates", location: "Main Office", organizer: "IT Team" },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [form] = Form.useForm();
  const [uploadedPdf, setUploadedPdf] = useState(null);

  // Upload props for PDF
  const uploadProps = {
    beforeUpload: (file) => {
      const isPdf = file.type === 'application/pdf';
      if (!isPdf) {
        message.error('You can only upload PDF files!');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('PDF must be smaller than 10MB!');
        return false;
      }
      setUploadedPdf(file);
      return false; // Prevent auto upload
    },
    onRemove: () => {
      setUploadedPdf(null);
    },
    fileList: uploadedPdf ? [uploadedPdf] : [],
  };

  // Generate PDF for event
  const generatePDF = (record) => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text("Event Details", 20, 30);
    
    // Event details
    doc.setFontSize(12);
    doc.text(`Event: ${record.event}`, 20, 50);
    doc.text(`Date: ${record.date}`, 20, 60);
    doc.text(`Description: ${record.description || 'N/A'}`, 20, 70);
    doc.text(`Location: ${record.location || 'N/A'}`, 20, 80);
    doc.text(`Organizer: ${record.organizer || 'N/A'}`, 20, 90);
    
    // Save the PDF
    doc.save(`${record.event.replace(/\s+/g, '_')}_details.pdf`);
    message.success("PDF downloaded successfully!");
  };

  // Images for top carousel
  const images = [
    "https://picsum.photos/800/200?random=1",
  "https://picsum.photos/800/200?random=2",
  "https://picsum.photos/800/200?random=3",
  ];

  // Open modal for creating or editing
  const openModal = (record = null) => {
    setEditingRecord(record);
    if (record) {
      form.setFieldsValue(record);
      setUploadedPdf(record.pdf || null);
    } else {
      form.resetFields();
      setUploadedPdf(null);
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      switch (activeTab) {
        case "progress":
          if (editingRecord) {
            setProgressData(prev => prev.map(r => (r.key === editingRecord.key ? { ...editingRecord, ...values } : r)));
            message.success("Progress updated!");
          } else {
            setProgressData(prev => [...prev, { key: Date.now(), ...values }]);
            message.success("Progress added!");
          }
          break;
        case "problem":
          if (editingRecord) {
            setProblemData(prev => prev.map(r => (r.key === editingRecord.key ? { ...editingRecord, ...values } : r)));
            message.success("Problem updated!");
          } else {
            setProblemData(prev => [...prev, { key: Date.now(), ...values }]);
            message.success("Problem added!");
          }
          break;
        case "profile":
          if (editingRecord) {
            setProfileData(prev => prev.map(r => (r.key === editingRecord.key ? { ...editingRecord, ...values } : r)));
            message.success("Profile updated!");
          } else {
            setProfileData(prev => [...prev, { key: Date.now(), ...values }]);
            message.success("Profile added!");
          }
          break;
        case "events":
          const eventData = { ...values, pdf: uploadedPdf };
          if (editingRecord) {
            setEventsData(prev => prev.map(r => (r.key === editingRecord.key ? { ...editingRecord, ...eventData } : r)));
            message.success("Event updated!");
          } else {
            setEventsData(prev => [...prev, { key: Date.now(), ...eventData }]);
            message.success("Event added!");
          }
          setUploadedPdf(null); // Reset after save
          break;
        default:
          break;
      }
      setIsModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
    });
  };

  const handleDelete = (key) => {
    switch (activeTab) {
      case "progress": setProgressData(prev => prev.filter(r => r.key !== key)); break;
      case "problem": setProblemData(prev => prev.filter(r => r.key !== key)); break;
      case "profile": setProfileData(prev => prev.filter(r => r.key !== key)); break;
      case "events": setEventsData(prev => prev.filter(r => r.key !== key)); break;
      default: break;
    }
    message.success("Deleted successfully!");
  };

  // Columns for each table
  const getColumns = () => {
    switch (activeTab) {
      case "progress":
        return [
          { title: "Service", dataIndex: "service", key: "service" },
          { title: "Status", dataIndex: "status", key: "status" },
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
      case "problem":
        return [
          { title: "Service", dataIndex: "service", key: "service" },
          { title: "Issue", dataIndex: "issue", key: "issue" },
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
      case "profile":
        return [
          { title: "Name", dataIndex: "name", key: "name" },
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
      case "events":
        return [
          { title: "Event", dataIndex: "event", key: "event" },
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Description", dataIndex: "description", key: "description" },
          { title: "Location", dataIndex: "location", key: "location" },
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <>
                <Button type="link" onClick={() => openModal(record)}>Edit</Button>
                <Button type="link" onClick={() => generatePDF(record)}>Download PDF</Button>
                <Button type="link" danger onClick={() => handleDelete(record.key)}>Delete</Button>
              </>
            ),
          },
        ];
      default:
        return [];
    }
  };

  const getData = () => {
    switch (activeTab) {
      case "progress": return progressData;
      case "problem": return problemData;
      case "profile": return profileData;
      case "events": return eventsData;
      default: return [];
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Top Carousel */}
      <Carousel autoplay autoplaySpeed={2000} style={{ marginBottom: 20 }}>
        {images.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
        ))}
      </Carousel>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Post Progress" key="progress" />
        <Tabs.TabPane tab="Post Problem" key="problem" />
        <Tabs.TabPane tab="Post Profile" key="profile" />
        <Tabs.TabPane tab="Upcoming Events" key="events" />
      </Tabs>

      {/* New button */}
      <Button type="primary" style={{ marginBottom: 20 }} onClick={() => openModal()}>
        New {activeTab === "progress" ? "Progress" : activeTab === "problem" ? "Problem" : activeTab === "profile" ? "Profile" : "Event"}
      </Button>

      {/* Table */}
      <Table dataSource={getData()} columns={getColumns()} />

      {/* Modal */}
      <Modal
        title={editingRecord ? "Edit" : "Create"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText={editingRecord ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          {activeTab === "progress" && (
            <>
              <Form.Item name="service" label="Service" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </>
          )}
          {activeTab === "problem" && (
            <>
              <Form.Item name="service" label="Service" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="issue" label="Issue" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </>
          )}
          {activeTab === "profile" && (
            <>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </>
          )}
          {activeTab === "events" && (
            <>
              <Form.Item name="event" label="Event" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                <Input placeholder="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="location" label="Location">
                <Input />
              </Form.Item>
              <Form.Item name="organizer" label="Organizer">
                <Input />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
