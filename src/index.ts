export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      const requestBody = await request.json();

      // Parámetros personalizados desde Google Colab
      const inputs = {
        prompt: requestBody.prompt || "A highly detailed, ultra-HD depiction of Emmanuel, symbolizing 'God with us', in a serene and peaceful atmosphere. -Without text -epic style -realistic watercolor painting",
        steps: requestBody.steps || 150, // Máximo de pasos
        width: 2048,
        height: 2048,
        cfg_scale: requestBody.cfg_scale || 12, // Aumenta la precisión de la imagen
        sampler: requestBody.sampler || "DPM++ 2M Karras", // Mejor sampler para calidad
        seed: requestBody.seed || Math.floor(Math.random() * 1000000), // Permite reproducibilidad
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
    } else {
      return new Response("Use POST method with JSON parameters.", {
        status: 405,
        headers: { "content-type": "text/plain" },
      });
    }
  },
} satisfies ExportedHandler<Env>;
