// views/Login.tsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Alert, Card } from "antd";

const { Title } = Typography;

const Login = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (values: { username: string; password: string }) => {
    const { username, password } = values;
    const success = login(username, password);
    if (success) {
      navigate("/"); // Redirecionar para a rota protegida
    } else {
      setError("Credenciais inválidas");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        // backgroundColor: "#f0f2f5",
      }}
    >
      <Card style={{ width: 400, padding: 20 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Login de Vendedores
        </Title>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}
        <Form
          name="login"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Usuário"
            name="username"
            rules={[{ required: true, message: "Por favor, insira seu usuário!" }]}
          >
            <Input placeholder="Digite seu usuário" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
          >
            <Input.Password placeholder="Digite sua senha" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
