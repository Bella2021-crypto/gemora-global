
import axios from 'axios';
const PAYSTACK_SECRET_KEY="sk_test_beb91762fa114eaeccda84b1cfb1887d432e134c";
export async function initializeTransaction(email,amountKobo,metadata={}){
  const resp=await axios.post('https://api.paystack.co/transaction/initialize',{email,amount:amountKobo,metadata},{headers:{Authorization:`Bearer ${PAYSTACK_SECRET_KEY}`}});
  return resp.data;
}
