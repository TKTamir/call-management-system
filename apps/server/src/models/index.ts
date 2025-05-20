import { sequelize } from "@config/database";

// TODO: Import models here when created
// import User from './user';
// import Tag from './tag';
// import Call from './call';
// import Task from './task';

// //TODO: Set up associations between models here when created
const initializeModels = (): void => {
  // User.hasMany(Call);
  // Call.belongsTo(User);
};

const syncDatabase = async (force = false): Promise<void> => {
  try {
    //TODO: Call initializeModels
    // initializeModels();
    await sequelize.sync({ force });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Error syncing database:", error);
    throw error;
  }
};

export {
  sequelize,
  initializeModels,
  syncDatabase,
  // TODO: Export models here when created
  // User,
  // Tag,
  // Call,
  // Task
};
