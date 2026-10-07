export interface Student {
  id: string;
  name: string;
  email: string;
  year: number;
  phone: string;
  avatar?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Pending' | 'Not Started' | 'Completed';
}

export interface BugReport {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  taskName?: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Fixed' | 'Resolved';
  reportDate: string;
  reportedBy: string;
  reportedById?: string;
  screenshotName?: string;
  comments: {
    id: string;
    author: string;
    authorRole: string;
    date: string;
    content: string;
  }[];
}

export interface ProjectComment {
  id: string;
  author: string;
  date: string;
  content: string;
  role?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  teamName: string;
  teamSize: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  startDate: string;
  endDate: string;
  members: Student[];
  tasks: Task[];
  comments: ProjectComment[];
}

export const INITIAL_STUDENTS_DIRECTORY: Student[] = [
  { id: 'S001', name: 'Aishwarya Nair', email: 'aish@college.edu', year: 2, phone: '9876543210' },
  { id: 'S002', name: 'Rahul R', email: 'rahul@college.edu', year: 2, phone: '9876543211' },
  { id: 'S003', name: 'Anu K', email: 'anu@college.edu', year: 2, phone: '9876543212' },
  { id: 'S004', name: 'Vivek S', email: 'vivek@college.edu', year: 2, phone: '9876543213' },
  { id: 'S005', name: 'Pooja Menon', email: 'pooja@college.edu', year: 2, phone: '9876543214' },
  { id: 'S006', name: 'Karthik Raja', email: 'karthik@college.edu', year: 3, phone: '9876543215' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'P001',
    title: 'Smart Waste Management',
    description: 'A project to develop an IoT-based system for smart waste management in campus.',
    teamName: 'Team Alpha',
    teamSize: 4,
    status: 'Pending',
    startDate: '01 Sep 2026',
    endDate: '30 Nov 2026',
    members: [
      { id: 'S001', name: 'Aishwarya Nair', email: 'aish@college.edu', year: 2, phone: '9876543210' },
      { id: 'S002', name: 'Rahul R', email: 'rahul@college.edu', year: 2, phone: '9876543211' },
      { id: 'S003', name: 'Anu K', email: 'anu@college.edu', year: 2, phone: '9876543212' },
      { id: 'S004', name: 'Vivek S', email: 'vivek@college.edu', year: 2, phone: '9876543213' },
    ],
    tasks: [
      { id: 'T001', name: 'Login UI', description: 'Design and develop login interface', assignedTo: 'Aishwarya', priority: 'High', status: 'In Progress' },
      { id: 'T002', name: 'Database', description: 'Set up and configure database', assignedTo: 'Rahul', priority: 'Medium', status: 'Pending' },
      { id: 'T003', name: 'Testing', description: 'Write test cases and perform testing', assignedTo: 'Anu', priority: 'Low', status: 'Pending' },
      { id: 'T004', name: 'Deployment', description: 'Deploy the application', assignedTo: 'Vivek', priority: 'Medium', status: 'Not Started' },
    ],
    comments: [
      { id: 'C001', author: 'Rahul R', date: '05 Oct 2026, 10:30 AM', content: 'Working on the database module.' },
      { id: 'C002', author: 'Anu K', date: '05 Oct 2026, 02:15 PM', content: 'Completed the UI for login page.' },
      { id: 'C003', author: 'Aishwarya Nair', date: '06 Oct 2026, 09:45 AM', content: 'Tests are in progress.' },
    ],
  },
  {
    id: 'P002',
    title: 'Campus Navigation',
    description: 'Indoor interactive navigation app for new college visitors and freshmen.',
    teamName: 'Team Beta',
    teamSize: 3,
    status: 'Approved',
    startDate: '05 Aug 2026',
    endDate: '20 Oct 2026',
    members: [
      { id: 'S005', name: 'Pooja Menon', email: 'pooja@college.edu', year: 2, phone: '9876543214' },
      { id: 'S006', name: 'Karthik Raja', email: 'karthik@college.edu', year: 3, phone: '9876543215' },
    ],
    tasks: [
      { id: 'T005', name: 'Floor Mapping', description: 'Map campus floor blueprints to SVG', assignedTo: 'Pooja', priority: 'High', status: 'Completed' },
      { id: 'T006', name: 'Beacon Integration', description: 'BLE beacon discovery sync', assignedTo: 'Karthik', priority: 'Medium', status: 'In Progress' },
    ],
    comments: [
      { id: 'C004', author: 'Dr. Anil Kumar', date: '10 Aug 2026, 11:00 AM', content: 'Design documents reviewed and approved.' },
    ],
  },
  {
    id: 'P003',
    title: 'Health Tracker',
    description: 'Wearable integration app tracking student athletic metrics and fitness club activities.',
    teamName: 'Team Gamma',
    teamSize: 3,
    status: 'Rejected',
    startDate: '10 Jul 2026',
    endDate: '15 Sep 2026',
    members: [
      { id: 'S004', name: 'Vivek S', email: 'vivek@college.edu', year: 2, phone: '9876543213' },
    ],
    tasks: [
      { id: 'T007', name: 'Heart Rate Stream', description: 'Connect Bluetooth sensors', assignedTo: 'Vivek', priority: 'High', status: 'Pending' },
    ],
    comments: [
      { id: 'C005', author: 'Dr. Anil Kumar', date: '15 Jul 2026, 04:00 PM', content: 'Hardware scope exceeds lab safety equipment policy.' },
    ],
  },
  {
    id: 'P004',
    title: 'E-Learning Platform',
    description: 'AI-assisted quiz generator and repository for faculty lecture materials.',
    teamName: 'Team Delta',
    teamSize: 4,
    status: 'Approved',
    startDate: '12 Jun 2026',
    endDate: '30 Aug 2026',
    members: [
      { id: 'S002', name: 'Rahul R', email: 'rahul@college.edu', year: 2, phone: '9876543211' },
      { id: 'S003', name: 'Anu K', email: 'anu@college.edu', year: 2, phone: '9876543212' },
    ],
    tasks: [],
    comments: [],
  },
  {
    id: 'P005',
    title: 'Event Management',
    description: 'Portal for university symposium, cultural fest registrations and ticket passes.',
    teamName: 'Team Epsilon',
    teamSize: 2,
    status: 'Pending',
    startDate: '01 Oct 2026',
    endDate: '20 Dec 2026',
    members: [
      { id: 'S006', name: 'Karthik Raja', email: 'karthik@college.edu', year: 3, phone: '9876543215' },
    ],
    tasks: [],
    comments: [],
  },
];

