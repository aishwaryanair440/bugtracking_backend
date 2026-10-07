import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { usePortal } from '../App';

type Comment = { id: string; author: string; text: string; date: string };
type Report = { id: string; title: string; description: string; priority: string; project: string; projectId?: string; taskId?: string; reportedBy?: string; date?: string; comments?: Comment[]; status: string };
export default function BugDetail() {
  const { id } = useParams();
  const { reports, saveReports, projects, tasks, role, setNotice } = usePortal();
  const [comment, setComment] = useState('');
  const report: Report | undefined = reports.find((item: Report) => item.id === id);
  if (!report) return <div className="simple-empty"><h2>Bug report not found</h2><Link to="/bugs" className="button secondary">Back to bug reports</Link></div>;
  const project = projects.find((item: { id: string; title: string }) => report.projectId ? item.id === report.projectId : item.title === report.project);
  const task = tasks.find((item: { id: string }) => item.id === report.taskId);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!comment.trim()) return;
    const entry: Comment = { id: `C${Date.now()}`, author: role === 'faculty' ? 'Dr. Anil Kumar' : 'Aishwarya Nair', text: comment.trim(), date: new Date().toISOString() };
    saveReports(reports.map((item: Report) => item.id === id ? { ...item, comments: [...(item.comments || []), entry] } : item));
    setComment('');
    setNotice('Comment posted.');
  };
  const updateStatus = (status: string) => { saveReports(reports.map((item: Report) => item.id === id ? { ...item, status } : item)); setNotice('Bug status updated.'); };
  return <>
    <Link to="/bugs" className="back-link">← Back to bug reports</Link>
    {project && <Link to={`/projects/${project.id}`} className="back-link bug-project-link">View project: {project.title}</Link>}
    <div className="page-heading"><div><div className="eyebrow">BUG REPORT DETAILS</div><h1>{report.title}</h1><p>{report.project}</p></div><span className="badge">{report.status}</span></div>
    <div className="bug-detail-grid"><section className="detail-panel"><h2>Bug information</h2><dl>{[['Bug ID', report.id], ['Project', report.project], ['Related task', task?.title || 'No related task'], ['Priority', report.priority], ['Status', report.status], ['Report date', report.date ? new Date(report.date).toLocaleDateString() : 'Not recorded'], ['Reported by', report.reportedBy || 'Student']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{role === 'faculty' && <label className="status-control">Update status<select value={report.status} onChange={event => updateStatus(event.target.value)}>{['Open', 'In Progress', 'Resolved'].map(status => <option key={status}>{status}</option>)}</select></label>}</section><section className="detail-panel"><h2>Description</h2><p className="bug-description">{report.description}</p></section></div>
    <section className="detail-panel comments-panel"><div className="section-heading"><h2><MessageSquare size={18} />Comments <span>{report.comments?.length || 0}</span></h2></div>
      {!report.comments?.length && <p className="comments-empty">No comments yet. Share an update or ask a question about this bug.</p>}
      {(report.comments || []).map(entry => <article className="comment-row" key={entry.id}><span className="avatar">{entry.author.split(' ').slice(0, 2).map(word => word[0]).join('')}</span><div><strong>{entry.author}</strong><time dateTime={entry.date}>{new Date(entry.date).toLocaleString()}</time><p>{entry.text}</p></div></article>)}
      <form onSubmit={submit} className="comment-form"><label htmlFor="bug-comment">Add a comment</label><textarea id="bug-comment" required maxLength={2000} rows={3} placeholder="Share an update, a question, or a possible fix…" value={comment} onChange={event => setComment(event.target.value)} /><button className="button primary" disabled={!comment.trim()}>Post Comment<ArrowRight size={16} /></button></form>
    </section>
  </>;
}
