import database from "../database/db.js";

export const createWishlistTable = async () => {
  try {
    await database.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        product_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,

        FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE,

        UNIQUE(user_id, product_id)
      );
    `);

    console.log("Wishlist table created successfully.");
  } catch (error) {
    console.error("Error creating wishlist table:", error);
  }
};