export const INITIAL_BUGS: BugReport[] = [
  {
    id: 'B001',
    title: 'Login failure',
    projectId: 'P001',
    projectName: 'Smart Waste Management',
    taskName: 'Login UI',
    description: 'The login page throws an error when using valid credentials. Error message: "Invalid user"',
    priority: 'High',
    status: 'Open',
    reportDate: '06 Oct 2026',
    reportedBy: 'Aishwarya Nair',
    reportedById: 'S001',
    comments: [
      {
        id: 'BC001',
        author: 'Rahul R',
        authorRole: 'Student',
        date: '06 Oct 2026',
        content: 'I am also facing the same issue. Please check the backend logs.',
      },
    ],
  },
  {
    id: 'B002',
    title: 'UI alignment issue',
    projectId: 'P002',
    projectName: 'Campus Navigation',
    taskName: 'Floor Mapping',
    description: 'Sidebar icon overlaps the back arrow button on tablets.',
    priority: 'Low',
    status: 'Fixed',
    reportDate: '04 Oct 2026',
    reportedBy: 'Pooja Menon',
    reportedById: 'S005',
    comments: [
      {
        id: 'BC002',
        author: 'Dr. Anil Kumar',
        authorRole: 'Faculty',
        date: '05 Oct 2026',
        content: 'Verified patch in staging environment.',
      },
    ],
  },
  {
    id: 'B003',
    title: 'Page crash on refresh',
    projectId: 'P001',
    projectName: 'Smart Waste Management',
    taskName: 'Database',
    description: 'WebSocket reconnect crashes after 3 retries.',
    priority: 'Medium',
    status: 'In Progress',
    reportDate: '03 Oct 2026',
    reportedBy: 'Rahul R',
    reportedById: 'S002',
    comments: [],
  },
  {
    id: 'B004',
    title: 'Button not working',
    projectId: 'P004',
    projectName: 'E-Learning Platform',
    taskName: 'Quiz Submit',
    description: 'Submit quiz button remains in disabled state after captcha completion.',
    priority: 'Low',
    status: 'Resolved',
    reportDate: '28 Sep 2026',
    reportedBy: 'Anu K',
    reportedById: 'S003',
    comments: [],
  },
  {
    id: 'B005',
    title: 'Crash on login',
    projectId: 'P005',
    projectName: 'Event Management',
    taskName: 'Auth Hook',
    description: 'Null pointer exception in SSO token reader.',
    priority: 'Medium',
    status: 'Open',
    reportDate: '25 Sep 2026',
    reportedBy: 'Karthik Raja',
    reportedById: 'S006',
    comments: [],
  },
];
