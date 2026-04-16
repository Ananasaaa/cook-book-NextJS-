export async function compressDataUrlToJpegDataUrl(
  dataUrl: string,
  maxSide = 260,
  quality = 0.68,
): Promise<string | null> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }
  const trimmed = dataUrl.trim();
  if (!/^data:/i.test(trimmed)) {
    return null;
  }
  const normalizedSrc = trimmed.replace(/^data:/i, "data:");
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      let w = img.naturalWidth || img.width;
      let h = img.naturalHeight || img.height;
      if (w < 1 || h < 1) {
        resolve(null);
        return;
      }
      if (w > maxSide || h > maxSide) {
        const ratio = Math.min(maxSide / w, maxSide / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = normalizedSrc;
  });
}

export async function buildStoredRecipeCoverDataUrl(file: File): Promise<string> {
  let raw = await compressBlobToJpegDataUrl(file, 420, 0.78);

  if (!raw) {
    const direct = await blobToDataUrlViaReader(file);
    if (direct && direct.length > 32) {
      raw =
        (await compressDataUrlToJpegDataUrl(direct, 420, 0.78)) ?? direct;
    }
  }

  if (!raw || raw.length <= 32) {
    return "/add-photo.png";
  }

  if (raw.length > 380_000) {
    const smaller = await compressDataUrlToJpegDataUrl(raw, 360, 0.75);
    if (smaller) {
      raw = smaller;
    }
  }
  if (raw.length > 520_000) {
    const smaller = await compressDataUrlToJpegDataUrl(raw, 300, 0.72);
    if (smaller) {
      raw = smaller;
    }
  }
  if (raw.length > 650_000) {
    const smaller = await compressDataUrlToJpegDataUrl(raw, 240, 0.68);
    if (smaller) {
      raw = smaller;
    }
  }

  return /^data:/i.test(raw) ? raw.replace(/^data:/i, "data:") : "/add-photo.png";
}

export async function blobToDataUrlViaReader(blob: Blob): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      resolve(typeof r === "string" ? r : null);
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(blob);
  });
}

export async function compressBlobToJpegDataUrl(
  blob: Blob,
  maxSide = 560,
  quality = 0.78,
): Promise<string | null> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  if (typeof createImageBitmap !== "undefined") {
    try {
      const bmp = await createImageBitmap(blob);
      let w = bmp.width;
      let h = bmp.height;
      if (w < 1 || h < 1) {
        bmp.close();
        return null;
      }
      if (w > maxSide || h > maxSide) {
        const ratio = Math.min(maxSide / w, maxSide / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        bmp.close();
        return null;
      }
      ctx.drawImage(bmp, 0, 0, w, h);
      bmp.close();
      try {
        return canvas.toDataURL("image/jpeg", quality);
      } catch {
        return null;
      }
    } catch {
      // fall through to HTMLImageElement path
    }
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new window.Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;
      if (width < 1 || height < 1) {
        resolve(null);
        return;
      }
      if (width > maxSide || height > maxSide) {
        const ratio = Math.min(maxSide / width, maxSide / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };

    img.src = objectUrl;
  });
}
