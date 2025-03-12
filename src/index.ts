export default {
  async fetch(request, env) {
    let prompt;
    let model = "@cf/stabilityai/stable-diffusion-xl-base-1.0"; // Modelo por defecto
    let num_steps = 20;
    let height = 2048;
    let width = 2048;

    if (request.method === "POST") {
      try {
        const body = await request.json();
        prompt = body.prompt;
        model = body.model || model;
        
        // Asegurar que los valores sean números y dentro de los límites permitidos
        if (typeof body.num_steps === "number") {
          num_steps = Math.min(Math.max(body.num_steps, 1), 20);
        }
        if (typeof body.height === "number") {
          height = Math.min(Math.max(body.height, 256), 2048);
        }
        if (typeof body.width === "number") {
          width = Math.min(Math.max(body.width, 256), 2048);
        }
      } catch (e) {
        return new Response("Invalid JSON body", { status: 400 });
      }
    } else {
      const url = new URL(request.url);
      prompt = url.searchParams.get("prompt");
      model = url.searchParams.get("model") || model;

      // Convertir y validar parámetros de la URL
      const urlNumSteps = parseInt(url.searchParams.get("num_steps"));
      if (!isNaN(urlNumSteps)) {
        num_steps = Math.min(Math.max(urlNumSteps, 1), 20);
      }

      const urlHeight = parseInt(url.searchParams.get("height"));
      if (!isNaN(urlHeight)) {
        height = Math.min(Math.max(urlHeight, 256), 2048);
      }

      const urlWidth = parseInt(url.searchParams.get("width"));
      if (!isNaN(urlWidth)) {
        width = Math.min(Math.max(urlWidth, 256), 2048);
      }
    }

    if (!prompt) {
      return new Response("Missing 'prompt' parameter", { status: 400 });
    }

    // Construcción de la solicitud a Stability AI
    const inputs = {
      prompt,
      num_steps,
      height,
      width,
    };

    try {
      const response = await env.AI.run(model, inputs);
      
      return new Response(response, {
        headers: { "content-type": "image/png" },
      });
    } catch (error) {
      return new Response(`Error generating image: ${error}`, { status: 500 });
    }
  },
};
