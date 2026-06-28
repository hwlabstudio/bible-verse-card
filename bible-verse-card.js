const canvas = document.getElementById("cardCanvas");
const ctx = canvas.getContext("2d");
const drawButton = document.getElementById("drawButton");
const downloadButton = document.getElementById("downloadButton");
const message = document.getElementById("message");

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;
const CARD_TEXT_MAX_WIDTH = 780;

const FONT_STACK = '"Apple SD Gothic Neo", "Noto Serif KR", "Nanum Myeongjo", serif';

const PALETTES = [
  { name: "크림 피치", from: "#fff1df", to: "#ffd6c9", ink: "#4b332d" },
  { name: "라벤더 밀크", from: "#f3eaff", to: "#d9e7ff", ink: "#38324f" },
  { name: "민트 새벽", from: "#e8f8ef", to: "#d7eef8", ink: "#263f3d" },
  { name: "살구 하늘", from: "#ffe5d4", to: "#d7ecff", ink: "#44372f" },
  { name: "로즈 베이지", from: "#fae4e1", to: "#f6ead4", ink: "#463331" },
  { name: "버터 세이지", from: "#fff3c8", to: "#dcebd0", ink: "#3c3b24" },
  { name: "블루 그레이스", from: "#e3f0ff", to: "#e8e2ff", ink: "#2d354d" },
  { name: "코랄 린넨", from: "#ffe1d2", to: "#fff3e6", ink: "#4a352c" },
  { name: "연보라 복숭아", from: "#f1e2ff", to: "#ffdcd8", ink: "#453145" },
  { name: "초록 기도", from: "#eaf6dc", to: "#d4eee4", ink: "#2e402d" },
];

let currentVerse = null;
let isDrawing = false;
let loadingFrameId = null;
let loadingTimerId = null;

drawPlaceholderCard();

drawButton.addEventListener("click", () => {
  if (isDrawing) return;

  isDrawing = true;
  currentVerse = null;
  drawButton.disabled = true;
  downloadButton.disabled = true;
  setMessage("");

  const palette = randomItem(PALETTES);
  animateLoadingCard(palette);

  loadingTimerId = window.setTimeout(() => {
    stopLoadingAnimation();
    currentVerse = VERSES[Math.floor(Math.random() * VERSES.length)];
    drawVerseCard(currentVerse);
    isDrawing = false;
    drawButton.disabled = false;
    downloadButton.disabled = false;
  }, 1400);
});

downloadButton.addEventListener("click", () => {
  if (isDrawing) {
    setMessage("말씀카드를 고르고 있어요. 잠시만 기다려주세요.");
    return;
  }

  if (!currentVerse) {
    setMessage("먼저 말씀카드를 뽑아주세요.");
    return;
  }

  downloadCanvas(currentVerse.reference);
});

function drawPlaceholderCard() {
  const palette = PALETTES[0];
  paintBackground(palette);
  drawDecorations(palette);

  ctx.fillStyle = palette.ink;
  ctx.globalAlpha = 0.82;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  drawFittedLine("나에게 주시는", CARD_WIDTH / 2, CARD_HEIGHT / 2 - 72, CARD_TEXT_MAX_WIDTH, 76, 46, 700);
  drawFittedLine("새해 말씀", CARD_WIDTH / 2, CARD_HEIGHT / 2 + 12, CARD_TEXT_MAX_WIDTH, 76, 46, 700);

  ctx.globalAlpha = 0.64;
  drawFittedLine("버튼을 눌러 말씀을 받아보세요", CARD_WIDTH / 2, CARD_HEIGHT / 2 + 105, CARD_TEXT_MAX_WIDTH, 36, 26, 400);
  ctx.globalAlpha = 1;
}

function drawVerseCard(item) {
  const palette = randomItem(PALETTES);
  paintBackground(palette);
  drawDecorations(palette);
  drawVerseText(item, palette);
}

function animateLoadingCard(palette) {
  const startedAt = performance.now();

  function render(now) {
    const elapsed = now - startedAt;
    drawLoadingCard(palette, elapsed);
    loadingFrameId = requestAnimationFrame(render);
  }

  loadingFrameId = requestAnimationFrame(render);
}

function drawLoadingCard(palette, elapsed) {
  paintBackground(palette);
  drawDecorations(palette);

  const pulse = 0.5 + Math.sin(elapsed / 260) * 0.5;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = palette.ink;

  ctx.globalAlpha = 0.72 + pulse * 0.14;
  drawFittedLine("당신을 위한 카드를", CARD_WIDTH / 2, CARD_HEIGHT / 2 - 55, CARD_TEXT_MAX_WIDTH, 58, 38, 700);
  drawFittedLine("고르고 있습니다", CARD_WIDTH / 2, CARD_HEIGHT / 2 + 22, CARD_TEXT_MAX_WIDTH, 58, 38, 700);

  ctx.globalAlpha = 0.56;
  drawFittedLine("잠시 마음을 가다듬어 보세요", CARD_WIDTH / 2, CARD_HEIGHT / 2 + 122, CARD_TEXT_MAX_WIDTH, 32, 24, 400);

  drawLoadingDots(palette, elapsed);
  ctx.restore();
}

