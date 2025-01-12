export default async function run(userMessage: string): Promise<any> {
  try {
    const userID = generateUserID(userMessage);

    const payload = {
      user_message: userMessage,
    };

    const response = await fetch(`https://alx-expert.tech/api/${userID}/supervaani`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json()
    return data.supervaani_message;

  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error for the caller to handle
  }
}

function generateUserID(userMessage: string): string {
  return `user_${userMessage.length}`;
}

