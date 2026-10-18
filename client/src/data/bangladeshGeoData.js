/**
 * Bangladesh Administrative Hierarchy and Mouza Data
 * Used for dependent dropdown selectors in LandLock Engine
 */

export const DIVISIONS = [
  { code: 'DHAKA', nameBn: 'ঢাকা', nameEn: 'Dhaka' },
  { code: 'CHATTOGRAM', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram' },
  { code: 'RAJSHAHI', nameBn: 'রাজশাহী', nameEn: 'Rajshahi' },
  { code: 'KHULNA', nameBn: 'খুলনা', nameEn: 'Khulna' },
  { code: 'BARISHAL', nameBn: 'বরিশাল', nameEn: 'Barishal' },
  { code: 'SYLHET', nameBn: 'সিলেট', nameEn: 'Sylhet' },
  { code: 'RANGPUR', nameBn: 'রংপুর', nameEn: 'Rangpur' },
  { code: 'MYMENSINGH', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh' },
]

export const DISTRICTS_BY_DIVISION = {
  DHAKA: [
    { code: 'DHAKA', nameBn: 'ঢাকা', nameEn: 'Dhaka' },
    { code: 'GAZIPUR', nameBn: 'গাজীপুর', nameEn: 'Gazipur' },
    { code: 'NARAYANGANJ', nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj' },
    { code: 'MANIKGANJ', nameBn: 'মানিকগঞ্জ', nameEn: 'Manikganj' },
    { code: 'MUNSHIGANJ', nameBn: 'মুন্সীগঞ্জ', nameEn: 'Munshiganj' },
  ],
  CHATTOGRAM: [
    { code: 'CHATTOGRAM', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram' },
    { code: 'COXS_BAZAR', nameBn: 'কক্সবাজার', nameEn: 'Cox\'s Bazar' },
    { code: 'CUMILLA', nameBn: 'কুমিল্লা', nameEn: 'Cumilla' },
  ],
  RAJSHAHI: [
    { code: 'RAJSHAHI', nameBn: 'রাজশাহী', nameEn: 'Rajshahi' },
    { code: 'BOGURA', nameBn: 'বগুড়া', nameEn: 'Bogura' },
    { code: 'PABNA', nameBn: 'পাবনা', nameEn: 'Pabna' },
  ],
  KHULNA: [
    { code: 'KHULNA', nameBn: 'খুলনা', nameEn: 'Khulna' },
    { code: 'JASHORE', nameBn: 'যশোর', nameEn: 'Jashore' },
  ],
  BARISHAL: [
    { code: 'BARISHAL', nameBn: 'বরিশাল', nameEn: 'Barishal' },
    { code: 'PATUAKHALI', nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali' },
  ],
  SYLHET: [
    { code: 'SYLHET', nameBn: 'সিলেট', nameEn: 'Sylhet' },
    { code: 'MOULVIBAZAR', nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar' },
  ],
  RANGPUR: [
    { code: 'RANGPUR', nameBn: 'রংপুর', nameEn: 'Rangpur' },
    { code: 'DINAJPUR', nameBn: 'দিনাজপুর', nameEn: 'Dinajpur' },
  ],
  MYMENSINGH: [
    { code: 'MYMENSINGH', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh' },
    { code: 'JAMALPUR', nameBn: 'জামালপুর', nameEn: 'Jamalpur' },
  ],
}

export const UPAZILAS_BY_DISTRICT = {
  DHAKA: [
    { code: 'DHANMONDI', nameBn: 'ধানমন্ডি', nameEn: 'Dhanmondi' },
    { code: 'GULSHAN', nameBn: 'গুলশান', nameEn: 'Gulshan' },
    { code: 'MIRPUR', nameBn: 'মিরপুর', nameEn: 'Mirpur' },
    { code: 'MOHAMMADPUR', nameBn: 'মোহাম্মদপুর', nameEn: 'Mohammadpur' },
    { code: 'TEJGAON', nameBn: 'তেজগাঁও', nameEn: 'Tejgaon' },
    { code: 'SAVAR', nameBn: 'সাভার', nameEn: 'Savar' },
  ],
  GAZIPUR: [
    { code: 'JOYDEBPUR', nameBn: 'জয়দেবপুর', nameEn: 'Joydebpur' },
    { code: 'KALIAKAIR', nameBn: 'কালিয়াকৈর', nameEn: 'Kaliakair' },
    { code: 'SREEPUR', nameBn: 'শ্রীপুর', nameEn: 'Sreepur' },
  ],
  NARAYANGANJ: [
    { code: 'NARAYANGANJ_SADAR', nameBn: 'নারায়ণগঞ্জ সদর', nameEn: 'Narayanganj Sadar' },
    { code: 'SONARGAON', nameBn: 'সোনারগাঁ', nameEn: 'Sonargaon' },
  ],
  CHATTOGRAM: [
    { code: 'KOTWALI_CTG', nameBn: 'কোতোয়ালী', nameEn: 'Kotwali' },
    { code: 'PANCHLAISH', nameBn: 'পাঁচলাইশ', nameEn: 'Panchlaish' },
    { code: 'PAHARTALI', nameBn: 'পাহাড়তলী', nameEn: 'Pahartali' },
  ],
  RAJSHAHI: [
    { code: 'BOALIA', nameBn: 'বোয়ালিয়া', nameEn: 'Boalia' },
    { code: 'RAJPARA', nameBn: 'রাজপাড়া', nameEn: 'Rajpara' },
  ],
  KHULNA: [
    { code: 'KHALISHPUR', nameBn: 'খালিশপুর', nameEn: 'Khalishpur' },
    { code: 'SONADANGA', nameBn: 'সোনাডাঙ্গা', nameEn: 'Sonadanga' },
  ],
  BARISHAL: [
    { code: 'BARISHAL_SADAR', nameBn: 'বরিশাল সদর', nameEn: 'Barishal Sadar' },
  ],
  SYLHET: [
    { code: 'SYLHET_SADAR', nameBn: 'সিলেট সদর', nameEn: 'Sylhet Sadar' },
  ],
  RANGPUR: [
    { code: 'RANGPUR_SADAR', nameBn: 'রংপুর সদর', nameEn: 'Rangpur Sadar' },
  ],
  MYMENSINGH: [
    { code: 'MYMENSINGH_SADAR', nameBn: 'ময়মনসিংহ সদর', nameEn: 'Mymensingh Sadar' },
  ],
}

export const MOUZAS_BY_UPAZILA = {
  DHANMONDI: [
    { code: 'DHANMONDI-01', nameBn: 'ধানমন্ডি-০১ (জেএল ১০)', nameEn: 'Dhanmondi-01', jl: '10' },
    { code: 'DHANMONDI-02', nameBn: 'ধানমন্ডি-০২ (জেএল ১১)', nameEn: 'Dhanmondi-02', jl: '11' },
  ],
  GULSHAN: [
    { code: 'GULSHAN-01', nameBn: 'গুলশান-০১ (জেএল ১৪)', nameEn: 'Gulshan-01', jl: '14' },
    { code: 'GULSHAN-02', nameBn: 'গুলশান-০২ (জেএল ১৫)', nameEn: 'Gulshan-02', jl: '15' },
  ],
  MIRPUR: [
    { code: 'MIRPUR-01', nameBn: 'মিরপুর-০১ (জেএল ১৯)', nameEn: 'Mirpur-01', jl: '19' },
    { code: 'MIRPUR-03', nameBn: 'মিরপুর-০৩ (জেএল ২০)', nameEn: 'Mirpur-03', jl: '20' },
  ],
  MOHAMMADPUR: [
    { code: 'MOHAMMADPUR-01', nameBn: 'মোহাম্মদপুর-০১ (জেএল ২২)', nameEn: 'Mohammadpur-01', jl: '22' },
  ],
  TEJGAON: [
    { code: 'TEJGAON-01', nameBn: 'তেজগাঁও-০১ (জেএল ২৫)', nameEn: 'Tejgaon-01', jl: '25' },
  ],
  SAVAR: [
    { code: 'SAVAR-01', nameBn: 'সাভার-০১ (জেএল ৩০)', nameEn: 'Savar-01', jl: '30' },
  ],
  JOYDEBPUR: [
    { code: 'JOYDEBPUR-01', nameBn: 'জয়দেবপুর-০১ (জেএল ০৫)', nameEn: 'Joydebpur-01', jl: '05' },
  ],
  NARAYANGANJ_SADAR: [
    { code: 'NARAYANGANJ-01', nameBn: 'নারায়ণগঞ্জ-০১ (জেএল ০৮)', nameEn: 'Narayanganj-01', jl: '08' },
  ],
  KOTWALI_CTG: [
    { code: 'ANDARKILLA-01', nameBn: 'আন্দরকিল্লা (জেএল ১২)', nameEn: 'Andarkilla-01', jl: '12' },
  ],
  BOALIA: [
    { code: 'BOALIA-01', nameBn: 'বোয়ালিয়া-০১ (জেএল ০৩)', nameEn: 'Boalia-01', jl: '03' },
  ],
  KHALISHPUR: [
    { code: 'KHALISHPUR-01', nameBn: 'খালিশপুর-০১ (জেএল ০৭)', nameEn: 'Khalishpur-01', jl: '07' },
  ],
  SYLHET_SADAR: [
    { code: 'KOTWALI_SYL-01', nameBn: 'কোটওয়ালী সিলেট (জেএল ০৯)', nameEn: 'Kotwali_Syl-01', jl: '09' },
  ],
  BARISHAL_SADAR: [
    { code: 'BARISHAL-01', nameBn: 'বরিশাল সদর (জেএল ০৪)', nameEn: 'Barishal-01', jl: '04' },
  ],
  RANGPUR_SADAR: [
    { code: 'RANGPUR-01', nameBn: 'রংপুর সদর (জেএল ০২)', nameEn: 'Rangpur-01', jl: '02' },
  ],
  MYMENSINGH_SADAR: [
    { code: 'MYMENSINGH-01', nameBn: 'ময়মনসিংহ সদর (জেএল ০৬)', nameEn: 'Mymensingh-01', jl: '06' },
  ],
}

/**
 * Seeded pilot parcels in Bangladesh
 * Allows instant demo lookup and direct queries to the live public-status API endpoint
 */
export const SEEDED_PARCEL_CATALOG = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    divisionCode: 'DHAKA',
    districtCode: 'DHAKA',
    upazilaCode: 'DHANMONDI',
    mouzaCode: 'DHANMONDI-01',
    khatianNumber: '101',
    khatianType: 'RS',
    dagNumber: '5001',
    jlNumber: '10',
    recordedArea: '10.50',
    areaUnit: 'শতাংশ (Decimal)',
    subParcelReference: 'PL-1',
    holdingNumber: 'HD-101/A',
    verificationStatus: 'VERIFIED',
    expectedDecision: 'BLOCKED_BY_VALID_ORDER',
    labelBn: 'ধানমন্ডি দাগ ৫০০১ (আদেশে অবরুদ্ধ ও বন্ধকযুক্ত)',
    courtOrder: {
      courtName: 'বিজ্ঞ সিনিয়র সহকারী জজ ১ম আদালত, ঢাকা',
      caseNumber: 'দেওয়ানি মোকদ্দমা নং OS-2024-00123',
      orderReference: 'ORD-DH-2024-991',
      orderType: 'অস্থায়ী নিষেধাজ্ঞা ও হস্তান্তর স্থগিতাদেশ (Injunction)',
      effectiveFrom: '২০২৪-০১-২০',
      effectiveUntil: '২০২৭-১২-৩১',
      transactionScope: 'SALE (বিক্রয় ও দলিল রেজিস্ট্রি সম্পূর্ণ স্থগিত)',
      approvalStatus: 'APPROVED',
      approverName: 'Judge / Approver Rahman',
    },
    mortgage: {
      lenderName: 'সোনালী ব্যাংক পিএলসি, ধানমন্ডি কর্পোরেট শাখা',
      lenderReference: 'MORT-DB-2023-001',
      securedArea: '১০.৫০ শতাংশ (সম্পূর্ণ জমি)',
      status: 'ACTIVE',
      registeredDate: '২০২৩-০৬-০১',
    },
    certificateStatus: 'BLOCKED',
    certificateMessage: 'আদালতের সক্রিয় আদেশের কারণে অনাপত্তি সনদপত্র অবরুদ্ধ।',
    sources: {
      court: 'যাচাইকৃত (বিজ্ঞ আদালত রেজিস্ট্রি)',
      bank: 'যাচাইকৃত (সক্রিয় বন্ধকী লিয়েন বিদ্যমান)',
      registry: 'যাচাইকৃত (সাব-রেজিস্ট্রি গেটকিপার লক সক্রিয়)',
      landOffice: 'যাচাইকৃত (এসি ল্যান্ড ডিজিটাল খতিয়ান)',
    },
  },
  {
    id: 'b2000000-0000-0000-0000-000000000002',
    divisionCode: 'DHAKA',
    districtCode: 'DHAKA',
    upazilaCode: 'GULSHAN',
    mouzaCode: 'GULSHAN-02',
    khatianNumber: '202',
    khatianType: 'RS',
    dagNumber: '6002',
    jlNumber: '15',
    recordedArea: '15.00',
    areaUnit: 'শতাংশ (Decimal)',
    subParcelReference: 'PL-2',
    holdingNumber: 'HD-202/B',
    verificationStatus: 'VERIFIED',
    expectedDecision: 'PENDING',
    labelBn: 'গুলশান দাগ ৬০০২ (মোকদ্দমা বিচারাধীন)',
    courtOrder: {
      courtName: 'বিজ্ঞ যুগ্ম জেলা জজ ২য় আদালত, ঢাকা',
      caseNumber: 'দেওয়ানি মোকদ্দমা নং MS-2024-00456',
      orderReference: 'ORD-DH-2024-992',
      orderType: 'বণ্টন মোকদ্দমা ও সীমানা বিরোধ (Injunction Pending)',
      effectiveFrom: '২০২৪-০২-১৫',
      effectiveUntil: 'বিচারাধীন',
      transactionScope: 'ALL (আইনি পরীক্ষা সাপেক্ষে)',
      approvalStatus: 'PENDING',
      approverName: 'আদেশ অনুমোদন প্রক্রিয়াধীন',
    },
    mortgage: null,
    certificateStatus: 'PENDING',
    certificateMessage: 'বিজ্ঞ আদালতের মোকদ্দমা ও আদেশ নিষ্পত্তি না হওয়া পর্যন্ত সনদপত্র বিবেচনাধীন।',
    sources: {
      court: 'যাচাইকৃত (দেওয়ানি মোকদ্দমা বিচারাধীন)',
      bank: 'দায়মুক্ত (কোনো সক্রিয় বন্ধক নেই)',
      registry: 'পর্যবেক্ষণে (গেটকিপার সতর্কতা সক্রিয়)',
      landOffice: 'যাচাইকৃত (এসি ল্যান্ড রেকর্ড আর্কাইভ)',
    },
  },
  {
    id: 'b3000000-0000-0000-0000-000000000003',
    divisionCode: 'DHAKA',
    districtCode: 'DHAKA',
    upazilaCode: 'MIRPUR',
    mouzaCode: 'MIRPUR-03',
    khatianNumber: '303',
    khatianType: 'RS',
    dagNumber: '7003',
    jlNumber: '20',
    recordedArea: '8.25',
    areaUnit: 'শতাংশ (Decimal)',
    subParcelReference: 'PL-3',
    holdingNumber: 'HD-303/C',
    verificationStatus: 'VERIFIED',
    expectedDecision: 'CLEAR',
    labelBn: 'মিরপুর দাগ ৭০০৩ (ঝুঁকিমুক্ত ও লেনদেনযোগ্য)',
    courtOrder: null,
    mortgage: {
      lenderName: 'সোনালী ব্যাংক পিএলসি',
      lenderReference: 'MORT-DB-2022-099',
      releaseReference: 'REL-DB-2023-045',
      status: 'RELEASED',
      registeredDate: '২০২২-০৫-১০',
      releasedDate: '২০২৩-০৫-১০',
    },
    certificateStatus: 'AVAILABLE',
    certificateMessage: 'অনলাইন আইনি-ঝুঁকিমুক্ত অনাপত্তি যাচাই সনদপত্র প্রস্তুত (ডাউনলোডযোগ্য)।',
    sources: {
      court: 'যাচাইকৃত (কোনো নিষেধাজ্ঞা বা মামলা নেই)',
      bank: 'দায়মুক্ত (বন্ধক আনুষ্ঠানিকভাবে অবমুক্ত)',
      registry: 'ক্লিয়ারেন্স উন্মুক্ত (সাব-রেজিস্ট্রি গেটকিপার ক্লিয়ার)',
      landOffice: 'যাচাইকৃত (ডিজিটাল পর্চা প্রতিপাদিত)',
    },
  },
  {
    id: 'b4000000-0000-0000-0000-000000000004',
    divisionCode: 'DHAKA',
    districtCode: 'GAZIPUR',
    upazilaCode: 'JOYDEBPUR',
    mouzaCode: 'JOYDEBPUR-01',
    khatianNumber: '404',
    khatianType: 'RS',
    dagNumber: '8004',
    jlNumber: '05',
    recordedArea: '12.00',
    areaUnit: 'শতাংশ (Decimal)',
    subParcelReference: 'PL-4',
    holdingNumber: 'HD-404/D',
    verificationStatus: 'VERIFIED',
    expectedDecision: 'MORTGAGE_REQUIRES_RELEASE',
    labelBn: 'জয়দেবপুর দাগ ৮০০৪ (ব্যাংকে বন্ধকযুক্ত - দায়মুক্তি আবশ্যক)',
    courtOrder: null,
    mortgage: {
      lenderName: 'অগ্রণী ব্যাংক পিএলসি, জয়দেবপুর শাখা',
      lenderReference: 'MORT-AGR-2024-512',
      securedArea: '১২.০০ শতাংশ (সম্পূর্ণ দাগ)',
      status: 'ACTIVE',
      registeredDate: '২০২৪-০৩-১১',
    },
    certificateStatus: 'CONDITIONAL',
    certificateMessage: 'ব্যাংক হতে লিয়েন অবমুক্তি পত্র (NOC) দাখিল সাপেক্ষে কার্যকর।',
    sources: {
      court: 'যাচাইকৃত (কোনো আদালতের নিষেধাজ্ঞা নেই)',
      bank: 'সতর্কতা (সক্রিয় বাণিজ্যিক বন্ধক বহাল)',
      registry: 'শর্তাধীন গেটকিপার (ব্যাংক NOC বাধ্যতামূলক)',
      landOffice: 'যাচাইকৃত (এসি ল্যান্ড ডিজিটাল রেকর্ড)',
    },
  },
  {
    id: 'b5000000-0000-0000-0000-000000000005',
    divisionCode: 'DHAKA',
    districtCode: 'DHAKA',
    upazilaCode: 'TEJGAON',
    mouzaCode: 'TEJGAON-01',
    khatianNumber: '505',
    khatianType: 'RS',
    dagNumber: '9005',
    jlNumber: '25',
    recordedArea: '6.50',
    areaUnit: 'শতাংশ (Decimal)',
    subParcelReference: 'PL-5',
    holdingNumber: 'HD-505/E',
    verificationStatus: 'UNVERIFIED',
    expectedDecision: 'UNKNOWN',
    labelBn: 'তেজগাঁও দাগ ৯০৫৫ (অসম্পূর্ণ রেকর্ড / অজানা স্থিতি)',
    courtOrder: null,
    mortgage: null,
    certificateStatus: 'UNAVAILABLE',
    certificateMessage: 'রেকর্ড অপূর্ণ বা অপ্রতুল তথ্যের কারণে কোনো সনদপত্র প্রযোজ্য নয়।',
    sources: {
      court: 'অনির্ধারিত (আদালত নথির সাথে সংযোগ নেই)',
      bank: 'অনির্ধারিত (ব্যাংকিং লিয়েন রেকর্ড অপ্রাপ্য)',
      registry: 'অনির্ধারিত (সাব-রেজিস্ট্রি গেটকিপার অপর্যাপ্ত ডেটা)',
      landOffice: 'অসম্পূর্ণ (পর্চা ডিজিটালকরণ অসমাপ্ত)',
    },
  },
]
