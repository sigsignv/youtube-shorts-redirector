export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  main(ctx) {
    /**
     * Redirect on initial page load
     */
    redirectIfShorts();

    /**
     * Redirect on YouTube internal navigation
     */
    ctx.addEventListener(document, "yt-navigate-start", redirectIfShorts);

    /**
     * Redirect on Shorts ID is ready
     */
    ctx.addEventListener(document, "yt-page-data-updated", redirectIfShorts);
  },
});

function getShortsId(pathname: string) {
  const segments = pathname.split("/");
  if (segments.length !== 3 || segments[1] !== "shorts") {
    return "";
  }
  return segments[2];
}

function redirectIfShorts() {
  const shortsId = getShortsId(window.location.pathname);
  if (shortsId !== "") {
    window.location.replace(`https://www.youtube.com/watch?v=${shortsId}`);
  }
}
