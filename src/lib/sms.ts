export const sendSMS = async (to: string, message: string) => {
  // In a real app, you would use Twilio or Termii here.
  // For this project, we'll log it to the console as a "Mock SMS".
  
  console.log('--- MOCK SMS SENT ---');
  console.log(`TO: ${to}`);
  console.log(`MESSAGE: ${message}`);
  console.log('---------------------');
  
  return { success: true, messageId: 'mock_' + Math.random().toString(36).substr(2, 9) };
};

export const sendOrderStatusSMS = async (to: string, orderId: string, status: string) => {
  const shortId = orderId.slice(-6).toUpperCase();
  const statusMessages: Record<string, string> = {
    'PENDING': `FeastOS: We've received your order #${shortId}! It's in the queue.`,
    'PREPARING': `FeastOS: Your order #${shortId} is now being prepared by our chefs! 🍳`,
    'READY': `FeastOS: Your order #${shortId} is ready for delivery/pickup! ✅`,
    'COMPLETED': `FeastOS: Your order #${shortId} has been delivered. Enjoy your meal! 🍴`,
  };

  const message = statusMessages[status] || `FeastOS: Your order #${shortId} status has been updated to ${status}.`;
  return sendSMS(to, message);
};
