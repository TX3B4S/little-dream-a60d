export default {
  async fetch(request, env) {
    const inputs = {
      prompt: "A depiction of Emmanuel, the sacred name of the Messiah, symbolizing 'God with us', with a serene and peaceful atmosphere, highlighting the significance of God's presence among humanity. -Without text -epic style -realistic acuarela painting style",
    };

    const response = await env.AI.run(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      inputs,
    );

    return new Response(response, {
      headers: {
        "content-type": "image/png",
      },
    });
  },
} satisfies ExportedHandler<Env>;
