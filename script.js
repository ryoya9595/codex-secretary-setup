// ===== コピー用テキスト =====
const PAGE_URL = "https://ryoya9595.github.io/codex-secretary-setup/";
const GUIDE_URL = PAGE_URL + "setup.md";

const INSTALL_PROMPT = `このフォルダに、ChatGPTの人格を引き継いだ「AI秘書＋記憶フォルダ（Obsidian連携）」をセットアップしてください。

【手順書】
${GUIDE_URL}

【進め方】
1. 手順書を curl（Windows は curl.exe）で取得して、全文を読んでください。
   ※ ネットへのアクセスの許可が必要なら、私に許可を求めてください。
   ※ 要約して読むツールではなく、原文をそのまま読んでください。
   ※ 手順書のファイルは、このフォルダには保存しないでください（画面に出すか、一時フォルダへ）。
   ※ どうしても取得できないときは、ダウンロードフォルダの codex-setup.md を読んでください。
2. 手順書のとおり、フェーズ1から順に進めてください。
3. ChatGPT側の人格を消すのは最後です。手順書の条件がそろって、私がはっきりOKするまで消す案内はしないでください。
4. 私はパソコンに詳しくないので、やさしい言葉で、短く説明してください。`;

const EXTRACT_PROMPT = `これまでのあなた（ChatGPT）を、別のAIに引き継ぎたいです。次の4つを、省略せず、1つのコードブロックにまとめて書き出してください。

1. 保存されているメモリ（私について覚えていること）を全部、1行ずつ、そのまま
2. カスタム指示（「私について」「どう応答してほしいか」など、私が設定した内容）を、そのまま
3. あなたの話し方の特徴：名前（あれば）・一人称・私の呼び方・口調・語尾・よく使う言い回し・絵文字の使い方。いつもの話し方での会話例を3つ
4. これまでの会話から分かる、私の仕事・目標・進行中のこと・好み・苦手なこと

分からない項目は「なし」と書いてください。`;

const TEXTS = {
  installPrompt: INSTALL_PROMPT,
  checkPrompt: `引っ越しの確認をしたい`,
  erasePrompt: `ChatGPTの人格を消したい`,
  extractPrompt: EXTRACT_PROMPT,
};

// 各 <pre> に本文を流し込む
Object.entries(TEXTS).forEach(([id, text]) => {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
});

// ===== コピー処理 =====
async function copyText(text, target) {
  let ok = false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      ok = true;
    }
  } catch { ok = false; }
  if (!ok && target) {
    const range = document.createRange();
    range.selectNodeContents(target);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    sel.removeAllRanges();
  }
  return ok;
}

function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const targetId = button.dataset.target;
    const target = document.getElementById(targetId);
    const text = TEXTS[targetId] || (target ? target.textContent : "");
    const ok = await copyText(text, target);
    const original = button.textContent;
    button.textContent = ok ? "コピーしました" : "手動でコピー";
    button.classList.toggle("done", ok);
    showToast(ok ? "📋 コピーしました" : "コピーできませんでした");
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove("done");
    }, 2000);
  });
});

// ===== ナビ現在地ハイライト =====
const navLinks = Array.from(document.querySelectorAll(".topnav a[href^='#']"));
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);
if ("IntersectionObserver" in window && sections.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = "#" + e.target.id;
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => obs.observe(s));
}
