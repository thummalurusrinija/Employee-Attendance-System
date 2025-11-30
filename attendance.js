const express = require('express');
const router = express.Router();
const pool = require('../db');

// TEMP: use your test employee's id from users table
const fakeUserId = 4; // change if needed

// POST /api/attendance/checkin
router.post('/checkin', async (req, res) => {
  try {
    const userId = fakeUserId;

    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

    // Check if already checked in today
    const existing = await pool.query(
      'SELECT id FROM attendance WHERE user_id = $1 AND date = $2',
      [userId, today]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const now = new Date();

    // Simple late logic: after 9:15 AM = late
    const isLate =
      now.getHours() > 9 ||
      (now.getHours() === 9 && now.getMinutes() > 15);
    const status = isLate ? 'late' : 'present';

    const result = await pool.query(
      'INSERT INTO attendance (user_id, date, check_in_time, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, today, now, status]
    );

    return res.status(201).json({ attendance: result.rows[0] });
  } catch (err) {
    console.error('Checkin error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/attendance/checkout
router.post('/checkout', async (req, res) => {
  try {
    const userId = fakeUserId;

    const today = new Date().toISOString().slice(0, 10);

    // Find today's attendance record for this user
    const existing = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 AND date = $2',
      [userId, today]
    );

    if (existing.rows.length === 0) {
      return res.status(400).json({ message: 'No check-in found for today' });
    }

    const record = existing.rows[0];

    if (record.check_out_time) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    const now = new Date();
    const checkInTime = new Date(record.check_in_time);

    // ms difference → hours
    const diffMs = now - checkInTime;
    const totalHours = diffMs / (1000 * 60 * 60); // e.g. 7.5

    const updated = await pool.query(
      'UPDATE attendance SET check_out_time = $1, total_hours = $2 WHERE id = $3 RETURNING *',
      [now, totalHours, record.id]
    );

    return res.json({ attendance: updated.rows[0] });
  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
