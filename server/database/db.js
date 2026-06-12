import pkg from "pg";
const {Client}=pkg;

const database=new Client({
    //user:process.env.DB_USER,
    user:"postgres",
    host:"localhost",
    database:"MarketHub",
    password:"KITKAT265",
    //password:process.env.DB_PASSWORD,
    port:5432,
});

try {
  await database.connect();
  console.log("Connected to the database successfully");
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

export default database;