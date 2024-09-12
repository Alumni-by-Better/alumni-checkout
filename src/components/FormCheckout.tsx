import { useState } from "react";
import type { FormProps } from 'antd';
import { Button, Form, Input, Select } from 'antd';

const FormCheckout = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    card: '',
    username_card: '',
  });

  const styles = {
    form: {
      height: '100%',
      width: '100%',
      padding: '50px',
    },
    formItem: {
      color: '#1A1A1AB2',
      fontSize: '16px',
      fontWeight: '500',
      marginBottom: '20px',
      padding: '10px 0',
    },
    formInput: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    formSelect: {
      width: '100%',
      height: '40px',
      padding: '0px',
      borderRadius: '5px',
    },
    formButton: {
      color: '#fff',
      backgroundColor: '#003FB0',
      width: '100%',
      height: '100%',
      fontSize: '16px',
      fontWeight: '400',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setFormData({ ...formData });
    console.log(formData);
  };

  type FieldType = {
    username?: string;
    email?: string;
    phone?: string;
    address?: string;
    card?: string;
    username_card?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      layout="vertical"
      labelCol={{ span: "100%" }}
      wrapperCol={{ span: 24 }}
      style={{ ...styles.form, maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      onSubmitCapture={handleSubmit}
    >
      <Form.Item<FieldType>
        style={styles.formItem}
        label="Nome Completo"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input style={styles.formInput} />
      </Form.Item>

      <Form.Item<FieldType>
        style={styles.formItem}
        label="E-mail"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input style={styles.formInput} />
      </Form.Item>

      <Form.Item<FieldType>
        style={styles.formItem}
        label="Telefone"
        name="phone"
        rules={[{ required: true, message: 'Please input your phone!' }]}
      >
        <Input style={styles.formInput} />
      </Form.Item>

      <Form.Item<FieldType>
        style={styles.formItem}
        label="Endereço"
        name="address"
        rules={[{ required: true, message: 'Please input your address!' }]}
      >
        <Select style={styles.formSelect} defaultValue={"brasil"}>
          <Select.Option value="brasil">Brasil</Select.Option>
          <Select.Option value="china">China</Select.Option>
          <Select.Option value="usa">U.S.A</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item<FieldType>
        style={styles.formItem}
        label="Nome do titular do cartão"
        name="username_card"
        rules={[{ required: true, message: 'Please input your name!' }]}
      >
        <Input style={styles.formInput} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={styles.formButton}>
          Pagar
        </Button>
      </Form.Item>
    </Form>
  );
}

export default FormCheckout;