const app = require('./app');
const sequelize = require('./config/db');

// Ensure model associations are registered
require('./models/expense.model');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');

    await sequelize.sync(); // ใช้ migrations แทนใน production จริง

    app.listen(PORT, () => {
      console.log(`Backend server กำลังทำงานที่ port ${PORT}`);
    });
  } catch (err) {
    console.error('ไม่สามารถเชื่อมต่อฐานข้อมูลได้:', err.message);
    process.exit(1);
  }
}

start();
