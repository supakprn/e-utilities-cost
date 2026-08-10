require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./config/db');
const User = require('./models/user.model');
const ExpenseCategory = require('./models/expenseCategory.model');
const BudgetCategory = require('./models/budgetCategory.model');

const expenseCategories = [
  { name: 'ค่าไฟฟ้า', code: 'ELEC', unit: 'บาท' },
  { name: 'ค่าพลังงาน', code: 'ENERGY', unit: 'บาท' },
  { name: 'ค่าน้ำประปา', code: 'WATER', unit: 'บาท' },
  { name: 'ค่าอินเตอร์เน็ต', code: 'INTERNET', unit: 'บาท' },
  { name: 'ค่าโทรศัพท์', code: 'PHONE', unit: 'บาท' },
  { name: 'ค่าไปรษณีย์', code: 'POST', unit: 'บาท' },
  { name: 'ค่าทิ้งขยะ', code: 'WASTE', unit: 'บาท' },
];

const budgetCategories = [
  { name: 'งบประมาณ (ปวช.)', code: 'BUDGET_PVC' },
  { name: 'งบประมาณ (ปวส.)', code: 'BUDGET_PVS' },
  { name: 'เงินรายได้สถานศึกษา', code: 'BUDGET_INCOME' },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    for (const cat of expenseCategories) {
      await ExpenseCategory.findOrCreate({ where: { code: cat.code }, defaults: cat });
    }
    for (const cat of budgetCategories) {
      await BudgetCategory.findOrCreate({ where: { code: cat.code }, defaults: cat });
    }

    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashed = await bcrypt.hash('admin1234', 10);
      await User.create({
        username: 'admin',
        password: hashed,
        full_name: 'ผู้ดูแลระบบ',
        role: 'admin',
      });
      console.log('สร้างผู้ใช้ admin เริ่มต้นแล้ว (username: admin, password: admin1234) — กรุณาเปลี่ยนรหัสผ่านทันทีหลัง deploy จริง');
    }

    console.log('Seed ข้อมูลเสร็จสมบูรณ์');
    process.exit(0);
  } catch (err) {
    console.error('Seed ผิดพลาด:', err);
    process.exit(1);
  }
}

seed();
