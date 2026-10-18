/**
 * Design system constants and localization maps for LandLock Engine
 * GovTech design system for Bangladesh Land Legal-Risk Verification Portal
 */

export const ROLE_BN = {
  SYSTEM_ADMIN: 'সিস্টেম প্রশাসক',
  COURT_OFFICER: 'আদালত কর্মকর্তা',
  ORDER_APPROVER: 'আদেশ অনুমোদনকারী',
  LAND_OFFICER: 'ভূমি কর্মকর্তা',
  REGISTRY_OFFICER: 'রেজিস্ট্রি কর্মকর্তা',
  BANK_OFFICER: 'ব্যাংক কর্মকর্তা',
  AUDITOR: 'অডিটর',
  CITIZEN: 'নাগরিক',
}

export const ROLE_EN = {
  SYSTEM_ADMIN: 'System Admin',
  COURT_OFFICER: 'Court Officer',
  ORDER_APPROVER: 'Order Approver',
  LAND_OFFICER: 'Land Revenue Officer',
  REGISTRY_OFFICER: 'Sub-Registry Officer',
  BANK_OFFICER: 'Bank Credit Officer',
  AUDITOR: 'System Auditor',
  CITIZEN: 'Citizen / Stakeholder',
}

export const STATUS_DEFINITIONS = {
  CLEAR: {
    key: 'CLEAR',
    labelBn: 'পরিষ্কার (নিষেধাজ্ঞামুক্ত)',
    labelEn: 'Clear (No Active Injunction)',
    variant: 'success',
    severity: 'low',
    description: 'উক্ত সম্পত্তিতে কোনো সক্রিয় আইনি নিষেধাজ্ঞা বা বিচারাধীন বাধা নেই।',
  },
  VERIFIED: {
    key: 'VERIFIED',
    labelBn: 'যাচাইকৃত',
    labelEn: 'Verified',
    variant: 'success',
    severity: 'low',
    description: 'রেকর্ড ও স্বত্ব পরীক্ষাপূর্বক বৈধ মর্মে প্রতিপাদিত।',
  },
  APPROVED: {
    key: 'APPROVED',
    labelBn: 'অনুমোদিত',
    labelEn: 'Approved',
    variant: 'success',
    severity: 'low',
    description: 'বিজ্ঞ কর্তৃপক্ষ কর্তৃক আদেশ বা আবেদন অনুমোদিত হয়েছে।',
  },
  RELEASED: {
    key: 'RELEASED',
    labelBn: 'দায়মুক্ত',
    labelEn: 'Released / Discharged',
    variant: 'success',
    severity: 'low',
    description: 'পূর্বে আরোপিত নিষেধাজ্ঞা বা বন্ধকী দায় আনুষ্ঠানিকভাবে অবমুক্ত।',
  },
  BLOCKED_BY_VALID_ORDER: {
    key: 'BLOCKED_BY_VALID_ORDER',
    labelBn: 'বৈধ আদেশে অবরুদ্ধ',
    labelEn: 'Blocked by Court Order',
    variant: 'danger',
    severity: 'high',
    description: 'বিজ্ঞ আদালতের বৈধ নিষেধাজ্ঞা বা স্থগিতাদেশের কারণে লেনদেন সম্পূর্ণ স্থগিত।',
  },
  ACTIVE: {
    key: 'ACTIVE',
    labelBn: 'সক্রিয় নিষেধাজ্ঞা',
    labelEn: 'Active Restriction',
    variant: 'danger',
    severity: 'high',
    description: 'সম্পত্তির উপর বলবৎ আদেশ কার্যকর অবস্থায় রয়েছে।',
  },
  REJECTED: {
    key: 'REJECTED',
    labelBn: 'প্রত্যাখ্যাত',
    labelEn: 'Rejected',
    variant: 'danger',
    severity: 'high',
    description: 'আবেদন বা খসড়া আদেশ যথাযথ কর্তৃপক্ষ কর্তৃক বাতিল করা হয়েছে।',
  },
  REVIEW_REQUIRED: {
    key: 'REVIEW_REQUIRED',
    labelBn: 'পর্যালোচনা প্রয়োজন',
    labelEn: 'Review Required',
    variant: 'warning',
    severity: 'medium',
    description: 'বিচারাধীন দেওয়ানি মোকদ্দমা বা অস্পষ্ট রেকর্ড বিদ্যমান, আইনি পরীক্ষা আবশ্যক।',
  },
  PENDING: {
    key: 'PENDING',
    labelBn: 'বিবেচনাধীন',
    labelEn: 'Pending Decision',
    variant: 'warning',
    severity: 'medium',
    description: 'অনুমোদনকারী কর্মকর্তার সিদ্ধান্তের অপেক্ষায় রয়েছে।',
  },
  IN_PROGRESS: {
    key: 'IN_PROGRESS',
    labelBn: 'প্রক্রিয়াধীন',
    labelEn: 'In Progress',
    variant: 'info',
    severity: 'medium',
    description: 'যাচাইকরণ বা নিরীক্ষা কার্যক্রম চলমান রয়েছে।',
  },
  MORTGAGE_REQUIRES_RELEASE: {
    key: 'MORTGAGE_REQUIRES_RELEASE',
    labelBn: 'বন্ধক মুক্তি আবশ্যক',
    labelEn: 'Mortgage / Lien Active',
    variant: 'warning',
    severity: 'medium',
    description: 'আর্থিক প্রতিষ্ঠানের অনুকূলে সক্রিয় বন্ধক রয়েছে, লেনদেনের পূর্বে অনাপত্তি (NOC) দাখিল আবশ্যক।',
  },
  DRAFT: {
    key: 'DRAFT',
    labelBn: 'খসড়া',
    labelEn: 'Draft',
    variant: 'neutral',
    severity: 'low',
    description: 'আদেশ বা নথির খসড়া প্রস্তুতকৃত, চূড়ান্ত স্বাক্ষরের অপেক্ষায়।',
  },
  SYSTEM_UNAVAILABLE: {
    key: 'SYSTEM_UNAVAILABLE',
    labelBn: 'সিস্টেম অনুপলব্ধ',
    labelEn: 'System Unavailable',
    variant: 'neutral',
    severity: 'medium',
    description: 'সার্ভার বা ডেটাবেজ সংযোগে সাময়িক বিঘ্ন।',
  },
  UNKNOWN: {
    key: 'UNKNOWN',
    labelBn: 'অনির্ধারিত / তথ্য অপূর্ণ',
    labelEn: 'Unknown / Incomplete Data',
    variant: 'neutral',
    severity: 'medium',
    description: 'প্রয়োজনীয় রেকর্ডের ঘাটতি বা সিস্টেম অসঙ্গতির কারণে আইনি অবস্থা নিশ্চিত করা যায়নি। এটি ঝুঁকিমুক্ত হিসেবে গণ্য নয়।',
  },
  SUBMITTED: {
    key: 'SUBMITTED',
    labelBn: 'দাখিলকৃত (অনুমোদন অপেক্ষমাণ)',
    labelEn: 'Submitted for Approval',
    variant: 'info',
    severity: 'medium',
    description: 'আদেশটি প্রস্তুত করে বিচারিক স্বাক্ষরের জন্য পেশ করা হয়েছে।',
  },
  UNDER_REVIEW: {
    key: 'UNDER_REVIEW',
    labelBn: 'পর্যালোচনাধীন',
    labelEn: 'Under Review',
    variant: 'info',
    severity: 'medium',
    description: 'বিজ্ঞ আদালত বা অনুমোদনকারী বিচারক কর্তৃক আদেশটি নিরীক্ষণ করা হচ্ছে।',
  },
  PENDING_APPROVAL: {
    key: 'PENDING_APPROVAL',
    labelBn: 'অনুমোদনের অপেক্ষায়',
    labelEn: 'Pending Approval',
    variant: 'warning',
    severity: 'medium',
    description: 'বিজ্ঞ বিচারক বা অনুমোদনকারী কর্মকর্তার স্বাক্ষরের অপেক্ষায় রয়েছে।',
  },
  AMENDED: {
    key: 'AMENDED',
    labelBn: 'সংশোধিত',
    labelEn: 'Amended',
    variant: 'warning',
    severity: 'medium',
    description: 'আদালতের পরবর্তী আদেশে পূর্বের আদেশের শর্তাবলি পরিমার্জন বা সংশোধন করা হয়েছে।',
  },
  EXPIRED: {
    key: 'EXPIRED',
    labelBn: 'মেয়াদোত্তীর্ণ',
    labelEn: 'Expired',
    variant: 'neutral',
    severity: 'low',
    description: 'আদেশের কার্যকর সময়সীমা সমাপ্ত হয়েছে এবং নতুন কোনো মেয়াদ বৃদ্ধি আদেশ নেই।',
  },
  SUSPENDED: {
    key: 'SUSPENDED',
    labelBn: 'সাময়িক স্থগিত',
    labelEn: 'Suspended',
    variant: 'warning',
    severity: 'medium',
    description: 'উচ্চ আদালত বা বিচারিক আদেশে সাময়িকভাবে স্থগিতাদেশ বলবৎ।',
  },
  REVOKED: {
    key: 'REVOKED',
    labelBn: 'প্রত্যাহারকৃত / বাতিল',
    labelEn: 'Revoked',
    variant: 'danger',
    severity: 'high',
    description: 'বিজ্ঞ আদালত কর্তৃক পূর্ববর্তী আদেশটি বাতিল বা প্রত্যাহার করা হয়েছে।',
  },
  DISPUTED: {
    key: 'DISPUTED',
    labelBn: 'বিরোধপূর্ণ বন্ধক',
    labelEn: 'Disputed Mortgage',
    variant: 'warning',
    severity: 'medium',
    description: 'বন্ধকী চুক্তি বা স্বত্ব নিয়ে আইনি বিরোধ বা আপত্তি উত্থাপিত হয়েছে।',
  },
  RELEASE_PENDING: {
    key: 'RELEASE_PENDING',
    labelBn: 'অবমুক্তি প্রক্রিয়াধীন',
    labelEn: 'Release Pending Verification',
    variant: 'info',
    severity: 'medium',
    description: 'ব্যাংক কর্তৃক অনাপত্তিপত্র দাখিল করা হয়েছে, চূড়ান্ত যাচাই প্রক্রিয়াধীন।',
  },
  RELEASE_REQUESTED: {
    key: 'RELEASE_REQUESTED',
    labelBn: 'অবমুক্তির আবেদন দাখিলকৃত',
    labelEn: 'Release Requested',
    variant: 'info',
    severity: 'medium',
    description: 'ঋণগ্রহীতার দায়মুক্তির আবেদন ও অনাপত্তিপত্র দপ্তরে বিবেচনাধীন।',
  },
}

