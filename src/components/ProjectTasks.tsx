import { useState, type FormEvent } from 'react';
import { Plus, ListTodo, ArrowUpRight, X } from 'lucide-react';
import { usePortal } from '../App';

type Task = { id: string; projectId: string; title: string; description: string; assignedTo: string; priority: string; status: string; due: string };
type Project = { id: string; members: string[] };
export default function ProjectTasks({ project }: { project: Project }) {
  const { tasks, saveTasks, role, setNotice } = usePortal();
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const projectTasks: Task[] = tasks.filter((task: Task) => task.projectId === project.id);
  const selected = projectTasks.find(task => task.id === selectedId);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    saveTasks([...tasks, { id: `T${Date.now()}`, projectId: project.id, title: String(data.get('title')).trim(), description: String(data.get('description')).trim(), assignedTo: String(data.get('assignedTo')), priority: String(data.get('priority')), due: String(data.get('due')), status: 'Not Started' }]);
    setCreating(false);
    setNotice('Task created. Your team and faculty can view its details.');
  };
  const updateStatus = (status: string) => {
    saveTasks(tasks.map((task: Task) => task.id === selectedId ? { ...task, status } : task));
    setNotice('Task status updated.');
  };
  return <section>
    <div className="section-heading"><h2>Tasks <span>{projectTasks.length}</span></h2><button className="button primary" onClick={() => setCreating(!creating)}><Plus size={16} />{creating ? 'Cancel' : 'Add Task'}</button></div>
    {creating && <form className="detail-panel task-form" onSubmit={submit}>
      <h2>Create a task</h2>
      <label>Task name<input name="title" required maxLength={120} placeholder="e.g. Design the login interface" /></label>
      <label>Description<textarea name="description" required rows={3} placeholder="Describe the work and expected outcome" /></label>
      <div className="two-fields"><label>Assigned to<select name="assignedTo" required>{project.members.map(member => <option key={member}>{member}</option>)}</select></label><label>Priority<select name="priority"><option>Medium</option><option>High</option><option>Low</option></select></label></div>
      <label>Due date<input name="due" type="date" required /></label><button className="button primary">Create Task</button>
    </form>}
    {selected && <div className="detail-panel task-detail">
      <div className="section-heading"><h2>{selected.title}</h2><button className="icon-button" aria-label="Close task details" onClick={() => setSelectedId(null)}><X size={18} /></button></div>
      <p className="project-description">{selected.description}</p>
      <dl>{[['Task ID', selected.id], ['Assigned to', selected.assignedTo], ['Priority', selected.priority], ['Due date', selected.due], ['Status', selected.status]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {(role === 'faculty' || selected.assignedTo === 'Aishwarya Nair') && <label className="status-control">Update status<select value={selected.status} onChange={event => updateStatus(event.target.value)}>{['Not Started', 'Pending', 'In Progress', 'Completed'].map(status => <option key={status}>{status}</option>)}</select></label>}
    </div>}
    {!projectTasks.length ? <div className="simple-empty"><ListTodo size={34} /><h3>No tasks yet.</h3><p>Add tasks to assign work and track your project’s progress.</p></div> : <div className="table-panel"><table><thead><tr><th>Task</th><th>Assigned to</th><th>Priority</th><th>Status</th><th>Due date</th><th>Action</th></tr></thead><tbody>{projectTasks.map(task => <tr key={task.id}><td><strong>{task.title}</strong><small>{task.id}</small></td><td>{task.assignedTo}</td><td><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></td><td>{task.status}</td><td>{task.due}</td><td><button className="button secondary" onClick={() => setSelectedId(task.id)}>View<ArrowUpRight size={14} /></button></td></tr>)}</tbody></table></div>}
  </section>;
}