function drawLoadingDots(palette, elapsed) {
  const dotY = CARD_HEIGHT / 2 + 205;
  const dotGap = 42;
  const startX = CARD_WIDTH / 2 - dotGap;

  for (let index = 0; index < 3; index += 1) {
    const wave = Math.sin(elapsed / 210 + index * 0.85);
    const radius = 9 + Math.max(wave, 0) * 8;

    ctx.globalAlpha = 0.25 + Math.max(wave, 0) * 0.4;
    ctx.fillStyle = palette.ink;
    ctx.beginPath();
    ctx.arc(startX + index * dotGap, dotY, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function stopLoadingAnimation() {
  if (loadingFrameId) {
    cancelAnimationFrame(loadingFrameId);
    loadingFrameId = null;
  }

  if (loadingTimerId) {
    window.clearTimeout(loadingTimerId);
    loadingTimerId = null;
  }
}

function paintBackground(palette) {
  ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const gradient = ctx.createLinearGradient(120, 0, CARD_WIDTH - 80, CARD_HEIGHT);
  gradient.addColorStop(0, palette.from);
  gradient.addColorStop(1, palette.to);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const light = ctx.createRadialGradient(270, 230, 20, 270, 230, 560);
  light.addColorStop(0, "rgba(255, 255, 255, 0.62)");
  light.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
}

function drawDecorations(palette) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.beginPath();
  ctx.arc(930, 170, 170, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(120, 1130, 230, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = hexToRgba(palette.ink, 0.18);
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(CARD_WIDTH / 2, 165);
  ctx.lineTo(CARD_WIDTH / 2, 235);
  ctx.moveTo(CARD_WIDTH / 2 - 30, 197);
  ctx.lineTo(CARD_WIDTH / 2 + 30, 197);
  ctx.stroke();

  ctx.strokeStyle = hexToRgba(palette.ink, 0.13);
  ctx.lineWidth = 2;
  roundRect(ctx, 76, 76, CARD_WIDTH - 152, CARD_HEIGHT - 152, 34);
  ctx.stroke();

  ctx.restore();
}

function drawVerseText(item, palette) {
  const layout = getVerseLayout(item.verse, CARD_TEXT_MAX_WIDTH);
  const fontSize = layout.fontSize;
  const lineHeight = Math.round(fontSize * 1.55);

  ctx.fillStyle = palette.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${fontSize}px ${FONT_STACK}`;

  const lines = layout.lines;
  const totalTextHeight = lines.length * lineHeight;
  const startY = CARD_HEIGHT / 2 - totalTextHeight / 2 + lineHeight / 2 - 20;

  lines.forEach((line, index) => {
    ctx.fillText(line, CARD_WIDTH / 2, startY + index * lineHeight);
  });

  ctx.globalAlpha = 0.78;
  drawFittedLine(item.reference, CARD_WIDTH / 2, CARD_HEIGHT - 210, CARD_TEXT_MAX_WIDTH, 42, 28, 600);
  ctx.globalAlpha = 1;
}

function getVerseLayout(text, maxWidth) {
  let fontSize = getVerseFontSize(text);
  let lines = [];

  while (fontSize >= 42) {
    ctx.font = `700 ${fontSize}px ${FONT_STACK}`;
    lines = wrapText(text, maxWidth);

    if (lines.length * fontSize * 1.55 <= 720 && lines.every((line) => ctx.measureText(line).width <= maxWidth)) {
      return { fontSize, lines };
    }

    fontSize -= 2;
  }

  ctx.font = `700 ${fontSize}px ${FONT_STACK}`;
  return { fontSize, lines: wrapText(text, maxWidth) };
}

function drawFittedLine(text, x, y, maxWidth, preferredSize, minimumSize, weight) {
  let fontSize = preferredSize;

  while (fontSize > minimumSize) {
    ctx.font = `${weight} ${fontSize}px ${FONT_STACK}`;

    if (ctx.measureText(text).width <= maxWidth) break;
    fontSize -= 2;
  }

  ctx.font = `${weight} ${fontSize}px ${FONT_STACK}`;
  ctx.fillText(text, x, y);
}

function getVerseFontSize(text) {
  if (text.length > 80) return 54;
  if (text.length > 58) return 62;
  if (text.length > 36) return 70;
  return 78;
}

function wrapText(text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    const width = ctx.measureText(testLine).width;

    if (width <= maxWidth) {
      line = testLine;
      return;
    }

    if (line) {
      lines.push(line);
      line = word;
      return;
    }

    lines.push(...breakLongWord(word, maxWidth));
    line = "";
  });

  if (line) lines.push(line);
  return lines;
}

function breakLongWord(word, maxWidth) {
  const chunks = [];
  let chunk = "";

  Array.from(word).forEach((char) => {
    const testChunk = chunk + char;
    if (ctx.measureText(testChunk).width <= maxWidth) {
      chunk = testChunk;
    } else {
      if (chunk) chunks.push(chunk);
      chunk = char;
    }
  });

  if (chunk) chunks.push(chunk);
  return chunks;
}

function downloadCanvas(reference) {
  const fileName = `말씀카드_${makeSafeReference(reference)}.png`;
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  const fallbackWindow = isIOS() ? window.open() : null;

  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setMessage("이미지 저장을 시작했어요.");

  // 일부 iPhone Safari 환경에서 download가 제한되면 열린 이미지 탭에서 길게 눌러 저장할 수 있습니다.
  if (fallbackWindow) {
    fallbackWindow.document.write(`<img src="${dataUrl}" alt="말씀카드" style="width:100%;height:auto;">`);
    fallbackWindow.document.title = fileName;
  }
}

function makeSafeReference(reference) {
  return reference
    .trim()
    .replace(/\s+(?=\d)/g, "")
    .replace(/[\s:\/\\]+/g, "-")
    .replace(/[^\u3131-\u318e\uac00-\ud7a3a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function setMessage(text) {
  message.textContent = text;
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}
