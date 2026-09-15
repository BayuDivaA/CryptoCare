async function uploadToPinata(file, jwt) {
  const payload = new FormData();
  payload.append("file", file, file.name || "upload");

  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: payload,
    });
    const data = await response.json();

    if (response.ok && data?.IpfsHash) {
      return data.IpfsHash;
    }
  } catch (_err) {
    // Fall through to the newer uploads endpoint below.
  }

  const fallbackPayload = new FormData();
  fallbackPayload.append("file", file, file.name || "upload");
  const fallbackResponse = await fetch("https://uploads.pinata.cloud/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: fallbackPayload,
  });

  const fallbackData = await fallbackResponse.json();
  if (fallbackResponse.ok && (fallbackData?.data?.cid || fallbackData?.cid)) {
    return fallbackData?.data?.cid || fallbackData?.cid;
  }

  throw new Error(fallbackData?.error?.reason || fallbackData?.error || "Upload to Pinata failed.");
}

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const jwt = Netlify.env.get("PINATA_JWT");
  if (!jwt) {
    return Response.json(
      { error: "Pinata is not configured. Set PINATA_JWT in the site's environment variables." },
      { status: 500 }
    );
  }

  let file;
  try {
    const incoming = await req.formData();
    file = incoming.get("file");
  } catch (_err) {
    return Response.json({ error: "Expected multipart/form-data with a 'file' field." }, { status: 400 });
  }

  if (!file || typeof file === "string") {
    return Response.json({ error: "No file provided." }, { status: 400 });
  }

  try {
    const cid = await uploadToPinata(file, jwt);
    return Response.json({ cid });
  } catch (error) {
    return Response.json({ error: error?.message || "Upload to Pinata failed." }, { status: 502 });
  }
};

export const config = {
  path: "/api/pinata-upload",
};
