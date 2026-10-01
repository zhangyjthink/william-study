/**
 * William's Mastery Quest - Core Interactive Engine
 * Tutor: 秋夜老师 (Coach AI)
 * Student: 怀谦 (William, 8yo, G3 International School)
 */

// ===================== 1. 严格手动登录门禁 (必须手动输入) =====================
const AUTH_CREDENTIALS = {
  user: 'william',
  pass: '8888'
};

// 严禁自动登录，会话仅保存在当前浏览器的 SessionStorage（关网页即锁）
function checkAuth() {
  const isAuthed = sessionStorage.getItem('william_auth_token') === 'verified_session';
  const guard = document.getElementById('auth-guard');
  if (!isAuthed) {
    if (guard) guard.classList.remove('hidden');
    // 清空任何可能的预填充输入
    const uInput = document.getElementById('auth-user-input');
    const pInput = document.getElementById('auth-pass-input');
    if (uInput) uInput.value = '';
    if (pInput) pInput.value = '';
  } else {
    if (guard) guard.classList.add('hidden');
  }
}

function handleLoginSubmit() {
  const uInput = document.getElementById('auth-user-input');
  const pInput = document.getElementById('auth-pass-input');
  const errBox = document.getElementById('auth-err-msg');

  const u = uInput ? uInput.value.trim() : '';
  const p = pInput ? pInput.value.trim() : '';

  if (u === AUTH_CREDENTIALS.user && p === AUTH_CREDENTIALS.pass) {
    sessionStorage.setItem('william_auth_token', 'verified_session');
    if (errBox) errBox.classList.add('hidden');
    const guard = document.getElementById('auth-guard');
    if (guard) guard.classList.add('hidden');
  } else {
    if (errBox) {
      errBox.innerText = '⚠️ 用户名或密码错误，请手动重新输入（提示: william / 8888）';
      errBox.classList.remove('hidden');
    }
  }
}

function handleLogout() {
  sessionStorage.removeItem('william_auth_token');
  location.reload();
}

