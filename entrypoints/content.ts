export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  allFrames: false,
  runAt: "document_start",
  main(ctx) {
    const shortsID = getShortsID(window.location.pathname);
    if (shortsID !== "") {
      window.location.replace(`https://www.youtube.com/watch?v=${shortsID}`);
    }

    ctx.addEventListener(document, "yt-navigate-start", () => {
      const shortsID = getShortsID(window.location.pathname);
      if (shortsID !== "") {
        window.location.replace(`https://www.youtube.com/watch?v=${shortsID}`);
      }
    });
  },
});

function getShortsID(pathname: string): string {
  const segments = pathname.split("/");
  if (segments.length === 3 && segments[1] === "shorts") {
    return segments[2];
  }
  return "";
}
