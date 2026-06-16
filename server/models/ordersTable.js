import database from "../database/db.js";

export async function createOrdersTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS orders (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        buyer_id UUID NOT NULL,

        total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
        tax_price DECIMAL(10,2) NOT NULL CHECK (tax_price >= 0),
        shipping_price DECIMAL(10,2) NOT NULL CHECK (shipping_price >= 0),

        order_status VARCHAR(50) DEFAULT 'Processing'
          CHECK (order_status IN ('Processing', 'Shipped', 'Delivered', 'Cancelled')),

        payment_method VARCHAR(10) DEFAULT 'Card'
          CHECK (payment_method IN ('Card', 'COD')),

        payment_status VARCHAR(20) DEFAULT 'Pending'
          CHECK (payment_status IN ('Pending', 'Paid', 'Failed')),

        paid_at TIMESTAMP NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    await database.query(query);

    console.log("Orders table ready.");
  } catch (error) {
    console.error("❌ Failed To Create Orders Table.", error);
    process.exit(1);
  }
}