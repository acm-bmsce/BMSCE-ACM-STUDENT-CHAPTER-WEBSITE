import { useMemo, useState, useEffect } from "react";
import SEO from "../components/SEO";
import mockData from "../../mock_events.json";
import { getOptimizedImageUrl } from "../utils/imageHelper";

import EventTitleSection from "../components/events/EventTitleSection";
import EventFeaturedSection from "../components/events/EventFeaturedSection";
import EventCalendarSection from "../components/events/EventCalendarSection";
import EventUpcomingSessions from "../components/events/EventUpcomingSessions";
import EventPastSessions from "../components/events/EventPastSessions";

const parseDate = (date) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const buildCalendarCells = (monthAnchor, events, focusLabel, today) => {
  const year = monthAnchor.getFullYear();
  const month = monthAnchor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startIndex = (firstOfMonth.getDay() + 6) % 7;
  const totalCells = Math.ceil((startIndex + daysInMonth) / 7) * 7;

  const eventCounts = new Map();
  events
    .map((evt) => parseDate(evt.date))
    .filter((d) => d !== null)
    .filter((d) => d.getFullYear() === year && d.getMonth() === month)
    .forEach((d) => {
      const day = d.getDate();
      eventCounts.set(day, (eventCounts.get(day) || 0) + 1);
    });

  const focusDate = events
    .map((evt) => parseDate(evt.date))
    .filter((d) => d !== null)
    .find((d) => d.getFullYear() === year && d.getMonth() === month);

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startIndex + 1;
    const isWeekend = index % 7 >= 5;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return { type: "empty", isWeekend };
    }

    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === dayNumber;

    const isFocus = Boolean(focusDate) && focusDate.getDate() === dayNumber && !isToday;

    const count = eventCounts.get(dayNumber) || 0;
    const eventsLabel = count > 0 ? [`${count} event${count > 1 ? "s" : ""}`] : undefined;

    return {
      type: "day",
      day: dayNumber,
      isWeekend,
      isToday,
      isFocus,
      focusLabel: isFocus ? focusLabel : undefined,
      events: eventsLabel,
    };
  });
};