export const ORDER_TYPES_BN = {
  INJUNCTION: 'নিষেধাজ্ঞা (Injunction)',
  STATUS_QUO: 'স্থিতাবস্থা (Status Quo)',
  ATTACHMENT: 'ক্রোকের আদেশ (Attachment)',
  STAY_ORDER: 'স্থগিতাদেশ (Stay Order)',
  TITLE_DECLARATION: 'স্বত্ব ঘোষণা (Title Declaration)',
  OTHER: 'অন্যান্য (Other)',
}

export const TRANSACTION_SCOPES_BN = {
  ALL: 'সর্বপ্রকার হস্তান্তর ও নামজারি নিষিদ্ধ (ALL)',
  SALE: 'বিক্রয় ও সাফ-কবলা দলিল নিষিদ্ধ (SALE)',
  GIFT: 'দান বা হেবা নিষিদ্ধ (GIFT)',
  MORTGAGE: 'বন্ধক ও লিয়েন নিষিদ্ধ (MORTGAGE)',
  LEASE: 'ইজারা বা বন্দোবস্ত নিষিদ্ধ (LEASE)',
  HEIRSHIP_TRANSFER: 'ওয়ারিশ সূত্রে নামজারি নিষিদ্ধ (HEIRSHIP)',
  OTHER: 'অন্যান্য বিশেষ শর্ত (OTHER)',
}

