import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Row, Col, Spin } from "antd";
import { updateUser } from "../api/userService";

function UserEditModal({ user, onSuccess, onCancel, loading: parentLoading }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
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
    }
  }, [user, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await updateUser(user.id, values);
      
      if (response.data.success) {
        message.success("User updated successfully");
        onSuccess(response.data.data);
      } else {
        message.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      message.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
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
              <Input disabled />
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
              label="Alternate Contact"
              name="alternateContact"
            >
              <Input placeholder="Alternate Contact Number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
            >
              <Input placeholder="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Gender"
              name="gender"
            >
              <Input placeholder="Male/Female/Other" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Marital Status"
              name="maritalStatus"
            >
              <Input placeholder="Single/Married/Divorced" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Religion"
              name="religion"
            >
              <Input placeholder="Religion" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Caste"
              name="caste"
            >
              <Input placeholder="Caste" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Sub Caste"
              name="subCaste"
            >
              <Input placeholder="Sub Caste" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Height"
              name="height"
            >
              <Input placeholder="Height (e.g., 5'6 inches)" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Weight"
              name="weight"
            >
              <Input placeholder="Weight (kg)" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Current Address"
          name="currentAddress"
        >
          <Input.TextArea placeholder="Current Address" rows={2} />
        </Form.Item>

        <Form.Item
          label="Permanent Address"
          name="permanentAddress"
        >
          <Input.TextArea placeholder="Permanent Address" rows={2} />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Father's Name"
              name="fatherName"
            >
              <Input placeholder="Father's Name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Father's Occupation"
              name="fatherOccupation"
            >
              <Input placeholder="Father's Occupation" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Mother's Name"
              name="motherName"
            >
              <Input placeholder="Mother's Name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Mother's Occupation"
              name="motherOccupation"
            >
              <Input placeholder="Mother's Occupation" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Siblings"
              name="siblings"
            >
              <Input placeholder="Number of siblings and details" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Family Income"
              name="familyIncome"
            >
              <Input placeholder="Family Income" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Job Type"
              name="jobType"
            >
              <Input placeholder="Government/Private/Self-Employed" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Company Name"
              name="companyName"
            >
              <Input placeholder="Company Name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Annual Income"
              name="annualIncome"
            >
              <Input placeholder="Annual Income" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Education"
              name="education"
            >
              <Input placeholder="Education" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Blood Group"
              name="bloodGroup"
            >
              <Input placeholder="Blood Group" />
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

        <Form.Item
          label="Hobbies"
          name="hobbies"
        >
          <Input.TextArea placeholder="Hobbies (comma separated)" rows={2} />
        </Form.Item>

        <Form.Item
          label="Interests"
          name="interests"
        >
          <Input.TextArea placeholder="Interests (comma separated)" rows={2} />
        </Form.Item>

        <Form.Item
          label="Membership Type"
          name="membershipType"
        >
          <Input placeholder="Membership Type" />
        </Form.Item>

        <Form.Item>
          <Row gutter={8}>
            <Col span={12}>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Save Changes
              </Button>
            </Col>
            <Col span={12}>
              <Button onClick={onCancel} block disabled={loading}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Spin>
  );
}

export default UserEditModal;
