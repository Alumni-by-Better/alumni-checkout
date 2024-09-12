import { Col, Row } from 'antd';
import './App.css'

import checkoutIcon from './assets/images/checkout-icon.png'
import alumniLogo from './assets/images/alumni-logo.svg'
import FormCheckout from './components/FormCheckout'
import { ArrowLeftOutlined } from '@ant-design/icons';

function App() {

  type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

  const styles = {
    main: {
      fontFamily: 'Manrope, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#d7eefe',
      padding: '0',
      boxSize: 'border-box',
    },
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

  return (
    <>
      <main style={styles.main}>
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
                  <h3 style={styles.productCardHeader}>Curso de inglês  - 12 meses</h3>
                </div>
                <div className="card-body">
                  <h4 style={styles.productCardTitle} >R$2.880,00</h4>
                  <p style={styles.productCardMethod}>á vista via <span style={styles.productCardMethodSpan}>cartão de crédito</span></p>
                </div>
              </div>
              <div className="card-footer" style={styles.productCardTotal}>
                <span style={styles.productCardTotalTitle}>Valor total</span>
                <span style={styles.productCardTotalValue}><small style={styles.productCardTotalValueSmall}>R$</small> 5.760,00</span>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} style={styles.rightColumn}>
            <FormCheckout />
          </Col>
        </Row>
      </main>
    </>
  )
}

export default App