export default function EventPage() {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prev = {
      htmlOverflow: html.style.overflow,
      htmlOverflowX: html.style.overflowX,
      htmlOverflowY: html.style.overflowY,
      htmlHeight: html.style.height,
      htmlMinHeight: html.style.minHeight,
      htmlDisplay: html.style.display,
      htmlAlignItems: html.style.alignItems,
      htmlJustifyContent: html.style.justifyContent,
      htmlBackground: html.style.background,
      bodyBackground: body.style.background,
      bodyOverflow: body.style.overflow,
      bodyOverflowX: body.style.overflowX,
      bodyOverflowY: body.style.overflowY,
      bodyHeight: body.style.height,
      bodyMinHeight: body.style.minHeight,
      bodyDisplay: body.style.display,
      bodyAlignItems: body.style.alignItems,
      bodyJustifyContent: body.style.justifyContent,
    };

    html.style.display = "block";
    html.style.height = "auto";
    html.style.minHeight = "100%";
    html.style.overflow = "auto";
    html.style.overflowX = "hidden";
    html.style.overflowY = "auto";
    html.style.alignItems = "stretch";
    html.style.justifyContent = "initial";
    html.style.background = "#000";

    body.style.display = "block";
    body.style.height = "auto";
    body.style.minHeight = "100%";
    body.style.overflow = "auto";
    body.style.overflowX = "hidden";
    body.style.overflowY = "auto";
    body.style.alignItems = "stretch";
    body.style.justifyContent = "initial";
    body.style.background = "#000";

    return () => {
      html.style.overflow = prev.htmlOverflow;
      html.style.overflowX = prev.htmlOverflowX;
      html.style.overflowY = prev.htmlOverflowY;
      html.style.height = prev.htmlHeight;
      html.style.minHeight = prev.htmlMinHeight;
      html.style.display = prev.htmlDisplay;
      html.style.alignItems = prev.htmlAlignItems;
      html.style.justifyContent = prev.htmlJustifyContent;
      html.style.background = prev.htmlBackground;
      body.style.background = prev.bodyBackground;
      body.style.overflow = prev.bodyOverflow;
      body.style.overflowX = prev.bodyOverflowX;
      body.style.overflowY = prev.bodyOverflowY;
      body.style.height = prev.bodyHeight;
      body.style.minHeight = prev.bodyMinHeight;
      body.style.display = prev.bodyDisplay;
      body.style.alignItems = prev.bodyAlignItems;
      body.style.justifyContent = prev.bodyJustifyContent;
    };
  }, []);

  const derived = useMemo(() => {
    const events = Array.isArray(mockData) ? mockData : mockData.events || [];
    const pageData = (mockData && mockData.eventPage) || {};

    const normalized = events.map((evt, index) => ({
      ...evt,
      _id: evt._id || evt.id || `event-${index}`,
      title: evt.title,
      date: evt.date,
      description: evt.description,
      location: evt.location || "BMSCE Campus",
      image: evt.image,
      is_featured: evt.is_featured,
      parsedDate: parseDate(evt.date),
    }));

    const sorted = normalized
      .filter((item) => item.parsedDate !== null)
      .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

    const upcoming = sorted.filter((item) => item.parsedDate >= today);
    const past = [...sorted].filter((item) => item.parsedDate < today).reverse();

    const feat = normalized.find((e) => e.is_featured) || upcoming[0] || normalized[0];
    const attendance =
      typeof feat?.attendees === "number"
        ? feat.attendees
        : Number(feat?.attendees) || undefined;
    const featuredImages = (pageData && pageData.featuredImages) || {};
    const featuredCard = {
      title: feat?.title?.split(" ").slice(0, 2).join(" ") || "ACM",
      titleAccent: feat?.title?.split(" ").slice(2).join(" "),
      description: feat?.description || "Join our flagship ACM event.",
      dateLabel: feat?.date || "",
      location: feat?.location || "BMSCE Campus",
      speakers: "Industry Experts",
      capacity: "Limited",
      image: getOptimizedImageUrl(feat?.image, 1200),
      registrationLink: feat?.registration_link || "#",
      attendancePercent: attendance ? Math.min(100, Math.round((attendance / 250) * 100)) : 72,
      attendanceLabel: attendance ? `${attendance} attending` : "180 attending",
      imageSecondary: featuredImages.secondary,
      imageTertiary: featuredImages.tertiary,
    };

    const spotlightEvt = upcoming[0] || past[0] || sorted[0];
    const focusLabel = spotlightEvt?.title?.split(" ").slice(0, 2).join(" ") || undefined;

    const monthAnchor = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const cells = buildCalendarCells(monthAnchor, normalized, focusLabel, today);

    const spotlight = spotlightEvt
      ? {
          day: spotlightEvt.parsedDate?.getDate() || 1,
          monthLabel: `${spotlightEvt.parsedDate?.toLocaleDateString("en-IN", {
            month: "short",
          })} - ${spotlightEvt.location || "BMSCE Campus"}`,
          badge: spotlightEvt.parsedDate >= today ? "Upcoming" : "Recent",
          titleLine1: spotlightEvt.title.split(" ")[0],
          titleLine2: spotlightEvt.title.split(" ").slice(1).join(" ") || "Session",
          description: spotlightEvt.description,
          imageUrl: spotlightEvt.image,
          time: spotlightEvt.parsedDate
            ? spotlightEvt.parsedDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "10:00 AM",
          location: spotlightEvt.location || "BMSCE Campus",
        }
      : pageData?.calendarDefaults?.spotlight;

    const maxUpcoming = pageData?.upcomingCount || 3;
    const maxPast = pageData?.pastCount || 3;
    const sessionCards = upcoming.slice(0, maxUpcoming).map((item) => ({
      day: item.parsedDate.getDate().toString().padStart(2, "0"),
      month: item.parsedDate.toLocaleDateString("en-IN", { month: "short" }),
      title: item.title,
      description: item.description || "Technical session by BMSCE ACM.",
      tag: item.tag || "Workshop",
      location: item.location || "BMSCE",
      time: item.parsedDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      image: item.image,
    }));

    const pastSessionCards = past.slice(0, maxPast).map((item) => ({
      day: item.parsedDate.getDate().toString().padStart(2, "0"),
      month: item.parsedDate.toLocaleDateString("en-IN", { month: "short" }),
      title: item.title,
      description: item.description || "ACM event highlight.",
      tag: item.tag || "Past Event",
      location: item.location || "BMSCE",
      dateLabel: item.parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      image: item.image,
    }));

    return {
      featuredCard,
      monthLabel: monthAnchor
        .toLocaleDateString("en-IN", { month: "long", year: "numeric" })
        .toUpperCase(),
      spotlight,
      sessionCards,
      pastSessionCards,
      cells,
      semesterLabel: pageData?.semesterLabel || "ACADEMIC CALENDAR",
    };
  }, [monthOffset]);

  return (
    <main className="relative block min-h-screen w-full bg-black overflow-y-visible">
      <section className="relative overflow-hidden pb-14 pt-[3vh] bg-black"></section>
      <SEO
        title="Events | BMSCE ACM"
        description="View our featured events, academic calendar, and upcoming technical sessions."
      />

      <div className="flex flex-col gap-0">
        <section className="relative w-full">
          <EventTitleSection featured={derived.featuredCard} sectionTitle="EVENTS" />
        </section>

        <section className="relative w-full py-20 px-4 bg-black">
          <EventCalendarSection
            monthLabel={derived.monthLabel}
            semesterLabel={derived.semesterLabel}
            cells={derived.cells}
            spotlight={derived.spotlight}
            onPrevMonth={() => setMonthOffset((prev) => prev - 1)}
            onNextMonth={() => setMonthOffset((prev) => prev + 1)}
          />
        </section>

        <section className="relative w-full">
          <EventFeaturedSection />
        </section>

        <section className="relative w-full pb-32">
          <EventPastSessions sessions={derived.pastSessionCards} locationLabel="BMSCE Campus" />
        </section>

        <section className="relative w-full pb-32">
          <EventUpcomingSessions sessions={derived.sessionCards} locationLabel="BMSCE Campus" />
        </section>
      </div>
    </main>
  );
}