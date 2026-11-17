import Repair from '../models/Repair.js';

export const generateRepairId = async () => {
  try {
    const latestRepair = await Repair.findOne({}, { repairId: 1 })
      .sort({ createdAt: -1 })
      .lean();

    if (!latestRepair || !latestRepair.repairId) {
      return 'REP-1001';
    }

    const matches = latestRepair.repairId.match(/\d+/);
    if (!matches) {
      return 'REP-1001';
    }

    const nextNumber = parseInt(matches[0], 10) + 1;
    return `REP-${nextNumber}`;
  } catch (err) {
    return `REP-${Date.now().toString().slice(-4)}`;
  }
};
