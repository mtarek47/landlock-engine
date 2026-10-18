import {
  Home,
  Search,
  FileText,
  FilePlus,
  ClipboardCheck,
  ClipboardList,
  Shield,
  BarChart3,
  Scale,
  Landmark,
  ShieldAlert,
  Users,
  Settings,
  Bell,
  HelpCircle,
  PhoneCall,
  User,
  Clock,
  Award,
  LayoutDashboard,
  Map,
} from 'lucide-react'

/**
 * Role Metadata & Localization
 */
export const ROLE_PROFILES = {
  CITIZEN: {
    key: 'CITIZEN',
    titleBn: 'নাগরিক ব্যবহারকারী',
    titleEn: 'Citizen / Land Buyer',
    institutionType: 'নাগরিক সেবা',
    badgeVariant: 'neutral',
    description: 'ভূমি ক্রয়-বিক্রয় পূর্ববর্তী আইনি ঝুঁকি ও স্বত্ব যাচাইকরণ পোর্টাল।',
  },
  COURT_OFFICER: {
    key: 'COURT_OFFICER',
    titleBn: 'আদালত কর্মকর্তা',
    titleEn: 'Court Bench Officer',
    institutionType: 'বিচার বিভাগ',
    badgeVariant: 'info',
    description: 'দেওয়ানি আদালতের মোকদ্দমা ও অস্থায়ী নিষেধাজ্ঞা খসড়া নিবন্ধন ও ব্যবস্থাপনা।',
  },
  ORDER_APPROVER: {
    key: 'ORDER_APPROVER',
    titleBn: 'আদেশ অনুমোদনকারী বিচারক',
    titleEn: 'Judicial Order Approver',
    institutionType: 'বিচারিক এখতিয়ার',
    badgeVariant: 'warning',
    description: 'আদালতের খসড়া নিষেধাজ্ঞা ও স্থগিতাদেশ পর্যালোচনান্তে ডিজিটাল স্বাক্ষর প্রদান।',
  },
  REGISTRY_OFFICER: {
    key: 'REGISTRY_OFFICER',
    titleBn: 'সাব-রেজিস্ট্রি কর্মকর্তা',
    titleEn: 'Sub-Registry Gatekeeper',
    institutionType: 'নিবন্ধন পরিদপ্তর',
    badgeVariant: 'success',
    description: 'দলিল নিবন্ধনের পূর্বে আদালতের স্থগিতাদেশ ও ব্যাংক লিয়েনের স্বয়ংক্রিয় গেটকিপার যাচাই।',
  },
  BANK_OFFICER: {
    key: 'BANK_OFFICER',
    titleBn: 'ব্যাংক ক্রেডিট কর্মকর্তা',
    titleEn: 'Bank Mortgage Officer',
    institutionType: 'আর্থিক প্রতিষ্ঠান',
    badgeVariant: 'warning',
    description: 'ঋণের বিপরীতে জমি বন্ধক নিবন্ধন এবং ঋণ পরিশোধান্তে অনাপত্তিপত্র (NOC) ব্যবস্থাপনা।',
  },
  AUDITOR: {
    key: 'AUDITOR',
    titleBn: 'সিস্টেম অডিটর',
    titleEn: 'Independent System Auditor',
    institutionType: 'নিরীক্ষা ও পরিদর্শন',
    badgeVariant: 'danger',
    description: 'সকল লেনদেন, বিচারিক আদেশ ও গেটকিপার সিদ্ধান্তের অপরিবর্তনীয় অডিট ট্রেইল পরিদর্শন।',
  },
  SYSTEM_ADMIN: {
    key: 'SYSTEM_ADMIN',
    titleBn: 'সিস্টেম প্রশাসক',
    titleEn: 'System Administrator',
    institutionType: 'সেন্ট্রাল আইটি প্রশাসন',
    badgeVariant: 'danger',
    description: 'ব্যবহারকারী ভূমিকা, প্রাতিষ্ঠানিক এক্সেস এবং সিস্টেম অখণ্ডতা প্রশাসন।',
  },
  LAND_OFFICER: {
    key: 'LAND_OFFICER',
    titleBn: 'সহকারী কমিশনার (ভূমি)',
    titleEn: 'Assistant Commissioner (Land)',
    institutionType: 'ভূমি প্রশাসন',
    badgeVariant: 'success',
    description: 'মৌজা, খতিয়ান, দাগ ও রেকর্ডীয় মালিকানার ডিজিটাল ডাটাবেজ সমন্বয়।',
  },
}

/**
 * Role-Based Navigation Trees matching the 9 screens in the reference image
 */
