import { ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import checkoutIcon from '../assets/images/checkout-icon.png';
import alumniLogo from '../assets/images/alumni-logo.svg';
import FormCheckout from '../components/FormCheckout';
// import { useCheckout } from "../context/CheckoutContext";
import { useEffect, useState } from "react";
import { fetchCheckoutDataByToken, getCourseById, getPlanById } from "../services/api";
import { useParams } from "react-router-dom";
import { formatNumber } from "../utils";

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

const styles = {
  leftColumn: {
    height: '100%',
    width: '100%',
    padding: '50px',
  },
  backIcon: {
    fontSize: '12px',
    color: '#1A1A1AE5',
    opacity: '0.4',
  },
  rightColumn: {
    backgroundColor: '#fff',
    minHeight: '100vh',
    width: '100%',
    padding: '20px',
    margin: '0'
  },
  breadcrumb: {
    marginBottom: '20px'
  },
  checkoutHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px'
  },
  checkoutHeaderTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1A1A1AE5'
  },
  checkoutInfo: {
    height: '100%',
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column' as FlexDirection,
    padding: '10px 20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    marginTop: '30px',
  },
  productCardHeader: {
    color: '#003FB0',
    fontSize: '16px',
    fontWeight: '600',
  },
  productCardTitle: {
    color: '#1A1A1AE5',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0'
  },
  productCardMethod: {
    color: '#1A1A1A99',
    fontSize: '12px',
    fontWeight: '300',
  },
  productCardMethodSpan: {
    fontSize: '12px',
    fontWeight: '600',
  },
  productCardTotal: {
    display: 'flex',
    flexDirection: 'column' as FlexDirection,
    borderTop: '2px solid #003FB0',
    marginTop: '20px',
  },
  productCardTotalTitle: {
    color: '#003FB0',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '20px',
  },
  productCardTotalValue: {
    color: '#1A1A1AE5',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0'
  },
  productCardTotalValueSmall: {
    color: '#1A1A1AE5',
    fontSize: '16px',
    fontWeight: '300',
  }
}

interface ParamsProps extends Record<string, string | undefined> {
  checkout_token: string;
}

export interface CourseProps {
  id: string;
  name: string;
  pricing_schema?: {
    price: number;
  };
  discount: number;
  plan_items?: {
    cycles: number;
    product: {
      id: string;
      name: string;
      pricing_schema: {
        price: number;
      };
    };
  }[];
}

function Home() {
  const { token } = useParams<ParamsProps>();
  // const { checkoutData, setCheckoutData } = useCheckout();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseProps>();

  useEffect(() => {
    const fetchCheckoutData = async () => {
      setLoading(true);
      try {
        if (!token) {
          throw new Error('Checkout token não fornecido');
        }

        // Nova função de busca baseada no token
        const checkoutDataByToken = await fetchCheckoutDataByToken(token);

        console.log('checkoutDataByToken', checkoutDataByToken);

        if (!checkoutDataByToken) {
          throw new Error('Nenhum dado encontrado para o token fornecido');
        }

        const course =
          checkoutDataByToken.recurrence
            ? await getPlanById(checkoutDataByToken.course_id) // Busca plano
            : await getCourseById(checkoutDataByToken.course_id); // Busca curso

        console.log('course', course);

        setSelectedCourse(course);
        // setCheckoutData({
        //   ...checkoutData,
        //   course_name: selectedCourse?.name ?? null,
        //   course_price: selectedCourse?.plan_items?.[0]?.product?.pricing_schema?.price.toString() || '0',
        //   discount: selectedCourse?.discount || 0,
        //   recurrence: checkoutDataByToken.recurrence,
        // });
      } catch (error) {
        console.error('Erro ao carregar os dados do checkout:', error);
        setError('Erro ao carregar os dados do checkout');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [token]);


  // console.log('checkoutData', checkoutData);
  console.log('selectedCourse', selectedCourse);

  if (loading) return <p>Carregando dados do curso...</p>;

  if (error) return <p>{error}</p>;

  return (
    <Row justify={"end"} gutter={24} style={{ height: '100%', width: '100%' }}>
      <Col xs={24} sm={24} md={12} lg={12} xl={6} style={styles.leftColumn}>
        <div className="checkout-header" style={styles.checkoutHeader}>
          <ArrowLeftOutlined style={styles.backIcon} />
          <img src={checkoutIcon} alt="Checkout Logo" />
          <h1 style={styles.checkoutHeaderTitle}>Checkout Alumni</h1>
        </div>
        <div className="checkout-info" style={styles.checkoutInfo}>
          <img src={alumniLogo} alt="Logo Alumni" />
          <div className="card" style={styles.productCard}>
            <div className="card-header">
              <h3 style={styles.productCardHeader}>{selectedCourse?.plan_items?.[0]?.product?.name || selectedCourse?.name || "Nome do Curso"}</h3>
            </div>
            <div className="card-body">
              <h4 style={styles.productCardTitle}>R$ {formatNumber(selectedCourse?.plan_items?.[0]?.product?.pricing_schema?.price ?? selectedCourse?.pricing_schema?.price ?? 0)}</h4>
              <p style={styles.productCardMethod}><span style={styles.productCardMethodSpan}>cartão de crédito</span></p>
            </div>
          </div>
          <div className="card" style={styles.productCard}>
            <div className="card-header">
              <h3 style={styles.productCardHeader}> Material Didático - {selectedCourse?.plan_items?.[0].product.name.replace(" - Recorrência", "") || selectedCourse?.name}</h3>
            </div>
            <div className="card-body">
              <h4 style={styles.productCardTitle}>R$ {formatNumber(selectedCourse?.plan_items?.[0]?.product?.pricing_schema?.price ?? selectedCourse?.pricing_schema?.price ?? 0)}
              </h4>
              <p style={styles.productCardMethod}>
                <span style={styles.productCardMethodSpan}>cartão de crédito</span>
              </p>
            </div>
          </div>
          <div className="card-footer" style={styles.productCardTotal}>
            <span style={styles.productCardTotalTitle}>Valor total</span>
            <span style={styles.productCardTotalValue}>
              <small style={styles.productCardTotalValueSmall}>R$</small>
              {formatNumber((selectedCourse?.plan_items?.[0]?.product?.pricing_schema?.price ?? selectedCourse?.pricing_schema?.price ?? 0) * (selectedCourse?.plan_items?.[0]?.cycles ?? 2))}
            </span>
          </div>
        </div>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12} style={styles.rightColumn}>
        {token && (
          <FormCheckout
            course={selectedCourse}
            token={token}
          />
        )}
      </Col>
    </Row>
  );
}

export default Home;