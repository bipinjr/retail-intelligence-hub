const url = "https://hsysxxfudqbrmbkehoil.supabase.co/rest/v1/";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzeXN4eGZ1ZHFicm1ia2Vob2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzOTA2NzUsImV4cCI6MjA5MTk2NjY3NX0.escXoKXI5g1aIY1Ict4hnSIhfISHnUJsP09mlMp8Yo0";

async function test() {
  const res = await fetch(url + "rpc/what_tables_exist_or_anything", {
    method: "POST",
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    }
  });
  // Or actually, there's no way to list tables natively over REST without a specific function.
  // Wait, I can try fetching from "Reviews" (capitalized).
  const tablesToTry = ["Reviews", "table_reviews", "review"];
  for (const t of tablesToTry) {
    const res = await fetch(url + t + "?limit=1", {
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`
      }
    });
    console.log(t, res.status);
  }
}
test();
