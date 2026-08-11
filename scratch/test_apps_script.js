async function testFetch() {
  const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbyJuIfElPCsZ-2K58rS72-UDDJ9uiAU8HmG7dZw2VLrsoFrjP5csBp5-JGjz3yXTdva/exec';
  try {
    const res = await fetch(appsScriptUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      redirect: 'follow'
    });
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get('content-type'));
    const text = await res.text();
    console.log("Body snippet:", text.slice(0, 300));
  } catch (err) {
    console.error("Error:", err);
  }
}

testFetch();
