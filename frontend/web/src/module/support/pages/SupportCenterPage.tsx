import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { SupportMessage, SupportSession } from "../../../api/server/Support.api";
import { supportApi } from "../../../api/server/Support.api";
import { ErrorBlock } from "../../../components/common/ui/ErrorBlock";
import { PageLoader } from "../../../components/common/ux/PageLoader";
import { Footer } from "../../../components/Footer/Footer";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  LifeBuoy,
  MessageSquarePlus,
  Send,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./SupportCenterPage.css";

type SupportLocale = "vi" | "en";

type NewSessionForm = {
  initialMessage: string;
  attachmentUrl: string;
};

type ReplyForm = {
  messageText: string;
  attachmentUrl: string;
};

const copyByLocale = {
  vi: {
    loading: "Dang tai ho tro...",
    errorTitle: "Khong the tai ho tro",
    retry: "Thu lai",
    backAccount: "Ve tai khoan",
    kicker: "Support Center",
    title: "Ho tro chuyen di",
    subtitle: "Tao yeu cau, theo doi hoi thoai va gui them thong tin cho doi ngu TravelViet.",
    newSession: "Tao yeu cau moi",
    initialMessage: "Noi dung can ho tro",
    attachmentUrl: "Link dinh kem",
    createSession: "Gui yeu cau",
    creating: "Dang gui...",
    sessions: "Phien ho tro",
    noSessions: "Chua co phien ho tro.",
    messages: "Hoi thoai",
    noMessages: "Chua co tin nhan.",
    messageText: "Tin nhan",
    send: "Gui",
    sending: "Dang gui...",
    status: "Trang thai",
    messageCount: "Tin nhan",
    lastMessageAt: "Cap nhat",
    customer: "Ban",
    staff: "Nhan vien",
    system: "He thong",
    rating: "Danh gia phien",
    feedback: "Gop y",
    submitRating: "Luu danh gia",
    ratingSaved: "Da luu danh gia.",
    ratingClosedOnly: "Chi danh gia duoc khi phien da resolved/closed.",
  },
  en: {
    loading: "Loading support...",
    errorTitle: "Could not load support",
    retry: "Retry",
    backAccount: "Back to account",
    kicker: "Support Center",
    title: "Trip support",
    subtitle: "Create requests, follow conversations, and send more context to the TravelViet team.",
    newSession: "New request",
    initialMessage: "What do you need help with?",
    attachmentUrl: "Attachment link",
    createSession: "Create request",
    creating: "Creating...",
    sessions: "Support sessions",
    noSessions: "No support sessions yet.",
    messages: "Conversation",
    noMessages: "No messages yet.",
    messageText: "Message",
    send: "Send",
    sending: "Sending...",
    status: "Status",
    messageCount: "Messages",
    lastMessageAt: "Updated",
    customer: "You",
    staff: "Staff",
    system: "System",
    rating: "Session rating",
    feedback: "Feedback",
    submitRating: "Save rating",
    ratingSaved: "Rating saved.",
    ratingClosedOnly: "Rating is available only after the session is resolved or closed.",
  },
} satisfies Record<SupportLocale, Record<string, string>>;

function getLocale(language: string): SupportLocale {
  return language === "en" ? "en" : "vi";
}

function formatDate(value: string | undefined, locale: SupportLocale) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function canRate(session: SupportSession | null) {
  return session?.status === "resolved" || session?.status === "closed";
}

function getSenderLabel(message: SupportMessage, copy: Record<string, string>) {
  const sender = message.senderType?.toLowerCase();
  if (sender === "customer") {
    return copy.customer;
  }
  if (sender === "staff") {
    return copy.staff;
  }
  return copy.system;
}

