import Pusher from 'pusher'

const pusher = new Pusher({
  appId: "1776113",
  key: "1073497ad2587f2c6a61",
  secret: "a6d96dfeb65e6666a9ab",
  cluster: "us2"
})

export async function POST(request: Request) {
  const body = await request.json()
  
  try {
    await pusher.trigger("chat", "message", body)
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
}
