export async function GET() {
  return new Response(JSON.stringify({ version: "0.2.0" }));
}
