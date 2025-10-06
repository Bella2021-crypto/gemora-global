
import cloudinary from "cloudinary";
cloudinary.v2.config({ cloud_name:"drbkamqdr", api_key:"629812938311984", api_secret:"WMePd9QQOnRnBirJIR3gavgy5FI" });
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{ const { file } = req.body||{}; if(!file) return res.status(400).json({error:'file required'});
    const result=await cloudinary.v2.uploader.upload(file,{folder:'gemora'}); return res.status(200).json(result);
  } catch(e){ console.error(e); return res.status(500).json({error:'Cloudinary upload failed'}); }
}
