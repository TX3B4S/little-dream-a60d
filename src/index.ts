export default {
  async fetch(request, env) {
    let prompt;
    let model;
    let num_steps = 20; // Valor por defecto
    let height = 2048; // Valor por defecto
    let width = 2048; // Valor por defecto

    if (request.method === "POST") {
      try {
        const body = await request.json();
        prompt = body.prompt;
        model = body.model || "@cf/stabilityai/stable-diffusion-xl-base-1.0"; // Modelo por defecto

        // Verificar si los valores existen en la solicitud y asignarlos
        if (body.num_steps) num_steps = Math.min(body.num_steps, 20);
        if (body.height) height = Math.min(Math.max(body.height, 256), 2048);
        if (body.width) width = Math.min(Math.max(body.width, 256), 2048);
      } catch (e) {
        return new Response("Invalid JSON body", { status: 400 });
      }
    } else {
      const url = new URL(request.url);
      prompt = url.searchParams.get("prompt");
      model = url.searchParams.get("model") || "@cf/stabilityai/stable-diffusion-xl-base-1.0";

      // Parámetros opcionales en la URL
      num_steps = Math.min(parseInt(url.searchParams.get("num_steps")) || 20, 20);
      height = Math.min(Math.max(parseInt(url.searchParams.get("height")) || 2048, 256), 2048);
      width = Math.min(Math.max(parseInt(url.searchParams.get("width")) || 2048, 256), 2048);
    }

    if (!prompt) {
      return new Response("Missing 'prompt' parameter", { status: 400 });
    }

    const inputs = { prompt, num_steps, height, width };

    try {
      const response = await env.AI.run(model, inputs);

      return new Response(response, {
        headers: {
          "content-type": "image/png",
        },
      });
    } catch (error) {
      return new Response(`Error generating image: ${error.message}`, {
        status: 500,
      });
    }
  },
};
