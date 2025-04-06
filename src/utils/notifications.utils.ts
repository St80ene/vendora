export const sendEmailNotification = (user, subject, message) => {
  try {
    // Example of sending an email or in-app notification
    // await sendEmail(user.email, subject, message); // Replace with your actual notification service

    // Optional: You can also log this notification for auditing purposes
    console.log(`Notification sent to ${user.email}: ${subject} - ${message}`);
  } catch (error) {
    console.error('Notification Error:', error.message);
  }
};
