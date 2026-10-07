import React, { useState } from 'react';
import { Project, BugReport, INITIAL_STUDENTS_DIRECTORY, Student } from './data';
import {
  ArrowLeft,
  Calendar,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

interface CreateProjectProps {
  onBack: () => void;
  onSubmit: (project: Project) => void;
}

export default function CreateProject({ onBack, onSubmit }: CreateProjectProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-10-08');
  const [endDate, setEndDate] = useState('2026-12-20');
  const [teamName, setTeamName] = useState('');
  
  // Pre-seed with the user and allow adding more
  const [selectedMembers, setSelectedMembers] = useState<Student[]>([
    INITIAL_STUDENTS_DIRECTORY[0], // Aishwarya Nair
    INITIAL_STUDENTS_DIRECTORY[1], // Rahul R
    INITIAL_STUDENTS_DIRECTORY[2], // Anu K
  ]);

  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const availableStudents = INITIAL_STUDENTS_DIRECTORY.filter(
    (s) => !selectedMembers.some((m) => m.id === s.id)
  );

  const handleAddMember = (student: Student) => {
    setSelectedMembers([...selectedMembers, student]);
    setIsAddingStudent(false);
  };

  const handleRemoveMember = (id: string) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== id));
  };

  const handleAddNewStudentCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentSearch.trim()) return;
    const newStudent: Student = {
      id: `S${Math.floor(100 + Math.random() * 900)}`,
      name: studentSearch.trim(),
      email: `${studentSearch.toLowerCase().replace(/\s+/g, '')}@college.edu`,
      year: 2,
      phone: '987654' + Math.floor(1000 + Math.random() * 9000),
    };
    setSelectedMembers([...selectedMembers, newStudent]);
    setStudentSearch('');
    setIsAddingStudent(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !teamName.trim()) {
      setErrorMsg('Please fill in all required fields (Title, Description, Team Name).');
      return;
    }

    const newProject: Project = {
      id: `P00${Math.floor(6 + Math.random() * 90)}`,
      title: title.trim(),
      description: description.trim(),
      teamName: teamName.trim(),
      teamSize: selectedMembers.length,
      status: 'Pending', // As specified: "set the project status to Pending and route to faculty dashboard for review"
      startDate: startDate ? new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '08 Oct 2026',
      endDate: endDate ? new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '20 Dec 2026',
      members: selectedMembers,
      tasks: [
        {
          id: `T${Math.floor(10 + Math.random() * 89)}`,
          name: 'Requirements & Architecture',
          description: 'Document system requirements and architecture outline',
          assignedTo: selectedMembers[0]?.name || 'Student',
          priority: 'High',
          status: 'In Progress',
        },
      ],
      comments: [
        {
          id: `C${Date.now()}`,
          author: selectedMembers[0]?.name || 'Student Leader',
          date: 'Just now',
          content: 'Project submitted for faculty review and approval.',
        },
      ],
    };

    onSubmit(newProject);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
          Faculty Approval Required
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Header banner */}
        <div className="px-8 py-6 bg-gradient-to-r from-amber-50 via-amber-50/50 to-white border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <h1 className="text-xl font-bold text-slate-900">Create New Project</h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Submit your team proposal. Once submitted, status is set to <span className="font-semibold text-amber-600">Pending</span> until Faculty approves or rejects.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100/60 text-amber-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            2026 Academic Capstone
          </div>
        </div>

        {errorMsg && (
          <div className="mx-8 mt-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Smart Waste Management"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-sm transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the objective, methodology, technology stack, and real-world campus impact..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-sm transition-all resize-none"
            ></textarea>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Team Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              Team Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Team Alpha"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-sm transition-all"
            />
          </div>

          {/* Team Members & Selection */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="block text-sm font-semibold text-slate-800">Team Members</label>
                <p className="text-xs text-slate-500">Add co-authors, developers, or research partners</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingStudent(!isAddingStudent)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                + Add Student
              </button>
            </div>

            {/* Quick dropdown / search if open */}
            {isAddingStudent && (
              <div className="p-4 mb-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Select from Directory or type new student
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingStudent(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableStudents.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleAddMember(s)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-xs font-medium text-slate-800 flex items-center gap-2 hover:shadow-xs transition-all"
                    >
                      <span>{s.name}</span>
                      <span className="text-slate-400 text-[10px]">({s.id})</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-2 border-t border-amber-200/60">
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Or enter new student name..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewStudentCustom}
                    className="px-3 py-1.5 bg-amber-500 text-slate-900 rounded-lg text-xs font-semibold hover:bg-amber-400 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Selected Members Section matching wireframe list */}
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Selected Members: ({selectedMembers.length})
              </div>
              <div className="divide-y divide-slate-200">
                {selectedMembers.map((member, index) => (
                  <div key={member.id} className="py-2.5 flex items-center justify-between first:pt-1 last:pb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                          <span>{member.name}</span>
                          {index === 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                              Lead
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {member.id} • {member.email} • Year {member.year}
                        </div>
                      </div>
                    </div>
                    {selectedMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submission Info Notice */}
          <div className="rounded-xl p-3.5 bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Review Pipeline:</span> Once submitted, this project will appear under Faculty Pending Approvals. Faculty will review your team, milestones, and deliverable scope to approve or request revisions.
            </div>
          </div>

          {/* Buttons matching wireframe */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
