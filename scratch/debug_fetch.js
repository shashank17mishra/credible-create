async function debugAppsScript() {
  const url = 'https://script.google.com/macros/s/AKfycbyJuIfElPCsZ-2K58rS72-UDDJ9uiAU8HmG7dZw2VLrsoFrjP5csBp5-JGjz3yXTdva/exec';
  
  console.log("--- TEST 1: GET REQUEST ---");
  try {
    const resGet = await fetch(url, { redirect: 'follow' });
    console.log("GET Status:", resGet.status);
    console.log("GET Content-Type:", resGet.headers.get('content-type'));
    const textGet = await resGet.text();
    console.log("GET Body length:", textGet.length);
    console.log("GET Body snippet:", textGet.slice(0, 300));
  } catch (e) {
    console.error("GET Error:", e);
  }

  console.log("\n--- TEST 2: POST WITH { action: 'read' } ---");
  try {
    const resPostRead = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'read' }),
      redirect: 'follow'
    });
    console.log("POST Read Status:", resPostRead.status);
    console.log("POST Read Content-Type:", resPostRead.headers.get('content-type'));
    const textPostRead = await resPostRead.text();
    console.log("POST Read Body:", textPostRead);
  } catch (e) {
    console.error("POST Read Error:", e);
  }

  console.log("\n--- TEST 3: POST WITHOUT BODY ---");
  try {
    const resPostEmpty = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({}),
      redirect: 'follow'
    });
    console.log("POST Empty Status:", resPostEmpty.status);
    console.log("POST Empty Content-Type:", resPostEmpty.headers.get('content-type'));
    const textPostEmpty = await resPostEmpty.text();
    console.log("POST Empty Body:", textPostEmpty);
  } catch (e) {
    console.error("POST Empty Error:", e);
  }
}

debugAppsScript();