export const ROLE_NAVIGATION = {
  // Screen 2: Citizen Land Search Sidebar
  CITIZEN: [
    {
      group: 'নাগরিক সেবা',
      items: [
        {
          path: '/',
          labelBn: 'হোম',
          labelEn: 'Home',
          icon: Home,
        },
        {
          path: '/citizen',
          labelBn: 'জমি অনুসন্ধান',
          labelEn: 'Land Search',
          icon: Search,
        },
        {
          path: '/map',
          labelBn: 'মৌজা নকশা (GIS)',
          labelEn: 'Mouza Cadastral Map',
          icon: Map,
        },
        {
          path: '/parcels',
          labelBn: 'অনুসন্ধান ইতিহাস',
          labelEn: 'Search History',
          icon: Clock,
        },
        {
          path: '/dashboard',
          labelBn: 'প্রোফাইল',
          labelEn: 'Profile',
          icon: User,
        },
        {
          path: '/#faq',
          labelBn: 'সহায়তা',
          labelEn: 'Help',
          icon: HelpCircle,
        },
        {
          path: '/#contact',
          labelBn: 'যোগাযোগ',
          labelEn: 'Contact',
          icon: PhoneCall,
        },
      ],
    },
  ],

  // Screen 4: Court Order Portal Sidebar
  COURT_OFFICER: [
    {
      group: 'কোর্ট অর্ডার পোর্টাল',
      items: [
        {
          path: '/',
          labelBn: 'হোম',
          labelEn: 'Home',
          icon: Home,
        },
        {
          path: '/dashboard',
          labelBn: 'কোর্ট ড্যাশবোর্ড',
          labelEn: 'Court Dashboard',
          icon: LayoutDashboard,
        },
        {
          path: '/cases',
          labelBn: 'নতুন আদেশ',
          labelEn: 'New Order',
          icon: FilePlus,
        },
        {
          path: '/cases?tab=list',
          labelBn: 'আদেশসমূহ',
          labelEn: 'Orders List',
          icon: ClipboardList,
        },
        {
          path: '/parcels',
          labelBn: 'অনুসন্ধানের জন্য',
          labelEn: 'For Search',
          icon: Search,
        },
        {
          path: '/audit',
          labelBn: 'ইতিহাস',
          labelEn: 'History',
          icon: Clock,
        },
        {
          path: '/dashboard',
          labelBn: 'প্রোফাইল',
          labelEn: 'Profile',
          icon: User,
        },
        {
          path: '/#faq',
          labelBn: 'সহায়তা',
          labelEn: 'Help',
          icon: HelpCircle,
        },
      ],
    },
  ],

  ORDER_APPROVER: [
    {
      group: 'বিচারিক স্বাক্ষর ও অনুমোদন',
      items: [
        {
          path: '/dashboard',
          labelBn: 'বিচারিক ড্যাশবোর্ড',
          labelEn: 'Judicial Overview',
          icon: Home,
        },
        {
          path: '/approvals',
          labelBn: 'আদেশ অনুমোদন অপেক্ষমাণ',
          labelEn: 'Judicial Approvals Queue',
          icon: Scale,
        },
        {
          path: '/cases',
          labelBn: 'মামলা ও বিচারিক নথি',
          labelEn: 'Cases & Court Orders',
          icon: FileText,
        },
        {
          path: '/parcels',
          labelBn: 'দাগ ও খতিয়ান রেকর্ড',
          labelEn: 'Parcels & Property Scope',
          icon: Search,
        },
      ],
    },
  ],

  // Screen 5: Registry Officer Decision Console Sidebar
  REGISTRY_OFFICER: [
    {
      group: 'রেজিস্ট্রি অফিসার কনসোল',
      items: [
        {
          path: '/dashboard',
          labelBn: 'ড্যাশবোর্ড',
          labelEn: 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          path: '/registry',
          labelBn: 'যাচাই তালিকা',
          labelEn: 'Verification List',
          icon: ClipboardCheck,
        },
        {
          path: '/approvals',
          labelBn: 'সিদ্ধান্ত অনুমোদন',
          labelEn: 'Decision Approval',
          icon: Scale,
        },
        {
          path: '/parcels',
          labelBn: 'রেজিস্ট্রি রেকর্ড',
          labelEn: 'Registry Record',
          icon: FileText,
        },
        {
          path: '/verify',
          labelBn: 'সার্টিফিকেট',
          labelEn: 'Certificate',
          icon: Award,
        },
        {
          path: '/dashboard',
          labelBn: 'প্রোফাইল',
          labelEn: 'Profile',
          icon: User,
        },
        {
          path: '/#faq',
          labelBn: 'সহায়তা',
          labelEn: 'Help',
          icon: HelpCircle,
        },
      ],
    },
  ],

  // Screen 6: Bank Portal Sidebar
  BANK_OFFICER: [
    {
      group: 'ব্যাংক পোর্টাল',
      items: [
        {
          path: '/dashboard',
          labelBn: 'ড্যাশবোর্ড',
          labelEn: 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          path: '/mortgages',
          labelBn: 'বন্ধক নিবন্ধন',
          labelEn: 'Mortgage Register',
          icon: Landmark,
        },
        {
          path: '/mortgages?tab=list',
          labelBn: 'বন্ধক তালিকা',
          labelEn: 'Mortgage List',
          icon: ClipboardList,
        },
        {
          path: '/mortgages?tab=history',
          labelBn: 'ট্রানজেকশন ইতিহাস',
          labelEn: 'Transaction History',
          icon: Clock,
        },
        {
          path: '/dashboard',
          labelBn: 'প্রোফাইল',
          labelEn: 'Profile',
          icon: User,
        },
        {
          path: '/#faq',
          labelBn: 'সহায়তা',
          labelEn: 'Help',
          icon: HelpCircle,
        },
      ],
    },
  ],

  // Screen 7: Audit Trail & Admin Dashboard Sidebar
  AUDITOR: [
    {
      group: 'অডিট ট্রেইল ও অ্যাডমিন ড্যাশবোর্ড',
      items: [
        {
          path: '/audit',
          labelBn: 'অডিট লগ',
          labelEn: 'Audit Log',
          icon: BarChart3,
        },
        {
          path: '/audit?tab=sources',
          labelBn: 'উৎস ট্র্যাকিং',
          labelEn: 'Source Tracking',
          icon: Search,
        },
        {
          path: '/audit?tab=users',
          labelBn: 'ব্যবহারকারী ব্যবস্থাপনা',
          labelEn: 'User Management',
          icon: Users,
        },
        {
          path: '/audit?tab=roles',
          labelBn: 'রোল ও পারমিশন',
          labelEn: 'Roles & Permissions',
          icon: ShieldAlert,
        },
        {
          path: '/audit?tab=settings',
          labelBn: 'সিস্টেম সেটিংস',
          labelEn: 'System Settings',
          icon: Settings,
        },
        {
          path: '/audit?tab=notifications',
          labelBn: 'নোটিফিকেশন',
          labelEn: 'Notifications',
          icon: Bell,
        },
      ],
    },
  ],

  SYSTEM_ADMIN: [
    {
      group: 'সিস্টেম মডিউলসমূহ',
      items: [
        {
          path: '/dashboard',
          labelBn: 'প্রধান ড্যাশবোর্ড',
          labelEn: 'System Overview',
          icon: LayoutDashboard,
        },
        {
          path: '/cases',
          labelBn: 'কোর্ট অর্ডার পোর্টাল',
          labelEn: 'Court Portal',
          icon: FilePlus,
        },
        {
          path: '/approvals',
          labelBn: 'বিচারিক অনুমোদন',
          labelEn: 'Judicial Approvals',
          icon: Scale,
        },
        {
          path: '/registry',
          labelBn: 'রেজিস্ট্রি কনসোল',
          labelEn: 'Registry Gatekeeper',
          icon: ClipboardCheck,
        },
        {
          path: '/mortgages',
          labelBn: 'ব্যাংক বন্ধক পোর্টাল',
          labelEn: 'Bank Mortgages',
          icon: Landmark,
        },
        {
          path: '/map',
          labelBn: 'মৌজা নকশা (GIS)',
          labelEn: 'Mouza Cadastral GIS',
          icon: Map,
        },
        {
          path: '/parcels',
          labelBn: 'জমি ও খতিয়ান রেকর্ড',
          labelEn: 'Parcels & Records',
          icon: Search,
        },
        {
          path: '/audit',
          labelBn: 'অডিট লগ ও নিরীক্ষা',
          labelEn: 'Audit Trail',
          icon: BarChart3,
        },
      ],
    },
    {
      group: 'সার্বিক সিস্টেম প্রশাসন',
      items: [
        {
          path: '/audit?tab=users',
          labelBn: 'ব্যবহারকারী ব্যবস্থাপনা',
          labelEn: 'User Management',
          icon: Users,
        },
        {
          path: '/audit?tab=roles',
          labelBn: 'রোল ও পারমিশন',
          labelEn: 'Roles & Permissions',
          icon: ShieldAlert,
        },
        {
          path: '/audit?tab=settings',
          labelBn: 'সিস্টেম সেটিংস',
          labelEn: 'System Settings',
          icon: Settings,
        },
      ],
    },
  ],

  LAND_OFFICER: [
    {
      group: 'ভূমি রাজস্ব ও খতিয়ান প্রশাসন',
      items: [
        {
          path: '/dashboard',
          labelBn: 'ভূমি অফিস ড্যাশবোর্ড',
          labelEn: 'AC Land Dashboard',
          icon: Home,
        },
        {
          path: '/parcels',
          labelBn: 'খতিয়ান ও দাগ রেজিস্ট্রি',
          labelEn: 'Parcels & Land Records',
          icon: Search,
        },
        {
          path: '/map',
          labelBn: 'মৌজা নকশা (GIS)',
          labelEn: 'Mouza Cadastral Map',
          icon: Map,
        },
        {
          path: '/registry',
          labelBn: 'রেজিস্ট্রি অবস্থা যাচাই',
          labelEn: 'Registry Gatekeeper Check',
          icon: ClipboardCheck,
        },
        {
          path: '/citizen',
          labelBn: 'উন্মুক্ত নাগরিক সেবা',
          labelEn: 'Citizen Public Portal',
          icon: Shield,
        },
      ],
    },
  ],
}

/**
 * Get navigation configuration for a given role
 * @param {string} role
 * @returns {Array} Navigation groups
 */
export function getNavigationForRole(role) {
  if (!role) return ROLE_NAVIGATION.CITIZEN
  return ROLE_NAVIGATION[role] || ROLE_NAVIGATION.CITIZEN
}

