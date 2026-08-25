import {
  Plus, PlusCircle, Route, Building2, ArrowLeft, ArrowRight, ArrowUpRight, ArrowUp,
  ClipboardList, Sparkles, BookOpen, BarChart3, Building, MessageCircle, CheckCircle2,
  ChevronRight, ChevronDown, ChevronLeft, ChevronUp, X, CloudSync, UploadCloud, Code2, ArrowRightLeft, Wrench, Trash2, Pencil,
  FileText, Download, AlertCircle, Flag, History, Home, Hourglass, Info, Globe, Paperclip,
  PanelLeftClose, PanelLeftOpen, Lightbulb, Link as LinkIcon, Flame, MapPin, Lock, LogOut,
  Mail, Menu, Medal, Activity, MoreHorizontal, Bell, ExternalLink, Banknote, UserSearch,
  Play, PlayCircle, BrainCircuit, FileQuestion, Clock, GraduationCap, Search, Send,
  Shield, Bot, Star, Timer, TrendingUp, BadgeCheck, UserCheck, Eye, AlertTriangle, Hand,
  Briefcase, Award, Zap, Share2, Users, AtSign, Monitor, Infinity, Video, UserPlus, SquarePen,
  Sun, Moon, Copy
} from 'lucide-react';

// Custom Brand SVGs
const GoogleIcon = ({ className, size="1em" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = ({ className, size="1em" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = ({ className, size="1em" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const ChatIcon = ({ className, size="1em" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.03 2 11C2 13.793 3.42 16.29 5.617 17.88C5.467 18.734 4.887 19.866 4.103 20.65C4.013 20.74 3.972 20.871 4.004 20.996C4.037 21.121 4.137 21.215 4.265 21.24C5.975 21.573 7.604 21.233 8.784 20.655C9.8 20.88 10.884 21 12 21C17.523 21 22 16.97 22 12C22 7.03 17.523 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// Mappings
const iconMap = {
  add: Plus,
  add_circle: PlusCircle,
  all_inclusive: Infinity,
  alt_route: Route,
  alternate_email: AtSign,
  apartment: Building2,
  arrow_back: ArrowLeft,
  arrow_forward: ArrowRight,
  arrow_outward: ArrowUpRight,
  arrow_upward: ArrowUp,
  assignment: ClipboardList,
  attach_file: Paperclip,
  auto_awesome: Sparkles,
  auto_stories: BookOpen,
  bar_chart: BarChart3,
  bolt: Zap,
  briefcase: Briefcase,
  Briefcase: Briefcase,
  business: Building,
  business_center: Briefcase,
  chat_bubble: MessageCircle,
  check_circle: CheckCircle2,
  chevron_right: ChevronRight,
  close: X,
  cloud_sync: CloudSync,
  cloud_upload: UploadCloud,
  code: Code2,
  compare: ArrowRightLeft,
  construction: Wrench,
  delete: Trash2,
  description: FileText,
  devices: Monitor,
  download: Download,
  edit: Pencil,
  error: AlertCircle,
  flag: Flag,
  group: Users,
  history: History,
  home: Home,
  hourglass_top: Hourglass,
  info: Info,
  keyboard_arrow_down: ChevronDown,
  keyboard_arrow_up: ChevronUp,
  keyboard_arrow_left: ChevronLeft,
  keyboard_arrow_right: ChevronRight,
  language: Globe,
  left_panel_close: PanelLeftClose,
  left_panel_open: PanelLeftOpen,
  lightbulb: Lightbulb,
  link: LinkIcon,
  local_fire_department: Flame,
  location_on: MapPin,
  lock: Lock,
  logout: LogOut,
  mail: Mail,
  menu: Menu,
  menu_book: BookOpen,
  military_tech: Medal,
  monitoring: Activity,
  more_horiz: MoreHorizontal,
  notifications: Bell,
  open_in_new: ExternalLink,
  payments: Banknote,
  person_add: UserPlus,
  person_search: UserSearch,
  play_arrow: Play,
  play_circle: PlayCircle,
  play_lesson: Video,
  psychology: BrainCircuit,
  public: Globe,
  quiz: FileQuestion,
  schedule: Clock,
  school: GraduationCap,
  search: Search,
  send: Send,
  share: Share2,
  shield: Shield,
  smart_toy: ChatIcon,
  star: Star,
  timer: Timer,
  trending_up: TrendingUp,
  troubleshoot: Wrench,
  verified: BadgeCheck,
  verified_user: UserCheck,
  visibility: Eye,
  warning: AlertTriangle,
  waving_hand: Sparkles,
  web: Globe,
  work: Briefcase,
  work_history: History,
  square_pen: SquarePen,
  SquarePen: SquarePen,
  create: SquarePen,
  edit_note: SquarePen,
  Sun: Sun,
  sun: Sun,
  Moon: Moon,
  moon: Moon,
  Copy: Copy,
  copy: Copy,
  
  // Brands
  google: GoogleIcon,
  github: GithubIcon,
  linkedin: LinkedinIcon
};

const AppIcon = ({ name, className = '', ...props }) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    return <span className={`material-symbols-outlined select-none inline-flex items-center justify-center leading-none ${className}`} {...props}>{name}</span>;
  }

  // Determine if it's a lucide icon (needs size mapped from w-h classes ideally, 
  // but lucide respects className for coloring. SVG needs w/h).
  // We can pass className to it. Lucide defaults to size=24.
  // To allow tailwind classes to govern size, we should remove hardcoded lucide size if we want
  // but Lucide `className` usually overrides well if we use `w-6 h-6`.
  
  return <IconComponent className={className} size="1em" {...props} />;
};

export default AppIcon;
