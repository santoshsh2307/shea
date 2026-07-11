import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  Row,
  Col,
  message,
  Spin,
  Upload
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createUser, updateUser } from "../api/userService";

const { TextArea } = Input;

function CreateUser({ initialValues, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (initialValues?.id) {
        // Update existing user
        await updateUser(initialValues.id, values);
        message.success("User updated successfully!");
      } else {
        // Create new user
        const response = await createUser(values, photoFile);
        message.success(response.data.message || "User created successfully!");
      }

      if (onSuccess) {
        onSuccess(values);
      } else {
        form.resetFields();
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 20 }}>
        <Card title={initialValues ? "Edit User" : "Create New User"}>
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Person Information */}
            <h3>Personal Information</h3>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="username" 
                  label="Username" 
                  rules={[
                    { required: true, message: "Username is required" }
                  ]}
                >
                  <Input placeholder="Enter username" disabled={initialValues?.id} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item 
                  name="password" 
                  label="Password" 
                  rules={[
                    { required: !initialValues?.id, message: "Password is required" }
                  ]}
                >
                  <Input.Password placeholder="Enter password" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item 
                  name="email" 
                  label="Email" 
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Invalid email" }
                  ]}
                >
                  <Input placeholder="Enter email" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item 
                  name="firstName" 
                  label="First Name"
                  rules={[{ required: true, message: "First name is required" }]}
                >
                  <Input placeholder="Enter first name" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item 
                  name="lastName" 
                  label="Last Name"
                  rules={[{ required: true, message: "Last name is required" }]}
                >
                  <Input placeholder="Enter last name" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item 
                  name="contactNumber" 
                  label="Contact Number"
                  rules={[
                    { required: true, message: "Contact number is required" },
                    { pattern: /^[0-9]{10,}$/, message: "Invalid contact number" }
                  ]}
                >
                  <Input placeholder="Enter contact number" />
                </Form.Item>
              </Col>
            </Row>

            {/* Photo Upload */}
            <h3 style={{ marginTop: 30 }}>Photo</h3>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Profile Photo">
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={(file) => {
                      setPhotoFile(file);
                      return false; // Prevent auto upload
                    }}
                    onRemove={() => setPhotoFile(null)}
                  >
                    {photoFile ? null : (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload Photo</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            {/* Professional & Health Information */}
            <h3 style={{ marginTop: 30 }}>Professional & Health Information</h3>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="occupation" 
                  label="Occupation"
                >
                  <Input placeholder="Enter occupation" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item 
                  name="education" 
                  label="Education"
                >
                  <Select placeholder="Select education level">
                    <Select.Option value="High School">High School</Select.Option>
                    <Select.Option value="Bachelor's">Bachelor's</Select.Option>
                    <Select.Option value="Master's">Master's</Select.Option>
                    <Select.Option value="PhD">PhD</Select.Option>
                    <Select.Option value="Other">Other</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item 
                  name="bloodGroup" 
                  label="Blood Group"
                >
                  <Select placeholder="Select blood group">
                    <Select.Option value="A+">A+</Select.Option>
                    <Select.Option value="A-">A-</Select.Option>
                    <Select.Option value="B+">B+</Select.Option>
                    <Select.Option value="B-">B-</Select.Option>
                    <Select.Option value="O+">O+</Select.Option>
                    <Select.Option value="O-">O-</Select.Option>
                    <Select.Option value="AB+">AB+</Select.Option>
                    <Select.Option value="AB-">AB-</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item 
                  name="membershipType" 
                  label="Membership Type"
                >
                  <Select placeholder="Select membership type">
                    <Select.Option value="Free">Free</Select.Option>
                    <Select.Option value="Standard">Standard</Select.Option>
                    <Select.Option value="Premium">Premium</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Membership Status */}
            <h3 style={{ marginTop: 30 }}>Status</h3>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="isActive" 
                  label="Active Status"
                  initialValue={true}
                >
                  <Select placeholder="Select status">
                    <Select.Option value={true}>Active</Select.Option>
                    <Select.Option value={false}>Inactive</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Form Actions */}
            <Row gutter={16} style={{ marginTop: 30 }}>
              <Col span={12}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  loading={loading}
                >
                  {initialValues ? "Update User" : "Create User"}
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  block 
                  size="large"
                  onClick={() => form.resetFields()}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </Spin>
  );
}

export default CreateUser;
