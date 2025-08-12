import db from '../utils/db.js';

export const createOutfit = async (req, res) => {
  const { top_item_id, bottom_item_id, shoes_item_id, color, tema } = req.body;
  const userId = req.user.id;

  const [items] = await db.query(
    'SELECT id FROM items WHERE id IN (?, ?, ?) AND user_id = ?',
    [top_item_id, bottom_item_id, shoes_item_id, userId]
  );

  if (items.length !== 3) return res.status(400).json({ message: 'Invalid or unauthorized item IDs' });

  const [result] = await db.query(
    'INSERT INTO outfits (user_id, top_item_id, bottom_item_id, shoes_item_id, color, tema) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, top_item_id, bottom_item_id, shoes_item_id, color, tema]
  );

  res.status(201).json({ message: 'Outfit saved', id: result.insertId });
};

export const getUserOutfits = async (req, res) => {
  const userId = req.user.id;
  const { color, tema } = req.query;

  // Query dasar dengan JOIN untuk mengambil URL gambar
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
    WHERE o.user_id = ?
  `;
  const params = [userId];

  // Tambahkan filter jika ada
  if (color) {
    query += ' AND o.color = ?';
    params.push(color);
  }
  if (tema) {
    query += ' AND o.tema = ?';
    params.push(tema);
  }

  try {
    const [outfits] = await db.query(query, params);
    res.json(outfits);
  } catch (err) {
    console.error('Error fetching outfits:', err.message);
    res.status(500).json({ message: 'Error fetching outfits' });
  }
};

export const deleteOutfit = async (req, res) => {
  const outfitId = req.params.id;
  const [rows] = await db.query('SELECT * FROM outfits WHERE id = ?', [outfitId]);
  if (!rows.length || rows[0].user_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  await db.query('DELETE FROM outfits WHERE id = ?', [outfitId]);
  res.json({ message: 'Outfit deleted' });
};
