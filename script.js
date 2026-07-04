const cursor = document.querySelector(".cursor-light");
const meter = document.querySelector(".scroll-meter span");
const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");

const panels = {
  business: {
    label: "01 / Business Field",
    title: "先理解钱从哪里漏掉。",
    body: "我从西南连锁宠物店经营里看到：客户复购、销售跟进、会员沉淀和库存运营，不是一个“AI 聊天”能解决的问题。"
  },
  data: {
    label: "02 / Data Diagnosis",
    title: "把历史成交数据变成前瞻信号。",
    body: "围绕订单、会员、复购周期和流失风险做诊断，找出最值得自动化、最可能带来增收的切入点。"
  },
  agent: {
    label: "03 / Agent Execution",
    title: "让 Agent 读写工具，而不是只回答问题。",
    body: "飞书、多维表格、文档、会议纪要、任务、内容生成和报告输出，都可以被编排进执行链路。"
  },
  product: {
    label: "04 / Product Delivery",
    title: "从方案到可用产品。",
    body: "小程序、H5、SwiftUI App、FastAPI、数据看板和脚本自动化，最终都指向可上线、可培训、可迭代。"
  }
};

const roles = {
  fde: {
    title: "Forward Deployed Engineer",
    copy: "进入业务现场，把 AI 能力部署成可用工具、流程和增长动作。"
  },
  native: {
    title: "AI-native Builder",
    copy: "用 AI 原生方式学习、开发、表达和交付，把一个人的产能扩展成系统。"
  },
  retail: {
    title: "Retail AI Builder",
    copy: "从宠物连锁和零售经营问题出发，围绕复购、会员、跟进和数据诊断做 AI 落地。"
  },
  lecturer: {
    title: "Agent Community Lecturer",
    copy: "把 Agent、工具调用和工作流讲成业务团队能理解、能上手、能复用的方法。"
  }
};

let width = 0;
let height = 0;
let particles = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.max(48, Math.floor((width * height) / 22000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.7 + 0.4
  }));
}

function drawField() {
  ctx.clearRect(0, 0, width, height);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      p.x += dx * 0.002;
      p.y += dy * 0.002;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(246, 241, 231, 0.34)";
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 118) {
        ctx.strokeStyle = `rgba(80, 227, 194, ${0.11 * (1 - dist / 118)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawField);
}

function updateScrollMeter() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max <= 0 ? 0 : window.scrollY / max;
  meter.style.height = `${Math.round(progress * 100)}%`;
}

window.addEventListener("pointermove", (event) => {
  mouse = { x: event.clientX, y: event.clientY };
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
  const nx = event.clientX / window.innerWidth - 0.5;
  const ny = event.clientY / window.innerHeight - 0.5;
  document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
  document.documentElement.style.setProperty("--my", `${event.clientY}px`);
  document.documentElement.style.setProperty("--parallax-x", `${nx * 54}px`);
  document.documentElement.style.setProperty("--parallax-y", `${ny * 42}px`);
  document.documentElement.style.setProperty("--tilt-x", `${nx * 9}deg`);
  document.documentElement.style.setProperty("--tilt-y", `${ny * 8}deg`);
});

window.addEventListener("scroll", updateScrollMeter, { passive: true });
window.addEventListener("resize", () => {
  resizeCanvas();
  updateScrollMeter();
});

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const enginePanel = document.getElementById("engine-panel");
document.querySelectorAll(".engine-node").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".engine-node").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const content = panels[button.dataset.panel];
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const baseTransform = isMobile ? "translateX(-50%)" : "translateY(-50%)";
    enginePanel.animate(
      [
        { opacity: 0, transform: `${baseTransform} translateY(12px)` },
        { opacity: 1, transform: `${baseTransform} translateY(0)` }
      ],
      { duration: 260, easing: "ease-out" }
    );
    enginePanel.innerHTML = `
      <p class="panel-label">${content.label}</p>
      <h3>${content.title}</h3>
      <p>${content.body}</p>
    `;
  });
});

document.querySelectorAll(".role-pill").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".role-pill").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const role = roles[button.dataset.role];
    const title = document.querySelector(".hero-mode-title");
    const copy = document.querySelector(".hero-mode-copy");
    const stage = document.querySelector(".role-stage");
    stage.animate(
      [
        { opacity: 0.55, transform: "translateY(8px) scale(0.99)" },
        { opacity: 1, transform: "translateY(0) scale(1)" }
      ],
      { duration: 240, easing: "ease-out" }
    );
    title.textContent = role.title;
    copy.textContent = role.copy;
  });
});

document.querySelectorAll(".magnetic").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    card.style.transform = `translate(${x * 0.025}px, ${y * 0.025}px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const speakingStage = document.querySelector("[data-gallery-stage]");
const speakingMain = document.querySelector("[data-gallery-main]");
const speakingCount = document.querySelector("[data-gallery-count]");
const speakingTitle = document.querySelector("[data-gallery-title]");
const speakingCopy = document.querySelector("[data-gallery-copy]");

document.querySelectorAll(".speaking-thumb").forEach((button) => {
  button.addEventListener("click", () => {
    if (!speakingMain || button.classList.contains("active")) return;
    document.querySelectorAll(".speaking-thumb").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    speakingStage.classList.add("is-swapping");
    window.setTimeout(() => {
      speakingMain.src = button.dataset.image;
      speakingMain.alt = button.getAttribute("aria-label") || "火山引擎 Agent 社区线下分享照片";
      speakingCount.textContent = button.dataset.count;
      speakingTitle.textContent = button.dataset.title;
      speakingCopy.textContent = button.dataset.copy;
      speakingStage.classList.remove("is-swapping");
    }, 150);
  });
});

if (speakingStage) {
  speakingStage.addEventListener("pointermove", (event) => {
    const rect = speakingStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    speakingStage.style.transform = `rotateX(${y * -3.5}deg) rotateY(${x * 4.5}deg)`;
  });
  speakingStage.addEventListener("pointerleave", () => {
    speakingStage.style.transform = "";
  });
}

resizeCanvas();
updateScrollMeter();
drawField();
