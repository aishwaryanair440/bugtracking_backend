import React, { useState } from 'react';
import { Project, BugReport, INITIAL_STUDENTS_DIRECTORY, Student } from './data';
import CreateProject from './CreateProject';
import {
  GraduationCap,
  LayoutDashboard,
  FolderGit2,
  PlusCircle,
  Bug,
  User,
  LogOut,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Send,
  MessageSquare,
  ListTodo,
  Check,
  Plus,
  Calendar,
  Layers,
  ArrowLeft,
  X
} from 'lucide-react';

interface StudentPortalProps {
  projects: Project[];
  bugs: BugReport[];
  currentStudent: Student;
  onLogout: () => void;
  onAddProject: (project: Project) => void;
  onAddBug: (bug: BugReport) => void;
  onUpdateProject: (project: Project) => void;
  onUpdateBug: (bug: BugReport) => void;
  onSwitchToFaculty: () => void;
}

type TabType = 'dashboard' | 'my-projects' | 'create-project' | 'bug-reports' | 'profile' | 'project-details' | 'report-bug';

export default function StudentPortal({
  projects,
  bugs,
  currentStudent,
  onLogout,
  onAddProject,
  onAddBug,
  onUpdateProject,
  onUpdateBug,
  onSwitchToFaculty,
}: StudentPortalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [projectDetailSubTab, setProjectDetailSubTab] = useState<'overview' | 'team' | 'tasks' | 'bug-reports' | 'comments'>('overview');
  
  // Bug reporting form state
  const [newBugTitle, setNewBugTitle] = useState('');
  const [newBugDescription, setNewBugDescription] = useState('');
  const [newBugPriority, setNewBugPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newBugTaskId, setNewBugTaskId] = useState('');
  const [newBugScreenshotName, setNewBugScreenshotName] = useState<string>('');

  // Comment state in project
  const [newCommentText, setNewCommentText] = useState('');

  // Find student's projects (where member or creator)
  const studentProjects = projects.filter((p) =>
    p.members.some((m) => m.id === currentStudent.id || m.email === currentStudent.email)
  );

  const activeProject = projects.find((p) => p.id === selectedProjectId) || studentProjects[0] || projects[0];

  // My Tasks across student projects
  const studentTasks = activeProject?.tasks || [];
  const openBugsCount = bugs.filter((b) => b.projectId === activeProject?.id && b.status !== 'Fixed' && b.status !== 'Resolved').length;

  const handleCreateProjectSubmit = (newProj: Project) => {
    onAddProject(newProj);
    setSelectedProjectId(newProj.id);
    setActiveTab('my-projects');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeProject) return;
    const updated = {
      ...activeProject,
      comments: [
        ...activeProject.comments,
        {
          id: `C${Date.now()}`,
          author: currentStudent.name,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: newCommentText.trim(),
        },
      ],
    };
    onUpdateProject(updated);
    setNewCommentText('');
  };

  const handleReportBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBugTitle.trim() || !activeProject) return;

    const taskObj = activeProject.tasks.find((t) => t.id === newBugTaskId);

    const newBug: BugReport = {
      id: `B00${bugs.length + 1}`,
      title: newBugTitle.trim(),
      projectId: activeProject.id,
      projectName: activeProject.title,
      taskName: taskObj ? taskObj.name : 'General Module',
      description: newBugDescription.trim() || 'No description provided.',
      priority: newBugPriority,
      status: 'Open',
      reportDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      reportedBy: currentStudent.name,
      reportedById: currentStudent.id,
      screenshotName: newBugScreenshotName,
      comments: [],
    };

    onAddBug(newBug);
    setNewBugTitle('');
    setNewBugDescription('');
    setNewBugScreenshotName('');
    setActiveTab('bug-reports');
  };

  const renderSidebar = () => (
    <aside className="w-64 bg-[#111c2d] text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800">
      <div>
        {/* Brand header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-900 shadow-md">
            <GraduationCap className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-wide">Student</div>
            <div className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">Project Portal</div>
          </div>
        </div>

        {/* Navigation items specified in prompt */}
        <nav className="p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('my-projects')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'my-projects' || activeTab === 'project-details'
                ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>My Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('create-project')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'create-project'
                ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create Project</span>
          </button>

          <button
            onClick={() => setActiveTab('bug-reports')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'bug-reports' || activeTab === 'report-bug'
                ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>Bug Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </nav>
      </div>

      {/* Bottom section with Role Switcher & Logout */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {/* Demo convenience shortcut to review project from faculty side */}
        <button
          onClick={onSwitchToFaculty}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 text-xs font-semibold border border-blue-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            Switch to Faculty View
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans">
      {renderSidebar()}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Student Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-800">{currentStudent.name}</div>
                <div className="text-xs text-slate-400">{currentStudent.id}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-xs">
                {currentStudent.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Tab View router */}
        <main className="p-8 flex-1">
          {activeTab === 'create-project' && (
            <CreateProject
              onBack={() => setActiveTab('dashboard')}
              onSubmit={handleCreateProjectSubmit}
            />
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              {/* Welcome message wireframe match */}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Good Morning, {currentStudent.name}!</h1>
                <p className="text-sm text-slate-500 mt-1">Here's an overview of your project and activities.</p>
              </div>

              {/* 4 Stat Cards matching wireframe screen 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: My Project */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Project</span>
                  <div className="my-3">
                    <div className="text-lg font-bold text-slate-900 truncate">
                      {activeProject ? activeProject.title : 'No Project Yet'}
                    </div>
                  </div>
                  {activeProject ? (
                    <button
                      onClick={() => {
                        setSelectedProjectId(activeProject.id);
                        setActiveTab('project-details');
                      }}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      View
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('create-project')}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700"
                    >
                      + Create Now
                    </button>
                  )}
                </div>

                {/* Card 2: My Tasks */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Tasks</span>
                  <div className="my-3">
                    <div className="text-3xl font-extrabold text-slate-900">
                      {studentTasks.length}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (activeProject) {
                        setSelectedProjectId(activeProject.id);
                        setProjectDetailSubTab('tasks');
                        setActiveTab('project-details');
                      }
                    }}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    View Tasks
                  </button>
                </div>

                {/* Card 3: Open Bugs */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Bugs</span>
                  <div className="my-3">
                    <div className="text-3xl font-extrabold text-slate-900">
                      {openBugsCount}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('bug-reports')}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    View Bugs
                  </button>
                </div>

                {/* Card 4: Project Status */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Status</span>
                  <div className="my-3">
                    {activeProject ? (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          activeProject.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : activeProject.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {activeProject.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {activeProject.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                        {activeProject.status === 'Rejected' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {activeProject.status}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">None</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {activeProject ? `Submitted for 2026 Batch` : `Create a project to begin`}
                  </div>
                </div>
              </div>

              {/* Requirement: If no projects exist for a student, display:
                  "You don't have a project yet." [ + Create New Project ]
                  If projects exist, display: MY PROJECT Smart Waste Management Team Alpha Status: Pending [ View Project ] */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">My Project</h2>
                  {studentProjects.length > 0 && (
                    <button
                      onClick={() => setActiveTab('create-project')}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Another Project
                    </button>
                  )}
                </div>

                {studentProjects.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                      <FolderGit2 className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">You don't have a project yet.</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Form your team, define your project milestones, and submit for faculty supervisor review.
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => setActiveTab('create-project')}
                        className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        + Create New Project
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {proj.teamName} • {proj.id}
                              </p>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                proj.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : proj.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {proj.status}
                            </span>
                          </div>

                          <div className="mt-3 text-xs text-slate-600 line-clamp-2">
                            {proj.description}
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Start: {proj.startDate}</span>
                            <span>End: {proj.endDate}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 flex items-center justify-end">
                          <button
                            onClick={() => {
                              setSelectedProjectId(proj.id);
                              setActiveTab('project-details');
                            }}
                            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <span>View Project</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* My Tasks Section matching wireframe screen 2 table */}
              {activeProject && (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">My Tasks</h2>
                      <p className="text-xs text-slate-500">Assigned deliverable checklist for {activeProject.title}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProjectId(activeProject.id);
                        setProjectDetailSubTab('tasks');
                        setActiveTab('project-details');
                      }}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      View All Tasks <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                          <th className="py-2.5 px-3">Task Name</th>
                          <th className="py-2.5 px-3">Priority</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studentTasks.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-3 font-semibold text-slate-800">{t.name}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  t.priority === 'High'
                                    ? 'text-rose-600 bg-rose-50'
                                    : t.priority === 'Medium'
                                    ? 'text-amber-600 bg-amber-50'
                                    : 'text-emerald-600 bg-emerald-50'
                                }`}
                              >
                                {t.priority}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                  t.status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : t.status === 'In Progress'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MY PROJECTS TAB */}
          {activeTab === 'my-projects' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
                  <p className="text-xs text-slate-500 mt-1">Manage and track your capstone project lifecycle</p>
                </div>
                <button
                  onClick={() => setActiveTab('create-project')}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  + Create New Project
                </button>
              </div>

              {studentProjects.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <FolderGit2 className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">You don't have a project yet.</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Click below to assemble your team, define deliverables, and request approval.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('create-project')}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-xs transition-all inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    + Create New Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {studentProjects.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{p.id}</span>
                            <h2 className="text-lg font-bold text-slate-900 mt-0.5">{p.title}</h2>
                            <div className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mt-2">
                              {p.teamName} ({p.members.length} members)
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              p.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : p.status === 'Pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                          {p.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span>Start: {p.startDate}</span>
                          <span>End: {p.endDate}</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {p.tasks.length} tasks • {p.comments.length} comments
                        </span>
                        <button
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            setActiveTab('project-details');
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>View Project</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROJECT DETAILS VIEW WITH TABS matching wireframe 3, 4, 5, 8 */}
          {activeTab === 'project-details' && activeProject && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Back button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('my-projects')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Project ID: {activeProject.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      activeProject.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeProject.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {activeProject.status}
                  </span>
                </div>
              </div>

              {/* Title Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">{activeProject.title}</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeProject.teamName} • {activeProject.startDate} to {activeProject.endDate}
                  </p>
                </div>
              </div>

              {/* Subtabs: Overview, Team, Tasks, Bug Reports, Comments */}
              <div className="border-b border-slate-200 flex gap-6 text-sm font-semibold">
                {(['overview', 'team', 'tasks', 'bug-reports', 'comments'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setProjectDetailSubTab(tab)}
                    className={`pb-3 capitalize transition-all relative ${
                      projectDetailSubTab === tab
                        ? 'text-amber-600 font-bold border-b-2 border-amber-500'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* SUBTAB 1: OVERVIEW matching wireframe screen 3 */}
              {projectDetailSubTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Project Information</h3>
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-3 py-2 border-b border-slate-100">
                        <span className="text-slate-400 font-semibold">Project ID</span>
                        <span className="col-span-2 text-slate-800 font-medium">{activeProject.id}</span>
                      </div>
                      <div className="grid grid-cols-3 py-2 border-b border-slate-100">
                        <span className="text-slate-400 font-semibold">Title</span>
                        <span className="col-span-2 text-slate-800 font-semibold">{activeProject.title}</span>
                      </div>
                      <div className="grid grid-cols-3 py-2 border-b border-slate-100">
                        <span className="text-slate-400 font-semibold">Description</span>
                        <span className="col-span-2 text-slate-800 leading-relaxed">{activeProject.description}</span>
                      </div>
                      <div className="grid grid-cols-3 py-2 border-b border-slate-100">
                        <span className="text-slate-400 font-semibold">Status</span>
                        <span className="col-span-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              activeProject.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700'
                                : activeProject.status === 'Pending'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {activeProject.status}
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-3 py-2 border-b border-slate-100">
                        <span className="text-slate-400 font-semibold">Start Date</span>
                        <span className="col-span-2 text-slate-800 font-medium">{activeProject.startDate}</span>
                      </div>
                      <div className="grid grid-cols-3 py-2">
                        <span className="text-slate-400 font-semibold">End Date</span>
                        <span className="col-span-2 text-slate-800 font-medium">{activeProject.endDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side Project Status card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Project Status</h3>
                      <p className="text-xs text-slate-500 mt-2">
                        {activeProject.status === 'Approved'
                          ? 'This project has been approved by the faculty.'
                          : activeProject.status === 'Pending'
                          ? 'This project is currently pending faculty approval.'
                          : 'This project proposal was rejected by the faculty.'}
                      </p>
                    </div>

                    <div className="pt-6">
                      <div
                        className={`w-full py-2.5 rounded-xl text-center text-xs font-bold border ${
                          activeProject.status === 'Approved'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : activeProject.status === 'Pending'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-rose-50 border-rose-200 text-rose-700'
                        }`}
                      >
                        ✓ {activeProject.status}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: TEAM matching wireframe screen 4 */}
              {projectDetailSubTab === 'team' && (
                <div className="space-y-6">
                  {/* Team Information */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Team Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <div className="text-xs text-slate-400 font-semibold">Team ID</div>
                        <div className="text-sm font-bold text-slate-800 mt-1">T001</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <div className="text-xs text-slate-400 font-semibold">Team Name</div>
                        <div className="text-sm font-bold text-slate-800 mt-1">{activeProject.teamName}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <div className="text-xs text-slate-400 font-semibold">Team Size</div>
                        <div className="text-sm font-bold text-slate-800 mt-1">{activeProject.members.length} Members</div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Team Members</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                            <th className="py-2.5 px-3">ID</th>
                            <th className="py-2.5 px-3">Name</th>
                            <th className="py-2.5 px-3">Email</th>
                            <th className="py-2.5 px-3">Year</th>
                            <th className="py-2.5 px-3">Phone</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeProject.members.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50">
                              <td className="py-3 px-3 font-mono font-bold text-slate-700">{m.id}</td>
                              <td className="py-3 px-3 font-semibold text-slate-900">{m.name}</td>
                              <td className="py-3 px-3 text-slate-600">{m.email}</td>
                              <td className="py-3 px-3 text-slate-600">{m.year}</td>
                              <td className="py-3 px-3 font-mono text-slate-600">{m.phone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: TASKS matching wireframe screen 5 */}
              {projectDetailSubTab === 'tasks' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Tasks</h3>
                      <p className="text-xs text-slate-500">Deliverables and sprint assignment breakdown</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                          <th className="py-2.5 px-3">Task ID</th>
                          <th className="py-2.5 px-3">Task Name</th>
                          <th className="py-2.5 px-3">Description</th>
                          <th className="py-2.5 px-3">Assigned To</th>
                          <th className="py-2.5 px-3">Priority</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeProject.tasks.map((task) => (
                          <tr key={task.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-mono font-bold text-slate-700">{task.id}</td>
                            <td className="py-3 px-3 font-semibold text-slate-900">{task.name}</td>
                            <td className="py-3 px-3 text-slate-600">{task.description}</td>
                            <td className="py-3 px-3 text-slate-800 font-medium">{task.assignedTo}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  task.priority === 'High'
                                    ? 'bg-rose-50 text-rose-600'
                                    : task.priority === 'Medium'
                                    ? 'bg-amber-50 text-amber-600'
                                    : 'bg-emerald-50 text-emerald-600'
                                }`}
                              >
                                {task.priority}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                  task.status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : task.status === 'In Progress'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {task.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: BUG REPORTS matching wireframe screen 6 */}
              {projectDetailSubTab === 'bug-reports' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Bug Reports</h3>
                      <p className="text-xs text-slate-500">Track issues logged against this project</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('report-bug')}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      + Report New Bug
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                          <th className="py-2.5 px-3">Bug ID</th>
                          <th className="py-2.5 px-3">Title</th>
                          <th className="py-2.5 px-3">Priority</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Report Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bugs
                          .filter((b) => b.projectId === activeProject.id)
                          .map((b) => (
                            <tr key={b.id} className="hover:bg-slate-50">
                              <td className="py-3 px-3 font-mono font-bold text-slate-700">{b.id}</td>
                              <td className="py-3 px-3 font-semibold text-slate-900">{b.title}</td>
                              <td className="py-3 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                    b.priority === 'High'
                                      ? 'bg-rose-50 text-rose-600'
                                      : b.priority === 'Medium'
                                      ? 'bg-amber-50 text-amber-600'
                                      : 'bg-emerald-50 text-emerald-600'
                                  }`}
                                >
                                  {b.priority}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                    b.status === 'Fixed' || b.status === 'Resolved'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : b.status === 'In Progress'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-500 font-medium">{b.reportDate}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB 5: COMMENTS matching wireframe screen 8 */}
              {projectDetailSubTab === 'comments' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Comments</h3>
                    <p className="text-xs text-slate-500">Discussion feed among team members and advisors</p>
                  </div>

                  <div className="space-y-4">
                    {activeProject.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {comment.author.charAt(0)}
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{comment.author}</span>
                            <span className="text-[11px] text-slate-400">{comment.date}</span>
                          </div>
                          <p className="text-xs text-slate-700 mt-2 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add comment box */}
                  <form onSubmit={handlePostComment} className="pt-4 border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Post
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* REPORT BUG PAGE matching wireframe screen 7 */}
          {activeTab === 'report-bug' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <button
                onClick={() => setActiveTab('bug-reports')}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Bug Reports
              </button>

              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
                <h1 className="text-xl font-bold text-slate-900">Report a Bug</h1>
                <p className="text-xs text-slate-500 mt-1">Submit an issue report with reproduction steps</p>

                <form onSubmit={handleReportBugSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newBugTitle}
                      onChange={(e) => setNewBugTitle(e.target.value)}
                      placeholder="Enter bug title"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newBugDescription}
                      onChange={(e) => setNewBugDescription(e.target.value)}
                      placeholder="Describe the issue in detail"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Priority *</label>
                      <select
                        value={newBugPriority}
                        onChange={(e) => setNewBugPriority(e.target.value as any)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Related Task</label>
                      <select
                        value={newBugTaskId}
                        onChange={(e) => setNewBugTaskId(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white"
                      >
                        <option value="">Select task</option>
                        {activeProject?.tasks.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Screenshot attach */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Attach Screenshot (optional)</label>
                    <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-between">
                      <input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setNewBugScreenshotName(e.target.files[0].name);
                        }}
                        className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Submit Bug Report
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* MY BUG REPORTS PAGE matching wireframe screen 9 */}
          {activeTab === 'bug-reports' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">My Bug Reports</h1>
                  <p className="text-xs text-slate-500 mt-1">Review all active bug tickets across project modules</p>
                </div>
                <button
                  onClick={() => setActiveTab('report-bug')}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  + Report New Bug
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Bug ID</th>
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3">Priority</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bugs.map((bug) => (
                        <tr key={bug.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-mono font-bold text-slate-700">{bug.id}</td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-900">{bug.title}</div>
                            <div className="text-[11px] text-slate-400">{bug.projectName}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                bug.priority === 'High'
                                  ? 'bg-rose-50 text-rose-600'
                                  : bug.priority === 'Medium'
                                  ? 'bg-amber-50 text-amber-600'
                                  : 'bg-emerald-50 text-emerald-600'
                              }`}
                            >
                              {bug.priority}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                bug.status === 'Fixed' || bug.status === 'Resolved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : bug.status === 'In Progress'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {bug.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-medium">{bug.reportDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STUDENT PROFILE PAGE matching wireframe screen 10 */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
                <h1 className="text-xl font-bold text-slate-900">Profile</h1>

                <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-slate-900 text-amber-400 font-extrabold text-2xl flex items-center justify-center shadow-md">
                    {currentStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{currentStudent.name}</h2>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{currentStudent.id}</div>
                    <div className="text-xs text-amber-700 font-medium mt-1">{currentStudent.email}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Details</h3>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-400">Name</span>
                      <span className="font-semibold text-slate-800">{currentStudent.name}</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-400">Student ID</span>
                      <span className="font-mono font-semibold text-slate-800">{currentStudent.id}</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-400">Email</span>
                      <span className="text-slate-800">{currentStudent.email}</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-400">Phone</span>
                      <span className="font-mono text-slate-800">{currentStudent.phone}</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-400">Year</span>
                      <span className="font-semibold text-slate-800">{currentStudent.year}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => alert('Profile edit mode enabled for ' + currentStudent.name)}
                    className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
