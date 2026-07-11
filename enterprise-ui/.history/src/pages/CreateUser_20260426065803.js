import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  DatePicker,
  TimePicker,
  Select,
  Steps,
  Upload,
  Row,
  Col,
  message
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createUser } from "../api/userService";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

function CreateUser() {
  const [current, setCurrent] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [form] = Form.useForm();

  // ================= STEP NAVIGATION =================
  const next = async () => {
    try {
      await form.validateFields();
      setCurrent(current + 1);
    } catch (err) {}
  };

  const prev = () => setCurrent(current - 1);

  // ================= CAMERA =================
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
    } catch (err) {
      message.error("Camera permission denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setPhoto(imageData);
    stopCamera();
    message.success("Photo captured successfully!");
  };

  // ================= LOCATION =================
  const getLocation = () => {
    if (!navigator.geolocation) {
      message.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        message.success("Location captured!");
      },
      () => {
        message.error("Location permission denied");
      }
    );
  };

  // ================= SUBMIT =================
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Map form values to UserDTO structure
      const userData = {
        username: values.username || values.name, // Use name as fallback for username
        password: values.password || "default123", // Default password, should be changed later
        email: values.email,
        firstName: values.firstName || values.name?.split(' ')[0],
        lastName: values.lastName || values.name?.split(' ').slice(1).join(' '),
        dateOfBirth: values.dob ? values.dob.format('YYYY-MM-DD') : null,
        gender: values.gender,
        maritalStatus: values.maritalStatus,
        contactNumber: values.contactNumber,
        alternateContact: values.altContactNumber,
        occupation: values.occupation,
        education: values.education,
        bloodGroup: values.bloodGroup,
        height: values.height,
        weight: values.weight,
        religion: values.religion,
        caste: values.caste,
        subCaste: values.subCaste,
        currentAddress: values.currentAddress,
        permanentAddress: values.permanentAddress,
        fatherName: values.fatherDetails?.split(' ')[0],
        fatherOccupation: values.fatherDetails?.split(' ').slice(1).join(' '),
        motherName: values.motherDetails?.split(' ')[0],
        motherOccupation: values.motherDetails?.split(' ').slice(1).join(' '),
        siblings: values.siblings,
        familyIncome: values.familyIncome,
        jobType: values.jobType,
        companyName: values.companyName,
        annualIncome: values.annualIncome,
        hobbies: values.hobbies,
        interests: values.interests,
        membershipType: "REGULAR", // Default membership type
        photo: photo ? "captured_photo.jpg" : null, // Placeholder for photo upload
      };

      const response = await createUser(userData);

      if (response.data.success) {
        message.success("User created successfully!");
        navigate("/users"); // Navigate to users list
      } else {
        message.error(response.data.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Create user error:", error);
      message.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <Card title="SHEA SAMBANDHA REGISTRATION">

        <Steps
          current={current}
          style={{ marginBottom: 30 }}
          items={[
            { title: "Personal Details" },
            { title: "Family Details" },
            { title: "Education & Job" },
            { title: "Documents" }
          ]}
        />

        <Form layout="vertical" form={form} onFinish={onFinish}>

          {/* ================= STEP 1 ================= */}
          {current === 0 && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="username" label="Username" rules={[{ required: true, message: "Username is required" }]}>
                  <Input placeholder="Enter username" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Valid email is required" }]}>
                  <Input placeholder="Enter email" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="password" label="Password" rules={[{ required: true, message: "Password is required" }]}>
                  <Input.Password placeholder="Enter password" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "First name is required" }]}>
                  <Input placeholder="Enter first name" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="lastName" label="Last Name">
                  <Input placeholder="Enter last name" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="dob" label="Date of Birth">
                  <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="gender" label="Gender">
                  <Select placeholder="Select gender">
                    <Select.Option value="Male">Male</Select.Option>
                    <Select.Option value="Female">Female</Select.Option>
                    <Select.Option value="Other">Other</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="maritalStatus" label="Marital Status">
                  <Select placeholder="Select marital status">
                    <Select.Option value="Single">Single</Select.Option>
                    <Select.Option value="Married">Married</Select.Option>
                    <Select.Option value="Divorced">Divorced</Select.Option>
                    <Select.Option value="Widowed">Widowed</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="religion" label="Religion">
                  <Input placeholder="Enter religion" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="height" label="Height">
                  <Input placeholder="e.g., 5'6&quot;" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="weight" label="Weight">
                  <Input placeholder="Weight in kg" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="bloodGroup" label="Blood Group">
                  <Select placeholder="Select blood group">
                    <Select.Option value="A+">A+</Select.Option>
                    <Select.Option value="A-">A-</Select.Option>
                    <Select.Option value="B+">B+</Select.Option>
                    <Select.Option value="B-">B-</Select.Option>
                    <Select.Option value="AB+">AB+</Select.Option>
                    <Select.Option value="AB-">AB-</Select.Option>
                    <Select.Option value="O+">O+</Select.Option>
                    <Select.Option value="O-">O-</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="contactNumber" label="Contact Number">
                  <Input placeholder="Enter contact number" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="altContactNumber" label="Alternate Contact">
                  <Input placeholder="Enter alternate contact" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="hobbies" label="Hobbies">
                  <TextArea rows={2} placeholder="Enter hobbies (comma separated)" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="interests" label="Interests">
                  <TextArea rows={2} placeholder="Enter interests (comma separated)" />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* ================= STEP 2 ================= */}
          {current === 1 && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="fatherName" label="Father's Name">
                    <Input placeholder="Enter father's name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="fatherOccupation" label="Father's Occupation">
                    <Input placeholder="Enter father's occupation" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="motherName" label="Mother's Name">
                    <Input placeholder="Enter mother's name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="motherOccupation" label="Mother's Occupation">
                    <Input placeholder="Enter mother's occupation" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="siblings" label="Siblings Details">
                <TextArea rows={3} placeholder="Enter details about siblings" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="caste" label="Caste">
                    <Input placeholder="Enter caste" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="subCaste" label="Sub Caste">
                    <Input placeholder="Enter sub caste" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="currentAddress" label="Current Address">
                <TextArea rows={2} placeholder="Enter current address" />
              </Form.Item>

              <Form.Item name="permanentAddress" label="Permanent Address">
                <TextArea rows={2} placeholder="Enter permanent address" />
              </Form.Item>

              <Form.Item name="familyIncome" label="Family Income">
                <Input placeholder="Enter family income" />
              </Form.Item>
            </>
          )}

          {/* ================= STEP 3 ================= */}
          {current === 2 && (
            <>
              <Form.Item name="education" label="Education">
                <Input placeholder="Enter education details" />
              </Form.Item>

              <Form.Item name="occupation" label="Occupation">
                <Input placeholder="Enter occupation/job title" />
              </Form.Item>

              <Form.Item name="jobType" label="Job Type">
                <Select placeholder="Select job type">
                  <Select.Option value="Government">Government</Select.Option>
                  <Select.Option value="Private">Private</Select.Option>
                  <Select.Option value="Self-Employed">Self-Employed</Select.Option>
                  <Select.Option value="Business">Business</Select.Option>
                  <Select.Option value="Student">Student</Select.Option>
                  <Select.Option value="Unemployed">Unemployed</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="companyName" label="Company Name">
                <Input placeholder="Enter company/organization name" />
              </Form.Item>

              <Form.Item name="annualIncome" label="Annual Income">
                <Input placeholder="Enter annual income" />
              </Form.Item>
            </>
          )}

          {/* ================= STEP 4 ================= */}
          {current === 3 && (
            <>
              {/* Keep all your Upload fields exactly same */}
              <Form.Item label="Caste Certificate">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item label="SSLC Marks Card">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item label="Job ID Card">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item label="PF Account Copy">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item label="Aadhaar Copy">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item label="Recent Photo">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item label="Divorce Court Certificate">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>

              {/* NEW: Live Camera */}
              <Form.Item label="Live Photo Capture">
                <video ref={videoRef} autoPlay style={{ width: "100%", maxHeight: 300 }} />
                <canvas ref={canvasRef} style={{ display: "none" }} />

                <div style={{ marginTop: 10 }}>
                  <Button onClick={startCamera} style={{ marginRight: 10 }}>
                    Start Camera
                  </Button>
                  <Button type="primary" onClick={capturePhoto}>
                    Capture Photo
                  </Button>
                </div>

                {photo && (
                  <img
                    src={photo}
                    alt="Captured"
                    style={{ marginTop: 10, width: 200 }}
                  />
                )}
              </Form.Item>

              {/* NEW: Location */}
              <Form.Item label="Current Location">
                <Button onClick={getLocation}>Get Location</Button>

                {location && (
                  <div style={{ marginTop: 10 }}>
                    <p><b>Latitude:</b> {location.latitude}</p>
                    <p><b>Longitude:</b> {location.longitude}</p>
                  </div>
                )}
              </Form.Item>
            </>
          )}

          {/* Navigation Buttons */}
          <div style={{ marginTop: 20 }}>
            {current > 0 && (
              <Button onClick={prev} style={{ marginRight: 8 }}>
                Previous
              </Button>
            )}

            {current < 3 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}

            {current === 3 && (
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            )}
          </div>

        </Form>
      </Card>
    </div>
  );
}

export default CreateUser;