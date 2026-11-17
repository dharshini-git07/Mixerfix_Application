import Message from '../models/Message.js';
import Repair from '../models/Repair.js';

// @desc    Get chat message thread for a repair
// @route   GET /api/chat/:repairId
// @access  Private
export const getMessagesByRepairId = async (req, res, next) => {
  try {
    const { repairId } = req.params;

    const messages = await Message.find({ repairId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a new chat message
// @route   POST /api/chat/:repairId
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { repairId } = req.params;
    const { content, text } = req.body;

    const messageText = content || text;
    if (!messageText || !messageText.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    // Optional find repair
    const repair = await Repair.findOne({ repairId: repairId.toUpperCase() });

    const newMessage = await Message.create({
      repair: repair ? repair._id : null,
      repairId: repairId.toUpperCase(),
      sender: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      content: messageText.trim(),
      timestamp: new Date(),
    });

    // Emit Socket.IO event to room
    const io = req.app.get('io');
    if (io) {
      io.to(repairId.toUpperCase()).emit('chat:message', newMessage);
      io.emit('chat:message', newMessage); // Also broad broadcast
    }

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    next(error);
  }
};
