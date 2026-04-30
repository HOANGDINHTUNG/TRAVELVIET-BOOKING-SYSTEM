import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Link2,
  MessageCircle,
  Send,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  scheduleChatApi,
  type ScheduleChatMessage,
  type ScheduleChatRoom,
} from "../../../api/server/ScheduleChat.api";
import { ErrorBlock } from "../../../components/common/ui/ErrorBlock";
import { PageLoader } from "../../../components/common/ux/PageLoader";
import { Footer } from "../../../components/Footer/Footer";
import { getStoredAuthUser } from "../../auth/api/authApi";
import "./ScheduleChatPage.css";

type ScheduleChatLocale = "vi" | "en";

type ScheduleChatCopy = {
  loading: string;
  errorTitle: string;
  missing: string;
  backBooking: string;
  backHome: string;
  kicker: string;
  fallbackRoom: (scheduleId: number) => string;
  subtitle: string;
  members: string;
  active: string;
  inactive: string;
  conversation: string;
  noMessages: string;
  message: string;
  attachmentUrl: string;
  send: string;
  sending: string;
  attachment: string;
  you: string;
  guest: string;
  schedule: string;
  sendError: string;
};

const copyByLocale: Record<ScheduleChatLocale, ScheduleChatCopy> = {
  vi: {
    loading: "Dang tai nhom chat...",
    errorTitle: "Khong the tai nhom chat",
    missing: "Lich trinh khong hop le.",
    backBooking: "Ve booking",
    backHome: "Ve trang chu",
    kicker: "Schedule group chat",
    fallbackRoom: (scheduleId) => `Nhom chat lich trinh #${scheduleId}`,
    subtitle:
      "Trao doi thong tin truoc ngay khoi hanh voi cac thanh vien trong cung lich trinh va doi ngu TravelViet.",
    members: "Thanh vien",
    active: "Dang mo",
    inactive: "Tam dung",
    conversation: "Hoi thoai",
    noMessages: "Chua co tin nhan trong nhom nay.",
    message: "Tin nhan",
    attachmentUrl: "Link dinh kem",
    send: "Gui tin nhan",
    sending: "Dang gui...",
    attachment: "Mo dinh kem",
    you: "Ban",
    guest: "Thanh vien",
    schedule: "Lich trinh",
    sendError: "Khong the gui tin nhan.",
  },
  en: {
    loading: "Loading group chat...",
    errorTitle: "Could not load group chat",
    missing: "Invalid schedule.",
    backBooking: "Back to booking",
    backHome: "Back to home",
    kicker: "Schedule group chat",
    fallbackRoom: (scheduleId) => `Schedule chat #${scheduleId}`,
    subtitle:
      "Coordinate before departure with travelers on the same schedule and the TravelViet team.",
    members: "Members",
    active: "Active",
    inactive: "Paused",
    conversation: "Conversation",
    noMessages: "No messages in this group yet.",
    message: "Message",
    attachmentUrl: "Attachment link",
    send: "Send message",
    sending: "Sending...",
    attachment: "Open attachment",
    you: "You",
    guest: "Member",
    schedule: "Schedule",
    sendError: "Could not send message.",
  },
};

function getLocale(language: string): ScheduleChatLocale {
  return language === "en" ? "en" : "vi";
}

