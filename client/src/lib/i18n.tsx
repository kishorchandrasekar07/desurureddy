import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "en" | "te" | "ta";

export const translations = {
  en: {
    languageName: "English",
    greeting: "Hello",
    communityName: "Desuru Reddy's Community",
    formTitle: "Community Registration",
    formDescription: "Please fill out the form below to join our community database.",
    name: "Name",
    namePlaceholder: "Enter your full name",
    phone: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    community: "Community",
    gender: "Gender",
    selectGender: "Select gender",
    male: "Male",
    female: "Female",
    dateOfBirth: "Date of Birth",
    pickDate: "Pick a date",
    presentAddress: "Present Address",
    addressPlaceholder: "Enter your current address",
    nativePlace: "Native Place",
    nativePlaceholder: "Enter your native place",
    gothram: "Gothram",
    selectGothram: "Select your Gothram",
    houseName: "House Name",
    selectHouseName: "Select House Name",
    state: "State",
    selectState: "Select your state",
    county: "County/District",
    selectCounty: "Select your county",
    other: "Other",
    otherGothram: "Other Gothram",
    otherGothramPlaceholder: "Enter your Gothram",
    otherHouseName: "Other House Name",
    otherHouseNamePlaceholder: "Enter your House Name",
    submit: "Submit",
    submitting: "Submitting...",
    successTitle: "Registration Successful!",
    successMessage: "Your information has been submitted successfully.",
    pendingApprovalMessage: "Your submission is pending approval since you selected 'Other' for Gothram or House Name.",
    submitAnother: "Submit Another Response",
    errorTitle: "Submission Failed",
    errorMessage: "There was an error submitting your information. Please try again.",
    admin: "Admin",
    login: "Login",
    logout: "Logout",
    password: "Password",
    passwordPlaceholder: "Enter admin password",
    invalidPassword: "Invalid password",
    pendingApprovals: "Pending Approvals",
    pendingApprovalsDescription: "These submissions require your approval before being added to the database.",
    approve: "Approve",
    reject: "Reject",
    approved: "Approved!",
    rejected: "Rejected",
    approvedDescription: "Submission has been approved and added to the database.",
    rejectedDescription: "Submission has been rejected and removed.",
    totalSubmissions: "Total Submissions",
    gothrams: "Gothrams",
    filters: "Filters",
    clearFilters: "Clear",
    searchByName: "Search by Name",
    searchPlaceholder: "Enter name...",
    all: "All",
    selected: "selected",
    selectAll: "Select All",
    clear: "Clear",
    exportPDF: "Export PDF",
    pdfDownloaded: "PDF Downloaded",
    pdfExportDescription: "Exported submissions to PDF.",
    submissions: "submissions",
    showing: "Showing",
    of: "of",
    records: "records",
    location: "Location",
    failedToLoad: "Failed to Load Data",
    refreshPage: "Please try refreshing the page.",
    adminLogin: "Admin Login",
    adminLoginDescription: "Enter the admin password to access the dashboard.",
    searchGothram: "Search Gothram...",
    searchHouseName: "Search House Name...",
    noGothramFound: "No Gothram found.",
    noHouseNameFound: "No House Name found.",
    searchAndSelectGothram: "Search and select your Gothram",
    searchAndSelectHouseName: "Search and select your House Name",
    pleaseSpecifyGothram: "Please specify Gothram",
    pleaseSpecifyHouseName: "Please specify House Name",
  },
  te: {
    languageName: "తెలుగు",
    greeting: "నమస్తే",
    communityName: "దేసురు రెడ్డి సమాజం",
    formTitle: "సమాజ నమోదు",
    formDescription: "మా సమాజ డేటాబేస్‌లో చేరడానికి దయచేసి క్రింది ఫారమ్‌ను పూర్తి చేయండి.",
    name: "పేరు",
    namePlaceholder: "మీ పూర్తి పేరు నమోదు చేయండి",
    phone: "ఫోన్ నంబర్",
    phonePlaceholder: "మీ ఫోన్ నంబర్ నమోదు చేయండి",
    community: "సమాజం",
    gender: "లింగం",
    selectGender: "లింగం ఎంచుకోండి",
    male: "పురుషుడు",
    female: "స్త్రీ",
    dateOfBirth: "పుట్టిన తేదీ",
    pickDate: "తేదీ ఎంచుకోండి",
    presentAddress: "ప్రస్తుత చిరునామా",
    addressPlaceholder: "మీ ప్రస్తుత చిరునామా నమోదు చేయండి",
    nativePlace: "స్వస్థలం",
    nativePlaceholder: "మీ స్వస్థలం నమోదు చేయండి",
    gothram: "గోత్రం",
    selectGothram: "మీ గోత్రం ఎంచుకోండి",
    houseName: "ఇంటి పేరు",
    selectHouseName: "ఇంటి పేరు ఎంచుకోండి",
    state: "రాష్ట్రం",
    selectState: "మీ రాష్ట్రం ఎంచుకోండి",
    county: "జిల్లా",
    selectCounty: "మీ జిల్లా ఎంచుకోండి",
    other: "ఇతర",
    otherGothram: "ఇతర గోత్రం",
    otherGothramPlaceholder: "మీ గోత్రం నమోదు చేయండి",
    otherHouseName: "ఇతర ఇంటి పేరు",
    otherHouseNamePlaceholder: "మీ ఇంటి పేరు నమోదు చేయండి",
    submit: "సమర్పించు",
    submitting: "సమర్పిస్తోంది...",
    successTitle: "నమోదు విజయవంతం!",
    successMessage: "మీ సమాచారం విజయవంతంగా సమర్పించబడింది.",
    pendingApprovalMessage: "మీరు గోత్రం లేదా ఇంటి పేరుకు 'ఇతర' ఎంచుకున్నందున మీ సమర్పణ ఆమోదం కోసం పెండింగ్‌లో ఉంది.",
    submitAnother: "మరో ప్రతిస్పందన సమర్పించండి",
    errorTitle: "సమర్పణ విఫలమైంది",
    errorMessage: "మీ సమాచారాన్ని సమర్పించడంలో లోపం జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    admin: "అడ్మిన్",
    login: "లాగిన్",
    logout: "లాగ్ అవుట్",
    password: "పాస్‌వర్డ్",
    passwordPlaceholder: "అడ్మిన్ పాస్‌వర్డ్ నమోదు చేయండి",
    invalidPassword: "చెల్లని పాస్‌వర్డ్",
    pendingApprovals: "పెండింగ్ ఆమోదాలు",
    pendingApprovalsDescription: "ఈ సమర్పణలు డేటాబేస్‌కు జోడించడానికి ముందు మీ ఆమోదం అవసరం.",
    approve: "ఆమోదించు",
    reject: "తిరస్కరించు",
    approved: "ఆమోదించబడింది!",
    rejected: "తిరస్కరించబడింది",
    approvedDescription: "సమర్పణ ఆమోదించబడింది మరియు డేటాబేస్‌కు జోడించబడింది.",
    rejectedDescription: "సమర్పణ తిరస్కరించబడింది మరియు తొలగించబడింది.",
    totalSubmissions: "మొత్తం సమర్పణలు",
    gothrams: "గోత్రాలు",
    filters: "ఫిల్టర్‌లు",
    clearFilters: "క్లియర్",
    searchByName: "పేరు ద్వారా శోధించండి",
    searchPlaceholder: "పేరు నమోదు చేయండి...",
    all: "అన్ని",
    selected: "ఎంపిక చేయబడింది",
    selectAll: "అన్ని ఎంచుకోండి",
    clear: "క్లియర్",
    exportPDF: "PDF ఎగుమతి",
    pdfDownloaded: "PDF డౌన్‌లోడ్ అయింది",
    pdfExportDescription: "సమర్పణలు PDFకు ఎగుమతి చేయబడ్డాయి.",
    submissions: "సమర్పణలు",
    showing: "చూపిస్తోంది",
    of: "లో",
    records: "రికార్డులు",
    location: "స్థానం",
    failedToLoad: "డేటా లోడ్ చేయడం విఫలమైంది",
    refreshPage: "దయచేసి పేజీని రిఫ్రెష్ చేసి ప్రయత్నించండి.",
    adminLogin: "అడ్మిన్ లాగిన్",
    adminLoginDescription: "డాష్‌బోర్డ్ యాక్సెస్ చేయడానికి అడ్మిన్ పాస్‌వర్డ్ నమోదు చేయండి.",
    searchGothram: "గోత్రం శోధించండి...",
    searchHouseName: "ఇంటి పేరు శోధించండి...",
    noGothramFound: "గోత్రం కనుగొనబడలేదు.",
    noHouseNameFound: "ఇంటి పేరు కనుగొనబడలేదు.",
    searchAndSelectGothram: "మీ గోత్రం శోధించి ఎంచుకోండి",
    searchAndSelectHouseName: "మీ ఇంటి పేరు శోధించి ఎంచుకోండి",
    pleaseSpecifyGothram: "దయచేసి గోత్రం పేర్కొనండి",
    pleaseSpecifyHouseName: "దయచేసి ఇంటి పేరు పేర్కొనండి",
  },
  ta: {
    languageName: "தமிழ்",
    greeting: "வணக்கம்",
    communityName: "தேசுரு ரெட்டி சமூகம்",
    formTitle: "சமூக பதிவு",
    formDescription: "எங்கள் சமூக தரவுத்தளத்தில் சேர கீழே உள்ள படிவத்தை பூர்த்தி செய்யவும்.",
    name: "பெயர்",
    namePlaceholder: "உங்கள் முழு பெயரை உள்ளிடவும்",
    phone: "தொலைபேசி எண்",
    phonePlaceholder: "உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்",
    community: "சமூகம்",
    gender: "பாலினம்",
    selectGender: "பாலினத்தை தேர்ந்தெடுக்கவும்",
    male: "ஆண்",
    female: "பெண்",
    dateOfBirth: "பிறந்த தேதி",
    pickDate: "தேதியை தேர்ந்தெடுக்கவும்",
    presentAddress: "தற்போதைய முகவரி",
    addressPlaceholder: "உங்கள் தற்போதைய முகவரியை உள்ளிடவும்",
    nativePlace: "சொந்த ஊர்",
    nativePlaceholder: "உங்கள் சொந்த ஊரை உள்ளிடவும்",
    gothram: "கோத்திரம்",
    selectGothram: "உங்கள் கோத்திரத்தை தேர்ந்தெடுக்கவும்",
    houseName: "வீட்டு பெயர்",
    selectHouseName: "வீட்டு பெயரை தேர்ந்தெடுக்கவும்",
    state: "மாநிலம்",
    selectState: "உங்கள் மாநிலத்தை தேர்ந்தெடுக்கவும்",
    county: "மாவட்டம்",
    selectCounty: "உங்கள் மாவட்டத்தை தேர்ந்தெடுக்கவும்",
    other: "மற்றவை",
    otherGothram: "மற்ற கோத்திரம்",
    otherGothramPlaceholder: "உங்கள் கோத்திரத்தை உள்ளிடவும்",
    otherHouseName: "மற்ற வீட்டு பெயர்",
    otherHouseNamePlaceholder: "உங்கள் வீட்டு பெயரை உள்ளிடவும்",
    submit: "சமர்ப்பிக்கவும்",
    submitting: "சமர்ப்பிக்கிறது...",
    successTitle: "பதிவு வெற்றிகரம்!",
    successMessage: "உங்கள் தகவல் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.",
    pendingApprovalMessage: "கோத்திரம் அல்லது வீட்டு பெயருக்கு 'மற்றவை' தேர்ந்தெடுத்ததால் உங்கள் சமர்ப்பிப்பு ஒப்புதலுக்கு காத்திருக்கிறது.",
    submitAnother: "மற்றொரு பதிலை சமர்ப்பிக்கவும்",
    errorTitle: "சமர்ப்பிப்பு தோல்வி",
    errorMessage: "உங்கள் தகவலை சமர்ப்பிப்பதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
    admin: "நிர்வாகி",
    login: "உள்நுழை",
    logout: "வெளியேறு",
    password: "கடவுச்சொல்",
    passwordPlaceholder: "நிர்வாகி கடவுச்சொல்லை உள்ளிடவும்",
    invalidPassword: "தவறான கடவுச்சொல்",
    pendingApprovals: "நிலுவையில் உள்ள ஒப்புதல்கள்",
    pendingApprovalsDescription: "இந்த சமர்ப்பிப்புகள் தரவுத்தளத்தில் சேர்ப்பதற்கு முன் உங்கள் ஒப்புதல் தேவை.",
    approve: "ஒப்புக்கொள்",
    reject: "நிராகரி",
    approved: "ஒப்புக்கொள்ளப்பட்டது!",
    rejected: "நிராகரிக்கப்பட்டது",
    approvedDescription: "சமர்ப்பிப்பு ஒப்புக்கொள்ளப்பட்டு தரவுத்தளத்தில் சேர்க்கப்பட்டது.",
    rejectedDescription: "சமர்ப்பிப்பு நிராகரிக்கப்பட்டு நீக்கப்பட்டது.",
    totalSubmissions: "மொத்த சமர்ப்பிப்புகள்",
    gothrams: "கோத்திரங்கள்",
    filters: "வடிகட்டிகள்",
    clearFilters: "அழி",
    searchByName: "பெயரால் தேடு",
    searchPlaceholder: "பெயரை உள்ளிடவும்...",
    all: "அனைத்தும்",
    selected: "தேர்ந்தெடுக்கப்பட்டது",
    selectAll: "அனைத்தையும் தேர்ந்தெடு",
    clear: "அழி",
    exportPDF: "PDF ஏற்றுமதி",
    pdfDownloaded: "PDF பதிவிறக்கப்பட்டது",
    pdfExportDescription: "சமர்ப்பிப்புகள் PDFக்கு ஏற்றுமதி செய்யப்பட்டன.",
    submissions: "சமர்ப்பிப்புகள்",
    showing: "காட்டுகிறது",
    of: "இல்",
    records: "பதிவுகள்",
    location: "இடம்",
    failedToLoad: "தரவு ஏற்றுவதில் தோல்வி",
    refreshPage: "பக்கத்தை புதுப்பிக்க முயற்சிக்கவும்.",
    adminLogin: "நிர்வாகி உள்நுழைவு",
    adminLoginDescription: "டாஷ்போர்டை அணுக நிர்வாகி கடவுச்சொல்லை உள்ளிடவும்.",
    searchGothram: "கோத்திரத்தை தேடுங்கள்...",
    searchHouseName: "வீட்டு பெயரை தேடுங்கள்...",
    noGothramFound: "கோத்திரம் கிடைக்கவில்லை.",
    noHouseNameFound: "வீட்டு பெயர் கிடைக்கவில்லை.",
    searchAndSelectGothram: "உங்கள் கோத்திரத்தை தேடி தேர்ந்தெடுக்கவும்",
    searchAndSelectHouseName: "உங்கள் வீட்டு பெயரை தேடி தேர்ந்தெடுக்கவும்",
    pleaseSpecifyGothram: "கோத்திரத்தை குறிப்பிடவும்",
    pleaseSpecifyHouseName: "வீட்டு பெயரை குறிப்பிடவும்",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const LANGUAGE_KEY = "app_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      if (saved && (saved === "en" || saved === "te" || saved === "ta")) {
        return saved;
      }
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, language } = useLanguage();
  return { t, language };
}
