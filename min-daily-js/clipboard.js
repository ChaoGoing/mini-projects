async function writeClipImg() {
  try {
    const imgURL = "/myimage.png";
    const data = await fetch(imgURL);
    const blob = await data.blob();

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
    console.log("Fetched image copied.");
  } catch (err) {
    console.error(err.name, err.message);
  }
}
