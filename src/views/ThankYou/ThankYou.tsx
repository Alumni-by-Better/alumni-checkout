import { Col, Row } from "antd";
import { useUser } from "../../hooks/useUser";
import { UserProvider } from "../../context/UserContext";


const styles = {
  ThankYou: {
    color: '#1A1A1AE5',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0',
    textAlign: 'center' as const,
  },
  message: {
    color: '#1A1A1A99',
    fontSize: '16px',
    fontWeight: '300',
    margin: '10px 0',
  },
  courseName: {
    color: '#003FB0',
    fontSize: '20px',
    fontWeight: '600',
    margin: '5px 0',
  },
};

export function ThankYou() {
  const { name, course } = useUser(); // Acessa o nome e o curso do contexto

  return (
    <UserProvider>
      <Row justify="center" align="middle" style={{ height: '100%' }}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <div style={styles.ThankYou}>
            <p>Obrigado pela compra!</p>
            <h2>{name}</h2>
            <h1 style={styles.message}>
              Você adquiriu o curso <span style={styles.courseName}>{course}</span>.
            </h1>
            <p style={styles.message}>
              Verifique o seu email para mais informações e acesso ao curso. Caso não receba o email, entre em contato com nosso suporte.
            </p>
          </div>
        </Col>
      </Row>
    </UserProvider >
  );
}
