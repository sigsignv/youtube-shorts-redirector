type RedirectOptions = {
  phase: string;
};

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  main(ctx) {
    /**
     * Redirect on initial page load
     */
    redirectIfOnShorts({ phase: "document_start" });

    /**
     * Redirect on YouTube internal navigation
     */
    ctx.addEventListener(document, "yt-navigate-start", () =>
      redirectIfOnShorts({ phase: "yt-navigate-start" }),
    );

    /**
     * Redirect on Shorts ID is ready
     */
    ctx.addEventListener(document, "yt-page-data-updated", () =>
      redirectIfOnShorts({ phase: "yt-page-data-updated" }),
    );
  },
});

function extractShortsId() {
  const segments = location.pathname.split("/");
  if (segments.length !== 3 || segments[1] !== "shorts") {
    return "";
  }
  return segments[2];
}

function redirectIfOnShorts({ phase }: RedirectOptions) {
  const shortsId = extractShortsId();
  if (shortsId !== "") {
    console.debug(`Redirect triggered at ${phase}`);
    location.replace(`/watch?v=${shortsId}`);
  }
}
