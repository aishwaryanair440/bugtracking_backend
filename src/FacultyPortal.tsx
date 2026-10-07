import React, { useState } from 'react';
import { Project, BugReport } from './data';
import {
  GraduationCap,
  LayoutDashboard,
  FolderGit2,
  Bug,
  User,
  LogOut,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface FacultyPortalProps {
  projects: Project[];
  bugs: BugReport[];
  onLogout: () => void;
  onApproveProject: (projectId: string) => void;
  onRejectProject: (projectId: string) => void;
  onUpdateBug: (bug: BugReport) => void;
  onSwitchToStudent: () => void;
}

type FacultyTab = 'dashboard' | 'projects' | 'bug-reports' | 'profile' | 'project-details' | 'bug-details';

export default function FacultyPortal({
  projects,
  bugs,
  onLogout,
  onApproveProject,
  onRejectProject,
  onUpdateBug,
  onSwitchToStudent,
}: FacultyPortalProps) {
  const [activeTab, setActiveTab] = useState<FacultyTab>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [selectedBugId, setSelectedBugId] = useState<string | null>(bugs[0]?.id || null);
  
  // Project detail sub-tab
  const [projectSubTab, setProjectSubTab] = useState<'overview' | 'team' | 'tasks' | 'bug-reports' | 'comments'>('overview');

  // Search and filters
  const [searchProjectQuery, setSearchProjectQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  
  const [bugSearchQuery, setBugSearchQuery] = useState('');
  const [bugProjectFilter, setBugProjectFilter] = useState('All Projects');
  const [bugStatusFilter, setBugStatusFilter] = useState('All Status');
  const [bugPriorityFilter, setBugPriorityFilter] = useState('All Priority');

  // Faculty Bug Comment
  const [bugReplyText, setBugReplyText] = useState('');

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const activeBug = bugs.find((b) => b.id === selectedBugId) || bugs[0];

  // Calculated Stats
  const totalProjectsCount = projects.length;
  const pendingApprovalsCount = projects.filter((p) => p.status === 'Pending').length;
  const totalBugsCount = bugs.length;

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
      p.teamName.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchProjectQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered bugs
  const filteredBugs = bugs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(bugSearchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(bugSearchQuery.toLowerCase());
    const matchesProject = bugProjectFilter === 'All Projects' ? true : b.projectName === bugProjectFilter;
    const matchesStatus = bugStatusFilter === 'All Status' ? true : b.status === bugStatusFilter;
    const matchesPriority = bugPriorityFilter === 'All Priority' ? true : b.priority === bugPriorityFilter;
    return matchesSearch && matchesProject && matchesStatus && matchesPriority;
  });

  const handleSendBugReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugReplyText.trim() || !activeBug) return;

    const updatedBug: BugReport = {
      ...activeBug,
      comments: [
        ...activeBug.comments,
        {
          id: `BC${Date.now()}`,
          author: 'Dr. Anil Kumar',
          authorRole: 'Faculty',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          content: bugReplyText.trim(),
        },
      ],
    };

    onUpdateBug(updatedBug);
    setBugReplyText('');
  };

  const renderSidebar = () => (
    <aside className="w-64 bg-[#0d1f33] text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800">
      <div>
        {/* Brand header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-wide">Faculty</div>
            <div className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider">Review Portal</div>
          </div>
        </div>

        {/* Navigation items matching Faculty Wireframe */}
        <nav className="p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'projects' || activeTab === 'project-details'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderGit2 className="w-4 h-4" />
              <span>Projects</span>
            </div>
            {pendingApprovalsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('bug-reports')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'bug-reports' || activeTab === 'bug-details'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bug className="w-4 h-4" />
              <span>Bug Reports</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300">
              {totalBugsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </nav>
      </div>

      {/* Switch to Student & Logout */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <button
          onClick={onSwitchToStudent}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            Switch to Student View
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
    <div className="flex min-h-screen bg-[#f1f5f9] text-slate-900 font-sans">
      {renderSidebar()}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Faculty Review</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              {pendingApprovalsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-800">Dr. Anil Kumar</div>
                <div className="text-xs text-slate-400">F001 • Faculty Advisor</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                AK
              </div>
            </div>
          </div>
        </header>

        {/* Tab View router */}
        <main className="p-8 flex-1">
          {/* FACULTY DASHBOARD matching wireframe screen 2 */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome, Dr. Anil Kumar</h1>
                <p className="text-sm text-slate-500 mt-1">Here's an overview of your projects and activities.</p>
              </div>

              {/* 3 Metric Cards matching wireframe screen 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Total Projects */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Projects</span>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2">{totalProjectsCount}</div>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-xs font-semibold text-blue-600 hover:underline mt-2 inline-block"
                    >
                      View all projects →
                    </button>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FolderGit2 className="w-6 h-6" />
                  </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Approvals</span>
                    <div className="text-3xl font-extrabold text-amber-600 mt-2">{pendingApprovalsCount}</div>
                    <button
                      onClick={() => {
                        setStatusFilter('Pending');
                        setActiveTab('projects');
                      }}
                      className="text-xs font-semibold text-amber-700 hover:underline mt-2 inline-block"
                    >
                      Requires your action →
                    </button>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                {/* Bug Reports */}
                <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Bug Reports</span>
                    <div className="text-3xl font-extrabold text-rose-600 mt-2">{totalBugsCount}</div>
                    <button
                      onClick={() => setActiveTab('bug-reports')}
                      className="text-xs font-semibold text-rose-600 hover:underline mt-2 inline-block"
                    >
                      Review open tickets →
                    </button>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Bug className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Projects Quick Review List matching wireframe screen 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Projects</h2>
                    <p className="text-xs text-slate-500">Recent submissions requiring evaluation</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View All Projects →
                  </button>
                </div>

                <div className="space-y-3">
                  {projects.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                          <FolderGit2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
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
                          <div className="text-xs text-slate-500 mt-0.5">
                            {p.teamName} • {p.startDate} - {p.endDate}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons: If Pending: View, Approve, Reject; If Approved/Rejected: View */}
                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <button
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            setActiveTab('project-details');
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                        >
                          View
                        </button>

                        {p.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => onApproveProject(p.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onRejectProject(p.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-xs"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FACULTY PROJECTS TABLE VIEW matching wireframe screen 3 */}
          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
                <p className="text-xs text-slate-500 mt-1">Review capstone proposals, manage approvals, and track teams</p>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchProjectQuery}
                    onChange={(e) => setSearchProjectQuery(e.target.value)}
                    placeholder="Search projects or team..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-slate-500">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Projects Table matching wireframe screen 3 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Project Title</th>
                        <th className="py-3 px-3">Team</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Start Date</th>
                        <th className="py-3 px-3">End Date</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProjects.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-700">{p.id}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-900">{p.title}</td>
                          <td className="py-3.5 px-3 text-slate-600 font-medium">{p.teamName}</td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                p.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : p.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-500">{p.startDate}</td>
                          <td className="py-3.5 px-3 text-slate-500">{p.endDate}</td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {p.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => onApproveProject(p.id)}
                                    title="Approve Project"
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => onRejectProject(p.id)}
                                    title="Reject Project"
                                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shadow-xs"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedProjectId(p.id);
                                  setActiveTab('project-details');
                                }}
                                className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] transition-colors"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-10 text-xs text-slate-400">
                    No projects found matching the filter criteria.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FACULTY PROJECT DETAILS PAGE WITH APPROVE/REJECT matching wireframe screen 4 */}
          {activeTab === 'project-details' && activeProject && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('projects')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Projects
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Project ID: {activeProject.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      activeProject.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : activeProject.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {activeProject.status}
                  </span>
                </div>
              </div>

              {/* Title & Status Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">{activeProject.title}</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Submitted by {activeProject.teamName} • Timeline: {activeProject.startDate} to {activeProject.endDate}
                  </p>
                </div>

                {/* Faculty Evaluation buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onApproveProject(activeProject.id)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Project
                  </button>
                  <button
                    onClick={() => onRejectProject(activeProject.id)}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Project
                  </button>
                </div>
              </div>

              {/* Subtabs matching wireframe: Overview, Team, Tasks, Bug Reports, Comments */}
              <div className="border-b border-slate-200 flex gap-6 text-sm font-semibold">
                {(['overview', 'team', 'tasks', 'bug-reports', 'comments'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setProjectSubTab(tab)}
                    className={`pb-3 capitalize transition-all relative ${
                      projectSubTab === tab
                        ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {projectSubTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Project Info Table */}
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
                            className={`px-2.5 py-0.5 rounded text-xs font-bold ${
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

                  {/* Project Status Action Panel */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Project Status</h3>
                      <p className="text-xs text-slate-500 mt-2">
                        {activeProject.status === 'Pending'
                          ? 'This project is currently pending faculty approval.'
                          : activeProject.status === 'Approved'
                          ? 'This project has been approved by faculty. The team may proceed to sprint development.'
                          : 'This project proposal has been rejected.'}
                      </p>
                    </div>

                    <div className="pt-6 space-y-2.5">
                      <button
                        onClick={() => onApproveProject(activeProject.id)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve Project
                      </button>
                      <button
                        onClick={() => onRejectProject(activeProject.id)}
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Project
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TEAM SUBTAB */}
              {projectSubTab === 'team' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Team Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Team Members</h3>
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

              {/* TASKS SUBTAB */}
              {projectSubTab === 'tasks' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Tasks Monitoring</h3>
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

              {/* BUG REPORTS SUBTAB */}
              {projectSubTab === 'bug-reports' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Project Bug Reports</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                          <th className="py-2.5 px-3">Bug ID</th>
                          <th className="py-2.5 px-3">Title</th>
                          <th className="py-2.5 px-3">Priority</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Report Date</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
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
                              <td className="py-3 px-3 text-slate-500">{b.reportDate}</td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedBugId(b.id);
                                    setActiveTab('bug-details');
                                  }}
                                  className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* COMMENTS SUBTAB */}
              {projectSubTab === 'comments' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Advisor & Team Discussion</h3>
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
                </div>
              )}
            </div>
          )}

          {/* FACULTY BUG REPORTS TABLE PAGE matching wireframe screen 5 */}
          {activeTab === 'bug-reports' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Bug Reports</h1>
                <p className="text-xs text-slate-500 mt-1">Monitor issues, defects, and student task road-blocks</p>
              </div>

              {/* Filters toolbar matching wireframe */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project</label>
                  <select
                    value={bugProjectFilter}
                    onChange={(e) => setBugProjectFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All Projects">All Projects</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={bugStatusFilter}
                    onChange={(e) => setBugStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All Status">All Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={bugPriorityFilter}
                    onChange={(e) => setBugPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All Priority">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={bugSearchQuery}
                      onChange={(e) => setBugSearchQuery(e.target.value)}
                      placeholder="Search bug reports..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bug Reports Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Title</th>
                        <th className="py-3 px-3">Project</th>
                        <th className="py-3 px-3">Priority</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Report Date</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBugs.map((bug) => (
                        <tr key={bug.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-700">{bug.id}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-900">{bug.title}</td>
                          <td className="py-3.5 px-3 text-slate-600 font-medium">{bug.projectName}</td>
                          <td className="py-3.5 px-3">
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
                          <td className="py-3.5 px-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                bug.status === 'Resolved' || bug.status === 'Fixed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : bug.status === 'In Progress'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {bug.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-500">{bug.reportDate}</td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedBugId(bug.id);
                                setActiveTab('bug-details');
                              }}
                              className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FACULTY BUG DETAILS PAGE matching wireframe screen 6 */}
          {activeTab === 'bug-details' && activeBug && (
            <div className="max-w-3xl mx-auto space-y-6">
              <button
                onClick={() => setActiveTab('bug-reports')}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Bug Reports
              </button>

              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{activeBug.title}</h1>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          activeBug.priority === 'High'
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {activeBug.priority}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {activeBug.status}
                      </span>
                    </div>
                  </div>

                  {/* Faculty status toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateBug({ ...activeBug, status: 'Resolved' })}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => onUpdateBug({ ...activeBug, status: 'In Progress' })}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                    >
                      In Progress
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold">Bug ID:</span>{' '}
                    <span className="font-mono font-bold text-slate-800">{activeBug.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Project:</span>{' '}
                    <span className="font-semibold text-slate-800">{activeBug.projectName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Related Task:</span>{' '}
                    <span className="text-slate-800">{activeBug.taskName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Report Date:</span>{' '}
                    <span className="text-slate-800">{activeBug.reportDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Reported By:</span>{' '}
                    <span className="text-slate-800">{activeBug.reportedBy} ({activeBug.reportedById})</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono">
                    {activeBug.description}
                  </div>
                </div>

                {/* Bug Comments thread */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Comments</h3>

                  {activeBug.comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {c.author.charAt(0)}
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {c.author} <span className="text-[10px] text-blue-600 font-semibold">({c.authorRole})</span>
                          </span>
                          <span className="text-[11px] text-slate-400">{c.date}</span>
                        </div>
                        <p className="mt-1 text-slate-700">{c.content}</p>
                      </div>
                    </div>
                  ))}

                  <form onSubmit={handleSendBugReply} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={bugReplyText}
                      onChange={(e) => setBugReplyText(e.target.value)}
                      placeholder="Add a faculty guidance note or comment..."
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* FACULTY PROFILE PAGE matching wireframe screen 7 */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
                <h1 className="text-xl font-bold text-slate-900">Faculty Profile</h1>

                <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-blue-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                    AK
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Dr. Anil Kumar</h2>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">Faculty ID: F001</div>
                    <div className="text-xs text-blue-700 font-medium mt-1">anil@college.edu</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Details</h3>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-400">Name</span>
                      <span className="font-semibold text-slate-800">Dr. Anil Kumar</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-400">Faculty ID</span>
                      <span className="font-mono font-semibold text-slate-800">F001</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-400">Email</span>
                      <span className="text-slate-800">anil@college.edu</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-400">Password</span>
                      <span className="font-mono text-slate-800">••••••••••••</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => alert('Faculty profile edit mode opened')}
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-colors"
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
