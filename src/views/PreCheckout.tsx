import React, { useEffect, useState } from 'react';
import { getCourses, getMaterials, getPlans, registerLink } from '../services/api';
import { Button, Col, Form, Input, Layout, message, Row, Select } from 'antd';

interface Course {
  id: string;
  name: string;
  pricing_schema: {
    price: string;
  };
}

interface Plan {
  id: string;
  name: string;
  price: string;
}

type FieldType = {
  course?: string;
  discount?: string;
  plan?: string;
  recurrence?: number;
  material?: string;
};

const PreCheckout: React.FC = () => {
  const [recurrence, setRecurrence] = useState<number | undefined>();
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>();
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | undefined>();
  // const [discount, setDiscount] = useState<number>(0);
  const [link, setLink] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [materiais, setMateriais] = useState<Course[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      const products = await getCourses();

      const materiais = await getMaterials()
      setMateriais(materiais);
      console.log("materiais", materiais);

      const courses = products.filter((course: Course) => !course.name.includes('Recorrência') && !course.name.includes('Material Didático'));
      setCourses(courses);
    };

    const loadPlans = async () => {
      const plans = await getPlans();
      plans.filter((plan: Plan) => !plan.name.includes('Material Didático'));
      setPlans(plans);
    };

    loadPlans();
    loadCourses();
  }, []);

  // sem autenticação (FUNCIONAL)
  // const generateLink = async () => {
  //   if (!selectedCourseId) return;

  //   console.log("selectedCourseId", selectedCourseId);

  //   const data = await savePresetAndGenerateLink(selectedCourseId, discount);

  //   if (data.checkout_token) {
  //     // Determina se deve buscar nos cursos ou nos planos com base na recorrência
  //     const selectedItem =
  //       recurrence === "true"
  //         ? plans.find((plan) => plan.id === selectedCourseId)
  //         : courses.find((course) => course.id === selectedCourseId);

  //     if (!selectedItem) {
  //       alert("Erro: Item selecionado não encontrado!");
  //       return;
  //     }

  //     // Gera o link com a query string correta
  //     const params = new URLSearchParams({
  //       discount: discount.toString(),
  //       recurrence: recurrence || "", // Garantir que seja string, mesmo se for null
  //     });

  //     const url = `${window.location.origin}/alumni-checkout/checkout/${selectedItem.id}/${data.checkout_token}?${params.toString()}`;

  //     console.log("Generated Link:", url);
  //     setLink(url);
  //   } else {
  //     alert(data.message || "Erro ao gerar link");
  //   }
  // };

  const generateLink = async () => {
    if (!selectedCourseId || !selectedMaterialId) return;
    console.log("selectedCourseId", selectedCourseId);
    console.log("recurrence", recurrence);

    setLoading(true);

    try {
      const payload = {
        course_id: selectedCourseId,
        material_id: selectedMaterialId,
        discount: 0,
        recurrence: recurrence || 0,
      };

      console.log('Payload:', payload);

      const data = await registerLink(payload); // Chama o método do serviço
      setLink("https://server.alumni.org.br/alumni-checkout/checkout/" + data.token);
      message.success('Link gerado com sucesso!');
      console.log('checkout registrado com sucesso:', data);
      // O backend retorna o link gerado, que pode ser exibido ou salvo
    } catch (error) {
      message.error('Erro ao gerar link, tente novamente!');
      console.error('Falha ao registrar o link:', error);
      // Trate o erro apropriadamente (exibir mensagem, tentar novamente, etc.)
    }
    finally {
      setLoading(false);
    }
  };



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
      fontSize: '16px',
      fontWeight: '400',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
    },
  };

  return (
    <Layout style={{ backgroundColor: 'transparent' }}>
      <Row justify="center" align="middle" style={{ height: '100%' }}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} style={styles.form}>
          <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Gerar Link de Pagamento</h1>
          <Form
            name="basic"
            layout="vertical"
            labelCol={{ span: "100%" }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 600, backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
            initialValues={{ remember: true }}
            autoComplete="on"
          >
            {/* Campo de Recorrência */}
            <Form.Item<FieldType>
              style={styles.formItem}
              label="Tipo de curso"
              name="recurrence"
            >
              <Select
                style={styles.formSelect}
                placeholder="Selecione"
                value={recurrence}
                onChange={(value) => setRecurrence(value)}
              >
                <Select.Option value={1}>Recorrência</Select.Option>
                <Select.Option value={0}>Normal</Select.Option>
              </Select>
            </Form.Item>

            {/* Campo de Plano */}
            {recurrence === 1 ? (
              <Form.Item<FieldType>
                style={styles.formItem}
                label="Nome do plano"
                name="plan"
                rules={[{ required: true, message: 'Por favor, selecione um plano!' }]}
              >
                <Select
                  style={styles.formSelect}
                  placeholder="Selecione um plano"
                  value={selectedCourseId}
                  onChange={(value) => setSelectedCourseId(value)}
                >
                  <Select.Option value="" disabled>Selecione um plano</Select.Option>
                  {plans.map((plan) => (
                    <Select.Option key={plan.id} value={plan.id}>{plan.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) :
              (
                <>
                  <Form.Item<FieldType>
                    style={styles.formItem}
                    label="Nome do curso"
                    name="course"
                    rules={[{ required: true, message: 'Por favor, selecione um curso!' }]}
                  >
                    <Select
                      style={styles.formSelect}
                      placeholder="Selecione um curso"
                      value={selectedCourseId}
                      onChange={(value) => setSelectedCourseId(value)}
                    >
                      <Select.Option value="" disabled>Selecione um curso</Select.Option>
                      {courses.map((course) => (
                        <Select.Option key={course.id} value={course.id}>{course.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              )
            }

            <Form.Item<FieldType>
              style={styles.formItem}
              label="Material Didático"
              name="material"
              rules={[{ required: true, message: 'Por favor, selecione um material!' }]}
            >
              <Select
                style={styles.formSelect}
                placeholder="Selecione um material didático"
                value={selectedMaterialId}
                onChange={(value) => setSelectedMaterialId(value)}
              >
                <Select.Option value="" disabled>Selecione um material</Select.Option>
                {materiais.map((material) => (
                  <Select.Option key={material.id} value={material.id}>{material.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Campo de Desconto */}
            {/* <Form.Item<FieldType>
              style={styles.formItem}
              label="Desconto"
              name="discount"
              rules={[
                { required: true, message: 'Por favor, insira o desconto!' },
              ]}
            >
              <Input
                type="text"
                value={discount}
                style={styles.formInput}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="Desconto"
              />
            </Form.Item> */}

            <Button style={styles.formButton} onClick={generateLink} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar Link de Pagamento'}
            </Button>
            {link && (
              <Form.Item style={{ marginTop: '20px' }}>
                <Input
                  value={link}
                  readOnly
                  style={{ ...styles.formInput, backgroundColor: '#f0f0f0', color: '#333' }}
                  onClick={(e) => e.currentTarget.select()} // Facilita a cópia
                />
              </Form.Item>
            )}
          </Form>
        </Col>
      </Row>
    </Layout>
  );
};

export default PreCheckout;
