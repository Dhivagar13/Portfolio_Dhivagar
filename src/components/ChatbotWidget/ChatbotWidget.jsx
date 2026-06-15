import React, { useEffect, useRef, useState } from 'react';
import * as Motion from 'framer-motion/client';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import bioText from '../../../backend/data/bio.txt?raw';
import './ChatbotWidget.css';

const tabs = [
  { id: 0, label: 'Chat' },
  { id: 1, label: 'Profile' },
];

const starterMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    text: "Hi, I'm Dhivagar's AI assistant. Ask me about skills, projects, experience, education, or interests.",
  },
];

const quickPrompts = [
  "Skills?",
  'Career Chatbot?',
  'Experience?',
];

const profileHighlights = [
  { label: 'Role', value: 'Full Stack & AI Developer' },
  { label: 'Location', value: 'Tamil Nadu, India' },
  { label: 'Focus', value: 'React, FastAPI, Spring Boot, AI' },
];

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8000/chat';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toLines = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const compressSection = (text) => toLines(text).join(' ');

const getFieldValue = (sectionText, label) => {
  if (!sectionText) return '';
  const pattern = new RegExp(`^${escapeRegExp(label)}\\s*:\\s*(.+)$`, 'im');
  const match = sectionText.match(pattern);
  return match ? match[1].trim() : '';
};

const getSection = (text, name) => {
  const header = new RegExp(`^=====\\s*${escapeRegExp(name)}\\s*=====\\s*$`, 'm');
  const match = text.match(header);
  if (!match || match.index === undefined) return '';

  const startIndex = match.index + match[0].length;
  const rest = text.slice(startIndex);
  const nextHeaderMatch = rest.match(/^=====\s*[^=]+\s*=====\s*$/m);
  const endIndex = nextHeaderMatch ? startIndex + nextHeaderMatch.index : text.length;
  return text.slice(startIndex, endIndex).trim();
};

const buildExperienceSummary = (sectionText) => {
  if (!sectionText) return '';

  const entries = [];
  let current = null;

  sectionText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      if (line.startsWith('Company:')) {
        if (current) entries.push(current);
        current = { company: line.replace('Company:', '').trim() };
        return;
      }
      if (!current) return;

      if (line.startsWith('Role:')) {
        current.role = line.replace('Role:', '').trim();
      } else if (line.startsWith('Duration:')) {
        current.duration = line.replace('Duration:', '').trim();
      }
    });

  if (current) entries.push(current);
  if (!entries.length) return '';

  return entries
    .map((entry) => {
      const parts = [entry.company];
      if (entry.role) parts.push(`- ${entry.role}`);
      if (entry.duration) parts.push(`(${entry.duration})`);
      return parts.join(' ');
    })
    .join(' ');
};

const buildProjectSummary = (sectionText) => {
  if (!sectionText) return '';
  const lines = toLines(sectionText);
  if (!lines.length) return '';

  const nameLineIndex = lines.findIndex((line) => /^\d+\./.test(line));
  const nameLine = nameLineIndex >= 0 ? lines[nameLineIndex].replace(/^\d+\.\s*/, '') : lines[0];
  const overviewLine = lines.find((line) => /^Overview:/i.test(line));
  const techLine = lines.find((line) => /^Tech Stack:/i.test(line));
  const outcomeLine = lines.find((line) => /^Outcome:/i.test(line));

  const parts = [nameLine];
  if (overviewLine) parts.push(overviewLine);
  if (techLine) parts.push(techLine.replace(/^Tech Stack:/i, 'Tech:'));
  if (outcomeLine) parts.push(outcomeLine);

  return parts.join(' ');
};

const identitySection = getSection(bioText, 'IDENTITY');
const summarySection = getSection(bioText, 'PROFESSIONAL SUMMARY');
const skillsSection =
  getSection(bioText, 'TECHNICAL SKILLS') || getSection(bioText, 'CORE SKILLS');
const projectsSection = getSection(bioText, 'PROJECTS');
const educationSection = getSection(bioText, 'EDUCATION');
const interestsSection = getSection(bioText, 'INTERESTS & CAREER GOALS');
const experienceSection = getSection(bioText, 'PROFESSIONAL EXPERIENCE');
const certificationsSection = getSection(bioText, 'CERTIFICATIONS & ACHIEVEMENTS');
const leadershipSection = getSection(bioText, 'LEADERSHIP & COMMUNITY');
const softSkillsSection = getSection(bioText, 'SOFT SKILLS');

const summaryText = summarySection ? compressSection(summarySection) : '';
const skillsSummary = skillsSection ? compressSection(skillsSection) : '';
const projectsSummary = buildProjectSummary(projectsSection);
const educationSummary = educationSection ? compressSection(educationSection) : '';
const interestsSummary = interestsSection ? compressSection(interestsSection) : '';
const experienceSummary = buildExperienceSummary(experienceSection);
const certificationsSummary = certificationsSection ? compressSection(certificationsSection) : '';
const leadershipSummary = leadershipSection ? compressSection(leadershipSection) : '';
const softSkillsSummary = softSkillsSection ? compressSection(softSkillsSection) : '';

