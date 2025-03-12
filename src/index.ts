export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Only POST requests allowed", { status: 405 });
    }

    try {
      const body = await request.json();

      const inputs = {
        prompt: body.prompt || "A highly detailed, realistic watercolor painting of an epic landscape",
        negative_prompt: body.negative_prompt || "",
        height: body.height || 2048,
        width: body.width || 2048,
        num_steps: body.num_steps || 20,
        guidance: body.guidance || 7.5,
        seed: body.seed || Math.floor(Math.random() * 1000000),
      };

      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        inputs
      );

      return new Response(response, {
        headers: {
          "Content-Type": "image/png",
        },
      });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};
