import {
  NavItem,
  HowToUseItem,
  LanguageSwitchItem,
  SolutionItem,
  ScrollItems,
  ReviewType,
  EventBulletItem,
  CenterItemData,
} from './types';

// Main navigation with dropdown structure
export const navMainList: NavItem[] = [
  { 
    text: 'navigation.about', 
    url: '/about',
    icon: 'info'
  },
  { 
    text: 'navigation.products', 
    url: '/products',
    icon: 'shopping',
    hasDropdown: true,
    dropdownItems: [
      { text: 'navigation.allProducts', url: '/products', icon: 'shopping' },
      { text: 'navigation.productsVM', url: '/products/vm', icon: 'star' }
    ]
  },
  { 
    text: 'navigation.member', 
    url: '/member',
    icon: 'users',
    hasDropdown: true,
    dropdownItems: [
      { text: 'navigation.education', url: '/education', icon: 'book' },
      { text: 'navigation.certification', url: '/certification', icon: 'award' }
    ]
  },
  { 
    text: 'navigation.events', 
    url: '/events',
    icon: 'calendar'
  },
  { 
    text: 'navigation.clinic', 
    url: '/clinic',
    icon: 'clinic'
  },
  { 
    text: 'navigation.contact', 
    url: '/contact',
    icon: 'contact'
  }
];

export const navEventList: NavItem[] = [
  { 
    text: 'navigation.about', 
    url: '/about',
    icon: 'info'
  },
  { 
    text: 'navigation.products', 
    url: '/products',
    icon: 'shopping',
    hasDropdown: true,
    dropdownItems: [
      { text: 'navigation.allProducts', url: '/products', icon: 'shopping' },
      { text: 'navigation.productsVM', url: '/products/vm', icon: 'star' }
    ]
  },
  { 
    text: 'navigation.member', 
    url: '/member',
    icon: 'users',
    hasDropdown: true,
    dropdownItems: [
      { text: 'navigation.education', url: '/education', icon: 'book' },
      { text: 'navigation.certification', url: '/certification', icon: 'award' }
    ]
  },
  { 
    text: 'navigation.events', 
    url: '/events',
    icon: 'calendar'
  },
  { 
    text: 'navigation.clinic', 
    url: '/clinic',
    icon: 'clinic'
  },
  { 
    text: 'navigation.contact', 
    url: '/contact',
    icon: 'contact'
  }
];

export const navFormList: NavItem[] = [
  { 
    text: 'navigation.about', 
    url: '/about',
    icon: 'info'
  },
  { 
    text: 'navigation.products', 
    url: '/products',
    icon: 'shopping',
    hasDropdown: true,
    dropdownItems: [
      { text: 'navigation.allProducts', url: '/products', icon: 'shopping' },
      { text: 'navigation.productsVM', url: '/products/vm', icon: 'star' }
    ]
  },
  { 
    text: 'navigation.member', 
    url: '/member',
    icon: 'users',
    hasDropdown: true,
    dropdownItems: [
      { text: 'navigation.education', url: '/education', icon: 'book' },
      { text: 'navigation.certification', url: '/certification', icon: 'award' }
    ]
  },
  { 
    text: 'navigation.events', 
    url: '/events',
    icon: 'calendar'
  },
  { 
    text: 'navigation.clinic', 
    url: '/clinic',
    icon: 'clinic'
  },
  { 
    text: 'navigation.contact', 
    url: '/contact',
    icon: 'contact'
  }
];

export const howToUseItemList: HowToUseItem[] = [
  { imagePath: '/images/howToUse/skin.png', text: 'howToUse.item1' },
  { imagePath: '/images/howToUse/acne.png', text: 'howToUse.item2' },
  { imagePath: '/images/howToUse/butt.png', text: 'howToUse.item3' },
  { imagePath: '/images/howToUse/acne2.png', text: 'howToUse.item4' },
  { imagePath: '/images/howToUse/surgery.png', text: 'howToUse.item5' },
  { imagePath: '/images/howToUse/blood.png', text: 'howToUse.item6' },
];

export const eventBulletsItemList: EventBulletItem[] = [
  {
    imagePath: '/images/event-bullets/bulb.svg',
    text: 'eventBullets.item1',
  },
  {
    imagePath: '/images/event-bullets/stairs.svg',
    text: 'eventBullets.item2',
  },
  {
    imagePath: '/images/event-bullets/messages.svg',
    text: 'eventBullets.item3',
  },
  {
    imagePath: '/images/event-bullets/distributor.svg',
    text: 'eventBullets.item4',
  },
];

export const languageSwitchItemList: LanguageSwitchItem[] = [
  { imageUrl: '/languageSwitch/en.svg', url: '/en/' },
  { imageUrl: '/languageSwitch/en.svg', url: '/ru/' },
  { imageUrl: '/languageSwitch/en.svg', url: '/he/' },
];

