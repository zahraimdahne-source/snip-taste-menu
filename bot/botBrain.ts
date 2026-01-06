import { menuData } from '../data';
import { initialBotState, BotState, BotPhase, handleUserMessage } from './respondLocal';

/**
 * ------------------------------------------------------------------
 * 🧠 SNIP TASTE BOT BRAIN (DEEP LEARNING MODULE)
 * ------------------------------------------------------------------
 * This module enables "Deep Learning" style interactions in Darija.
 * It uses fuzzy matching, intent classification, and cultural nuance.
 */

// --- TYPES ---

type Language = 'darija_latn' | 'darija_ar' | 'fr' | 'en';

interface IntentScore {
  intent: string;
  score: number; // 0 to 1
  matchedKeywords: string[];
}

interface UserProfile {
  name?: string;
  preferences: {
    spicy: boolean;
    healthy: boolean;
    budget: boolean;
    gourmand: boolean;
  };
  lastIntent?: string;
  favoriteItems: string[];
}

// --- KNOWLEDGE BASE (THE "BRAIN" DATA) ---

const KNOWLEDGE_BASE = {
  // 1. GREETINGS & OPENERS
  greetings: {
    keywords: [
      'salam',
      'salut',
      'hello',
      'hi',
      'bonjour',
      'ahlan',
      'marhba',
      'coucou',
      'yo',
      'sbah lkhir',
      'sba7 lkhir',
      'mes lkhir',
      'bonsoir',
      'sbah',
      'leyl',
    ],
    responses: [
      {
        lang: 'darija_latn',
        text: 'Mar7ba bik f Snip Taste! 🔥 Shnu nwajjed lik lyoum? (Burger 🍔, Tacos 🌮, Pizza 🍕?)',
      },
      {
        lang: 'darija_ar',
        text: 'مرحبا بيك ف Snip Taste! 🔥 شنو نوجد ليك اليوم؟ (برغر 🍔، طاكوس 🌮، بيتزا 🍕؟)',
      },
    ],
  },

  // New specific greeting intents (handled by specialized logic if needed, or broad keywords)
  greeting_morning: {
    keywords: [
      'sbah lkhir',
      'sba7 lkhir',
      'sbah',
      'sba7',
      'bonjour',
      'bonjr',
      'morning',
      'good morning',
      'صباح الخير',
      'صباح',
      'سلام الصباح',
      'hey sbah',
      'cc sbah',
      'hello sbah',
      'sba7 nour',
      'sbah nour',
      'sba7noor',
      'wakha sbah',
      'yo sbah',
      'salam sbah',
      'wach kayn sbah',
      'coucou sbah',
      'salut matin',
      'matin',
      'ftour',
      'fin lftour',
      'breakfast',
      'petit dej',
      'pt dej',
      'dej',
      'dj',
      'sbah zwin',
      'sba7 mzyan',
      'صباح النور',
      'sabah',
      'sabah lkhir',
      'sabah nour',
    ],
    reply: {
      darija_latn: 'Sbah lkhir w rba7! ☀️ Wach fay9 j3an ola mazal? Snip Taste dayman m3ak 😎',
      darija_ar: 'صباح الخير والرباح! ☀️ واش فايق جعان ولا مازال؟ سنيب تاست ديما معاك 😎',
    },
  },
  greeting_night: {
    keywords: [
      'msa lkhir',
      'msa',
      'masa',
      'bonsoir',
      'soir',
      'leyl',
      'lil',
      'night',
      'good evening',
      'مساء الخير',
      'مساء',
      'ليل',
      'سلام دالليل',
      'hey soir',
      'cc soir',
      'salam leyl',
      'wach msa',
      'msa nour',
      'masa nour',
      'soirée',
      'late night',
      '3cha',
      'l3cha',
      'dinner',
      'diner',
      'fin l3cha',
      '3cha bssa7',
      'soir zwin',
      'msa mzyan',
      'bonsoir chef',
      'yo msa',
      'salam soir',
      'ليل زوين',
      'مساء النور',
      'night vibes',
      'snack night',
    ],
    reply: {
      darija_latn: 'Msa nour 🌙 Jiti f wa9t l3cha dyal bssa7! Chno ghadi y7rek lik lma3da? 🍔🔥',
      darija_ar: 'مساء النور 🌙 جيتي ف وقت العشاء ديال بصح! شنو غادي يحرك ليك المعدة؟ 🍔🔥',
    },
  },

  // 2. FOOD CATEGORIES (INTENT: BROWSE_CATEGORY)
  categories: {
    burger: {
      keywords: ['burger', 'humberger', 'sandwich', 'cheese', 'big mac', 'whopper', 'burgers'],
      reply: {
        darija_latn:
          '3ndna a7san Burgers! 🍔 Jarrab **Snip Burger** (Double Steak + Fromage). Ndir lik wa7d?',
        darija_ar: 'عندنا أحسن برغر! 🍔 جرب **سنيب برغر** (دوبل ستيك + فرماج). ندير ليك واحد؟',
      },
    },
    pizza: {
      keywords: ['pizza', 'piza', 'peperoni', 'margherita', '4 fromages', 'pizzas'],
      reply: {
        darija_latn:
          'Pizza dyalna katjib la3ez! 🍕 Sakhna w m3mmra fromage. Bghiti Sghira wla Kbira?',
        darija_ar: 'البيتزا ديالنا كاتجي لديدة! 🍕 سخونة ومعمرة فرماج. بغيتي صغيرة ولا كبيرة؟',
      },
    },
    tacos: {
      keywords: ['tacos', 'takos', 'takouss', 'tacosse', 'mixte', 'taco', 'takoss'],
      reply: {
        darija_latn: 'Tacos howa l3ch9! 🌮 Kayn Tacos XL 3amer bzaf. Bghiti nwerik les sauces?',
        darija_ar: 'الطاكوس هو العشق! 🌮 كاين طاكوس XL عامر بزاف. بغيتي نوريك لي صوص؟',
      },
    },
    pasta: {
      keywords: ['pates', 'pasta', 'spaghetti', 'ma9aronya', 'pate', 'bolognaise'],
      reply: {
        darija_latn: 'Les Pates dyalna "Al Dente" 🍝 sauce blanche wla rouge?',
        darija_ar: 'لي باط ديالنا "Al Dente" 🍝 صوص بيضا ولا حمرا؟',
      },
    },
  },

  // 3. TASTE PROFILING (INTENT: TASTE_X)
  moods: {
    spicy: {
      keywords: [
        'l7ar',
        'har',
        '7ar',
        'harr',
        'piquant',
        'piquante',
        'spicy',
        'extra har',
        'l7ar bzaf',
        'bghit l7ar',
        '7arra',
        'flfla',
        'felfla',
        'piment',
        'chili',
        'hot sauce',
        'samurai',
        'algerienne',
        'algérienne',
        'andalouse',
        'soudania',
        'harrr',
        'hrra',
        '🔥',
        '🌶️',
        'حار',
        'الحر',
        'فلفلة',
        'بيكانت',
        'صوص حار',
        'bghit hrra',
        'kat7ma9',
        'kat7raq',
        'heat',
        'spicy lover',
        'add sauce',
        'supp piquant',
      ],
      intent: 'PREF_SPICY',
      reply: {
        darija_latn: 'Aaaaah nta mn nas dyal l7ar 🌶️🔥 Tacos Sauce Algérienne ghadi y3jbk! Nzidoh?',
        darija_ar: 'آاااه نتا من الناس ديال الحار 🌶️🔥 طاكوس صوص ألجييرين غادي يعجبك! نزيدوه؟',
      },
    },
    healthy: {
      keywords: [
        'regime',
        'rgim',
        'diet',
        'light',
        'bla zit',
        'salade',
        'healthy',
        'vegetarien',
        'vege',
        'vegan',
      ],
      intent: 'PREF_HEALTHY',
      reply: {
        darija_latn:
          'Mhtam b santé? 💪 Jarrab **Salade César** (Djadl grillé + Khos). Bnina w khfifa!',
        darija_ar: 'مهتم بالصحة؟ 💪 جرب **سلادة سيزار** (دجاج مشوي + خص). بنينة وخفيفة!',
      },
    },
    hungry: {
      keywords: [
        'j3an',
        'j3t',
        'bjo3',
        'bjoo3',
        'mta',
        'ghadi nmout',
        'nmout bjo3',
        'faim',
        'faim de loup',
        'trop faim',
        'mort de faim',
        'klit walo',
        'maklitch',
        'walou makla',
        'm3a9ed',
        'm9ros',
        '3ssabi',
        'ghadban',
        'bghit nakol daba',
        'daba daba',
        'zrba',
        'mzrreb',
        'mch7un',
        'جوعان',
        'جعت',
        'غادي نموت',
        'ماكلّيت والو',
        'مقلق',
        'معصب',
        'فين الماكلة',
        'bghit makla',
        'hungry af',
        'starving',
        'makanch sber',
        'la patience',
        'zero patience',
        'hangry',
        'fiya jo3',
        'jo3',
        'hungry',
      ],
      intent: 'PREF_HUNGRY',
      reply: {
        darija_latn:
          'Hdaaaa chef 😤🧘‍♂️ Snip Taste ghadi y3tik lhadra! Menu Mega XL kayjib skhoun 🔥 Nwjdo lik?',
        darija_ar:
          'هدااا شاف 😤🧘‍♂️ سنيب تاست غادي يعتيك الهضرة! منيو ميݣا XL كايجب سخون 🔥 نوجدو ليك؟',
      },
    },
    budget: {
      keywords: [
        'walou flous',
        'flous 9lal',
        'flouss',
        'mfless',
        'fin du mois',
        'fin d mois',
        'etudiant',
        'student',
        'rkhis',
        'pas cher',
        'cheap',
        'promo',
        'promotion',
        'offre',
        'reduction',
        'budget',
        'petit budget',
        'ma3ndich',
        'makaynch',
        'l3a9a 9lila',
        'ma fiya',
        'khassni rkhis',
        'اقتصادي',
        'رخيص',
        'ما عنديش فلوس',
        'طالب',
        'fin l3a9a',
        '3la 9di',
        'promo etudiant',
        'menu rkhis',
        'sandwich rkhis',
        'taman 9lil',
        'saving',
        'economique',
        'deal',
        'bon plan',
        'rkhis',
      ],
      intent: 'PREF_BUDGET',
      reply: {
        darija_latn:
          'Machi mochkil a chef 🤝 Snip Taste kayfhem! Sandwich Kefta 20DH w bninn 😋. Ndirouh?',
        darija_ar: 'ماشي مشكل أ شاف 🤝 سنيب تاست كيفهم! ساندويش كفتة 20 درهم وبنين 😋. نديروه؟',
      },
    },
  },

  // 4. QUESTIONS (INTENT: INFO)
  questions: {
    delivery: {
      keywords: [
        'ch7al',
        'fo9ach',
        'f wach wa9t',
        'wa9t',
        'lwa9t',
        'ch7al dyal lwa9t',
        'retard',
        'late',
        'twal',
        'zrba',
        'zrbane',
        'mzrreb',
        'speed',
        'rapid',
        'livraison',
        'delivery',
        'deli',
        'kayn delay',
        'wach t3ttel',
        'fin lcommande',
        'fin talabi',
        'فين وصل',
        'واش تعطل',
        'وقت التوصيل',
        'minutes',
        'd9ay9',
        '30 min',
        '45 min',
        'fast',
        'vite',
        'urgent',
        'quick',
        'snip delivery',
        'service rapide',
        'express',
      ],
      reply: {
        darija_latn: 'Service saria3 🚀 30 min max tkoun lcommande 3ndk 🔥. Fin sakn?',
        darija_ar: 'سيرفيس سريع 🚀 30 دقيقة ماكس تكون الكوموند عندك 🔥. فين ساكن؟',
      },
    },
    quality: {
      keywords: ['bnin', 'zwin', 'top', 'nadi', 'fresh', 'tari', 'jdid', 'quality', 'calidad'],
      reply: {
        darija_latn:
          'Sowl li mjarreb! Lmakla dyalna **Nadi** 💯. Kolchi frais (Djad, La7m) d lyoum.',
        darija_ar: 'سول لي مجرب! الماكلة ديالنا **نادي** 💯. كلشي فريش (دجاج، لحم) د اليوم.',
      },
    },
    recommendation: {
      keywords: [
        'nasi7a',
        'conseil',
        'ans7ni',
        'chkoun 7sen',
        'choice',
        'khtar',
        'chno tns7ni',
        'ma3rft',
      ],
      reply: {
        darija_latn: 'Bghiti nasi7a? 🤔 **Tacos Kebab** howa li slay3ya db 🔥. M3mmr w bnin!',
        darija_ar: 'بغيتي نصيحة؟ 🤔 **طاكوس كباب** هو لي سلايعية دبا 🔥. معمر وبنين!',
      },
    },
    complaint: {
      keywords: [
        'nsitou',
        'nsit',
        'ma7titouch',
        'manque',
        'missing',
        'ghalat',
        'error',
        'fin sauce',
        'fin frites',
        'ma kaynach',
        'na9es',
        'na9sa',
        'problem',
        'chkl',
        'issue',
        'complaint',
        'reclamation',
        'fin litem',
        'commande ghalta',
        'talab ghalat',
        'نسيتو',
        'ماحطيتوش',
        'ناقص',
        'فين الصوص',
        'غلط',
        'مشكل',
        'كاين مشكل',
        'service',
        'delivery ghalat',
        'wrong order',
        'pas complet',
        'incomplete',
        'ma kamlach',
        'bug',
      ],
      reply: {
        darija_latn: 'Sma7 lina bzaf a chef 🙏 Gholia chno na9es w n3awdouh lik daba m3a cadeau 🎁',
        darija_ar: 'سماح لينا بزاف  أ شاف 🙏 قولي شنو ناقص ونعاودوه ليك دابا مع كادو 🎁',
      },
    },
  },

  // 8. PERSONALITY VECTORS (The "Soul")
  personality_vectors: {
    emotional_intelligence: {
      angry_customer: {
        triggers: ['retard', 'ghali', 'tfou', 't2khert', 'ma3جبنيش', 'زربتو'],
        responses: [
          'سمح لينا a khouya 😅، عارف راه retard كيعصب… عطينا غير 5 دقايق ونصلحوها ليك مع شي gesture زوين 😉',
          'Tfou؟ حقك علينا 🤝، وقع شي خلل ولكن راه غادي نصلحوها دابا ونفرحوك 💪🍔',
          'عارف ghali كتبان، ولكن الجودة ديال Snip Taste كتحكم 😎، نعوضوك بشي حاجة طيبة',
          'ما بغيناش نزعجوك، خليك علينا ودابا نصلحو الوضع 👌',
          'الغلط واقع، والرجولة نصلحوه 🙌 قولي شنو نقدر ندير ليك',
        ],
      },
      happy_customer: {
        triggers: ['bnin', 'top', 'nadi', 'zwin', 'waa3r', '🔥'],
        responses: [
          '🔥🔥 الله يعطيك الصحة! كلامك رفعنا لفوق 😎',
          'Bnina؟ هادي هي الهدرة اللي كنحبو ❤️🍔',
          'Nadi بزاف! مرحبا بيك ديما ف Snip Taste 👊',
          'Top dial top! الجاية أحسن إن شاء الله 😉',
          'تعليقك كيحمسنا نخدمو أكثر 💪 شكراً!',
        ],
      },
      troll_user: {
        triggers: ['hhhh', 'lol', 'nonsense', '😂', '🤡'],
        responses: [
          'Hhhh ضحكنا معاك ولكن راه الجوع ما كيتضحكش 😂🍟',
          'آش هاد الenergy 😂؟ سير طلب شي tacos وخلي الهضرة',
          'راك ف Snip Taste ماشي stand-up comedy 😎',
          'Hhhh زوين، ولكن الزوين أكثر هو burger ديالنا 😉',
          'راك كتضحك؟ الماكلة كتبكي باش تاكلها 😂',
        ],
      },
    },
    event_triggers: {
      football_match: {
        keywords: ['Raja', 'Wydad', 'match', 'derby', 'goal'],
        response: '⚽ Match day! Raja ولا Wydad؟ خليك مركز ف lferja وخلي tacos علينا 🔥🌮',
      },
      rainy_day: {
        keywords: ['chta', 'berd', 'matar', 'برد'],
        response: '☔ Chta w berd؟ Jawi dial Pizza skhouna w pasta kaydwi 😋🍕',
      },
      late_night: {
        keywords: ['minuit', 'lil', '3chiya', 'nuit'],
        response: '🌙 Jami ljo3? Hna m3ak حتى لـ2 دالصباح 😎🍔',
      },
    },
    slang_dictionary: [
      { word: 'Sat', example: 'Sat burger hada bnin بزاف 🔥' },
      { word: 'Nadi', example: 'Service nadi w rapid 💪' },
      { word: 'Hreb', example: 'Ljo3 hreb ملي كلّيت tacos 😂' },
      { word: 'M9awd', example: 'Pizza m9awda w fromage كيسيل 🧀' },
      { word: 'Zwin', example: 'Jaw zwin w accueil حسن 👌' },
      { word: 'Waa3r', example: 'Burger waa3r ما كيتنساوش 😎' },
      { word: 'Dreb', example: 'Dreb sauce algérienne وخلي الباقي علينا 🌶️' },
      { word: 'S7ab', example: 'جيب s7abك وتفرجو فالماتش ⚽' },
      { word: 'Hmar', example: 'جيت جوعان بحال hmar 😂' },
      { word: 'Zrb', example: 'كنخدمو zrb باش توصلك سخونة 🔥' },
      { word: 'M3amer', example: 'Tacos m3amer حتى للآخر 🌮' },
      { word: 'Fhamti', example: 'Quality قبل الكمية، fhamti؟ 😉' },
      { word: 'Kayn', example: 'إيلا بغيتي شي حاجة خاصة، راه kayn 👍' },
      { word: 'Safi', example: 'طلبك واجد، safi! 👌' },
      { word: 'Hada howa', example: 'Bnina بزاف؟ Hada howa 😎' },
      { word: 'Mzyan', example: 'Feedback ديالك mzyan بزاف ❤️' },
      { word: '3la rassi', example: 'أي مشكل؟ 3la rassi نصلحو 💯' },
      { word: 'Khoya', example: 'مرحبا khoya ف أي وقت 🙌' },
      { word: 'L3ez', example: 'Tacos ديال l3ez ماشي ديال اللعب 😂' },
      { word: 'F blastou', example: 'כלشي كيتوجد f blastou 👨‍🍳' },
    ],
  },

  // 7. Q&A KNOWLEDGE BASE (The "Master" Info)
  qna_knowledge_base: {
    LOCATION_INQUIRIES: {
      description: 'Questions about where Snip Taste is located and nearby landmarks.',
      keywords: [
        // Renamed 'examples' to 'keywords' to match engine logic
        'fin kayn snip taste',
        'wach qrib l gare',
        'adresse snip taste',
        'snip taste hay el farah',
        'فين جاية سنيب تاست',
        'near train station?',
        'snip taste hassan 2',
        'where are you located',
        'wach f hay farah',
        'snip taste casablanca fin',
        'fin blassa dyalkom',
        'localisation snip taste',
        'snip taste avenue hassan ii',
        'qrib l mahata',
        'snip taste map',
        'adresse exacte',
        'wach ba3id 3la centre',
        'snip taste quartier',
        'فينكم بالضبط',
        'snip taste fin',
      ],
      responses_random: [
        '📍 Kaynin f Hay El Farah, Avenue Hassan II, juste 7da la gare. Easy to find 😉',
        'Wld derb rah Snip Taste f Hay El Farah, qrib l mahata 🚉🔥',
        'Fin? Avenue Hassan II, Hay El Farah – Casablanca represent 💪📍',
        'Rah blassna واضحة: Hay El Farah, qrib l train station 👀🍔',
        'Casablanca baby! Hay El Farah, Avenue Hassan II, marhba bik 🫶',
      ],
    },
    MENU_SPECIFICS_BURGER: {
      description: 'Questions about burger ingredients, meat quality, and freshness.',
      keywords: [
        'burger dyalkom شنو فيه',
        'wach l7em fresh',
        'burger viande fraiche',
        'ingredients burger',
        'snip burger',
        'wach burger mzyan',
        'burger homemade',
        'fromage burger',
        'burger beef',
        'burger poulet',
        'شنو كتحطو فالبورغر',
        'burger sauce',
        'wach katdirou l7em dyal nhar',
        'burger quality',
        'burger taille',
        'burger spécial',
        'burger mixte',
        'burger halal',
        'burger casablanca',
        'best burger hay farah',
      ],
      responses_random: [
        '🍔 Burger dyalna kaytder b l7em frais 100%, khobz طري, sauce maison 🔥',
        'Fresh meat only wld derb! L7em dyal nhar, goût garanti 💯😋',
        'Burger = viande fraîche, fromage qui fond, sauce Snip secret 🤫🍔',
        'Kayna beef & poulet, kolchi fresh w kayt3mel f blastou 👌',
        'Ila bghiti burger sah, Snip Taste kay3tik qualité بلا هضرة 😎',
      ],
    },
    MENU_SPECIFICS_TACOS: {
      description: 'Questions about tacos sauces, size, and mix options.',
      keywords: [
        'tacos شحال فيه',
        'sauce tacos',
        'wach tacos mixte',
        'tacos size',
        'tacos poulet viande',
        'tacos snip taste',
        'tacos sauce fromagere',
        'tacos كبير',
        'tacos ingredients',
        'wach نقدر نخلط',
        'tacos maison',
        'tacos casablanca',
        'tacos hay farah',
        'tacos spicy',
        'tacos sauce algérienne',
        'tacos شبعان',
        'tacos menu',
        'tacos supplément',
        'best tacos casa',
        'tacos الليل',
      ],
      responses_random: [
        '🌮 Tacos dyalna شبعان! Taille كبيرة, sauces بزاف, و mixte مرحبا 😋',
        'Bghiti mixte? Poulet + viande + sauce fromagère 🔥',
        'Kayna algérienne, fromagère, spicy… khayar w dreb 😎',
        'Tacos Snip Taste = lourd, m3amer, w kaychبع 🧀🌮',
        'Dir sauce اللي بغيتي، حنا كنزبطوه على ذوقك 👌',
      ],
    },
    MENU_SPECIFICS_PIZZA: {
      description: 'Questions about pizza types, cheese, and options.',
      keywords: [
        'pizza شنو كاين',
        'pizza fromage',
        'types pizza',
        'pizza viande',
        'pizza poulet',
        'pizza 4 fromages',
        'pizza snip taste',
        'pizza taille',
        'pizza casablanca',
        'pizza hay farah',
        'pizza sauce tomate',
        'pizza crème',
        'pizza mixte',
        'pizza pepperoni',
        'pizza halal',
        'pizza menu',
        'pizza الليل',
        'best pizza casa',
        'pizza chaude',
        'pizza fraîche',
      ],
      responses_random: [
        '🍕 Kayna pizza viande, poulet, 4 fromages… kolchi fondant 😍',
        'Fromage dyalna généreux, pâte fresh w goût يقتل 🔥',
        'Pizza Snip Taste katji chaude, مباشرة من الفور 👌',
        'Bghiti sauce tomate ولا crème? choice dyalek 😉',
        'Pizza dyal wld derb، simple w tasty 💯🍕',
      ],
    },
    DELIVERY_LOGISTICS: {
      description: 'Questions about delivery zones, price, and availability.',
      keywords: [
        'delivery wach free',
        'livraison casablanca',
        'wach katsiftou',
        'delivery price',
        'snip taste livraison',
        'delivery hay farah',
        'delivery centre ville',
        'livraison الليل',
        'delivery time',
        'wach delivery gratuit',
        'zones delivery',
        'delivery maroc',
        'commande livraison',
        'delivery rapide',
        'delivery burger',
        'delivery tacos',
        'delivery pizza',
        'wach katsiftou l dar',
        'free delivery casa',
        'delivery snip',
      ],
      responses_random: [
        '🚴‍♂️ Livraison FREE f Casa كاملة! Just sit & chill 😎',
        'Oui a sidi, delivery gratuit أينما كنت ف Casablanca 🔥',
        'Katcommandi w katjiك حتى لباب دارك 🚪🍔',
        'Rapide w free, Snip Taste kay3رف الخدمة 💪',
        'Casa كاملة covered, no extra price 💯',
      ],
    },
    PAYMENT_METHODS: {
      description: 'Questions about accepted payment methods.',
      keywords: [
        'wach cash',
        'payment methods',
        'wach carte',
        'CIH card',
        'paiement livraison',
        'wach نخلص بالكارت',
        'cash only',
        'payment snip taste',
        'visa',
        'mastercard',
        'apple pay',
        'google pay',
        'wach cash delivery',
        'payment عند الاستلام',
        'payment options',
        'wach carte bancaire',
        'payment casa',
        'snip taste paiement',
        'payment hay farah',
        'payment order',
      ],
      responses_random: [
        '💵 Cash مرحبا، easy w simple 😉',
        'Pour l’instant cash only، خليك ready 😄',
        'Katخلص عند الاستلام، بلا صداع 💯',
        'Cash is king 👑',
        'Dir cash w rest assured، الخدمة زينة 👌',
      ],
    },
    OPENING_HOURS: {
      description: 'Questions about opening and closing times.',
      keywords: [
        'wach محلول دابا',
        'opening hours',
        'snip taste time',
        'وقت الفتح',
        'وقت الإغلاق',
        'open الليل',
        'wach محلول حتى 2',
        'snip taste horaires',
        'open weekend',
        'open friday',
        'open saturday',
        'snip taste اليوم',
        'open now',
        'close when',
        'hours hay farah',
        'snip taste الليل',
        'open late',
        'snip taste pm',
        'snip taste am',
        'working hours',
      ],
      responses_random: [
        '⏰ محلولين من 12:00 حتى 02:00 صباحاً 🌙',
        'نهار كامل معاك! من الميدة حتى الليل 😎',
        'حتى لـ2 دالصباح، الجوع مرحبا 🍔',
        'Open non-stop حتى يعيا الليل 🌮',
        '12h à 2h, toujours prêts 💪',
      ],
    },
    STATUS_ORDER: {
      description: 'Questions about order tracking and food status.',
      keywords: [
        'فين وصل طلبي',
        'order status',
        'commande فين وصلات',
        'delivery في الطريق',
        'wach خرج الطلب',
        'snip taste order',
        'status livraison',
        'فين الماكلة',
        'order delay',
        'delivery time',
        'فين الطاكوس',
        'فين البرغر',
        'order casablanca',
        'order hay farah',
        'tracking order',
        'commande snip',
        'delivery status',
        'فين وصل',
        'order update',
        'food coming',
      ],
      responses_random: [
        '🚴‍♂️ راه خرج، ف الطريق ليك دابا 😉',
        'صبر شوية، الماكلة سخونة و جاية 🔥',
        'Order ديالك كيتوجد، الجودة كتطلب وقت 😎',
        'قريب يوصل، حضر الطابلة 🍽️',
        'Snip Taste ما كيخليش الزبون يتسنى بزاف 💪',
      ],
    },
  },
};

