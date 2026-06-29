export default function Badge({ status }) {
  const map = {
    Present: 'badge-present',
    Late: 'badge-late',
    Pending: 'badge-pending',
    Approved: 'badge-approved',
    Rejected: 'badge-rejected',
  }
  return <span className={map[status] || 'badge-pending'}>{status}</span>
}
