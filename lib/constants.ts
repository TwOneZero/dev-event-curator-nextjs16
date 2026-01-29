export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    title: "Next.js Conf 2026",
    image: "/images/event1.png",
    slug: "nextjs-conf-2026",
    location: "San Francisco, CA",
    date: "2026-10-25",
    time: "09:00 AM",
  },
  {
    title: "React Summit",
    image: "/images/event2.png",
    slug: "react-summit",
    location: "Amsterdam, NL",
    date: "2026-06-12",
    time: "10:00 AM",
  },
  {
    title: "AWS re:Invent",
    image: "/images/event3.png",
    slug: "aws-reinvent",
    location: "Las Vegas, NV",
    date: "2026-12-01",
    time: "08:30 AM",
  },
  {
    title: "Google I/O 2026",
    image: "/images/event4.png",
    slug: "google-io-2026",
    location: "Mountain View, CA",
    date: "2026-05-20",
    time: "11:00 AM",
  },
  {
    title: "Web Summit 2026",
    image: "/images/event5.png",
    slug: "web-summit-2026",
    location: "Lisbon, Portugal",
    date: "2026-11-11",
    time: "09:00 AM",
  },
  {
    title: "JSWorld Conference",
    image: "/images/event6.png",
    slug: "jsworld-conference",
    location: "Online",
    date: "2026-02-15",
    time: "02:00 PM",
  },
];
