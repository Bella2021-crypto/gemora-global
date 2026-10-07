
import axios from 'axios';
export async function initializeTransaction(email,amountKobo,metadata={}){
  const resp=await axios.post('https://api.paystack.co/transaction/initialize',{email,amount:amountKobo,metadata},{headers:{Authorization:`Bearer ${PAYSTACK_SECRET_KEY}`}});
  return resp.data;
}
