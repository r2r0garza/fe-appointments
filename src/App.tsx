import { useState } from "react"

const initialValues = { name: "", email: "", preferredDate: "", note: "" }

export function App() {
  const [values, setValues] = useState(initialValues)
  const [status, setStatus] = useState<"idle" | "sending" | "accepted" | "error">("idle")
  const [message, setMessage] = useState("")

  function update(field: keyof typeof initialValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    if (status === "error") setStatus("idle")
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("sending")
    setMessage("")
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? ""}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "The request could not be sent.")
      setStatus("accepted")
      setMessage("Your request has been received. This is not a confirmed booking.")
      setValues(initialValues)
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "The request could not be sent. Please try again.")
    }
  }

  return (
    <main className="page-shell">
      <header className="masthead"><a href="#top" aria-label="Atelier appointments home">ATELIER <span>·</span> APPOINTMENTS</a><span>REQUEST DESK</span></header>
      <section className="request-layout" id="top">
        <div className="intro">
          <p className="kicker">A moment, made yours</p>
          <h1>Let’s find<br />a time.</h1>
          <p className="intro-copy">Tell us what works for you. We’ll be in touch to shape the details together.</p>
          <div className="side-note"><span className="note-mark">✳</span><p>Your preferred date is a starting point, not a booking. We’ll confirm availability with you.</p></div>
        </div>
        <div className="form-panel">
          <p className="form-heading">Appointment request</p>
          <p className="form-subtitle">A few details to get the conversation started.</p>
          <form onSubmit={submit}>
            <label htmlFor="name">Your name</label>
            <input id="name" name="name" autoComplete="name" required maxLength={100} value={values.name} onChange={(e) => update("name", e.target.value)} placeholder="Name" />
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
            <label htmlFor="preferredDate">Preferred date</label>
            <input id="preferredDate" name="preferredDate" type="date" required value={values.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} />
            <label htmlFor="note">A short note <span>(optional)</span></label>
            <textarea id="note" name="note" rows={3} maxLength={500} value={values.note} onChange={(e) => update("note", e.target.value)} placeholder="Anything we should know?" />
            <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending request…" : "Send request"}</button>
          </form>
          <div aria-live="polite" role={status === "error" ? "alert" : "status"} className={`result ${status}`}>{message}</div>
        </div>
      </section>
      <footer>We’ll only use these details to follow up on your request.</footer>
    </main>
  )
}

export default App