export default function SupportCenterPage() {
  const { i18n } = useTranslation();
  const locale = getLocale(i18n.language);
  const copy = copyByLocale[locale];
  const [sessions, setSessions] = useState<SupportSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<SupportSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [newSessionForm, setNewSessionForm] = useState<NewSessionForm>({
    initialMessage: "",
    attachmentUrl: "",
  });
  const [replyForm, setReplyForm] = useState<ReplyForm>({
    messageText: "",
    attachmentUrl: "",
  });
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const selectedMessages = useMemo(
    () => selectedSession?.messages ?? [],
    [selectedSession?.messages],
  );

  const loadSessions = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await supportApi.getMySessions();
      setSessions(data);
      if (data.length > 0) {
        const detail = await supportApi.getMySession(data[0].id);
        setSelectedSession(detail);
        setRating(detail.rating ?? 5);
        setFeedback(detail.feedback ?? "");
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : copy.errorTitle);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSessions();
  }, []);

  const selectSession = async (sessionId: number) => {
    setDetailLoading(true);
    setMessage("");

    try {
      const detail = await supportApi.getMySession(sessionId);
      setSelectedSession(detail);
      setRating(detail.rating ?? 5);
      setFeedback(detail.feedback ?? "");
    } catch (selectError) {
      setMessage(selectError instanceof Error ? selectError.message : copy.errorTitle);
    } finally {
      setDetailLoading(false);
    }
  };

  const updateNewSession =
    (field: keyof NewSessionForm) =>
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setNewSessionForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const updateReply =
    (field: keyof ReplyForm) =>
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setReplyForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const createSession = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newSessionForm.initialMessage.trim()) {
      return;
    }

    setCreating(true);
    setMessage("");

    try {
      const created = await supportApi.createMySession({
        initialMessage: newSessionForm.initialMessage.trim(),
        attachmentUrl: newSessionForm.attachmentUrl.trim() || undefined,
      });
      setSessions((current) => [created, ...current]);
      setSelectedSession(created);
      setNewSessionForm({ initialMessage: "", attachmentUrl: "" });
      setRating(created.rating ?? 5);
      setFeedback(created.feedback ?? "");
    } catch (createError) {
      setMessage(createError instanceof Error ? createError.message : copy.errorTitle);
    } finally {
      setCreating(false);
    }
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSession || !replyForm.messageText.trim()) {
      return;
    }

    setSending(true);
    setMessage("");

    try {
      await supportApi.sendMyMessage(selectedSession.id, {
        messageText: replyForm.messageText.trim(),
        attachmentUrl: replyForm.attachmentUrl.trim() || undefined,
      });
      const detail = await supportApi.getMySession(selectedSession.id);
      setSelectedSession(detail);
      setSessions((current) =>
        current.map((session) => (session.id === detail.id ? detail : session)),
      );
      setReplyForm({ messageText: "", attachmentUrl: "" });
    } catch (sendError) {
      setMessage(sendError instanceof Error ? sendError.message : copy.errorTitle);
    } finally {
      setSending(false);
    }
  };

  const rateSession = async () => {
    if (!selectedSession || !canRate(selectedSession)) {
      setMessage(copy.ratingClosedOnly);
      return;
    }

    try {
      const updated = await supportApi.rateMySession(selectedSession.id, {
        rating,
        feedback: feedback.trim() || undefined,
      });
      setSelectedSession(updated);
      setSessions((current) =>
        current.map((session) => (session.id === updated.id ? updated : session)),
      );
      setMessage(copy.ratingSaved);
    } catch (rateError) {
      setMessage(rateError instanceof Error ? rateError.message : copy.errorTitle);
    }
  };

  if (loading) {
    return <PageLoader label={copy.loading} />;
  }

  if (error) {
    return (
      <main className="support-error">
        <ErrorBlock title={copy.errorTitle} message={error} />
        <button type="button" onClick={() => void loadSessions()}>
          {copy.retry}
        </button>
      </main>
    );
  }

  return (
    <div className="support-page">
      <main className="support-shell">
        <Link className="support-back-link" to="/account">
          <ArrowLeft aria-hidden="true" />
          {copy.backAccount}
        </Link>

        <section className="support-hero">
          <span>{copy.kicker}</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </section>

        <div className="support-layout">
          <aside className="support-sidebar">
            <section className="support-panel">
              <header>
                <LifeBuoy aria-hidden="true" />
                <h2>{copy.sessions}</h2>
              </header>

              {sessions.length === 0 ? (
                <p className="support-empty">{copy.noSessions}</p>
              ) : (
                <div className="support-session-list">
                  {sessions.map((session) => (
                    <button
                      className={selectedSession?.id === session.id ? "is-active" : ""}
                      type="button"
                      key={session.id}
                      onClick={() => void selectSession(session.id)}
                    >
                      <strong>{session.sessionCode || `#${session.id}`}</strong>
                      <span>{session.status || copy.status}</span>
                      <small>{formatDate(session.lastMessageAt, locale)}</small>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="support-panel">
              <header>
                <MessageSquarePlus aria-hidden="true" />
                <h2>{copy.newSession}</h2>
              </header>

              <form className="support-form" onSubmit={createSession}>
                <label>
                  <span>{copy.initialMessage}</span>
                  <textarea
                    value={newSessionForm.initialMessage}
                    onChange={updateNewSession("initialMessage")}
                    rows={5}
                  />
                </label>
                <label>
                  <span>{copy.attachmentUrl}</span>
                  <input
                    value={newSessionForm.attachmentUrl}
                    onChange={updateNewSession("attachmentUrl")}
                  />
                </label>
                <button type="submit" disabled={creating}>
                  <Send aria-hidden="true" />
                  {creating ? copy.creating : copy.createSession}
                </button>
              </form>
            </section>
          </aside>

          <section className="support-panel support-conversation-panel">
            <header>
              <div>
                <h2>{copy.messages}</h2>
                <p>
                  {selectedSession?.sessionCode || copy.noSessions}
                  {selectedSession?.status ? ` · ${selectedSession.status}` : ""}
                </p>
              </div>
              <span className="support-status-pill">
                {selectedSession?.messageCount ?? 0} {copy.messageCount}
              </span>
            </header>

            {detailLoading ? (
              <p className="support-empty">{copy.loading}</p>
            ) : selectedMessages.length === 0 ? (
              <p className="support-empty">{copy.noMessages}</p>
            ) : (
              <div className="support-message-list">
                {selectedMessages.map((item) => (
                  <article
                    className={
                      item.senderType?.toLowerCase() === "customer"
                        ? "is-customer"
                        : "is-staff"
                    }
                    key={item.id}
                  >
                    <span>{getSenderLabel(item, copy)}</span>
                    <p>{item.messageText}</p>
                    {item.attachmentUrl && (
                      <a href={item.attachmentUrl} target="_blank" rel="noreferrer">
                        {item.attachmentUrl}
                      </a>
                    )}
                    <small>{formatDate(item.createdAt, locale)}</small>
                  </article>
                ))}
              </div>
            )}

            <form className="support-form support-reply-form" onSubmit={sendMessage}>
              <label>
                <span>{copy.messageText}</span>
                <textarea
                  value={replyForm.messageText}
                  onChange={updateReply("messageText")}
                  rows={4}
                  disabled={!selectedSession || canRate(selectedSession)}
                />
              </label>
              <label>
                <span>{copy.attachmentUrl}</span>
                <input
                  value={replyForm.attachmentUrl}
                  onChange={updateReply("attachmentUrl")}
                  disabled={!selectedSession || canRate(selectedSession)}
                />
              </label>
              <button
                type="submit"
                disabled={!selectedSession || canRate(selectedSession) || sending}
              >
                <Send aria-hidden="true" />
                {sending ? copy.sending : copy.send}
              </button>
            </form>

            <div className="support-rating-box">
              <label>
                <span>{copy.rating}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                />
                <strong>{rating}/5</strong>
              </label>
              <label>
                <span>{copy.feedback}</span>
                <input
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                />
              </label>
              <button type="button" onClick={() => void rateSession()}>
                <Star aria-hidden="true" />
                {copy.submitRating}
              </button>
            </div>

            {message && <p className="support-message">{message}</p>}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
