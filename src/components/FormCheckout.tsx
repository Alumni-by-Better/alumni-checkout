import { useEffect, useState } from "react";
import type { FormProps } from 'antd';
import { Button, Checkbox, Col, Form, Input, message, Row, Select } from 'antd';
import InputMask from 'react-input-mask';
import styled from "styled-components";
import { submitCheckout } from "../services/api";
import { CourseProps } from "../views/Home";
import { formatNumber } from "../utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const Pattern = `
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin: 0;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  transition: all 0.2s;
`;

export const InputMaskedContainer = styled(InputMask)`
  ${Pattern}
`;


interface FormCheckoutProps {
  token: string;
  course?: CourseProps;
  material?: CourseProps;
  recurrence?: boolean;
  customer?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

const FormCheckout = ({ course, material, recurrence, customer }: FormCheckoutProps) => {
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   phone: '',
  //   address: '',
  //   card_number: '',
  //   card_expiration: '',
  //   card_holder_name: '',
  //   card_cvv: '',
  //   products: [
  //     {
  //       id: 1,
  //       name: 'Curso de inglês - 12 meses',
  //       price: 2880.00,
  //       quantity: 1,
  //     },
  //   ],
  //   installments: 1,
  // });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cycles = course?.plan_items?.[0]?.cycles;
  const installments =
    parseInt(course?.name?.match(/\d+/)?.[0] || "0", 10);
  const { setUser } = useUser();

  console.log('course formcheckout', course);
  console.log('course cycles', cycles);
  console.log('course installments', installments);
  console.log('material formcheckout', material);

  const [form] = Form.useForm();

  useEffect(() => {
    // Força o valor inicial
    form.setFieldsValue({ address: "brasil", email: customer?.email });
  }, [form, customer]);

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

  type FieldType = {
    name: string;
    email: string;
    phone: string;
    address: string;
    card_number: string;
    card_expiration: string;
    card_holder_name: string;
    card_cvv: string;
    course_id: string;
    material_id: string;
    installments: number;
    accept_terms: boolean;
    address_zipcode: string;
    address_state: string;
    address_city: string;
    address_neighborhood: string;
    address_number: string;
    address_street: string;
  };

  // Função chamada ao enviar o formulário
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Form submitted:', values);
    setLoading(true);
    // if (course?.plan_items) {
    //   course.id = course.plan_items[0].product.id;
    // }
    const payload = {
      ...values,
      course_id: course?.id || "",
      material_id: material?.id || "",
      recurrence: recurrence ? 1 : 0,
    };

    console.log("Form payload:", payload);

    // Realiza o fetch usando os valores do formulário
    try {
      const response = await submitCheckout(payload);
      console.log('Response:', response);

      if (response.success) {
        // alert('Form submitted successfully 🎉');
        form.resetFields(); // Limpa os campos do formulário
        setUser({
          name: values.name,
          course: course?.name || '',
        });
        navigate('/success');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Erro ao enviar o formulário. Tente novamente.');
    } finally {
      setLoading(false);
    }


    // fetch('http://localhost:8000/api/vindi/checkout', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(values),
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log('Success:', data);
    //     alert('Form submitted successfully 🎉');
    //     form.resetFields(); // Limpa os campos do formulário
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });

  }

  // reset form
  form.resetFields();

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Erro ao enviar o formulário. Verifique os campos e tente novamente.');
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length === 8) {
      try {
        const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!data.erro) {
          // Configura os valores nos campos do formulário
          form.setFieldsValue({
            address_state: data.uf || '',
            address_city: data.localidade || '',
            address_neighborhood: data.bairro || '',
            address_street: data.logradouro || '',
          });
          console.log('Valores atualizados no formulário:', form.getFieldsValue());
        } else {
          // alert('CEP não encontrado!');
          message.error('CEP não encontrado!');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        message.error('Erro ao buscar o CEP. Tente novamente.');
        // alert('Erro ao buscar o CEP. Tente novamente.');
      }
    } else {
      alert('Por favor, insira um CEP válido com 8 dígitos.');
    }
  };


  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      labelCol={{ span: "100%" }}
      wrapperCol={{ span: 24 }}
      style={{ ...styles.form, maxWidth: 600 }}
      initialValues={{ remember: true, installments: 1 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="on"
    >
      <Form.Item<FieldType>
        style={styles.formItem}
        label="Nome Completo"
        name="name"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input style={styles.formInput} />
      </Form.Item>

      <Form.Item<FieldType>
        style={styles.formItem}
        label="E-mail"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' },
        ]}
      >
        <Input
          style={styles.formInput}
          type="email"
          value={customer?.email}
          disabled={!!customer?.email}
        />
      </Form.Item>

      <Form.Item<FieldType>
        style={styles.formItem}
        label="Telefone"
        name="phone"
        rules={[{ required: true, message: 'Please input your phone!' }]}
      >
        <InputMaskedContainer className="ant-input" mask="(99) 99999-9999" placeholder="(99) 99999-9999">

        </InputMaskedContainer>
      </Form.Item>

      <Form.Item<FieldType>
        style={styles.formItem}
        label="CEP"
        name="address_zipcode"
        rules={[{ required: true, message: 'Por favor, insira seu CEP!' }]}
      >
        <InputMaskedContainer
          type="text"
          mask="99999-999"
          placeholder="00000-000"
          onBlur={handleCepBlur}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={6}>
          <Form.Item<FieldType>
            style={styles.formItem}
            label="Estado"
            name="address_state"
            rules={[{ required: true, message: 'Por favor, insira o estado!' }]}
          >
            <Input style={styles.formInput} />
          </Form.Item>
        </Col>

        <Col span={18}>
          <Form.Item<FieldType>
            style={styles.formItem}
            label="Cidade"
            name="address_city"
            rules={[{ required: true, message: 'Por favor, insira a cidade!' }]}
          >
            <Input style={styles.formInput} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<FieldType>
        style={styles.formItem}
        label="Bairro"
        name="address_neighborhood"
        rules={[{ required: true, message: 'Por favor, insira o bairro!' }]}
      >
        <Input style={styles.formInput} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={20}>
          <Form.Item<FieldType>
            style={styles.formItem}
            label="Rua"
            name="address_street"
            rules={[{ required: true, message: 'Por favor, insira a rua!' }]}
          >
            <Input style={styles.formInput} />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item<FieldType>
            style={styles.formItem}
            label="Número"
            name="address_number"
            rules={[{ required: true, message: 'Por favor, insira o número!' }]}
          >
            <Input style={styles.formInput} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item<FieldType>
        style={styles.formItem}
        label="Número do cartão"
        name="card_number"
        rules={[{ required: true, message: 'Please input your card!' }]}
      >
        <InputMaskedContainer mask="9999 9999 9999 9999" placeholder="1234 5678 9123 4567" />
      </Form.Item>

      <Form.Item<FieldType>
        style={styles.formItem}
        label="Data de validade"
        name="card_expiration"
        rules={[{ required: true, message: 'Please input your date!' }]}
      >
        <InputMaskedContainer mask="99/99" placeholder="MM/YY" />
      </Form.Item>

      <Form.Item<FieldType>
        style={styles.formItem}
        label="Código de segurança"
        name="card_cvv"
        rules={[{ required: true, message: 'Please input your security code!' }]}
      >
        <InputMaskedContainer mask="999" placeholder="123" />
      </Form.Item>

      {!course?.plan_items && (
        <Form.Item<FieldType>
          style={styles.formItem}
          label="Parcelas"
          name="installments"
          rules={[{ required: true, message: 'Please input your installments!' }]}
        >
          <Select style={styles.formSelect}>
            {[...Array(installments)].map((_, index) => (
              <Select.Option key={index + 1} value={index + 1}>
                {index + 1}x de R$
                {formatNumber((course?.pricing_schema?.price ?? 0) / (index + 1) * 2)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {course?.plan_items && (
        <Form.Item<FieldType>
          style={styles.formItem}
          label="Parcelas do Material Didático"
          name="installments"
          rules={[{ required: true, message: 'Please input your installments!' }]}
        >
          <Select style={styles.formSelect}>
            {[...Array(cycles)].map((_, index) => (
              <Select.Option key={index + 1} value={index + 1}>
                {index + 1}x de R$
                {formatNumber((material?.pricing_schema?.price ?? 0) / (index + 1))}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item<FieldType>
        style={styles.formItem}
        label="Nome do titular do cartão"
        name="card_holder_name"
        rules={[{ required: true, message: 'Please input your name!' }]}
      >
        <Input style={styles.formInput} />
      </Form.Item>

      <Form.Item<FieldType>
        style={styles.formItem}
        name="accept_terms"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error('Você deve aceitar os termos para continuar!')),
          },
        ]}
      >
        <Checkbox>
          Eu aceito os <a className="" href="https://alumni.org.br/termos-e-condicoes/">termos e condições</a>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={styles.formButton}
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Pagar'}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default FormCheckout;