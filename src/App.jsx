import React, { useState } from "react";
import {
  Steps,
  Form,
  Input,
  Button,
  Row,
  Col,
  message,
  DatePicker,
  Select,
} from "antd";
import "antd/dist/antd.css";
import { WarningOutlined } from "@ant-design/icons";
import "./App.css";
import moment from "moment";

const { Step } = Steps;
const { Option } = Select;

const App = () => {
  const [current, setCurrent] = useState(0);
  const [stepErrors, setStepErrors] = useState([]);
  const [form] = Form.useForm();

  const stepTitles = [
    "Candidate",
    "Jobs",
    "Employer",
    "Referral",
    "Financial",
  ];

  const fieldsByStep = [
    [
      "email",
      "candidateId",
      "firstName",
      "lastName",
      "contactNumber",
      "alternateContactNumber",
      "designation",
      "dob",
      "gender",
      "experience",
      "location",
      "workAuth",
      "degree",
      "university",
    ],
    ["clientId", "clientName"],
    [
      "employerName",
      "employerAddress",
      "federalTaxId",
      "stateIncorporation",
      "authorizedName",
      "authorizedTitle",
      "authorizedEmail",
      "authorizedContact",
      "alternateContact",
      "website",
    ],
    ["vendorName", "bankName", "accountType", "bankAddress"],
    ["projectStart", "projectEnd", "duration"],
  ];

  const allFieldNames = fieldsByStep.flat();

  const validateStep = async (stepIndex) => {
    const fields = fieldsByStep[stepIndex] || [];
    if (!fields.length) return;
    try {
      await form.validateFields(fields);
      setStepErrors((prev) => prev.filter((i) => i !== stepIndex));
    } catch {
      setStepErrors((prev) =>
        prev.includes(stepIndex) ? prev : [...prev, stepIndex]
      );
    }
  };

  const scrollToErrorField = (errorInfo) => {
    const name = errorInfo?.errorFields?.[0]?.name?.[0];
    if (!name) return;
    const stepIndex = fieldsByStep.findIndex((fields) => fields.includes(name));
    setCurrent(stepIndex >= 0 ? stepIndex : 0);
    setTimeout(() => {
      const el = document.querySelector(`[name="${name}"]`);
      if (el) {  
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus?.({ preventScroll: false });
      }
    }, 300);
  };

  const handleFinishClick = async () => {
    try {
      await form.validateFields(allFieldNames);
      const values = form.getFieldsValue();
      message.success("Submitted Successfully!", 1);
      console.log("Submitted Details:", values);
      form.resetFields();
      setStepErrors([]);
      setTimeout(() => setCurrent(0), 100);
    } catch (errorInfo) {
      const invalidSteps = [];                                    
      const errorFields = errorInfo?.errorFields || [];
      for (const err of errorFields) {
        const name = err?.name?.[0];
        if (!name) continue;
        const stepIndex = fieldsByStep.findIndex((fields) =>
          fields.includes(name)
        );
        if (stepIndex >= 0 && !invalidSteps.includes(stepIndex)) {
          invalidSteps.push(stepIndex);
        }
      }
      setStepErrors(invalidSteps);
      scrollToErrorField(errorInfo);
      message.error("Please fill all required fields", 1);
    }
  };

  const handleNext = () => {
    const prevStep = current;
    setCurrent((c) => c + 1);
    setTimeout(() => validateStep(prevStep), 100);
  };

  const handlePrevious = async () => {
    const prevStep = current;
    setCurrent((c) => c - 1);
    setTimeout(() => validateStep(prevStep), 100);
  };

  const onStepClick = async (index) => {
    const prevStep = current;
    setCurrent(index);
    setTimeout(() => validateStep(prevStep), 100);
  };

  const handleBlur = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value.trim();

    if (
      [
        "firstName",
        "lastName",
        "degree",
        "university",
        "designation",
        "employerName",
        "stateIncorporation",
        "authorizedName",
        "authorizedTitle",
        "clientName",
        "vendorName",
        "bankName",
      ].includes(fieldName)
    ) {
      if (value && !/^[A-Za-z\s]+$/.test(value)) {
        form.setFields([{ name: fieldName, errors: ["Alphabets only"] }]);
      } else {
        form.setFields([{ name: fieldName, errors: [] }]);
      }
    }

    if (
      [
        "contactNumber",
        "alternateContactNumber",
        "authorizedContact",
        "alternateContact",
      ].includes(fieldName)
    ) {
      if (value && !/^\d+$/.test(value)) {
        form.setFields([{ name: fieldName, errors: ["Digits only"] }]);
      } else if (value && value.length !== 10) {
        form.setFields([{ name: fieldName, errors: ["Must be 10 digits"] }]);
      } else {
        form.setFields([{ name: fieldName, errors: [] }]);
      }
    }

    if (["candidateId", "experience","clientId"].includes(fieldName)) {
      if (value && !/^\d+$/.test(value)) {
        form.setFields([{ name: fieldName, errors: ["Digits only"] }]);
      } else {
        form.setFields([{ name: fieldName, errors: [] }]);
      }
    }
    if (fieldName === "email") {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        form.setFields([{ name: fieldName, errors: ["Invalid email format"] }]);
      } else {
        form.setFields([{ name: fieldName, errors: [] }]);
      }
    }

    if (fieldName === "federalTaxId") {
      if (value && !/^\d+$/.test(value)) {
        form.setFields([{ name: fieldName, errors: ["Digits only"] }]);
      } else if (value && value.length !== 9) {
        form.setFields([{ name: fieldName, errors: ["Must be 9 digits"] }]);
      } else {
        form.setFields([{ name: fieldName, errors: [] }]);
      }
    }
  };

  const handleKeyDown = async (e) => {
    const fieldName = e.target?.name;
    if (!fieldName) return;

    if ((e.key === "Enter" || e.key === "Tab") && fieldName === "email") {
      e.preventDefault();
      const value = form.getFieldValue("email");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!value?.trim()) {
        return form.setFields([{ name: "email", errors: ["Email is required"] }]);
      }
      if (!emailRegex.test(value)) {
        return form.setFields([{ name: "email", errors: ["Invalid email format"] }]);
      }

      form.setFields([{ name: "email", errors: [] }]);

      const fields = fieldsByStep[current] || [];
      const next = fields[fields.indexOf("email") + 1];
      document.querySelector(`[name="${next}"]`)?.focus();
    }
      
    if (e.key === "Enter" ) {
      e.preventDefault();
      try {
        await form.validateFields([fieldName]);
      } catch {
        return;
      }

      const currentFields = fieldsByStep[current] || [];
      const index = currentFields.indexOf(fieldName);
      if (index >= 0 && index < currentFields.length - 1) {
        const nextField = currentFields[index + 1];
        const nextEl = document.querySelector(`[name="${nextField}"]`);
        if (nextEl) nextEl.focus();
      } else {
        if (current < stepTitles.length - 1) {
          document.querySelector(".next-btn")?.click();
        } else {
          document.querySelector(".finish-btn")?.click();
        }
      }
    }

    if (
      [
        "firstName",
        "lastName",
        "designation",
        "degree",
        "university",
        "employerName",
        "stateIncorporation",
        "authorizedName",
        "authorizedTitle",
        "clientName",
        "vendorName",
        "bankName",
      ].includes(fieldName)
    ) {
      const allowed =
        /^[A-Za-z\s]$/.test(e.key) ||
        [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
          "Shift",
          "Enter",
        ].includes(e.key);
      if (!allowed) {
        e.preventDefault();
        form.setFields([{ name: fieldName, errors: ["Alphabets only"] }]);
      }
    }

    if (
      [
        "contactNumber",
        "alternateContactNumber",
        "experience",
        "candidateId",
        "authorizedContact",
        "alternateContact",
        "federalTaxId",
        "clientId"
      ].includes(fieldName)
    ) {
      const allowed =
        /^[0-9]$/.test(e.key) ||
        [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
          "Shift",
          "Enter",
        ].includes(e.key);
      if (!allowed) {
        e.preventDefault();
        form.setFields([{ name: fieldName, errors: ["Digits only"] }]);
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const fieldName = e.target?.name;
    if (!fieldName) return;

    if (
      [
        "firstName",
        "lastName",
        "designation",
        "degree",
        "university",
        "employerName",
        "stateIncorporation",
        "authorizedName",
        "authorizedTitle",
        "clientName",
        "vendorName",
        "bankName",
      ].includes(fieldName) &&
      !/^[A-Za-z\s]+$/.test(paste)
    ) {
      e.preventDefault();
      form.setFields([{ name: fieldName, errors: ["Alphabets only"] }]);
    } else if (
      [
        "contactNumber",
        "alternateContactNumber",
        "experience",
        "candidateId",
        "authorizedContact",
        "alternateContact",
        "clientId"
      ].includes(fieldName) &&
      !/^\d+$/.test(paste)
    ) {
      e.preventDefault();
      form.setFields([{ name: fieldName, errors: ["Digits only"] }]);
    }
    if (fieldName === "federalTaxId" && !/^\d+$/.test(paste)) {
      e.preventDefault();
      form.setFields([{ name: fieldName, errors: ["Digits only"] }]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target || {};
    if (!name) return;

    if (
      [
        "firstName",
        "lastName",
        "designation",
        "degree",
        "university",
        "employerName",
        "stateIncorporation",
        "authorizedName",
        "authorizedTitle",
        "clientName",
        "vendorName",
        "bankName",
      ].includes(name) &&
      /^[A-Za-z\s]*$/.test(value)
    ) {
      form.setFields([{ name, errors: [] }]);
    }

    if (
      [
        "contactNumber",
        "alternateContactNumber",
        "experience",
        "candidateId",
        "authorizedContact",
        "alternateContact",
        "federalTaxId",
        "clientId"
      ].includes(name) &&
      /^\d*$/.test(value)
    ) {
      form.setFields([{ name, errors: [] }]);
    }
    if (name === "email" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      form.setFields([{ name: "email", errors: [] }]);
    }
  };

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("year");

  const disabledDate = (current) => {
    const today = moment();
    const twentyOneYearsAgo = today.clone().subtract(21, "years").endOf("day");
    return !current || current.isAfter(twentyOneYearsAgo) || current.isAfter(today);
  };

  const handlePanelChange = (value, newMode) => {
    if (newMode === "date") {
      setMode("date");
    } else if (newMode === "month") {
      setMode("month");
    } else {
      setMode("year");
    }
  };

  const handleOpenChange = (status) => {
    setOpen(status);
    if (status) setMode("year"); 
  }

  return (
    <div style={{ padding: 20 }}>
      <Form layout="vertical" form={form}>
        <Steps className="step" current={current} onChange={onStepClick}>
          {stepTitles.map((t, index) => (
            <Step
              key={t}
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {t}
                  {stepErrors.includes(index) && (
                    <WarningOutlined style={{ color: "red" }} />
                  )}
                </div>
              }
            />
          ))}
        </Steps>

        <div style={{ minHeight: 420, marginTop: 16 }}>
          <div style={{ display: current === 0 ? "block" : "none" }}>
            <h3>Basic Details</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Invalid email format" },
                  ]}
                  validateTrigger={[]} 
                  shouldUpdate={false}
                >
                  <Input
                    name="email"
                    placeholder="Enter your email"
                    onKeyDown={handleKeyDown}
                    onChange={() => {
                      form.setFields([{ name: "email", errors: [] }]);
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="candidateId"
                  label="Candidate ID"
                  rules={[
                    { required: true, message: "Enter Candidate ID" },
                    { pattern: /^\d+$/, message: "Digits only" },
                  ]}
                >
                  <Input
                    name="candidateId"
                    placeholder="Enter Canditate ID"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onPaste={handlePaste}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: "Enter first name" },
                    { pattern: /^[A-Za-z\s]+$/, message: "Alphabets only" },
                  ]}
                >
                  <Input
                    name="firstName"
                    placeholder="Enter First Name"
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: "Enter last name" },
                    { pattern: /^[A-Za-z\s]+$/, message: "Alphabets only" },
                  ]}
                >
                  <Input
                    name="lastName"
                    placeholder="Enter Last Name"
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="contactNumber"
                  label="Contact Number"
                  rules={[
                    { required: true, message: "Enter contact number" },
                    { pattern: /^\d{10}$/, message: "Must be 10 digits" },
                  ]}
                >
                  <Input
                    name="contactNumber"
                    placeholder="Enter Contact Number"
                    maxLength={10}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="alternateContactNumber"
                  label="Alternate Contact Number"
                  rules={[{ pattern: /^\d{10}$/, message: "Must be 10 digits" }]}
                >
                  <Input
                    name="alternateContactNumber"
                    placeholder="Enter Contact Number"
                    maxLength={10}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="designation"
                  label="Designation"
                  rules={[
                    { required: true, message: "Enter designation" },
                    { pattern: /^[A-Za-z\s]+$/, message: "Alphabets only" },
                  ]}
                >
                  <Input
                    name="designation"
                    placeholder="Enter your Designation"
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="dob"
                  label="Date of Birth"
                  rules={[{ required: true, message: "Please select your DOB" }]}
                >
                  <DatePicker
                    open={open}
                    onOpenChange={handleOpenChange}
                    mode={mode}
                    onPanelChange={handlePanelChange}
                    disabledDate={disabledDate}
                    format="DD-MM-YYYY"
                    placeholder="Select your DOB"
                    showToday={false}
                    style={{ width: "100%" }}
                    defaultPickerValue={moment().subtract(21, "years")}
                    onChange={() => setOpen(false)} 
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: "Select your gender" }]}
                >
                  <Select placeholder="Select your gender" onBlur={handleBlur}>
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
     
            <h3 style={{ marginTop: 20 }}>Professional Details</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="experience"
                  label="Experience (Years)"
                  rules={[
                    { required: true, message: "Enter your experience" },
                    { pattern: /^\d{1,2}$/, message: "Max 2 digits only" },
                  ]}
                >
                  <Input
                    name="experience"
                    placeholder="Enter your Experience"
                    maxLength={2}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="location"
                  label="Current Location"
                  rules={[{ required: true, message: "Enter your location" }]}
                >
                  <Input
                    name="location"
                    placeholder="Enter your Location"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="workAuth"
                  label="Work Authorization"
                  rules={[
                    { required: true, message: "Select work authorization" },
                  ]}
                >
                  <Select placeholder="Select work authorization" onBlur={handleBlur}>
                    <Option value="Citizen">Citizen</Option>
                    <Option value="Visa">Visa</Option>
                    <Option value="PR">Permanent Resident</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <h3 style={{ marginTop: 20 }}>Education Details</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="degree"
                  label="Degree"
                  rules={[
                    { required: true, message: "Enter degree" },
                    { pattern: /^[A-Za-z\s]+$/, message: "Alphabets only" },
                  ]}
                >
                  <Input
                    name="degree"
                    placeholder="Enter your Degree"
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="university"
                  label="University Name"
                  rules={[
                    { required: true, message: "Enter university name" },
                    { pattern: /^[A-Za-z\s]+$/, message: "Alphabets only" },
                  ]}
                >
                  <Input
                    name="university"
                    placeholder="Enter your University"
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div style={{ display: current === 1 ? "block" : "none" }}>
            <h3>Job Details</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="clientId"
                  label="Client ID"
                  rules={[
                    { required: true, message: "Enter Client ID" },
                    { pattern: /^\d+$/, message: "Digits only" },
                  ]}
                >
                  <Input
                    name="clientId"
                    placeholder="Enter Client ID"
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="clientName"
                  label="Client Name"
                  rules={[
                    { required: true, message: "Enter Client Name" },
                    { pattern: /^[A-Za-z\s]+$/, message: "Alphabets only" },
                  ]}
                >
                  <Input
                    name="clientName"
                    placeholder="Enter Client Name"
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div style={{ display: current === 2 ? "block" : "none" }}>
            <h3>Employer Details</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="employerName"
                  label="Name"
                  rules={[{ required: true, message: "Enter employer name" }]}
                >
                  <Input
                    name="employerName"
                    placeholder="Enter Employer Name"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="employerAddress"
                  label="Address"
                  rules={[{ required: true, message: "Enter address" }]}
                >
                  <Input
                    name="employerAddress"
                    placeholder="Enter Address"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="federalTaxId"
                  label="Federal Tax ID"
                  rules={[{ required: true, message: "Enter Federal Tax ID" },{ pattern: /^\d{9}$/, message: "Must be 9 digits" }]}
                >
                  <Input
                    name="federalTaxId"
                    maxLength={9}
                    placeholder="Enter Federal Tax ID"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="stateIncorporation"
                  label="State of Incorporation"
                  rules={[{ required: true, message: "Enter State of Incorporation" }]}
                >
                  <Input
                    name="stateIncorporation"
                    placeholder="Enter State of Incorporation"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </Col>
            </Row>

            <h3 style={{ marginTop: 20 }}>Employer Signing Authority</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="authorizedName"
                  label="Authorized Name"
                  rules={[{ required: true, message: "Enter authorized name" }]}
                >
                  <Input
                    name="authorizedName"
                    placeholder="Enter Authorized Name"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="authorizedTitle"
                  label="Authorized Title"
                  rules={[{ required: true, message: "Enter authorized title" }]}
                >
                  <Input
                    name="authorizedTitle"
                    placeholder="Enter Authorized Title"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="authorizedEmail"
                  label="Authorized Email ID"
                  rules={[
                    { required: true, message: "Enter authorized email" },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                >
                  <Input
                    name="authorizedEmail"
                    placeholder="Enter Authorized Email"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="authorizedContact"
                  label="Authorized Contact Number"
                  rules={[
                    { required: true, message: "Enter authorized contact number" },
                    { pattern: /^\d{10}$/, message: "Must be 10 digits" },
                  ]}
                >
                  <Input
                    name="authorizedContact"
                    placeholder="Enter Contact Number"
                    maxLength={10}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="alternateContact"
                  label="Alternate Contact Number"
                  rules={[{ pattern: /^\d{10}$/, message: "Must be 10 digits" }]}
                >
                  <Input
                    name="alternateContact"
                    placeholder="Enter Alternate Number"
                    maxLength={10}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="website"
                  label="Website"
                  rules={[{ type: "url", message: "Enter a valid URL" }]}
                >
                  <Input
                    name="website"
                    placeholder="Enter Company Website"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div style={{ display: current === 3 ? "block" : "none" }}>
            <h3>Referral Details</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="vendorName"
                  label="Vendor Name"
                  rules={[
                    { required: true, message: "Enter Vendor Name" },
                    { pattern: /^[A-Za-z\s]+$/, message: "Alphabets only" },
                  ]}
                >
                  <Input
                    name="vendorName"
                    placeholder="Enter Vendor Name"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="bankName"
                  label="Bank Name"
                  rules={[
                    { required: true, message: "Enter Bank Name" },
                    { pattern: /^[A-Za-z\s]+$/, message: "Alphabets only" },
                  ]}
                >
                  <Input
                    name="bankName"
                    placeholder="Enter Bank Name"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="accountType"
                  label="Account Type"
                  rules={[{ required: true, message: "Select Account Type" }]}
                >
                  <Select placeholder="Select Account Type" onBlur={handleBlur}>
                    <Option value="Savings">Savings</Option>
                    <Option value="Current">Current</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="bankAddress"
                  label="Bank Address"
                  rules={[{ required: true, message: "Enter Bank Address" }]}
                >
                  <Input
                    name="bankAddress"
                    placeholder="Enter Bank Address"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div style={{ display: current === 4 ? "block" : "none" }}>
            <h3>Financial</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="projectStart"
                  label="Project Start Date"
                  rules={[{ required: true, message: "Select date" }]}
                >
                  <DatePicker
                    name="projectStart"
                    style={{ width: "100%" }}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="projectEnd"
                  label="Project End Date"
                  rules={[{ required: true, message: "Select date" }]}
                >
                  <DatePicker
                    name="projectEnd"
                    style={{ width: "100%" }}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="duration"
                  label="Duration"
                  rules={[{ required: true, message: "Enter duration" }]}
                >
                  <Input
                    name="duration"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>

        <div className="footer">
          {current > 0 && (
            <Button onClick={handlePrevious}>Previous</Button>
          )}
          {current < stepTitles.length - 1 && (
            <Button
              type="primary"
              className="next-btn"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
          {current === stepTitles.length - 1 && (
            <Button
              type="primary"
              className="finish-btn"
              onClick={handleFinishClick}
            >
              Finish
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default App;
