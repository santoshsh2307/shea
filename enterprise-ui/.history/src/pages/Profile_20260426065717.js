import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Upload,
  Spin,
  Avatar,
  Divider,
} from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../api/userService";

function Profile() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      message.error("Please login first");
      navigate("/");
      return;
    }
    
    const user = JSON.parse(userStr);
    setCurrentUser(user);
    
    // Populate form with current user data
    form.setFieldsValue({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      maritalStatus: user.maritalStatus,
      contactNumber: user.contactNumber,
      alternateContact: user.alternateContact,
      occupation: user.occupation,
      education: user.education,
      bloodGroup: user.bloodGroup,
      height: user.height,
      weight: user.weight,
      religion: user.religion,
      caste: user.caste,
      subCaste: user.subCaste,
      currentAddress: user.currentAddress,
      permanentAddress: user.permanentAddress,
      fatherName: user.fatherName,
      fatherOccupation: user.fatherOccupation,
      motherName: user.motherName,
      motherOccupation: user.motherOccupation,
      siblings: user.siblings,
      familyIncome: user.familyIncome,
      jobType: user.jobType,
      companyName: user.companyName,
      annualIncome: user.annualIncome,
      hobbies: user.hobbies,
      interests: user.interests,
      membershipType: user.membershipType,
    });

    // Set photo preview if photo exists
    if (user.photo) {
      setPhotoPreview(`http://localhost:8080/api/uploads/photos/${user.photo}`);
    }
  }, [form, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Prepare update data
      const updateData = {
        ...values,
        photo: currentUser.photo || null, // Keep existing photo name
      };

      const response = await updateUser(values.id, updateData);
      
      if (response.data.success) {
        // Update localStorage with new user data
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setCurrentUser(response.data.data);
        message.success("Profile updated successfully!");
      } else {
        message.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      message.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (info) => {
    if (info.file) {
      setPhotoFile(info.file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(info.file);
    }
  };

  if (!currentUser) {
    return <Spin style={{ marginTop: "100px" }} />;
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto" }}>
      <Card title="My Profile" extra={<Button onClick={() => navigate("/dashboard")}>Back</Button>}>
        
        {/* Profile Photo Section */}
        <Row gutter={[20, 20]} style={{ marginBottom: "30px" }}>
          <Col xs={24} sm={8} style={{ textAlign: "center" }}>
            {photoPreview ? (
              <Avatar size={150} src={photoPreview} />
            ) : (
              <Avatar size={150} icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
            )}
          </Col>
          
          <Col xs={24} sm={16}>
            <Upload
              maxCount={1}
              accept="image/*"
              beforeUpload={() => false}
              onChange={handlePhotoChange}
              onRemove={() => {
                setPhotoFile(null);
                setPhotoPreview(null);
              }}
            >
              <Button icon={<CameraOutlined />} block style={{ marginTop: 10 }}>
                Change Profile Photo
              </Button>
            </Upload>
            <p style={{ marginTop: 10, color: "#666", fontSize: "12px" }}>
              Click to select a new profile photo
            </p>
          </Col>
        </Row>

        <Divider />

        {/* Profile Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
        >
          <Form.Item
            label="User ID"
            name="id"
          >
            <Input disabled />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Username is required" }]}
              >
                <Input placeholder="Username" disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="First Name"
                name="firstName"
              >
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Contact Number"
                name="contactNumber"
              >
                <Input placeholder="Contact Number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Occupation"
                name="occupation"
              >
                <Input placeholder="Occupation" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Education"
                name="education"
              >
                <Input placeholder="Education" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Blood Group"
                name="bloodGroup"
              >
                <Input placeholder="Blood Group" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Membership Type"
            name="membershipType"
          >
            <Input placeholder="Membership Type" disabled />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Profile;
