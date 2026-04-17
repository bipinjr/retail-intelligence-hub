const url = "https://hsysxxfudqbrmbkehoil.supabase.co/rest/v1/profiles?limit=1";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzeXN4eGZ1ZHFicm1ia2Vob2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzOTA2NzUsImV4cCI6MjA5MTk2NjY3NX0.escXoKXI5g1aIY1Ict4hnSIhfISHnUJsP09mlMp8Yo0";

async function test() {
  const res = await fetch(url, { headers: { "apikey": key, "Authorization": `Bearer ${key}` }});
  const text = await res.text();
  console.log(res.status, text);
}
test();