function formatDate(value: string | undefined, locale: ScheduleChatLocale) {
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

function getSenderName(message: ScheduleChatMessage, copy: ScheduleChatCopy) {
  return (
    message.senderDisplayName ||
    message.senderFullName ||
    message.senderUserId ||
    copy.guest
  );
}

export default function ScheduleChatPage() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const locale = getLocale(i18n.language);
  const copy = copyByLocale[locale];
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [room, setRoom] = useState<ScheduleChatRoom | null>(null);
  const [messages, setMessages] = useState<ScheduleChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const numericScheduleId = useMemo(() => Number(scheduleId), [scheduleId]);
  const currentUserId = getStoredAuthUser()?.id;

  const loadChat = async () => {
    if (!Number.isFinite(numericScheduleId)) {
      setError(copy.missing);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [roomData, messagePage] = await Promise.all([
        scheduleChatApi.getRoom(numericScheduleId),
        scheduleChatApi.getMessages(numericScheduleId),
      ]);
      setRoom(roomData);
      setMessages(messagePage.content ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : copy.errorTitle);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadChat();
  }, [numericScheduleId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if ((!messageText.trim() && !attachmentUrl.trim()) || sending) {
      return;
    }

    setSending(true);
    setNotice("");

    try {
      await scheduleChatApi.sendMessage(numericScheduleId, {
        messageText: messageText.trim() || undefined,
        attachmentUrl: attachmentUrl.trim() || undefined,
      });
      const nextMessages = await scheduleChatApi.getMessages(numericScheduleId);
      setMessages(nextMessages.content ?? []);
      setMessageText("");
      setAttachmentUrl("");
    } catch (sendError) {
      setNotice(sendError instanceof Error ? sendError.message : copy.sendError);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <PageLoader label={copy.loading} />;
  }

  if (error) {
    return (
      <main className="schedule-chat-error">
        <ErrorBlock title={copy.errorTitle} message={error} />
        <Link to="/" className="schedule-chat-back-link">
          <ArrowLeft aria-hidden="true" />
          {copy.backHome}
        </Link>
      </main>
    );
  }

  const roomName = room?.roomName || copy.fallbackRoom(numericScheduleId);
  const memberCount = room?.memberCount ?? room?.members?.length ?? 0;

  return (
    <div className="schedule-chat-page">
      <main className="schedule-chat-shell">
        <button
          className="schedule-chat-back-link"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft aria-hidden="true" />
          {copy.backBooking}
        </button>

        <section className="schedule-chat-hero">
          <div>
            <span>{copy.kicker}</span>
            <h1>{roomName}</h1>
            <p>{copy.subtitle}</p>
          </div>
          <div className="schedule-chat-stats">
            <span>
              <CalendarDays aria-hidden="true" />
              {room?.scheduleCode || `${copy.schedule} #${numericScheduleId}`}
            </span>
            <span>
              <UsersRound aria-hidden="true" />
              {memberCount} {copy.members}
            </span>
            <strong>{room?.active === false ? copy.inactive : copy.active}</strong>
          </div>
        </section>

        <div className="schedule-chat-layout">
          <aside className="schedule-chat-members">
            <header>
              <UsersRound aria-hidden="true" />
              <h2>{copy.members}</h2>
            </header>
            <div className="schedule-chat-member-list">
              {(room?.members ?? []).map((member) => (
                <article key={member.id}>
                  <div>
                    {(member.displayName || member.fullName || copy.guest)
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                  <span>{member.displayName || member.fullName || copy.guest}</span>
                </article>
              ))}
            </div>
          </aside>

          <section className="schedule-chat-conversation">
            <header>
              <div>
                <MessageCircle aria-hidden="true" />
                <h2>{copy.conversation}</h2>
              </div>
              <span>{messages.length}</span>
            </header>

            <div className="schedule-chat-message-list">
              {messages.length === 0 ? (
                <p className="schedule-chat-empty">{copy.noMessages}</p>
              ) : (
                messages.map((item) => {
                  const isMine = Boolean(
                    currentUserId && item.senderUserId === currentUserId,
                  );

                  return (
                    <article
                      className={isMine ? "is-mine" : ""}
                      key={item.id}
                    >
                      <span>{isMine ? copy.you : getSenderName(item, copy)}</span>
                      {item.messageText && <p>{item.messageText}</p>}
                      {item.attachmentUrl && (
                        <a href={item.attachmentUrl} target="_blank" rel="noreferrer">
                          <Link2 aria-hidden="true" />
                          {copy.attachment}
                        </a>
                      )}
                      <small>{formatDate(item.createdAt, locale)}</small>
                    </article>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="schedule-chat-form" onSubmit={sendMessage}>
              <label>
                <span>{copy.message}</span>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  maxLength={5000}
                />
              </label>
              <label>
                <span>{copy.attachmentUrl}</span>
                <input
                  value={attachmentUrl}
                  onChange={(event) => setAttachmentUrl(event.target.value)}
                  maxLength={2000}
                />
              </label>
              <button
                type="submit"
                disabled={sending || (!messageText.trim() && !attachmentUrl.trim())}
              >
                <Send aria-hidden="true" />
                {sending ? copy.sending : copy.send}
              </button>
              {notice && <p className="schedule-chat-notice">{notice}</p>}
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
