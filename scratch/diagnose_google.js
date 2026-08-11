async function diagnoseGoogleAppsScript() {
  const url = 'https://script.google.com/macros/s/AKfycbyJuIfElPCsZ-2K58rS72-UDDJ9uiAU8HmG7dZw2VLrsoFrjP5csBp5-JGjz3yXTdva/exec';
  
  console.log("=== DIAGNOSTIC 1: GET WITH REDIRECT FOLLOW ===");
  try {
    const res1 = await fetch(url, { redirect: 'follow' });
    console.log("Res1 Status:", res1.status);
    console.log("Res1 Redirected:", res1.redirected);
    console.log("Res1 Final URL:", res1.url);
    console.log("Res1 Content-Type:", res1.headers.get('content-type'));
    const text1 = await res1.text();
    console.log("Res1 Snippet (first 400 chars):", text1.slice(0, 400));
  } catch (e) {
    console.error("Res1 Error:", e.message);
  }

  console.log("\n=== DIAGNOSTIC 2: GET WITH REDIRECT MANUAL ===");
  try {
    const res2 = await fetch(url, { redirect: 'manual' });
    console.log("Res2 Status:", res2.status);
    console.log("Res2 Location Header:", res2.headers.get('location'));
    if (res2.headers.get('location')) {
      const loc = res2.headers.get('location');
      console.log("Following Location Header manually to:", loc);
      const res2_loc = await fetch(loc);
      console.log("Res2 Location Status:", res2_loc.status);
      console.log("Res2 Location Content-Type:", res2_loc.headers.get('content-type'));
      const text2 = await res2_loc.text();
      console.log("Res2 Location Snippet:", text2.slice(0, 400));
    }
  } catch (e) {
    console.error("Res2 Error:", e.message);
  }

  console.log("\n=== DIAGNOSTIC 3: POST REQUEST TEST ===");
  try {
    const res3 = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ name: "Diagnostic Test", email: "test@example.com" }),
      redirect: 'follow'
    });
    console.log("Res3 Status:", res3.status);
    console.log("Res3 Content-Type:", res3.headers.get('content-type'));
    const text3 = await res3.text();
    console.log("Res3 Snippet:", text3.slice(0, 400));
  } catch (e) {
    console.error("Res3 Error:", e.message);
  }
}

diagnoseGoogleAppsScript();
