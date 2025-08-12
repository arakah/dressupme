import db from '../utils/db.js';
import cloudinary from '../utils/cloudinary.js';

/**
 * Mengunggah gambar item, menyimpannya di Cloudinary (dengan remove background),
 * dan mencatatnya di database.
 */
export const uploadItem = async (req, res) => {
  const { category } = req.body;
  const userId = req.user.id;

  if (!['top', 'bottom', 'shoes'].includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'mixmatch_items',
          transformation: [{ effect: "background_removal" }]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const imageUrl = uploadResult.secure_url;
    const cloudinaryPublicId = uploadResult.public_id;

    // PostgreSQL pakai RETURNING untuk ambil ID
    const result = await db.query(
      'INSERT INTO items (user_id, category, image_url, cloudinary_public_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, category, imageUrl, cloudinaryPublicId]
    );

    res.status(201).json({
      id: result.rows[0].id,
      user_id: userId,
      category,
      image_url: imageUrl,
      cloudinary_public_id: cloudinaryPublicId
    });
  } catch (err) {
    console.error("Upload Error:", err);
    if (err.http_code === 401) {
      return res.status(401).json({ message: 'Authentication with Cloudinary failed. Please check your API credentials.' });
    }
    res.status(500).json({ message: 'Server error during file upload', error: err.message });
  }
};

/**
 * Mengambil semua item milik pengguna yang sedang login.
 */
export const getUserItems = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get User Items Error:", err);
    res.status(500).json({ message: 'Server error fetching items' });
  }
};

/**
 * Menghapus sebuah item milik pengguna dari database dan Cloudinary.
 */
export const deleteItem = async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await db.query(
      'SELECT user_id, cloudinary_public_id FROM items WHERE id = $1',
      [itemId]
    );

    if (result.rows.length === 0 || result.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this item' });
    }

    const item = result.rows[0];

    if (item.cloudinary_public_id) {
      await cloudinary.uploader.destroy(item.cloudinary_public_id);
    }

    await db.query('DELETE FROM items WHERE id = $1', [itemId]);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error("Delete Item Error:", err);
    res.status(500).json({ message: 'Server error during item deletion', error: err.message });
  }
};