// --- BRAIN LOGIC (FUZZY MATCHING) ---

function calculateScore(input: string, keywords: string[]): number {
  const words = input.toLowerCase().split(' ');
  let matches = 0;

  const laughRegex = /(h{2,}|ha{2,}|hhh|lo+l|mdr|هههه)/i;

  words.forEach((word) => {
    // Exact match or partial substantial match
    if (keywords.some((k) => k === word || (word.length > 4 && k.includes(word)))) {
      matches++;
    }
    // Special handling for laughs being fuzzy
    else if (keywords.includes('hhhh') || keywords.includes('lol')) {
      if (laughRegex.test(word)) {
        matches++;
      }
    }
  });

  return matches / (words.length || 1); // Normalize score
}

// Helper to safely access nested properties
function safeGet(obj: any, path: string[]) {
  return path.reduce((o, key) => (o && o[key] !== 'undefined' ? o[key] : undefined), obj);
}

function detectBrainIntent(input: string): { intent: string; confidence: number; category?: any } {
  let bestIntent = 'UNKNOWN';
  let maxScore = 0;
  let detectedCategory = null;

  // 1. Check Categories
  if (KNOWLEDGE_BASE.categories) {
    Object.entries(KNOWLEDGE_BASE.categories).forEach(([key, data]: [string, any]) => {
      const score = calculateScore(input, data.keywords || []);
      if (score > maxScore) {
        maxScore = score;
        bestIntent = `BROWSE_${key.toUpperCase()}`;
        detectedCategory = data;
      }
    });
  }

  // 2. Check Moods
  if (KNOWLEDGE_BASE.moods) {
    Object.entries(KNOWLEDGE_BASE.moods).forEach(([key, data]: [string, any]) => {
      const score = calculateScore(input, data.keywords || []);
      if (score > maxScore) {
        maxScore = score;
        bestIntent = data.intent;
        detectedCategory = data;
      }
    });
  }

  // 3. Check Questions
  if (KNOWLEDGE_BASE.questions) {
    Object.entries(KNOWLEDGE_BASE.questions).forEach(([key, data]: [string, any]) => {
      const score = calculateScore(input, data.keywords || []);
      if (score > maxScore) {
        maxScore = score;
        bestIntent = `ASK_${key.toUpperCase()}`;
        detectedCategory = data;
      }
    });
  }

  // 4. Check Greetings (General)
  if (KNOWLEDGE_BASE.greetings) {
    const greetingScore = calculateScore(input, KNOWLEDGE_BASE.greetings.keywords || []);
    if (greetingScore > maxScore && greetingScore > 0.1) {
      maxScore = greetingScore;
      bestIntent = 'GREETING';
      detectedCategory = KNOWLEDGE_BASE.greetings;
    }
  }

  // 5. Check Greetings (Morning)
  if ((KNOWLEDGE_BASE as any).greeting_morning) {
    const morningScore = calculateScore(
      input,
      (KNOWLEDGE_BASE as any).greeting_morning.keywords || []
    );
    if (morningScore > maxScore) {
      maxScore = morningScore;
      bestIntent = 'GREETING_MORNING';
      detectedCategory = (KNOWLEDGE_BASE as any).greeting_morning;
    }
  }

  // 6. Check Greetings (Night)
  if ((KNOWLEDGE_BASE as any).greeting_night) {
    const nightScore = calculateScore(input, (KNOWLEDGE_BASE as any).greeting_night.keywords || []);
    if (nightScore > maxScore) {
      maxScore = nightScore;
      bestIntent = 'GREETING_NIGHT';
      detectedCategory = (KNOWLEDGE_BASE as any).greeting_night;
    }
  }

  // 7. Check Human Flows (Highest Priority for natural feel)
  if ((KNOWLEDGE_BASE as any).human_flows) {
    Object.entries((KNOWLEDGE_BASE as any).human_flows).forEach(([key, data]: [string, any]) => {
      const words = input.toLowerCase().split(' ');
      let match = false;
      if (data.keywords) {
        for (const k of data.keywords) {
          if (input.toLowerCase().includes(k.toLowerCase())) {
            match = true;
            break;
          }
        }
      }
      if (match) {
        maxScore = 0.95; // Very high confidence for these exact phrases
        bestIntent = `HUMAN_${key.toUpperCase()}`;
        detectedCategory = data;
      }
    });
  }

  // 8. PERSONALITY INJECTION (The 'Casawi' Vibe)
  if ((KNOWLEDGE_BASE as any).personality_modules) {
    const witty = (KNOWLEDGE_BASE as any).personality_modules.witty_comebacks;
    if (witty && witty.scenarios) {
      for (const [scenario, keywords] of Object.entries(witty.scenarios) as [string, string[]][]) {
        if (
          keywords.some(
            (k) =>
              input.toLowerCase() === k.toLowerCase() ||
              input.toLowerCase().split(' ').includes(k.toLowerCase())
          )
        ) {
          if (0.96 > maxScore) {
            // Higher than Human Flows for exact matches like "hh"
            maxScore = 0.96;
            bestIntent = `PERSONALITY_${scenario.toUpperCase()}`;
            detectedCategory = { responses_random: witty.replies_random }; // Map to structure expected by random picker
          }
        }
      }
    }
  }

  // 9. Q&A KNOWLEDGE BASE (Specific Answers)
  if ((KNOWLEDGE_BASE as any).qna_knowledge_base) {
    Object.entries((KNOWLEDGE_BASE as any).qna_knowledge_base).forEach(
      ([key, data]: [string, any]) => {
        const score = calculateScore(input, data.keywords || []);
        if (score > maxScore) {
          maxScore = score;
          bestIntent = `QNA_${key}`;
          detectedCategory = data;
        }
      }
    );
  }

  // 10. PERSONALITY VECTORS (Emotion & Events)
  if ((KNOWLEDGE_BASE as any).personality_vectors) {
    const vectors = (KNOWLEDGE_BASE as any).personality_vectors;

    // Emotional Intelligence
    if (vectors.emotional_intelligence) {
      Object.entries(vectors.emotional_intelligence).forEach(([key, data]: [string, any]) => {
        const score = calculateScore(input, data.triggers || []);
        if (score > maxScore) {
          maxScore = score;
          bestIntent = `EMOTION_${key.toUpperCase()}`;
          detectedCategory = { responses_random: data.responses }; // Map 'responses' to 'responses_random'
        }
      });
    }

    // Event Triggers
    if (vectors.event_triggers) {
      Object.entries(vectors.event_triggers).forEach(([key, data]: [string, any]) => {
        const score = calculateScore(input, data.keywords || []);
        // Events usually have lower threshold triggers, so we check stricter match or ensure score is significant
        if (score > maxScore && score > 0.3) {
          maxScore = score;
          bestIntent = `EVENT_${key.toUpperCase()}`;
          // Event responses are usually single string 'response', wrap it
          detectedCategory = { responses_random: [data.response] };
        }
      });
    }
  }

  return { intent: bestIntent, confidence: maxScore, category: detectedCategory };
}

