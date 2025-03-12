export default {
  async fetch(request, env) {
    let prompt;
    let model;

    if (request.method === "POST") {
      try {
        const body = await request.json();
        prompt = body.prompt;
        model = body.model;
      } catch (e) {
        return new Response("Invalid JSON body", { status: 400 });
      }
    } else {
      const url = new URL(request.url);
      prompt = url.searchParams.get("prompt");
      model = url.searchParams.get("model");
    }

    if (!prompt) {
      return new Response("Missing 'prompt' parameter", { status: 400 });
    }

    if (!model) {
      model = "@cf/stabilityai/stable-diffusion-xl-base-1.0"; // Modelo por defecto
    }

    const inputs = { prompt };

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
