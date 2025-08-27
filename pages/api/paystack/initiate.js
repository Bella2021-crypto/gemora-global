
import { initializeTransaction } from "../../../utils/paystack";
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{ const { email, amount } = req.body||{}; if(!email||!amount) return res.status(400).json({error:'email and amount are required'});
    const data=await initializeTransaction(email,Math.round(amount*100),{source:'Gemora'}); return res.status(200).json(data);
  }catch(e){ console.error(e); return res.status(500).json({error:'Paystack init failed'}); }
}
