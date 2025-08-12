import db from '../utils/db.js';

export const createOutfit = async (req, res) => {
  const { top_item_id, bottom_item_id, shoes_item_id, color, tema } = req.body;
  const userId = req.user.id;

  // PostgreSQL: ganti ? jadi $1, $2...
  const itemsResult = await db.query(
    'SELECT id FROM items WHERE id IN ($1, $2, $3) AND user_id = $4',
    [top_item_id, bottom_item_id, shoes_item_id, userId]
  );

  if (itemsResult.rows.length !== 3) {
    return res.status(400).json({ message: 'Invalid or unauthorized item IDs' });
  }

  const insertResult = await db.query(
    `INSERT INTO outfits (user_id, top_item_id, bottom_item_id, shoes_item_id, color, tema)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [userId, top_item_id, bottom_item_id, shoes_item_id, color, tema]
  );

  res.status(201).json({ message: 'Outfit saved', id: insertResult.rows[0].id });
};

export const getUserOutfits = async (req, res) => {
  const userId = req.user.id;
  const { color, tema } = req.query;

  let query = `
    SELECT 
      o.id, o.color, o.tema, o.created_at,
      o.top_item_id, top.image_url as top_image_url,
      o.bottom_item_id, bottom.image_url as bottom_image_url,
      o.shoes_item_id, shoes.image_url as shoes_image_url
    FROM outfits o
    LEFT JOIN items top ON o.top_item_id = top.id
    LEFT JOIN items bottom ON o.bottom_item_id = bottom.id
    LEFT JOIN items shoes ON o.shoes_item_id = shoes.id
    WHERE o.user_id = $1
  `;
  
  const params = [userId];
  let paramIndex = 2; // karena $1 sudah dipakai untuk userId

  if (color) {
    query += ` AND o.color = $${paramIndex++}`;
    params.push(color);
  }
  if (tema) {
    query += ` AND o.tema = $${paramIndex++}`;
    params.push(tema);
  }

  try {
    const outfitsResult = await db.query(query, params);
    res.json(outfitsResult.rows);
  } catch (err) {
    console.error('Error fetching outfits:', err.message);
    res.status(500).json({ message: 'Error fetching outfits' });
  }
};

export const deleteOutfit = async (req, res) => {
  const outfitId = req.params.id;

  const outfitResult = await db.query(
    'SELECT * FROM outfits WHERE id = $1',
    [outfitId]
  );

  if (!outfitResult.rows.length || outfitResult.rows[0].user_id !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await db.query('DELETE FROM outfits WHERE id = $1', [outfitId]);
  res.json({ message: 'Outfit deleted' });
};
