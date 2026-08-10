const { Op } = require('sequelize');
const Expense = require('../models/expense.model');
const ExpenseCategory = require('../models/expenseCategory.model');
const BudgetCategory = require('../models/budgetCategory.model');

const includeRefs = [
  { model: ExpenseCategory, as: 'expenseCategory' },
  { model: BudgetCategory, as: 'budgetCategory' },
];

exports.list = async (req, res, next) => {
  try {
    const { month, year, expense_category_id, budget_category_id, page = 1, limit = 20 } = req.query;
    const where = {};

    if (year) {
      const start = `${year}-01-01`;
      const end = `${year}-12-31`;
      where.billing_month = { [Op.between]: [start, end] };
      if (month) {
        const mm = String(month).padStart(2, '0');
        where.billing_month = { [Op.between]: [`${year}-${mm}-01`, `${year}-${mm}-31`] };
      }
    }
    if (expense_category_id) where.expense_category_id = expense_category_id;
    if (budget_category_id) where.budget_category_id = budget_category_id;

    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await Expense.findAndCountAll({
      where,
      include: includeRefs,
      order: [['billing_month', 'DESC']],
      limit: Number(limit),
      offset,
    });

    res.json({ data: rows, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Expense.findByPk(req.params.id, { include: includeRefs });
    if (!item) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const body = { ...req.body, created_by: req.user.id };
    if (!body.expense_category_id || !body.budget_category_id || !body.amount || !body.billing_month) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' });
    }
    const item = await Expense.create(body);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Expense.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Expense.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    await item.destroy();
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) { next(err); }
};
