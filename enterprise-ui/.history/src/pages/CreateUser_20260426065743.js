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
  const onFinish = (values) => {
    const finalData = {
      ...values,
      photo,
      location,
    };

    console.log(finalData);
    message.success("Form Submitted Successfully!");
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
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="dob" label="Date of Birth">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="birthDay" label="Birth Day">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="birthTime" label="Birth Time">
                  <TimePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="homeGod" label="Home God/Goddess">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="star" label="Star">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="bedaga" label="Bedaga">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="resemblance" label="Resemblance / Colour">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="height" label="Height">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="weight" label="Weight">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="bloodGroup" label="Blood Group">
                  <Select>
                    <Select.Option value="A+">A+</Select.Option>
                    <Select.Option value="A-">A-</Select.Option>
                    <Select.Option value="B+">B+</Select.Option>
                    <Select.Option value="O+">O+</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="contactNumber" label="Contact Number">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="altContactNumber" label="Alternative Contact">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="hobbies" label="Hobbies">
                  <TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* ================= STEP 2 ================= */}
          {current === 1 && (
            <>
              <Form.Item name="fatherDetails" label="Father Name & Occupation">
                <Input />
              </Form.Item>

              <Form.Item name="motherDetails" label="Mother Name & Occupation">
                <Input />
              </Form.Item>

              <Form.Item name="siblings" label="Siblings Details">
                <TextArea rows={3} />
              </Form.Item>

              <Form.Item name="caste" label="Caste">
                <Input />
              </Form.Item>

              <Form.Item name="currentAddress" label="Current Address">
                <TextArea rows={2} />
              </Form.Item>

              <Form.Item name="permanentAddress" label="Permanent Address">
                <TextArea rows={2} />
              </Form.Item>

              <Form.Item name="fatherRelatives" label="Father Relatives Contact & Address">
                <TextArea rows={2} />
              </Form.Item>

              <Form.Item name="motherRelatives" label="Mother Relatives Contact & Address">
                <TextArea rows={2} />
              </Form.Item>
            </>
          )}

          {/* ================= STEP 3 ================= */}
          {current === 2 && (
            <>
              <Form.Item name="education" label="Education">
                <Input />
              </Form.Item>

              <Form.Item name="occupation" label="Occupation / Job Title">
                <Input />
              </Form.Item>

              <Form.Item name="jobType" label="Job Type">
                <Select>
                  <Select.Option value="Govt">Government</Select.Option>
                  <Select.Option value="Private">Private</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item shouldUpdate>
                {({ getFieldValue }) =>
                  getFieldValue("jobType") === "Private" ? (
                    <Form.Item name="pfDetails" label="PF Account Details">
                      <Input />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>

              <Form.Item name="experience" label="Experience (Years)">
                <Input type="number" />
              </Form.Item>

              <Form.Item name="officeAddress" label="Office Address & Contact">
                <TextArea rows={2} />
              </Form.Item>

              <Form.Item name="childrenEducation" label="First Marriage Children Education Details">
                <TextArea rows={2} />
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