export const CASE_TYPES_BN = {
  CIVIL_SUIT: 'দেওয়ানি মোকদ্দমা (Civil Suit)',
  LAND_DISPUTE: 'জমি বিরোধ মোকদ্দমা (Land Dispute)',
  WRIT_PETITION: 'রিট পিটিশন (Writ Petition)',
  TITLE_SUIT: 'স্বত্ব সাব্যস্তের মামলা (Title Suit)',
  PARTITION_SUIT: 'বণ্টন বা বাঁটোয়ারা মামলা (Partition Suit)',
  OTHER: 'অন্যান্য বিচারিক মামলা (Other)',
}

export const MORTGAGE_STATUSES_BN = {
  ACTIVE: 'সক্রিয় বন্ধক (Active Mortgage)',
  RELEASED: 'দায়মুক্ত / অবমুক্ত (Released)',
  DISPUTED: 'বিরোধপূর্ণ বন্ধক (Disputed)',
  RELEASE_PENDING: 'অবমুক্তি প্রক্রিয়াধীন (Pending)',
  RELEASE_REQUESTED: 'অবমুক্তির আবেদন (Requested)',
}

export const MORTGAGE_SCOPE_TYPES_BN = {
  FULL_PARCEL: 'সম্পূর্ণ দাগ (Full Parcel)',
  PORTION: 'অংশবিশেষ / খণ্ডাংশ (Portion)',
  SHARE: 'সুনির্দিষ্ট হিস্যা (Share)',
}

/**
 * Convert Latin digits to Bengali digits
 */
export function toBengaliNumber(num) {
  if (num === null || num === undefined) return ''
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return String(num).replace(/[0-9]/g, (d) => bnDigits[d])
}