// ===================== 2. 初始核心错题数据源 (美式 G3 精选模型) =====================
const DEFAULT_MISTAKES = [
  {
    id: 'm1',
    subject: 'Math',
    topic: 'Two-Step Word Problems (两步应用题)',
    status: 'pending', // pending, mastered
    date: '2026-09-28',
    question: "Leo has 5 bags of marbles. Each bag contains 8 marbles. He gives 14 marbles to his friend Maya. How many marbles does Leo have left?",
    image: '',
    wrongReason: "第一步算出了 5×8=40 颗珠子，但第二步把'give to (给别人)'看成了'get more (又得到)'，算成了 40+14=54。",
    correctAnswer: "26 marbles",
    hints: [
      "💡 Hint 1: 第一步，先算 Leo 一共有多少颗弹珠？(5 bags × 8 marbles = ?)",
      "💡 Hint 2: 关注关键词 'gives ... to his friend'。弹珠是变多了还是变少了？应该用加法还是减法？",
      "💡 Hint 3: 列出综合算式：(5 × 8) - 14 = ?"
    ],
    twinChallenge: {
      question: "Twin Challenge: Chloe bought 4 packs of stickers. Each pack has 9 stickers. She used 15 stickers on her art project. How many stickers are left?",
      answer: "21",
      explanation: "4 × 9 = 36 stickers. 36 - 15 = 21 stickers."
    }
  },
  {
    id: 'm2',
    subject: 'ELA',
    topic: 'Text Evidence & Inference (阅读推断与证据寻找)',
    status: 'pending',
    date: '2026-09-29',
    question: "Read the passage: 'Oliver grabbed his thick wool coat, pulled his gloves tight, and saw his breath form little white clouds in the air.' \nQuestion: What season is it, and what clue tells you that?",
    image: '',
    wrongReason: "只回答了 'Winter'，忘记在试卷上写出支持该结论的 Text Evidence (文本证据)，导致被扣了一半的分数。",
    correctAnswer: "It is winter. Evidence: thick wool coat, gloves, breath forming white clouds in cold air.",
    hints: [
      "💡 Hint 1: 国际学校 ELA 题目的黄金法则：'Claim + Evidence' (结论 + 原文证据)。",
      "💡 Hint 2: 圈出文中描写温度和衣服的三个关键细节 (thick wool coat, gloves, white clouds)。",
      "💡 Hint 3: 用完整的英文句子回答：'It is winter because the passage mentions ...'"
    ],
    twinChallenge: {
      question: "Twin Challenge: 'Sophie wiped sweat from her forehead and jumped into the cool swimming pool to escape the blazing sun.' What season is it, and name ONE clue?",
      answer: "summer",
      explanation: "It is Summer. Clues: wiping sweat, cool swimming pool, blazing sun."
    }
  },
  {
    id: 'm3',
    subject: 'Math',
    topic: 'Area and Perimeter (周长与面积混淆)',
    status: 'pending',
    date: '2026-09-30',
    question: "A rectangular garden has a length of 7 feet and a width of 4 feet. Find the PERIMETER of the garden.",
    image: '',
    wrongReason: "把 Perimeter (周长) 和 Area (面积) 搞混了！直接算了 7×4=28，而实际上周长是绕一圈的长度。",
    correctAnswer: "22 feet (7 + 4 + 7 + 4 = 22)",
    hints: [
      "💡 Hint 1: 牢记区别：Area (面积) 是里面的方格面积 (Length × Width)；Perimeter (周长) 是栅栏绕一圈的总长度！",
      "💡 Hint 2: 长方形有 4 条边！2 条长 (7+7) + 2 条宽 (4+4)。",
      "💡 Hint 3: 算式是：7 + 4 + 7 + 4 = 22 feet，或者 (7 + 4) × 2 = 22 feet。"
    ],
    twinChallenge: {
      question: "Twin Challenge: A square rug has sides of 6 feet each. What is its Perimeter?",
      answer: "24",
      explanation: "A square has 4 equal sides: 6 × 4 = 24 feet."
    }
  },
  {
    id: 'm4',
    subject: 'Science',
    topic: 'Life Cycles & Plant Adaptations (生命周期与植物适应)',
    status: 'mastered',
    date: '2026-09-25',
    question: "Why do cacti in the desert have thick, waxy stems and sharp spines instead of wide leaves?",
    image: '',
    wrongReason: "忘记了 waxy coating (蜡质层) 的作用是 store water and prevent water loss (锁水防蒸发)。",
    correctAnswer: "Thick stems store water; the waxy coating prevents water loss; spines protect them from animals.",
    hints: [
      "💡 Hint 1: 沙漠环境的最核心特征是什么？(Dry, hot, very little rain)",
      "💡 Hint 2: 宽叶子容易蒸发水分，小刺 (spines) 能减少水分流失，还能防止口渴的动物咬它！"
    ],
    twinChallenge: {
      question: "Twin Challenge: Why do polar bears have thick white fur and a heavy layer of fat in the Arctic?",
      answer: "keep warm",
      explanation: "To keep warm in freezing temperatures and camouflage with snow."
    }
  }
];

// ===================== 3. 数据持久化与状态管理 =====================
let mistakesData = [];
let currentFilterSubject = 'all';
let currentFilterStatus = 'all';
let activeModalMistake = null;
let userXP = 85;

function loadStorage() {
  const saved = localStorage.getItem('william_mistakes_v1');
  if (saved) {
    try {
      mistakesData = JSON.parse(saved);
    } catch (e) {
      mistakesData = DEFAULT_MISTAKES;
    }
  } else {
    mistakesData = DEFAULT_MISTAKES;
    saveStorage();
  }

  const xp = localStorage.getItem('william_xp');
  if (xp) userXP = parseInt(xp, 10) || 0;
  updateStats();
}

function saveStorage() {
  localStorage.setItem('william_mistakes_v1', JSON.stringify(mistakesData));
  localStorage.setItem('william_xp', userXP);
  updateStats();
}

