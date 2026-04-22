import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import useMeasure from 'react-use-measure';
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
const skillsSection =
  getSection(bioText, 'TECHNICAL SKILLS') || getSection(bioText, 'CORE SKILLS');
const projectsSection = getSection(bioText, 'PROJECTS');
const educationSection = getSection(bioText, 'EDUCATION');
const interestsSection = getSection(bioText, 'INTERESTS & CAREER GOALS');
const experienceSection = getSection(bioText, 'PROFESSIONAL EXPERIENCE');

const skillsSummary = skillsSection ? compressSection(skillsSection) : '';
const projectsSummary = buildProjectSummary(projectsSection);
const educationSummary = educationSection ? compressSection(educationSection) : '';
const interestsSummary = interestsSection ? compressSection(interestsSection) : '';
const experienceSummary = buildExperienceSummary(experienceSection);

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
  if (/(skill|stack|technology|tech|expertise)/.test(normalized)) {
    return skillsSummary ? `From the bio: ${skillsSummary}` : "I don't have that information.";
  }
  if (/(project|career chatbot|chatbot)/.test(normalized)) {
    return projectsSummary ? `From the bio: ${projectsSummary}` : "I don't have that information.";
  }
  if (/(work|experience|intern|company|mua|skillsync)/.test(normalized)) {
    if (experienceSummary) {
      return `From the bio: ${experienceSummary}`;
    }
    return "I don't have that information.";
  }
  if (/(education|college|study|degree|school)/.test(normalized)) {
    return educationSummary ? `From the bio: ${educationSummary}` : "I don't have that information.";
  }
  if (/(interest|goal|passion|aim|future)/.test(normalized)) {
    return interestsSummary ? `From the bio: ${interestsSummary}` : "I don't have that information.";
  }
  if (/(contact|email|phone|linkedin|portfolio)/.test(normalized)) {
    return contactSummary ? `From the bio: ${contactSummary}` : "I don't have that information.";
  }
  return "I don't have that information.";
}

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [ref, bounds] = useMeasure();
  
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(starterMessages);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const replyTimeoutRef = useRef(null);

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

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    
    setMessages(prev => [...prev, { id: `${Date.now()}-user`, role: 'user', text: trimmed }]);
    setInputValue('');
    
    if (replyTimeoutRef.current) window.clearTimeout(replyTimeoutRef.current);
    replyTimeoutRef.current = window.setTimeout(() => {
      setMessages(prev => [...prev, { id: `${Date.now()}-assistant`, role: 'assistant', text: getAssistantReply(trimmed) }]);
    }, 400);
  };

  const handleTabClick = (newTabId) => {
    if (newTabId !== activeTab && !isAnimating) {
      setDirection(newTabId > activeTab ? 1 : -1);
      setActiveTab(newTabId);
    }
  };

  const content = useMemo(() => {
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
            />
            <button type="submit">↑</button>
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
  }, [activeTab, messages, inputValue]);

  const variants = {
    initial: (dir) => ({ x: 100 * dir, opacity: 0, filter: 'blur(4px)' }),
    active: { x: 0, opacity: 1, filter: 'blur(0px)' },
    exit: (dir) => ({ x: -100 * dir, opacity: 0, filter: 'blur(4px)' }),
  };

  return (
    <div className="cb-fixed-wrapper">
      <MotionConfig transition={{ duration: 0.5, type: 'spring', bounce: 0.25 }}>
        <motion.div
          layout
          className="cb-morph-container"
          style={{ borderRadius: 24 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!isOpen ? (
              <motion.button
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
              </motion.button>
            ) : (
              <motion.div
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
                            <motion.span
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
                <motion.div
                  className="cb-body-animator"
                  animate={{ height: bounds.height > 0 ? bounds.height : 'auto' }}
                >
                  <div ref={ref} className="cb-body-measurer">
                    <AnimatePresence
                      custom={direction}
                      mode="popLayout"
                      onExitComplete={() => setIsAnimating(false)}
                    >
                      <motion.div
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
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Footer with Close Button (positioned exactly where Open Button was) */}
                <div className="cb-footer">
                  <button className="cb-close-btn" onClick={() => setIsOpen(false)}>×</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </MotionConfig>
    </div>
  );
}

export default ChatbotWidget;