// Access_token.mjs

async function getAccessToken() {
  const response = await fetch('https://oauth.fatsecret.com/connect/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: '6513eeca31d64bd1a6e281ea37589132',
      client_secret: 'af1b1f5c2cf845ecae923f49cbb4b190'
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Access Token:', data.access_token);
  return data.access_token;
}

getAccessToken().catch(console.error);