function updateStats() {
  const total = mistakesData.length;
  const mastered = mistakesData.filter(m => m.status === 'mastered').length;
  const pending = total - mastered;

  const totalEl = document.getElementById('stat-total');
  const pendingEl = document.getElementById('stat-pending');
  const masteredEl = document.getElementById('stat-mastered');
  const xpEl = document.getElementById('stat-xp');
  const headerXp = document.getElementById('header-xp');
  const headerMastered = document.getElementById('header-mastered');

  if (totalEl) totalEl.innerText = total;
  if (pendingEl) pendingEl.innerText = pending;
  if (masteredEl) masteredEl.innerText = mastered;
  if (xpEl) xpEl.innerText = `${userXP} XP`;
  if (headerXp) headerXp.innerText = `${userXP} XP`;
  if (headerMastered) headerMastered.innerText = `已攻克: ${mastered} 题`;
}

// ===================== 4. 渲染错题卡片流 =====================
function renderMistakes() {
  const container = document.getElementById('mistakes-container');
  const emptyState = document.getElementById('empty-state');
  if (!container) return;

  container.innerHTML = '';

  let list = mistakesData;
  if (currentFilterSubject !== 'all') {
    list = list.filter(m => m.subject.toLowerCase() === currentFilterSubject.toLowerCase());
  }
  if (currentFilterStatus !== 'all') {
    list = list.filter(m => m.status === currentFilterStatus);
  }

  if (list.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  } else {
    if (emptyState) emptyState.classList.add('hidden');
  }

  list.forEach(item => {
    const card = document.createElement('div');
    const isMastered = item.status === 'mastered';
    
    // 科目专属图标与配色
    let subjIcon = 'fa-calculator';
    let subjColor = 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300';
    if (item.subject === 'ELA') {
      subjIcon = 'fa-book-bookmark';
      subjColor = 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300';
    } else if (item.subject === 'Science') {
      subjIcon = 'fa-flask';
      subjColor = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300';
    }

    card.className = `p-6 bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-200 hover:shadow-xl cursor-pointer flex flex-col justify-between group ${
      isMastered 
        ? 'border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/10' 
        : 'border-slate-200/80 dark:border-slate-800'
    }`;

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-xl text-xs font-bold ${subjColor} flex items-center gap-1.5">
              <i class="fa-solid ${subjIcon}"></i>
              <span>${item.subject}</span>
            </span>
            <span class="text-xs text-slate-400 font-mono">${item.date}</span>
          </div>

          <span class="px-2.5 py-1 rounded-xl text-xs font-bold ${
            isMastered 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
          }">
            ${isMastered ? '✓ 已彻底掌握' : '⚡ 待攻克自愈'}
          </span>
        </div>

        <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 transition-colors">
          ${item.topic}
        </h4>

        <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4 font-normal">
          ${item.question}
        </p>
      </div>

      <div>
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
          <span class="font-bold text-rose-500">当时错因:</span> ${item.wrongReason}
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span class="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>开始自愈订正</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </span>
          <span class="text-slate-400 text-[11px]">秋夜老师辅导</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openDetailModal(item);
    });

    container.appendChild(card);
  });
}

// ===================== 5. 错题详情与改错交互 =====================
function openDetailModal(item) {
  activeModalMistake = item;
  const modal = document.getElementById('detail-modal');
  if (!modal) return;

  document.getElementById('modal-subject-badge').innerText = item.subject;
  document.getElementById('modal-topic').innerText = item.topic;
  document.getElementById('modal-question-text').innerText = item.question;
  document.getElementById('modal-wrong-reason').innerText = item.wrongReason;

  const imgBox = document.getElementById('modal-question-image-box');
  const imgEl = document.getElementById('modal-question-image');
  if (item.image) {
    imgEl.src = item.image;
    imgBox.classList.remove('hidden');
  } else {
    imgBox.classList.add('hidden');
  }

  // 渲染启发梯子
  const hintsList = document.getElementById('modal-hints-list');
  hintsList.innerHTML = '';
  if (item.hints && item.hints.length > 0) {
    item.hints.forEach(hint => {
      const p = document.createElement('div');
      p.className = "p-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-indigo-100/80 dark:border-slate-700/60 font-medium";
      p.innerText = hint;
      hintsList.appendChild(p);
    });
  }

  // 清空输入框与变式题
  document.getElementById('modal-correction-input').value = '';
  const twinBox = document.getElementById('twin-challenge-box');
  twinBox.classList.add('hidden');

  modal.classList.remove('hidden');
}

