async function testSheetCSV() {
  const sheetId = '1SGEXLizqoxGhxxH3RikWsrzDlhscITkFWk7TeuM8Phw';
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  console.log("Fetching CSV from:", csvUrl);
  try {
    const res = await fetch(csvUrl);
    console.log("CSV Status:", res.status);
    const text = await res.text();
    console.log("CSV Content:\n", text);
  } catch (err) {
    console.error("CSV Error:", err);
  }
}

testSheetCSV();
