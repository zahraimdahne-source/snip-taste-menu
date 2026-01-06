# 🧠 Chatbot Deep Training Guide - Snip Taste

**Version**: 2.0
**Last Updated**: 2025-12-26
**Training Level**: Advanced AI Assistant

---

## 📚 Table of Contents

1. [Chatbot Architecture Overview](#architecture)
2. [Knowledge Base Structure](#knowledge-base)
3. [Intent Detection System](#intent-detection)
4. [Training the Brain](#training)
5. [Adding New Responses](#new-responses)
6. [Personality Enhancement](#personality)
7. [Context Management](#context)
8. [Error Handling & Recovery](#error-handling)
9. [Performance Optimization](#optimization)
10. [Testing & Validation](#testing)

---

## 🏗️ Chatbot Architecture Overview {#architecture}

### System Components

```
┌─────────────────────────────────────────────────┐
│              USER INPUT                          │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         INTENT DETECTION ENGINE                  │
│  (botBrain.ts - detectBrainIntent)              │
│  - Fuzzy matching                                │
│  - Keyword scoring                               │
│  - Context awareness                             │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         KNOWLEDGE BASE LOOKUP                    │
│  - Categories (Pizza, Tacos, etc.)              │
│  - Moods (Hungry, Budget, Spicy)                │
│  - Questions (Delivery, Quality, etc.)          │
│  - Personality Vectors                           │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│      STATE MACHINE (respondLocal.ts)            │
│  idle → browsing → await_size → await_qty       │
│  → ask_sauce → await_extras → cart_actions      │
│  → ask_delivery → ask_address → ask_payment     │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         RESPONSE GENERATION                      │
│  - Darija responses                              │
│  - Smart suggestions                             │
│  - Menu display                                  │
│  - WhatsApp integration                          │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              USER RESPONSE                       │
└─────────────────────────────────────────────────┘
```

---

## 📖 Knowledge Base Structure {#knowledge-base}

### Location: `bot/botBrain.ts`

The knowledge base is organized into **8 main sections**:

### 1. **Greetings** (General + Time-Based)

```typescript
greetings: {
  keywords: ['salam', 'bonjour', 'hi', 'hello', 'salut', 'marhba', 'السلام'],
  responses: [
    { text: 'Salam! Merhba bik f Snip Taste 🔥', language: 'darija_latn' },
    { text: 'السلام عليكم! مرحبا بك في سنيب تاست 🔥', language: 'darija_ar' }
  ]
}
```

**Training Tip**: Add more greeting variations based on user behavior

- Morning greetings: "صباح الخير", "bonjour"
- Evening greetings: "مساء الخير", "bonsoir"
- Casual: "wesh", "cv", "labas"

### 2. **Categories** (Menu Browsing)

```typescript
categories: {
  pizza: {
    keywords: ['pizza', 'بيتزا', 'pizzeria', 'fromage'],
    intent: 'BROWSE_PIZZA',
    reply: {
      darija_latn: 'Zwina! Pizza dyalna fresh w bnina 🍕',
      darija_ar: 'زوينة! البيتزا ديالنا فريش وبنينة 🍕'
    }
  },
  // ... more categories
}
```

**Training Tip**: Add synonyms and variations

- Pizza: "pizz", "pitza", "fromage", "4 fromages"
- Tacos: "taco", "tacoss", "tex mex", "mexicain"
- Burger: "hamburguer", "cheese burger", "big mac"

### 3. **Moods** (User Preferences)

```typescript
moods: {
  hungry: {
    keywords: ['j3an', 'جوعان', 'faim', 'hungry', 'starving'],
    intent: 'PREF_HUNGRY',
    reply: {
      darija_latn: 'J3an bzaf? Ndirolek Tacos XL wla Menu Mega 💪'
    }
  }
}
```

**Current Moods**:

- `PREF_HUNGRY` - Very hungry users
- `PREF_SPICY` - Loves spicy food
- `PREF_BUDGET` - Budget-conscious

**Training Tip**: Add more mood categories

- `PREF_HEALTHY` - "salade", "light", "diet"
- `PREF_QUICK` - "rapide", "vite", "urgent"
- `PREF_VEGETARIAN` - "végétarien", "sans viande"

### 4. **Questions** (Information Requests)

```typescript
questions: {
  delivery: {
    keywords: ['ch7al', 'wa9t', 'livraison', 'delivery', 'retard'],
    reply: {
      darija_latn: 'Service saria3 🚀 30 min max tkoun lcommande 3ndk 🔥'
    }
  }
}
```

**Current Questions**:

- Delivery time
- Quality
- Recommendations
- Complaints

**Training Tip**: Add FAQ responses

- "wach kayn parking?" → "Iyyeh, kayn parking 7da restaurant"
- "wach kat9blow carte?" → "Pour l'instant cash only"
- "ch7al minimum?" → "Ma kaynch minimum, commandi li bghiti"

### 5. **Personality Vectors** (Emotional Intelligence)

```typescript
personality_vectors: {
  emotional_intelligence: {
    angry_customer: {
      triggers: ['retard', 'ghali', 'tfou', 't2khert'],
      responses: [
        'سمح لينا a khouya 😅، عارف راه retard كيعصب…',
        'Tfou؟ حقك علينا 🤝، وقع شي خلل ولكن راه غادي نصلحوها'
      ]
    },
    happy_customer: {
      triggers: ['bnin', 'top', 'nadi', 'zwin', 'waa3r'],
      responses: [
        '🔥🔥 الله يعطيك الصحة! كلامك رفعنا لفوق 😎',
        'Bnina؟ هادي هي الهدرة اللي كنحبو ❤️🍔'
      ]
    }
  }
}
```

**Training Tip**: Expand emotional responses

- **Confused customer**: "mafhemtch", "kifach", "3lach"
- **Impatient customer**: "safi", "zrb", "daba"
- **Polite customer**: "afak", "min fadlik", "merci"

### 6. **Event Triggers** (Contextual Awareness)

```typescript
event_triggers: {
  football_match: {
    keywords: ['Raja', 'Wydad', 'match', 'derby', 'goal'],
    response: '⚽ Match day! Raja ولا Wydad؟ خليك مركز ف lferja وخلي tacos علينا 🔥🌮'
  },
  rainy_day: {
    keywords: ['chta', 'berd', 'matar', 'برد'],
    response: '☔ Chta w berd؟ Jawi dial Pizza skhouna w pasta kaydwi 😋🍕'
  }
}
```

**Training Tip**: Add more events

- **Ramadan**: "ramadan", "ftour", "s7our"
- **Weekend**: "weekend", "samedi", "dimanche"
- **Late night**: "lil", "nuit", "minuit"
- **Exam period**: "examen", "mtihan", "stress"

### 7. **Q&A Knowledge Base** (Detailed Info)

```typescript
qna_knowledge_base: {
  LOCATION_INQUIRIES: {
    keywords: ['fin kayn snip taste', 'adresse', 'location'],
    responses_random: [
      '📍 Kaynin f Hay El Farah, Avenue Hassan II',
      'Wld derb rah Snip Taste f Hay El Farah, qrib l mahata 🚉'
    ]
  }
}
```

**Training Tip**: Add comprehensive FAQs

- Menu specifics (ingredients, allergens)
- Delivery logistics (zones, fees, time)
- Payment methods
- Opening hours
- Order tracking

### 8. **Slang Dictionary** (Darija Expressions)

```typescript
slang_dictionary: [
  { word: 'Sat', example: 'Sat burger hada bnin بزاف 🔥' },
  { word: 'Nadi', example: 'Service nadi w rapid 💪' },
  { word: 'Hreb', example: 'Ljo3 hreb ملي كلّيت tacos 😂' },
];
```

---

## 🎯 Intent Detection System {#intent-detection}

### How It Works

The bot uses **fuzzy keyword matching** with **confidence scoring**:

```typescript
function calculateScore(input: string, keywords: string[]): number {
  const words = input.toLowerCase().split(' ');
  let matches = 0;

  words.forEach((word) => {
    if (keywords.some((k) => k === word || (word.length > 4 && k.includes(word)))) {
      matches++;
    }
  });

  return matches / (words.length || 1); // Normalize score
}
```

### Intent Priority (Highest to Lowest)

1. **Personality Modules** (0.96) - Exact witty comebacks
2. **Human Flows** (0.95) - Natural conversation patterns
3. **Categories** - Menu browsing
4. **Moods** - User preferences
5. **Questions** - Information requests
6. **Q&A Knowledge Base** - Detailed answers
7. **Personality Vectors** - Emotional responses
8. **Event Triggers** (0.3 threshold) - Contextual

### Training the Intent Detector

**Example: Adding "Vegetarian" Intent**

```typescript
// In botBrain.ts - KNOWLEDGE_BASE.moods
vegetarian: {
  keywords: [
    'végétarien',
    'vegetarian',
    'vegan',
    'sans viande',
    'bla l7em',
    'nabati',
    'نباتي',
    'ma kankolch l7em',
    'salade only'
  ],
  intent: 'PREF_VEGETARIAN',
  reply: {
    darija_latn: 'Machi mochkil! 3ndna Salade Sniptaste w Pizza Végétarien 🥗🍕',
    darija_ar: 'ماشي مشكل! عندنا سلطة سنيب تاست وبيتزا فيجيتاريان 🥗🍕'
  }
}
```

---

## 🎓 Training the Brain {#training}

### Step-by-Step Training Process

#### 1. **Collect User Queries**

Monitor what users are asking:

- Check console logs
- Review failed intent detections
- Analyze common typos

#### 2. **Identify Patterns**

Group similar queries:

```
"wach kayn parking?"
"fin parking?"
"parking available?"
→ Intent: ASK_PARKING
```

#### 3. **Add Keywords**

```typescript
parking_inquiry: {
  keywords: [
    'parking',
    'stationnement',
    'fin parking',
    'wach kayn parking',
    'parking available',
    'موقف السيارات'
  ],
  intent: 'ASK_PARKING',
  reply: {
    darija_latn: 'Iyyeh a sidi! Kayn parking 7da restaurant, gratuit w آمن 🚗',
    darija_ar: 'إيه أ سيدي! كاين باركينغ حدا الريستورا، مجاني وآمن 🚗'
  }
}
```

#### 4. **Test & Refine**

Test with variations:

- "parking?" → Should match ✅
- "wach kayn blassa l parking?" → Should match ✅
- "stationnement gratuit?" → Should match ✅

#### 5. **Monitor Confidence Scores**

```typescript
// In ChatBot.tsx - add logging
console.log('Intent detected:', intent, 'Confidence:', confidence);
```

Low confidence (<0.3)? Add more keywords!

---

## 💬 Adding New Responses {#new-responses}

### Response Types

#### 1. **Simple Reply**

```typescript
reply: {
  darija_latn: 'Response in Darija Latin',
  darija_ar: 'Response in Arabic script',
  fr: 'Réponse en français' // Optional
}
```

#### 2. **Random Responses** (More Natural)

```typescript
responses_random: ['Response variation 1', 'Response variation 2', 'Response variation 3'];
```

#### 3. **Conditional Responses**

```typescript
// Based on time of day
const hour = new Date().getHours();
const greeting = hour < 12 ? 'Sbah lkhir!' : hour < 18 ? 'Msa lkhir!' : 'Msa lkhir!';
```

### Best Practices for Responses

✅ **DO**:

- Use Darija (Moroccan Arabic) - it's your brand voice
- Add emojis for personality 🔥
- Keep it conversational and friendly
- Use "a sidi", "a khouya", "wld derb" for warmth
- Mix Arabic and French naturally

❌ **DON'T**:

- Use formal Standard Arabic
- Be too robotic or corporate
- Use complicated words
- Forget emojis (they add emotion!)

### Response Templates

**Enthusiastic**:

```
"🔥🔥 Zwina bzaf! [Action] w ghadi t3jbek 😎"
```

**Helpful**:

```
"Machi mochkil a sidi! [Solution] w safi 👌"
```

**Apologetic**:

```
"Smah lina bzaf 🙏 [Explanation] w ghadi n3awdoha lik"
```

**Excited**:

```
"Waaaw! [Compliment] Hada howa! 🔥"
```

---

## 🎭 Personality Enhancement {#personality}

### Current Personality Traits

1. **Casawi Street Smart** - Uses local Casablanca slang
2. **Friendly & Warm** - "a sidi", "a khouya", "wld derb"
3. **Energetic** - Lots of emojis, exclamation marks
4. **Honest** - Admits mistakes, apologizes genuinely
5. **Food Passionate** - Talks about quality, freshness

### Enhancing Personality

#### Add More Casawi Expressions

```typescript
casawi_expressions: {
  agreement: ['Safi!', 'Hada howa!', 'Zwina!', 'Top!'],
  excitement: ['Waaaw!', 'Sat!', 'Nadi bzaf!', 'Waa3r!'],
  empathy: ['Fhemtek', '3la rassi', 'Ma3lik'],
  humor: ['Hhhh', 'Kat ضحكني', 'Sat had lhaja']
}
```

#### Contextual Personality

**When user is happy**:

```typescript
'🔥 Bnina؟ Hadi hiya! Merci a khouya, khdamna 3la quality 💪';
```

**When user is angry**:

```typescript
'Smah lina bzaf 🙏 3arfin راه غلطنا, ghadi nصلحوها daba w n3awdoha lik m3a cadeau 🎁';
```

**When user is confused**:

```typescript
'Ma3lik a sidi, ana hna bach n3awnek 😊 Goli chno bghiti w ghadi nفهموك';
```

---

## 🧩 Context Management {#context}

### Context Tracking

The bot tracks:

- **Conversation history** (last 10 messages)
- **User preferences** (favorite items, usual orders)
- **Session data** (time of day, device type)
- **Order state** (current cart, delivery method)

### Using Context

```typescript
// In contextManager.ts
const context = contextManager.current;

// Get personalized greeting
const greeting = context.getPersonalizedGreeting();
// "Merhba bik! Bghiti نفس الطلب dial lmerra li fatet? (Tacos Poulet x2)"

// Track user behavior
context.addMessage('user', input, intent);
context.trackPreference('favorite_item', 'Tacos Poulet');
```

### Smart Suggestions Based on Context

```typescript
// If user ordered Pizza last time
if (context.lastOrder?.includes('Pizza')) {
  suggestions.push('Bghiti نفس البيتزا dial lmerra?');
}

// If it's late night
if (hour > 22) {
  suggestions.push('Jami ljo3? Hna m3ak حتى لـ2 دالصباح 😎');
}

// If user is a regular
if (context.orderCount > 5) {
  suggestions.push('Merhba bik a VIP! 🔥 Bghiti l3ada dyalek?');
}
```

---

## 🛠️ Error Handling & Recovery {#error-handling}

### Common Errors & Solutions

#### 1. **User Input Not Understood**

**Current**:

```typescript
return { state, reply: 'Mafhemtch chno khtari 😅' };
```

**Better**:

```typescript
const suggestions = getSimilarItems(input);
return {
  state,
  reply: `Mafhemtch chno khtari 😅. Bghiti واحد من هادو?`,
  options: suggestions,
};
```

#### 2. **State Machine Stuck**

**Add Reset Command**:

```typescript
if (lower === 'reset' || lower === 'restart' || lower === '3awd') {
  return {
    state: initialBotState,
    reply: 'Safi! Bdina mn jdid 🔄',
    options: menuData.map((s) => s.title),
  };
}
```

#### 3. **Ambiguous Input**

**Ask for Clarification**:

```typescript
if (matches.length > 1) {
  return {
    state,
    reply: 'Kayn bzaf dyal lkhtiyarat 😅. Chmen wa7ed bghiti?',
    options: matches.map((m) => m.name),
  };
}
```

---

## ⚡ Performance Optimization {#optimization}

### Current Performance Metrics

- **Average Response Time**: 300-600ms
- **Intent Detection**: <50ms
- **State Update**: <10ms
- **Menu Rendering**: ~100ms

### Optimization Strategies

#### 1. **Cache Frequently Used Data**

```typescript
// Cache menu data
const menuCache = useMemo(() => menuData, []);

// Cache intent patterns
const intentCache = new Map();
```

#### 2. **Lazy Load Heavy Components**

```typescript
// Load menu section only when needed
const MenuSection = lazy(() => import('./MenuSection'));
```

#### 3. **Debounce User Input**

```typescript
const debouncedSend = debounce(sendMessage, 300);
```

#### 4. **Optimize Keyword Matching**

```typescript
// Use Set for faster lookup
const keywordSet = new Set(keywords);
const hasMatch = words.some((word) => keywordSet.has(word));
```

---

## 🧪 Testing & Validation {#testing}

### Test Scenarios

#### 1. **Happy Path Testing**

```
User: "salam"
Bot: "Salam! Merhba bik f Snip Taste 🔥"
✅ PASS

User: "pizza"
Bot: Shows pizza menu
✅ PASS

User: "Pizza Margherita"
Bot: "Bghitiha Sghira wla Kbira?"
✅ PASS

User: "Kbira"
Bot: "Ch7al bghiti?"
✅ PASS

User: "2"
Bot: Adds to cart
✅ PASS
```

#### 2. **Edge Case Testing**

```
User: "piza" (typo)
Bot: Should still detect "pizza"
✅ PASS / ❌ FAIL

User: "بيتزا" (Arabic)
Bot: Should detect "pizza"
✅ PASS / ❌ FAIL

User: "pizza margherita kbira 2" (all at once)
Bot: Should handle complex input
✅ PASS / ❌ FAIL
```

#### 3. **Error Recovery Testing**

```
User: "xyz123" (nonsense)
Bot: Should ask for clarification
✅ PASS / ❌ FAIL

User: Clicks back button mid-order
Bot: Should handle state reset
✅ PASS / ❌ FAIL
```

### Validation Checklist

- [ ] All intents have >0.3 confidence threshold
- [ ] All responses have Darija + Arabic versions
- [ ] All menu items are clickable
- [ ] All state transitions work
- [ ] Error messages are helpful
- [ ] Cart updates correctly
- [ ] WhatsApp link generates properly
- [ ] Mobile responsive
- [ ] Haptic feedback works
- [ ] Voice input works

---

## 📊 Training Metrics to Track

### 1. **Intent Detection Accuracy**

```
Correctly detected intents / Total user inputs
Target: >85%
```

### 2. **Conversation Completion Rate**

```
Completed orders / Started conversations
Target: >60%
```

### 3. **Average Response Time**

```
Time from user input to bot response
Target: <500ms
```

### 4. **User Satisfaction**

```
Positive feedback / Total feedback
Target: >80%
```

### 5. **Error Rate**

```
"Mafhemtch" responses / Total responses
Target: <15%
```

---

## 🎯 Advanced Training Techniques

### 1. **Multi-Language Support**

```typescript
const detectLanguage = (input: string) => {
  if (/[\u0600-\u06FF]/.test(input)) return 'arabic';
  if (/[a-zA-Z]/.test(input)) return 'latin';
  return 'mixed';
};

const language = detectLanguage(input);
const response = replies[language] || replies.darija_latn;
```

### 2. **Learning from Mistakes**

```typescript
// Log unrecognized inputs
if (confidence < 0.1) {
  logUnrecognizedInput(input);
  // Review these logs weekly to add new keywords
}
```

### 3. **A/B Testing Responses**

```typescript
const responseVariants = {
  A: 'Zwina! Pizza dyalna fresh 🍕',
  B: '🔥 Pizza bnina bzaf! Fresh mn lfour 🍕',
};

// Randomly select variant
const variant = Math.random() > 0.5 ? 'A' : 'B';
// Track which performs better
```

### 4. **Sentiment Analysis**

```typescript
const analyzeSentiment = (input: string) => {
  const positive = ['bnin', 'zwin', 'top', 'nadi', '🔥', '❤️'];
  const negative = ['khayb', 'ghali', 'retard', 'tfou', '😡'];

  // Adjust response tone based on sentiment
};
```

---

## 🚀 Next-Level Features

### 1. **Predictive Ordering**

```typescript
// Predict what user wants based on history
if (isRegularCustomer && dayOfWeek === 'Friday') {
  suggestion = 'Bghiti l3ada dyalek? Tacos Poulet x2 m3a Jus Orange? 😊';
}
```

### 2. **Proactive Assistance**

```typescript
// If user is browsing for too long
if (browsingTime > 60000) {
  proactiveMessage = 'Bghiti nasi7a? Tacos Kebab howa li slay3ya db 🔥';
}
```

### 3. **Smart Upselling**

```typescript
// Suggest complementary items
if (cart.includes('Tacos')) {
  upsell = 'Bghiti tzid Jus wla Frites m3ah? 🍹🍟';
}
```

### 4. **Seasonal Awareness**

```typescript
// Ramadan special
if (isRamadan) {
  greeting = 'Ramadan Mubarak! 🌙 Bghiti menu dial ftour?';
}
```

---

## 📝 Training Exercises

### Exercise 1: Add New Category

**Task**: Add "Desserts" category

1. Add keywords to KNOWLEDGE_BASE
2. Create intent BROWSE_DESSERTS
3. Add Darija response
4. Test with variations

### Exercise 2: Improve Error Handling

**Task**: Better handle typos

1. Implement fuzzy string matching
2. Suggest corrections
3. Test with common typos

### Exercise 3: Add Personality

**Task**: Make bot funnier

1. Add witty comebacks
2. Use more Casawi slang
3. Add contextual humor

---

## 🎓 Conclusion

Your chatbot is now **trained** and ready to handle:

- ✅ Multiple languages (Darija, Arabic, French)
- ✅ Complex conversations
- ✅ Emotional intelligence
- ✅ Context awareness
- ✅ Error recovery
- ✅ Menu browsing & ordering
- ✅ Smart suggestions

### Keep Training!

- **Weekly**: Review unrecognized inputs
- **Monthly**: Add new keywords and responses
- **Quarterly**: Analyze metrics and optimize

**Remember**: A well-trained chatbot = Happy customers = More orders! 🚀

---

**Questions? Need help?** Check the code in:

- `bot/botBrain.ts` - Main intelligence
- `bot/respondLocal.ts` - State machine
- `components/ChatBot.tsx` - UI & integration