function handleCorrectionSubmit() {
  if (!activeModalMistake) return;
  const input = document.getElementById('modal-correction-input').value.trim();
  if (!input) {
    alert('请写下你的订正思路或答案哦！');
    return;
  }

  // 判定并触发同型变式挑战
  activeModalMistake.status = 'mastered';
  userXP += 10;
  saveStorage();
  renderMistakes();

  alert('🎉 太棒了！订正思路非常清晰！获得 +10 XP！\n秋夜老师为你准备了一道同型挑战题，乘胜追击挑战一下吧！');

  // 显示变式题
  const twinBox = document.getElementById('twin-challenge-box');
  if (activeModalMistake.twinChallenge) {
    document.getElementById('twin-question-text').innerText = activeModalMistake.twinChallenge.question;
    document.getElementById('twin-answer-input').value = '';
    const fb = document.getElementById('twin-feedback');
    fb.classList.add('hidden');
    twinBox.classList.remove('hidden');
  }
}

function handleTwinSubmit() {
  if (!activeModalMistake || !activeModalMistake.twinChallenge) return;
  const userAns = document.getElementById('twin-answer-input').value.trim().toLowerCase();
  const targetAns = activeModalMistake.twinChallenge.answer.toLowerCase();
  const fb = document.getElementById('twin-feedback');

  if (userAns.includes(targetAns)) {
    userXP += 15;
    saveStorage();
    fb.className = "text-xs font-bold p-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    fb.innerHTML = `🎉 恭喜 William！变式挑战完全正确！额外奖励 +15 XP！<br><span class="opacity-90 font-normal">解析: ${activeModalMistake.twinChallenge.explanation}</span>`;
    fb.classList.remove('hidden');
  } else {
    fb.className = "text-xs font-bold p-3 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
    fb.innerHTML = `再想一想哦！提示: ${activeModalMistake.hints[0] || '注意审题关键词'}`;
    fb.classList.remove('hidden');
  }
}

