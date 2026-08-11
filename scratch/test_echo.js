async function test() {
  const url = 'https://script.google.com/macros/s/AKfycbyJuIfElPCsZ-2K58rS72-UDDJ9uiAU8HmG7dZw2VLrsoFrjP5csBp5-JGjz3yXTdva/exec';
  const r1 = await fetch(url, { redirect: 'follow' });
  const html = await r1.text();
  console.log("HTML length:", html.length);
  console.log("HTML snippet:", html.slice(0, 1500));
  console.log("Matched echo URL:", match ? match[0] : "NONE");
  if (match) {
    const echoUrl = match[0].replace(/&amp;/g, '&');
    const r2 = await fetch(echoUrl);
    console.log("Echo status:", r2.status);
    const data = await r2.text();
    console.log("Echo response:", data);
  }
}

test().catch(console.error);
