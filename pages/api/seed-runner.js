
import { query } from "../../lib/db.js";
import { products } from "../../lib/data.js";
async function main(){
  try{
    await query(`CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY,name TEXT NOT NULL,price NUMERIC NOT NULL,image TEXT,description TEXT)`);
    for(const p of products){
      await query("INSERT INTO products (id,name,price,image,description) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING",[p.id,p.name,p.price,p.image,p.description]);
    }
    console.log("Seed complete."); process.exit(0);
  }catch(e){ console.error(e); process.exit(1); }
}
main();
