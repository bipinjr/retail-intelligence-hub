const url = "https://hsysxxfudqbrmbkehoil.supabase.co/rest/v1/reviews";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzeXN4eGZ1ZHFicm1ia2Vob2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzOTA2NzUsImV4cCI6MjA5MTk2NjY3NX0.escXoKXI5g1aIY1Ict4hnSIhfISHnUJsP09mlMp8Yo0";

async function test() {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({
      product_id: "test",
      product_name: "test",
      reviewer_name: "test",
      review_text: "test",
      rating: 5,
      city: "test",
      sentiment: "pending",
      label_tags: [],
      latitude: null,
      longitude: null,
      source: "Sellezy Native Portal"
    })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}
test();
