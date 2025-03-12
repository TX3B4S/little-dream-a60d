export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Manejo de solicitudes GET (para navegador) y POST (para Colab)
    if (request.method === "GET") {
      return new Response(
        "Cloudflare Worker is running. Use a POST request to generate an image.",
        { status: 200 }
      );
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const body = await request.json();
      
      // Parámetros con valores por defecto si no se envían desde la petición
      const inputs = {
        prompt: body.prompt || "A highly detailed, realistic watercolor painting of an epic landscape",
        negative_prompt: body.negative_prompt || "",
        height: body.height ? Math.min(2048, Math.max(256, body.height)) : 2048,
        width: body.width ? Math.min(2048, Math.max(256, body.width)) : 2048,
        num_steps: body.num_steps || 20,
        guidance: body.guidance || 7.5,
        seed: body.seed || Math.floor(Math.random() * 1000000),
      };

      // Llamar a la API de Cloudflare Workers AI
      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        inputs
      );

      return new Response(response, {
        headers: {
          "Content-Type": "image/png",
          "Access-Control-Allow-Origin": "*", // Permite acceso desde cualquier origen (Google Colab)
        },
      });
    } catch (error) {
      return new Response(`Error en generación: ${error.message}`, {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
