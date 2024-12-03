// configure api request

import axios from "axios";

const api = axios.create({
  baseURL: 'https://server.alumni.org.br/api/vindi',
});

interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  address: string;
  card_number: string;
  card_expiration: string;
  card_holder_name: string;
  card_cvv: string;
  installments: number;
  accept_terms: boolean;
}

interface RegisterLinkData {
  course_id: string;
  discount: number;
  recurrence: number;
}

export const submitCheckout = async (data: CheckoutData) => {
  const response = await api.post('/checkout', data);
  return response.data;
}

export const savePresetAndGenerateLink = async (course_id: string, discount: number) => {
  const response = await api.post('/checkout/preset', { course_id, discount });
  console.log('response', response);
  return response.data;
}

export const getCourses = async () => {
  const response = await api.get('/products');
  return response.data;
}

export const getCourseById = async (course_id: string) => {
  const response = await api.get(`/products/${course_id}`);
  console.log('response getCourseById', response);
  return response.data;
}

export const getPlans = async () => {
  const response = await api.get('/plans');
  return response.data;
}

export const getPlanById = async (plan_id: string) => {
  const response = await api.get(`/plans/${plan_id}`);
  return response.data;
}

export const getCheckoutData = async (checkout_token: string) => {
  const response = await api.get(`/checkout/${checkout_token}`);
  console.log('response', response);
  return response.data;
}

export const registerLink = async (payload: RegisterLinkData) => {
  const response = await api.post(`/checkout/register-link/`, payload);
  console.log('response registerLink', response);
  return response.data;
}

export const fetchCheckoutDataByToken = async (token: string) => {
  const response = await api.get(`/checkout/${token}`);
  console.log('response fetchCheckoutDataByToken', response);
  return response.data;
};


export default api;