export const solutionItems: SolutionItem[] = [
  {
    imageUrl: '/images/solution/item1.png',
    title: 'solution.item1title',
    text: [
      'solution.item1textP1',
      'solution.item1textP2',
      'solution.item1textP3',
      'solution.item1textP4',
      'solution.item1textP5',
      'solution.item1textP6',
    ],
  },
  {
    imageUrl: '/images/solution/item2.png',
    title: 'solution.item2title',
    column: true,
    text: [
      'solution.item2textP1',
      'solution.item2textP2',
      'solution.item2textP3',
      'solution.item2textP4',
      'solution.item2textP5',
    ],
  },
  {
    imageUrl: '/images/solution/item1.png',
    title: 'solution.item1title',
    text: [
      'solution.item1textP1',
      'solution.item1textP2',
      'solution.item1textP3',
      'solution.item1textP4',
      'solution.item1textP5',
      'solution.item1textP6',
    ],
  },
  {
    imageUrl: '/images/solution/item2.png',
    title: 'solution.item2title',
    column: true,
    text: [
      'solution.item2textP1',
      'solution.item2textP2',
      'solution.item2textP3',
      'solution.item2textP4',
      'solution.item2textP5',
    ],
  },
];

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const reviews: ReviewType[] = [
  {
    name: 'reviews.item1.name',
    rating: 5,
    text: 'reviews.item1.text',
  },
  {
    name: 'reviews.item2.name',
    rating: 5,
    text: 'reviews.item2.text',
  },
];

export const centerItemData: CenterItemData[] = [
  {
    name: 'גאל לוי קוסמטיקה בע״מ',
    city: 'רמת השרון- מרכז',
    contact: '054-539-3522',
  },
  {
    name: "ליידי די ביי דר' דיאנה קליניקה לאסתטיקה רפואית בעמ",
    city: 'באר שבע- דרום',
    contact: '052-605-3575',
  },
  {
    name: 'אורטל אוחיון קוסמטיקאית',
    city: 'נתניה מרכז',
    contact: '052-955-9155',
  },
  { name: 'דוניא קמוע', city: 'נצרת צפון', contact: '050-7592446' },
  { name: 'חטיב נימר אמאני', city: 'נצרת צפון', contact: '052-5413528' },
  { name: 'דר ויקטוריה אסלניאן', city: 'מרכז', contact: '050-8685444' },
  {
    name: 'פרפקט סקין קוסמטיקה- אורן וקריסטינה',
    city: 'מרכז',
    contact: '052-8010223',
  },
  { name: 'אילונה שפקטור', city: 'מרכז', contact: '054-7621889' },
  { name: 'לודמילה אגדרוב', city: 'ראשון לציון-מרכז', contact: '054-3264933' },
  { name: 'אור מדיקל קוסמטיקס- אורלי ', city: 'מרכז', contact: '054-9451444' },
  { name: 'לריסה קוסמטיקס', city: 'מרכז', contact: '054-5305240' },
  { name: 'נטלי לוטטי', city: 'מרכז', contact: '054-6860072' },
  { name: 'בוימל אורית', city: 'מרכז', contact: '054-4580605' },
  { name: 'בת שבע טל', city: 'מרכז', contact: '050-7582668' },
  { name: 'ציבי לוי', city: '', contact: '058-414-2637' },
  { name: 'רווית וולפסון', city: 'אשדוד ', contact: '050-799-8457' },
  {
    name: 'רייפיס א.א (אביטל איסקוב ) בע"מ',
    city: 'שוהם',
    contact: '052-832-5338',
  },
  { name: 'מירב אסטון קוסמטיקאית', city: 'גן יבנה', contact: '052-660-1016' },
  { name: 'אילי אברהמי', city: '', contact: '050-886-8614' },
  { name: 'סיגל קוסמטיקה בניחוח אחר', city: 'מרכז', contact: '054-220-8391' },
  { name: 'קטי מרדכי', city: 'חדרה', contact: '054-489-0451' },
  { name: 'קסניה פנחסוב', city: 'מרכז', contact: '054-3450595' },
  { name: 'תובה מנצור', city: '', contact: '050-377-7729' },
  { name: 'מירב לזמי', city: '', contact: '054-782-2384' },
  { name: 'אולגה שולמן', city: 'רחובות', contact: '050-306-9761' },
  { name: 'סלבי אברהם', city: 'מרכז - ראשון לציון', contact: '054-281-8142' },
  { name: 'חני יאיר פור', city: 'תל אביב', contact: '050-831-3895' },
  { name: 'שלומית פדידה', city: 'אשדוד ', contact: '052-250-2563' },
  { name: 'טלי ארזי', city: 'מרכז', contact: '052-330-7663' },
  { name: 'נטלי בנדורה', city: 'פתח תקווה', contact: '054-764-5074' },
  { name: 'שמית מלכה', city: 'צפון', contact: '054-202-0701' },
  { name: 'דר איתי סקורניק', city: 'מרכז', contact: '054-7660964' },
  { name: 'רחלי יוגב', city: 'אל עד מרכז', contact: '054-992-2699' },
  { name: 'דר ניר גלאור', city: 'זכרון יעקב', contact: '054-5454636' },
  { name: 'אסתר איליזרוב', city: 'פתח תקווה', contact: '054-5320240' },
  { name: 'סופי אביב', city: 'פתח תקווה', contact: '054-7547111' },
  { name: 'הלנה קלצקין', city: 'כפר סבא', contact: '050-4413135' },
  { name: 'יפעת רבה', city: 'יבנה', contact: '052-5230499' },
  { name: 'אילנית גבאי', city: 'אשדוד', contact: '052-5756724' },
  { name: 'שני אברהם', city: 'קריית גת', contact: '050-7700234' },
  { name: 'סימה פייר', city: 'צפון', contact: '050-8333654' },
  { name: 'שרי לוי', city: 'יבנה', contact: '050-6667891' },
];

export const navigation = [
  { name: 'home', href: '/' },
  { name: 'about', href: '/about' },
  { name: 'products', href: '/products' },
  { name: 'education', href: '/education' },
  { name: 'contact', href: '/contact' },
  { name: 'admin', href: '/admin' },
];