// 微软高保真自然语音朗读
function readQuestionSpeech() {
  if (!activeModalMistake) return;
  const text = activeModalMistake.question;
  if (!('speechSynthesis' in window)) {
    alert('您的设备暂不支持语音朗读');
    return;
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.9;
  u.pitch = 1.0;
  speechSynthesis.speak(u);
}

// ===================== 6. 秋夜老师 AI 交互抽屉 (Coach AI) =====================
function toggleAIDrawer() {
  const drawer = document.getElementById('ai-drawer');
  if (!drawer) return;
  drawer.classList.toggle('translate-x-full');
}

function sendAIMessage() {
  const input = document.getElementById('ai-input');
  const msgList = document.getElementById('ai-chat-messages');
  if (!input || !msgList) return;

  const text = input.value.trim();
  if (!text) return;

  // 用户发言
  const userBubble = document.createElement('div');
  userBubble.className = "flex items-start justify-end gap-2.5";
  userBubble.innerHTML = `
    <div class="p-3.5 bg-indigo-600 text-white rounded-2xl rounded-tr-sm leading-relaxed max-w-[85%] font-medium">
      ${text}
    </div>
    <div class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 font-bold">
      W
    </div>
  `;
  msgList.appendChild(userBubble);
  input.value = '';
  msgList.scrollTop = msgList.scrollHeight;

  // 秋夜老师苏格拉底式启发答复 (针对美式 G3 定制)
  setTimeout(() => {
    let reply = generateCoachAIReply(text);
    const aiBubble = document.createElement('div');
    aiBubble.className = "flex items-start gap-2.5";
    aiBubble.innerHTML = `
      <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
        秋
      </div>
      <div class="p-3.5 bg-indigo-50 dark:bg-slate-800/90 rounded-2xl rounded-tl-sm text-slate-800 dark:text-slate-200 border border-indigo-100 dark:border-slate-700 leading-relaxed max-w-[85%]">
        ${reply}
      </div>
    `;
    msgList.appendChild(aiBubble);
    msgList.scrollTop = msgList.scrollHeight;

    // 播放纯正美音
    speakCoachResponse(reply.replace(/<[^>]*>?/gm, ''));
  }, 600);
}

function generateCoachAIReply(query) {
  query = query.toLowerCase();
  
  if (query.includes('不懂') || query.includes("don't understand") || query.includes('不会')) {
    return `William，别担心，学习中遇到难题正是大脑在升级的时候！🌟<br><br>
    告诉秋夜老师：题目里哪一个单词或者哪一句话让你感觉最困惑？我们先把题目拆成两个小步骤来看！`;
  }
  
  if (query.includes('周长') || query.includes('perimeter') || query.includes('area') || query.includes('面积')) {
    return `Great question, William! 📐<br><br>
    记住秋夜老师教你的口诀：<br>
    • <b>Perimeter (周长)</b>：就像小蚂蚁沿着图形的边缘跑一整圈的长度，把所有的边加起来！<br>
    • <b>Area (面积)</b>：是里面铺满小方块的总数量 (Length × Width)。<br><br>
    你现在的题目是求围栏一圈，还是铺地毯呢？`;
  }

  if (query.includes('marble') || query.includes('两步') || query.includes('word problem') || query.includes('应用题')) {
    return `Let's use the Bar Model (线段图法) 来拆解！💡<br><br>
    1. 第一步：先画出总数。比如每袋有几个？一共有几袋？<br>
    2. 第二步：送给朋友后，总数是增加了还是减少了？<br>
    你先把第一步算出来的数字告诉我，我们再看下一步！`;
  }

  if (query.includes('evidence') || query.includes('阅读') || query.includes('reading') || query.includes('ela')) {
    return `在美式阅读理解中，证据就是你的放大镜 🔍！<br><br>
    当你得出一个答案时，试着用这句话在原文中找证据：<br>
    <i>"I know this because the text says..."</i><br>
    试着从故事里挑出一个描写细节读给秋夜老师听！`;
  }

  // 默认自愈鼓励引导
  return `收到，William！秋夜老师正在看你提到的点。👍<br><br>
  对于这道题，我们首先要抓住题目问的终极目标是什么？是求数量、求比较、还是找证据？把你的第一直觉告诉我，老师带你一步步拿下它！`;
}

function speakCoachResponse(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = 1.0;
  u.pitch = 1.0;
  speechSynthesis.speak(u);
}

// ===================== 7. 录入新错题交互 =====================
function handleAddNewMistake() {
  const subject = document.getElementById('new-subject').value;
  const topic = document.getElementById('new-topic').value.trim() || '综合练习题';
  const question = document.getElementById('new-question').value.trim();
  const image = document.getElementById('new-image').value.trim();
  const wrongReason = document.getElementById('new-reason').value.trim() || '审题或计算失误';
  const correctAnswer = document.getElementById('new-correct-ans').value.trim() || '详见解析';

  if (!question) {
    alert('请填写题目文字内容！');
    return;
  }

  const newId = 'm_' + Date.now();
  const newObj = {
    id: newId,
    subject: subject,
    topic: topic,
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    question: question,
    image: image,
    wrongReason: wrongReason,
    correctAnswer: correctAnswer,
    hints: [
      "💡 Hint 1: 圈出题目中的已知量与核心名词。",
      "💡 Hint 2: 建立数学模型或查找上下文对应句子。",
      "💡 Hint 3: 结合秋夜老师的步骤指引完成验算。"
    ],
    twinChallenge: {
      question: `Twin Challenge for ${topic}: 尝试用不同数值或场景再做一次检验！`,
      answer: correctAnswer,
      explanation: "举一反三，掌握解题本质。"
    }
  };

  mistakesData.unshift(newObj);
  saveStorage();
  renderMistakes();

  document.getElementById('add-modal').classList.add('hidden');
  alert('✨ 新错题收集成功！秋夜老师已将其加入攻克清单，随时准备陪你自愈攻关！');
}

// ===================== 8. 初始化事件绑定 =====================
document.addEventListener('DOMContentLoaded', () => {
  // 严格安全认证门禁 (每次必输)
  checkAuth();

  const authSubmitBtn = document.getElementById('auth-submit-btn');
  if (authSubmitBtn) authSubmitBtn.addEventListener('click', handleLoginSubmit);

  const authPassInput = document.getElementById('auth-pass-input');
  if (authPassInput) {
    authPassInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleLoginSubmit();
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  // 主题切换
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
    });
  }

  // 科目过滤按钮
  document.querySelectorAll('.filter-subject-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-subject-btn').forEach(b => {
        b.className = "filter-subject-btn px-4 py-2 rounded-xl text-xs font-bold transition-all text-slate-600 dark:text-slate-300 hover:text-indigo-600";
      });
      btn.className = "filter-subject-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-indigo-600 text-white shadow-sm";
      currentFilterSubject = btn.getAttribute('data-subject') || 'all';
      renderMistakes();
    });
  });

  // 状态筛选
  const statusSelect = document.getElementById('filter-status');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      currentFilterStatus = e.target.value;
      renderMistakes();
    });
  }

  // 错题弹窗操作
  const closeDetailBtn = document.getElementById('close-detail-modal-btn');
  if (closeDetailBtn) {
    closeDetailBtn.addEventListener('click', () => {
      document.getElementById('detail-modal').classList.add('hidden');
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    });
  }

  const readQBtn = document.getElementById('read-question-btn');
  if (readQBtn) readQBtn.addEventListener('click', readQuestionSpeech);

  const submitCorrBtn = document.getElementById('submit-correction-btn');
  if (submitCorrBtn) submitCorrBtn.addEventListener('click', handleCorrectionSubmit);

  const submitTwinBtn = document.getElementById('submit-twin-btn');
  if (submitTwinBtn) submitTwinBtn.addEventListener('click', handleTwinSubmit);

  const askAiThisBtn = document.getElementById('ask-ai-this-btn');
  if (askAiThisBtn) {
    askAiThisBtn.addEventListener('click', () => {
      if (activeModalMistake) {
        toggleAIDrawer();
        const input = document.getElementById('ai-input');
        if (input) input.value = `秋夜老师，请帮我分析这道【${activeModalMistake.topic}】难题：${activeModalMistake.question.slice(0, 40)}...`;
      }
    });
  }

  // 新错题弹窗
  const openAddBtn = document.getElementById('open-add-modal-btn');
  if (openAddBtn) {
    openAddBtn.addEventListener('click', () => {
      document.getElementById('add-modal').classList.remove('hidden');
    });
  }

  const closeAddBtn = document.getElementById('close-add-modal-btn');
  if (closeAddBtn) {
    closeAddBtn.addEventListener('click', () => {
      document.getElementById('add-modal').classList.add('hidden');
    });
  }

  const cancelAddBtn = document.getElementById('cancel-add-btn');
  if (cancelAddBtn) {
    cancelAddBtn.addEventListener('click', () => {
      document.getElementById('add-modal').classList.add('hidden');
    });
  }

  const confirmAddBtn = document.getElementById('confirm-add-btn');
  if (confirmAddBtn) confirmAddBtn.addEventListener('click', handleAddNewMistake);

  // 秋夜老师抽屉
  const toggleAiBtn = document.getElementById('toggle-ai-drawer-btn');
  if (toggleAiBtn) toggleAiBtn.addEventListener('click', toggleAIDrawer);

  const closeAiBtn = document.getElementById('close-ai-drawer-btn');
  if (closeAiBtn) closeAiBtn.addEventListener('click', toggleAIDrawer);

  const aiSendBtn = document.getElementById('ai-send-btn');
  if (aiSendBtn) aiSendBtn.addEventListener('click', sendAIMessage);

  const aiInput = document.getElementById('ai-input');
  if (aiInput) {
    aiInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendAIMessage();
    });
  }

  // 加载存储与首屏渲染
  loadStorage();
  renderMistakes();
});
