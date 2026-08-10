const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.summary = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const rows = await sequelize.query(
      `SELECT MONTH(billing_month) AS month, SUM(amount) AS total
       FROM expenses
       WHERE YEAR(billing_month) = :year
       GROUP BY MONTH(billing_month)
       ORDER BY month ASC`,
      { replacements: { year }, type: QueryTypes.SELECT }
    );

    const months = Array.from({ length: 12 }, (_, i) => {
      const found = rows.find((r) => Number(r.month) === i + 1);
      return { month: i + 1, total: found ? Number(found.total) : 0 };
    });

    const yearTotal = months.reduce((sum, m) => sum + m.total, 0);
    res.json({ year: Number(year), months, yearTotal });
  } catch (err) { next(err); }
};

exports.byCategory = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const rows = await sequelize.query(
      `SELECT ec.id, ec.name, ec.code, SUM(e.amount) AS total
       FROM expenses e
       JOIN expense_categories ec ON ec.id = e.expense_category_id
       WHERE YEAR(e.billing_month) = :year
       GROUP BY ec.id, ec.name, ec.code
       ORDER BY total DESC`,
      { replacements: { year }, type: QueryTypes.SELECT }
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.byBudget = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const rows = await sequelize.query(
      `SELECT bc.id, bc.name, bc.code, SUM(e.amount) AS total
       FROM expenses e
       JOIN budget_categories bc ON bc.id = e.budget_category_id
       WHERE YEAR(e.billing_month) = :year
       GROUP BY bc.id, bc.name, bc.code
       ORDER BY total DESC`,
      { replacements: { year }, type: QueryTypes.SELECT }
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.compare = async (req, res, next) => {
  try {
    const { year1, year2 } = req.query;
    if (!year1 || !year2) return res.status(400).json({ message: 'กรุณาระบุ year1 และ year2' });

    const rows = await sequelize.query(
      `SELECT YEAR(billing_month) AS year, MONTH(billing_month) AS month, SUM(amount) AS total
       FROM expenses
       WHERE YEAR(billing_month) IN (:year1, :year2)
       GROUP BY YEAR(billing_month), MONTH(billing_month)
       ORDER BY year ASC, month ASC`,
      { replacements: { year1, year2 }, type: QueryTypes.SELECT }
    );

    const build = (yr) => Array.from({ length: 12 }, (_, i) => {
      const found = rows.find((r) => Number(r.year) === Number(yr) && Number(r.month) === i + 1);
      return { month: i + 1, total: found ? Number(found.total) : 0 };
    });

    res.json({ year1: build(year1), year2: build(year2) });
  } catch (err) { next(err); }
};
