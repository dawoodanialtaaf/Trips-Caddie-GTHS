
// services/emailService.ts

const API_URL = "https://golfthehighsierra.com/trips-caddie/api/api-send-email.php";

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to,
        subject,
        html
      })
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      console.error("Email server error:", result);
      return false;
    }

    return true;

  } catch (err) {
    console.error("sendEmail network failure:", err);
    return false;
  }
}
