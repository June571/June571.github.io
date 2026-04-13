const DB_KEY = "ai_vault_multi_page_v1";

const defaultDB = {
  products: [
    {
      id: Date.now() + 1,
      title: "ChatGPT",
      desc: "多场景 AI 助手，支持文本、代码、分析等。",
      url: "https://chat.openai.com/",
      tags: ["对话", "通用"]
    },
    {
      id: Date.now() + 2,
      title: "Kimi",
      desc: "长文本处理与检索能力比较好。",
      url: "https://kimi.moonshot.cn/",
      tags: ["长文本", "国产"]
    }
  ],
  prompts: [
    {
      id: Date.now() + 3,
      title: "论文润色 Prompt",
      category: "写作",
      summary: "把学术语言改写得更清晰。",
      prompt: "角色：你是电力系统研究助理。\n目标：润色下述段落，提升逻辑与学术表达。\n输入：{原文}\n输出：1) 润色后版本 2) 修改理由 3) 关键术语建议"
    }
  ],
  skills: [
    {
      id: Date.now() + 4,
      title: "Cursor Skills 示例库",
      desc: "收集别人写得好的 Agent Skills。",
      url: "https://github.com/cursor-ai",
      tags: ["Agent", "Skills", "GitHub"]
    }
  ],
  ideas: [
    {
      id: Date.now() + 5,
      title: "多智能体调度想法",
      content: "让数据收集 Agent 和优化 Agent 串联，形成自动实验流水线。",
      createdAt: new Date().toISOString(),
      files: []
    }
  ],
  knowledge: [
    {
      id: Date.now() + 6,
      title: "IPM 的核心步骤",
      fileName: "ipm-note.html",
      html: "<p>内点法通过 barrier 项把不等式约束吸收进目标函数，并通过牛顿方向迭代逼近 KKT 解。</p>"
    }
  ]
};

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDB));
    return structuredClone(defaultDB);
  }
  try {
    const parsed = JSON.parse(raw);
    return { ...structuredClone(defaultDB), ...parsed };
  } catch (_) {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDB));
    return structuredClone(defaultDB);
  }
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function navHTML(active) {
  const links = [
    ["index.html", "首页"],
    ["products.html", "AI 产品库"],
    ["prompts.html", "功能提示词"],
    ["skills.html", "Skills 技能库"],
    ["ideas.html", "Idea"],
    ["knowledge.html", "知识管理"]
  ];
  return links
    .map(([href, label]) => `<a class="${active === href ? "active" : ""}" href="${href}">${label}</a>`)
    .join("");
}

function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    if (btn) {
      const old = btn.textContent;
      btn.textContent = "已复制";
      setTimeout(() => {
        btn.textContent = old;
      }, 1000);
    }
  } catch (_) {
    alert("复制失败，请手动复制");
  }
}

function downloadHTMLFile(title, html) {
  const wrapped = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>${escapeHTML(title)}</title></head><body>${html}</body></html>`;
  const blob = new Blob([wrapped], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title || "knowledge"}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