const contactSummary = (() => {
  const email = getFieldValue(identitySection, 'Email');
  const phone = getFieldValue(identitySection, 'Phone');
  const portfolio = getFieldValue(identitySection, 'Portfolio');
  const linkedin = getFieldValue(identitySection, 'LinkedIn');
  const parts = [];
  if (email) parts.push(`Email: ${email}`);
  if (phone) parts.push(`Phone: ${phone}`);
  if (portfolio) parts.push(`Portfolio: ${portfolio}`);
  if (linkedin) parts.push(`LinkedIn: ${linkedin}`);
  return parts.join(' | ');
})();

function getAssistantReply(message) {
  const normalized = message.toLowerCase();
  const short = (text, fallback = "I don't have that information.") => {
    if (!text) return fallback;
    const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
    return sentences.slice(0, 2).join(' ').trim();
  };

  const categories = [
    {
      id: 'greeting',
      keywords: ['hello', 'hi', 'hey', 'greetings', 'welcome', 'howdy', 'yo'],
      reply: "Hi, I'm Dhivagar. Ask me about my skills, projects, experience, or education."
    },
    {
      id: 'help',
      keywords: ['help', 'commands', 'options', 'what can you do', 'how to use', 'what should i ask', 'guide me'],
      reply: 'You can ask about my skills, projects, experience, education, achievements, contact, or AI work.'
    },
    {
      id: 'thanks',
      keywords: ['thanks', 'thank you', 'thankyou', 'ok', 'okay', 'cool', 'nice', 'great'],
      reply: 'You are welcome. Ask me anything else about my work.'
    },
    {
      id: 'identity',
      keywords: ['who is dhivagar', 'who are you', 'your name', 'tell me about yourself', 'tell me about you', 'who is he', 'who is this', 'dhivagar'],
      reply: "I'm Dhivagar B, a Full Stack Developer and AI Developer from Tamil Nadu. I build web apps, APIs, and AI-powered systems."
    },
    {
      id: 'skills',
      keywords: ['skill', 'stack', 'technology', 'tech', 'expertise', 'languages', 'frameworks', 'database', 'databases', 'coding', 'programming'],
      reply: 'Skills: Java, JavaScript, Python, React.js, FastAPI, Spring Boot, PostgreSQL, Firebase, Docker, and AI integration.'
    },
    {
      id: 'projects',
      keywords: ['project', 'projects', 'career chatbot', 'chatbot', 'built', 'developed', 'applications', 'systems'],
      reply: projectsSummary ? short(projectsSummary) : null
    },
    {
      id: 'experience',
      keywords: ['experience', 'work', 'intern', 'internship', 'company', 'mua', 'skillsync', 'job', 'profession', 'employed', 'history'],
      reply: experienceSummary ? short(experienceSummary) : null
    },
    {
      id: 'education',
      keywords: ['education', 'college', 'study', 'degree', 'school', 'mailam', 'university', 'cgpa', 'academics', 'qualification'],
      reply: educationSummary ? short(educationSummary) : null
    },
    {
      id: 'interests',
      keywords: ['interest', 'interests', 'goal', 'goals', 'passion', 'aim', 'future', 'career goal', 'career goals'],
      reply: 'Interests: Generative AI, RAG chatbots, full-stack system design, and intelligent applications.'
    },
    {
      id: 'contact',
      keywords: ['contact', 'email', 'phone', 'linkedin', 'portfolio', 'reach out', 'call me', 'mobile', 'address'],
      reply: contactSummary ? `Contact: ${contactSummary}` : null
    },
    {
      id: 'certifications',
      keywords: ['certification', 'certifications', 'achievement', 'achievements', 'prize', 'award', 'nptel', 'gold medal', 'paper presentation'],
      reply: certificationsSummary ? short(certificationsSummary) : null
    },
    {
      id: 'leadership',
      keywords: ['leadership', 'community', 'event', 'events', 'coordinator', 'intelinfo', 'manage', 'coordinate'],
      reply: leadershipSummary ? short(leadershipSummary) : null
    },
    {
      id: 'soft_skills',
      keywords: ['soft skill', 'soft skills', 'problem solving', 'communication', 'collaboration', 'adaptability'],
      reply: softSkillsSummary ? `Soft skills: ${softSkillsSummary}` : null
    },
    {
      id: 'ai',
      keywords: ['ai', 'ai experience', 'generative ai', 'llm', 'rag', 'gemini', 'openrouter', 'vector search', 'embeddings', 'chatbot development'],
      reply: 'AI work: Gemini, OpenRouter, RAG architecture, embeddings, vector search, and chatbot systems.'
    },
    {
      id: 'summary',
      keywords: ['summary', 'about yourself', 'overview', 'background', 'profile'],
      reply: summaryText ? short(summaryText) : "I'm Dhivagar B, a Full Stack Developer and AI Developer."
    }
  ];

  let bestCategory = null;
  let maxScore = 0;

  for (const category of categories) {
    if (!category.reply) continue;
    let score = 0;
    for (const keyword of category.keywords) {
      const escaped = escapeRegExp(keyword);
      const pattern = new RegExp('\\b' + escaped + 's?\\b', 'i');
      if (pattern.test(normalized)) {
        score += keyword.includes(' ') ? 3 : 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  if (bestCategory && maxScore > 0) {
    return bestCategory.reply;
  }

  return "I don't have that information, but feel free to ask about my skills, projects, experience, or education!";
}

async function getBackendReply(message) {
  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`Chat API failed with ${response.status}`);
  }

  const data = await response.json();
  if (!data.answer) {
    throw new Error('Chat API returned no answer');
  }

  return data.answer;
}

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(starterMessages);
  const [isReplying, setIsReplying] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isReplying) return;
    
    setMessages(prev => [...prev, { id: `${Date.now()}-user`, role: 'user', text: trimmed }]);
    setInputValue('');
    setIsReplying(true);

    try {
      const answer = await getBackendReply(trimmed);
      setMessages(prev => [...prev, { id: `${Date.now()}-assistant`, role: 'assistant', text: answer }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: `${Date.now()}-assistant`, role: 'assistant', text: getAssistantReply(trimmed) }]);
    } finally {
      setIsReplying(false);
    }
  };

  const handleTabClick = (newTabId) => {
    if (newTabId !== activeTab && !isAnimating) {
      setDirection(newTabId > activeTab ? 1 : -1);
      setActiveTab(newTabId);
    }
  };

  const content = (() => {
    if (activeTab === 0) {
      return (
        <div className="cb-chat-view">
          <div className="cb-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`cb-msg cb-msg--${msg.role}`}>{msg.text}</div>
            ))}
            <div ref={messagesEndRef} style={{ float:"left", clear: "both" }} />
          </div>
          <div className="cb-prompts">
            {quickPrompts.map(p => (
              <button key={p} onClick={() => sendMessage(p)} className="cb-prompt">{p}</button>
            ))}
          </div>
          <form className="cb-composer" onSubmit={(e) => { e.preventDefault(); sendMessage(inputValue); }}>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ask anything..."
              disabled={isReplying}
            />
            <button type="submit" disabled={isReplying}>{isReplying ? '...' : '↑'}</button>
          </form>
        </div>
      );
    } else {
      return (
        <div className="cb-profile-view">
          <div className="cb-profile-grid">
            {profileHighlights.map(item => (
              <div key={item.label} className="cb-profile-card">
                <span className="cb-profile-label">{item.label}</span>
                <span className="cb-profile-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  })();

  const variants = {
    initial: (dir) => ({ x: 100 * dir, opacity: 0, filter: 'blur(4px)' }),
    active: { x: 0, opacity: 1, filter: 'blur(0px)' },
    exit: (dir) => ({ x: -100 * dir, opacity: 0, filter: 'blur(4px)' }),
  };

  return (
    <div className="cb-fixed-wrapper">
      <MotionConfig transition={{ duration: 0.5, type: 'spring', bounce: 0.25 }}>
        <Motion.div
          layout
          className="cb-morph-container"
          style={{ borderRadius: 24 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!isOpen ? (
              <Motion.button
                key="launcher"
                layoutId="cb-morph"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="cb-launcher"
                onClick={() => setIsOpen(true)}
              >
                <div className="cb-launcher-inner">
                  <span className="cb-launcher-icon">+</span>
                </div>
              </Motion.button>
            ) : (
              <Motion.div
                key="panel"
                layoutId="cb-morph"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="cb-panel"
              >
                {/* Header & Tabs */}
                <div className="cb-header">
                  <div className="cb-tabs-container">
                    <div className="cb-tabs">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => handleTabClick(tab.id)}
                          className={`cb-tab ${activeTab === tab.id ? 'cb-tab-active' : ''}`}
                        >
                          {activeTab === tab.id && (
                            <Motion.span
                              layoutId="cb-tab-bubble"
                              className="cb-tab-bubble"
                              transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
                            />
                          )}
                          <span className="cb-tab-label">{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Animated Body */}
                <Motion.div
                  className="cb-body-animator"
                  layout
                  transition={{
                    type: 'spring',
                    bounce: 0.2,
                    duration: 0.8,
                  }}
                >
                  <div className="cb-body-measurer">
                    <AnimatePresence
                      custom={direction}
                      mode="wait"
                      onExitComplete={() => setIsAnimating(false)}
                    >
                      <Motion.div
                        key={activeTab}
                        variants={variants}
                        initial="initial"
                        animate="active"
                        exit="exit"
                        custom={direction}
                        onAnimationStart={() => setIsAnimating(true)}
                        onAnimationComplete={() => setIsAnimating(false)}
                        className="cb-view-wrapper"
                      >
                        {content}
                      </Motion.div>
                    </AnimatePresence>
                  </div>
                </Motion.div>

                {/* Footer with Close Button (positioned exactly where Open Button was) */}
                <div className="cb-footer">
                  <button className="cb-close-btn" onClick={() => setIsOpen(false)}>×</button>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </Motion.div>
      </MotionConfig>
    </div>
  );
}

export default ChatbotWidget;
