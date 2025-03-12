export default {
  async fetch(request, env) {
    let prompt;
    let model = "@cf/stabilityai/stable-diffusion-xl-base-1.0"; // Modelo por defecto
    let num_steps = 20;
    let height = 2048;
    let width = 2048;
    let negative_prompt = ""; // Prompt negativo por defecto
    let guidance = 7.5; // Valor por defecto
    let seed = null; // Seed opcional

    if (request.method === "POST") {
      try {
        const body = await request.json();
        prompt = body.prompt;
        model = body.model || model;

        // Validaciones de valores numéricos dentro de sus límites
        if (typeof body.num_steps === "number") {
          num_steps = Math.min(Math.max(body.num_steps, 1), 20);
        }
        if (typeof body.height === "number") {
          height = Math.min(Math.max(body.height, 256), 2048);
        }
        if (typeof body.width === "number") {
          width = Math.min(Math.max(body.width, 256), 2048);
        }
        if (typeof body.guidance === "number") {
          guidance = Math.min(Math.max(body.guidance, 0), 20);
        }
        if (typeof body.seed === "number") {
          seed = body.seed;
        }

        // Prompt negativo si se proporciona
        if (typeof body.negative_prompt === "string") {
          negative_prompt = body.negative_prompt;
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

      const urlGuidance = parseFloat(url.searchParams.get("guidance"));
      if (!isNaN(urlGuidance)) {
        guidance = Math.min(Math.max(urlGuidance, 0), 20);
      }

      const urlSeed = parseInt(url.searchParams.get("seed"));
      if (!isNaN(urlSeed)) {
        seed = urlSeed;
      }

      const urlNegativePrompt = url.searchParams.get("negative_prompt");
      if (urlNegativePrompt) {
        negative_prompt = urlNegativePrompt;
      }
    }

    if (!prompt) {
      return new Response("Missing 'prompt' parameter", { status: 400 });
    }

    // Construcción de la solicitud a Stability AI
    const inputs = {
      prompt,
      negative_prompt,
      num_steps,
      height,
      width,
      guidance,
    };

    // Solo agregar 'seed' si fue especificado
    if (seed !== null) {
      inputs.seed = seed;
    }

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