export const AUDIT_ACTIONS_BN = {
  REGISTRY_CHECK: 'রেজিস্ট্রি গেটকিপার যাচাই (Registry Check)',
  CREATE_ORDER: 'আদেশের খসড়া প্রস্তুত (Draft Order)',
  SUBMIT_ORDER: 'আদেশ দাখিল (Submit Order)',
  APPROVE_ORDER: 'আদেশ অনুমোদন (Approve Order)',
  REJECT_ORDER: 'আদেশ প্রত্যাখ্যান (Reject Order)',
  AMEND_ORDER: 'আদেশ সংশোধন (Amend Order)',
  RELEASE_ORDER: 'আদেশ প্রত্যাহার (Release Order)',
  REGISTER_MORTGAGE: 'ব্যাংক বন্ধক নিবন্ধন (Register Mortgage)',
  CREATE_MORTGAGE: 'ব্যাংক বন্ধক নিবন্ধন (Create Mortgage)',
  RELEASE_MORTGAGE: 'বন্ধক অবমুক্তি (Release Mortgage)',
  CREATE_PARCEL: 'পার্সেল নিবন্ধন (Create Parcel)',
  UPDATE_PARCEL: 'পার্সেল হালনাগাদ (Update Parcel)',
  CREATE_RESTRICTION: 'আইনি নিষেধাজ্ঞা বলবৎ (Apply Restriction)',
  RELEASE_RESTRICTION: 'নিষেধাজ্ঞা প্রত্যাহার (Release Restriction)',
  CREATE_CASE: 'মামলা নথিভুক্তকরণ (Create Case)',
  USER_LOGIN: 'ব্যবহারকারী লগইন (User Login)',
}

export const KNOWN_ACTORS = {
  'a1000000-0000-0000-0000-000000000001': {
    name: 'Court Clerk Tariq',
    username: 'court_officer1',
    role: 'COURT_OFFICER',
    roleBn: 'আদালত কর্মকর্তা',
    instBn: 'ঢাকার বিজ্ঞ দেওয়ানি আদালত',
  },
  'a2000000-0000-0000-0000-000000000002': {
    name: 'Judge / Approver Rahman',
    username: 'order_approver1',
    role: 'ORDER_APPROVER',
    roleBn: 'বিজ্ঞ বিচারক / অনুমোদনকারী',
    instBn: 'ঢাকার বিজ্ঞ দেওয়ানি আদালত',
  },
  'a3000000-0000-0000-0000-000000000003': {
    name: 'AC Land Officer Hasan',
    username: 'land_officer1',
    role: 'LAND_OFFICER',
    roleBn: 'সহকারী কমিশনার (ভূমি)',
    instBn: 'সহকারী কমিশনার (ভূমি) কার্যালয়',
  },
  'a4000000-0000-0000-0000-000000000004': {
    name: 'Sub-Registrar Chowdhury',
    username: 'registry_officer1',
    role: 'REGISTRY_OFFICER',
    roleBn: 'সাব-রেজিস্ট্রার',
    instBn: 'সাব-রেজিস্ট্রি অফিস, ঢাকা সদর',
  },
  'a5000000-0000-0000-0000-000000000005': {
    name: 'Credit Officer Ahmed',
    username: 'bank_officer1',
    role: 'BANK_OFFICER',
    roleBn: 'ব্যাংক ক্রেডিট অফিসার',
    instBn: 'ডেমো কমার্শিয়াল ব্যাংক পিএলসি',
  },
  'a6000000-0000-0000-0000-000000000006': {
    name: 'Chief Inspector Auditor Khan',
    username: 'auditor1',
    role: 'AUDITOR',
    roleBn: 'প্রধান অডিটর ও পরিদর্শক',
    instBn: 'ভূমি নিরীক্ষা অধিদপ্তর',
  },
  'a7000000-0000-0000-0000-000000000007': {
    name: 'System Administrator Admin',
    username: 'admin1',
    role: 'SYSTEM_ADMIN',
    roleBn: 'সিস্টেম প্রশাসক',
    instBn: 'ভূমি তথ্য ও প্রযুক্তি সেল',
  },
  'a8000000-0000-0000-0000-000000000008': {
    name: 'Citizen Karim',
    username: 'citizen1',
    role: 'CITIZEN',
    roleBn: 'সাধারণ নাগরিক',
    instBn: 'নাগরিক উন্মুক্ত পোর্টাল',
  },
}

export const KNOWN_INSTITUTIONS = {
  '10000000-0000-0000-0000-000000000001': 'বিজ্ঞ দেওয়ানি আদালত, ঢাকা (Court)',
  '20000000-0000-0000-0000-000000000002': 'সহকারী কমিশনার (ভূমি) কার্যালয় (AC Land)',
  '30000000-0000-0000-0000-000000000003': 'সাব-রেজিস্ট্রি অফিস, ঢাকা সদর (Sub-Registry)',
  '40000000-0000-0000-0000-000000000004': 'ডেমো কমার্শিয়াল ব্যাংক পিএলসি (Commercial Bank)',
}
