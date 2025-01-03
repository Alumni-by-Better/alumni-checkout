import { ArrowLeftOutlined } from "@ant-design/icons";
import { Col, message, Row } from "antd";

import checkoutIcon from '../assets/images/checkout-icon.png';
import alumniLogo from '../assets/images/alumni-logo.svg';
import FormCheckout from '../components/FormCheckout';
// import { useCheckout } from "../context/CheckoutContext";
import { useCallback, useEffect, useState } from "react";
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

interface CheckoutData {
  course_id: string;
  material_id: string;
  discount: number;
  recurrence: boolean;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

function Home() {
  const { token } = useParams<ParamsProps>();
  // const { checkoutData, setCheckoutData } = useCheckout();
  const [checkoutDataByToken, setCheckoutDataByToken] = useState<CheckoutData>({ course_id: '', material_id: '', discount: 0, recurrence: false, customer: { name: '', email: '', phone: '', address: '' } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseProps>();
  const [selectedMaterial, setSelectedMaterial] = useState<CourseProps>();
  const installments =
    parseInt(selectedCourse?.name?.match(/\d+/)?.[0] || "0", 10);

  const fetchCheckoutData = useCallback(async () => {
    if (!token) {
      setError('Checkout token não fornecido');
      setLoading(false);
      return;
    }

    try {
      const checkoutData: CheckoutData = await fetchCheckoutDataByToken(token);

      if (!checkoutData) {
        message.error('Nenhum dado encontrado para o token fornecido');
        throw new Error('Nenhum dado encontrado para o token fornecido');
      }

      setCheckoutDataByToken(checkoutData);

      const course =
        checkoutData?.recurrence
          ? await getPlanById(checkoutData?.course_id) // Busca plano
          : await getCourseById(checkoutData?.course_id); // Busca curso

      setSelectedCourse(course);

      const material = await getCourseById(checkoutData.material_id);
      setSelectedMaterial(material);
    } catch (error) {
      console.error('Erro ao carregar os dados do checkout:', error);
      setError('Erro ao carregar os dados do checkout');
      message.error('Erro ao carregar os dados do checkout');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCheckoutData();
  }, [fetchCheckoutData]);


  console.log('checkoutDataByToken', checkoutDataByToken);
  console.log('selectedCourse', selectedCourse);
  console.log('selectedMaterial', selectedMaterial);

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
              <h4 style={styles.productCardTitle}><small>R$</small> {
                formatNumber(
                  selectedCourse?.plan_items?.[0]?.product?.pricing_schema?.price
                  ?? selectedCourse?.pricing_schema?.price ?? 0
                )}
              </h4>
              <p style={styles.productCardMethod}>
                <span style={styles.productCardMethodSpan}>
                  cartão de crédito
                  {selectedCourse?.plan_items && " / mês"}
                </span>
              </p>
            </div>
          </div>
          <div className="card" style={styles.productCard}>
            <div className="card-header">
              <h3 style={styles.productCardHeader}> Material Didático - {selectedCourse?.plan_items?.[0].product.name.replace(" - Recorrência", "") || selectedCourse?.name}</h3>
            </div>
            <div className="card-body">
              <h4 style={styles.productCardTitle}><small>R$</small> {
                formatNumber(
                  (
                    (selectedMaterial?.pricing_schema?.price ?? 0)
                    // *
                    // (selectedMaterial?.plan_items?.[0]?.cycles ?? 0)
                  )
                )}
              </h4>
              <p style={styles.productCardMethod}>
                <span style={styles.productCardMethodSpan}>
                  cartão de crédito
                  {selectedCourse?.plan_items && ` parcelado ${selectedCourse?.plan_items?.[0]?.cycles}x`}
                </span>
              </p>
            </div>
          </div>
          <div className="card-footer" style={styles.productCardTotal}>
            <span style={styles.productCardTotalTitle}>Valor total</span>
            <span style={styles.productCardTotalValue}>
              <small style={styles.productCardTotalValueSmall}>R$</small>
              {formatNumber(
                selectedCourse?.plan_items ? (selectedCourse?.plan_items?.[0]?.product?.pricing_schema?.price ?? 0)
                  * (selectedCourse?.plan_items?.[0]?.cycles ?? 0)
                  * 2
                  : (selectedCourse?.pricing_schema?.price ?? 0)
                  * 2
              )}
              {!selectedCourse?.plan_items &&
                <>
                  <small> parcelado até</small> {selectedCourse?.plan_items?.[0]?.cycles ?? installments}x
                </>
              }
            </span>
          </div>
        </div>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12} style={styles.rightColumn}>
        {token && (
          <FormCheckout
            course={selectedCourse}
            recurrence={checkoutDataByToken?.recurrence}
            material={selectedMaterial}
            customer={checkoutDataByToken?.customer}
            token={token}
          />
        )}
      </Col>
    </Row>
  );
}

export default Home;