// Helper to pick random response if available
function pickRandomResponse(category: any): string | null {
  if (category && category.responses_random && category.responses_random.length > 0) {
    const randomIndex = Math.floor(Math.random() * category.responses_random.length);
    return category.responses_random[randomIndex];
  }
  // Fallback for simple 'replies' array in some personality modules
  if (
    category &&
    category.replies &&
    category.replies.length > 0 &&
    Array.isArray(category.replies)
  ) {
    const randomIndex = Math.floor(Math.random() * category.replies.length);
    return category.replies[randomIndex];
  }
  return null;
}

// --- MAIN EXPORT ---

/**
 * Validates and processes a user message through the Deep Learning Brain.
 * This wraps the original 'respondLocal' but adds "Soul" and "Context".
 */
export function processUserMessage(
  input: string,
  currentState: BotState
): {
  reply: string;
  newState: BotState;
  options: string[];
  intent: string;
} {
  // PRIORITY FIX: If user is in functional flow (browsing, ordering, etc),
  // ALWAYS use respondLocal to show actual menu items
  const functionalPhases: BotPhase[] = [
    'browsing',
    'await_size',
    'await_qty',
    'ask_sauce',
    'await_extras',
    'cart_actions',
    'ask_delivery_method',
    'ask_delivery_distance',
    'ask_address',
    'ask_payment',
  ];

  if (functionalPhases.includes(currentState.phase)) {
    // User is in ordering flow - use functional menu system
    const standardResponse = handleUserMessage(menuData as any, currentState, input);
    return {
      reply: standardResponse.reply,
      newState: standardResponse.state,
      options: standardResponse.options || [],
      intent: 'FUNCTIONAL_FLOW',
    };
  }

  // Check if user is clicking a menu category button (from idle phase)
  const isMenuCategory = menuData.some(
    (section) =>
      section.title.toLowerCase() === input.toLowerCase().trim() ||
      section.id.toLowerCase() === input.toLowerCase().trim()
  );

  if (currentState.phase === 'idle' && isMenuCategory) {
    // User clicked a category button - show menu items directly
    const standardResponse = handleUserMessage(menuData as any, currentState, input);
    return {
      reply: standardResponse.reply,
      newState: standardResponse.state,
      options: standardResponse.options || [],
      intent: 'BROWSE_MENU',
    };
  }

  // 1. Run the "Brain"
  const brainResult = detectBrainIntent(input);

  // 2. High Confidence Match? -> Use Brain's Reply (increased threshold for accuracy)
  if (brainResult.confidence > 0.3 && brainResult.category) {
    // Determine language (simple heuristic: if input has arabic chars, use AR, else Latn)
    const isArabic = /[\u0600-\u06FF]/.test(input);

    // Try to get a RANDOM human response first (for variety)
    const randomHumanReply = pickRandomResponse(brainResult.category);

    let replyText = randomHumanReply;

    // If no random response, try structured replies
    if (!replyText && brainResult.category.reply) {
      replyText =
        isArabic && brainResult.category.reply.darija_ar
          ? brainResult.category.reply.darija_ar
          : brainResult.category.reply.darija_latn ||
            brainResult.category.reply.fr ||
            brainResult.category.reply.text;
    }

    // Fallback for old greetings array structure
    if (!replyText && brainResult.category.responses) {
      replyText = brainResult.category.responses?.[isArabic ? 1 : 0]?.text;
    }

    // Ultimate fallback if nothing defined
    if (!replyText) {
      replyText = 'Fhemtk walakin ma3raftch chno ngol... 🤔';
    }

    // Smart Suggestions based on Intent
    let smartOptions: string[] = ['Voir le Menu'];

    if (brainResult.intent.includes('BROWSE_')) {
      smartOptions = ['Commander Daba', 'Voir Prix'];
    } else if (brainResult.intent === 'PREF_SPICY') {
      smartOptions = ['Tacos Sauce Algérienne', 'Pizza Piquante'];
    } else if (brainResult.intent === 'PREF_BUDGET') {
      smartOptions = ['Voir Promotions', 'Tacos Sghir (25dh)'];
    } else if (brainResult.intent === 'PREF_HUNGRY') {
      smartOptions = ['Menu Mega', 'Tacos XL'];
    } else if (brainResult.intent === 'ASK_DELIVERY') {
      smartOptions = ['Commander (Livraison)', 'Fin sakn?'];
    }

    // --- POPULATE MENU SECTION FOR DISPLAY ---
    // DISABLED: Smart menu removed as per user request
    // let menuSection: any | undefined = undefined;
    // // Only show menu if we're NOT already in browsing mode (to prevent re-showing after item click)
    // if (brainResult.intent.startsWith('BROWSE_') && currentState.phase !== 'browsing') {
    //   const categoryKey = brainResult.intent.replace('BROWSE_', '').toLowerCase();
    //   // Match with menuData IDs (pizza, tacos, burger, etc)
    //   const section = menuData.find(
    //     (s) => s.id === categoryKey || s.title.toLowerCase() === categoryKey
    //   );

    //   if (section) {
    //     menuSection = section; // Pass the entire section
    //     replyText += `\n\n👇 **Chof hadchi kaybane bnin!** (Click 3la item bach tzidou)`;
    //   }
    // }

    return {
      reply: replyText,
      newState: { ...currentState }, // Removed menuSection injection
      options: smartOptions,
      intent: brainResult.intent,
    };
  }

  // 3. Low Confidence? -> Fallback to Standard Logic (respondLocal)
  // This ensures we don't break the functional ordering flow (Address, Qty, etc)
  const standardResponse = handleUserMessage(menuData as any, currentState, input);
  return {
    reply: standardResponse.reply,
    newState: standardResponse.state,
    options: standardResponse.options || [],
    intent: 'FUNCTIONAL_FLOW',
  };
}
