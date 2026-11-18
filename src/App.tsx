import { FormEvent, useState } from "react"

type FormValues = { name: string; email: string; preferredDate: string; note: string }
type Submission = { kind: "success" | "error"; message: string } | null
const emptyValues: FormValues = { name: "", email: "", preferredDate: "", note: "" }

export function App() {
  const [values, setValues] = useState(emptyValues)
  const [submitting, setSubmitting] = useState(false)
  const [submission, setSubmission] = useState<Submission>(null)
  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setSubmission(null)
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setSubmission(null)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? ""}/api/appointments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Your request could not be sent. Please try again.")
      setSubmission({ kind: "success", message: "Your request was received. We’ll be in touch about next steps." })
      setValues(emptyValues)
    } catch (error) {
      setSubmission({ kind: "error", message: error instanceof Error ? error.message : "We couldn’t reach the service. Please try again." })
    } finally { setSubmitting(false) }
  }
  return (
    <main className="page-shell">
      <section className="request-panel" aria-labelledby="page-title">
        <div className="intro">
          <p className="eyebrow">Appointment request</p>
          <h1 id="page-title">Let’s find a time<br />that works for you.</h1>
          <p className="intro-copy">Share a few details and we’ll follow up. Your preferred date is a starting point, not a confirmed booking.</p>
          <div className="response-note"><span className="note-mark" aria-hidden="true">↗</span><span>Usually, you’ll hear back within one business day.</span></div>
        </div>
        <form className="request-form" onSubmit={submit}>
          <div className="field-grid">
            <label className="field"><span>Your name</span><input autoComplete="name" maxLength={100} required value={values.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Alex Morgan" /></label>
            <label className="field"><span>Email address</span><input type="email" autoComplete="email" maxLength={254} required value={values.email} onChange={(e) => update("email", e.target.value)} placeholder="alex@example.com" /></label>
            <label className="field field-wide"><span>Preferred date</span><input type="date" required value={values.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} /></label>
            <label className="field field-wide"><span>Anything we should know? <span className="optional">Optional</span></span><textarea rows={4} maxLength={500} value={values.note} onChange={(e) => update("note", e.target.value)} placeholder="A little context helps us prepare." /></label>
          </div>
          {submission && <p className={`feedback ${submission.kind}`} role={submission.kind === "error" ? "alert" : "status"}>{submission.message}</p>}
          <div className="form-end"><span className="privacy-note">Your details are only used to respond to this request.</span><button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send request"}<span aria-hidden="true">↗</span></button></div>
        </form>
      </section>
      <footer><span>Appointments</span><span>Request received ≠ appointment confirmed</span></footer>
    </main>
  )
}
export default App
