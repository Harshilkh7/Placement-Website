const testRegister = async () => {
  const uniqueEmail = `test${Date.now()}@example.com`;
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123',
        role: 'student'
      })
    });
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testRegister();
