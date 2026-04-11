export interface LinkedInPost {
  type: 'post' | 'comment' | 'article';
  text: string;
  date: string;
  url: string;
  likes?: number;
  comments?: number;
  /** LinkedIn activity ID for embed, e.g. "urn:li:share:7123456789" — optional */
  activityUrn?: string;
}

export const linkedInPosts: LinkedInPost[] = [
  {
    type: 'post',
    text: 'Excited to join PwC Norway as Manager, leading data engineering and AI initiatives. Looking forward to this new chapter! 🚀',
    date: '08.2025',
    url: 'https://linkedin.com/in/espen-h-kristensen-4770a525',
    likes: 47,
    comments: 12,
  },
  {
    type: 'article',
    text: 'Just published: "Norway published the 10 commandments of AI" — an analysis of the guiding principles by think tank Langsikt. What do they mean for Nordic tech?',
    date: '11.2025',
    url: 'https://linkedin.com/in/espen-h-kristensen-4770a525',
    likes: 38,
    comments: 8,
  },
  {
    type: 'comment',
    text: 'Great points on responsible AI governance. In our work at Kantega we found that data anonymisation is the first practical step most orgs overlook. Wrote a series on this — happy to share.',
    date: '10.2024',
    url: 'https://linkedin.com/in/espen-h-kristensen-4770a525',
    likes: 15,
  },
  {
    type: 'post',
    text: 'Just wrapped up a deep-dive into Azure AI Foundry. The managed endpoints for fine-tuned models are a game-changer for enterprise RAG use cases. Here are my key takeaways…',
    date: '06.2025',
    url: 'https://linkedin.com/in/espen-h-kristensen-4770a525',
    likes: 31,
    comments: 6,
  },
  {
    type: 'comment',
    text: 'Streaming with Kafka + Databricks is underrated for real-time data quality checks. We built a pattern using structured streaming that catches schema drift before it hits the lakehouse.',
    date: '03.2024',
    url: 'https://linkedin.com/in/espen-h-kristensen-4770a525',
    likes: 22,
  },
  {
    type: 'post',
    text: 'Presented "Breaking down AlphaGo" at UiO today — reinforcement learning explained through the lens of the greatest board game upset in history. Video coming soon 🎬',
    date: '06.2022',
    url: 'https://linkedin.com/in/espen-h-kristensen-4770a525',
    likes: 54,
    comments: 9,
  },
  {
    type: 'post',
    text: 'New certification unlocked: PL-300 Microsoft Certified Power BI Data Analyst 📊 Time to build some dashboards.',
    date: '01.2024',
    url: 'https://linkedin.com/in/espen-h-kristensen-4770a525',
    likes: 62,
    comments: 14,
  },
  {
    type: 'comment',
    text: 'The anonymisation vs pseudonymisation distinction matters more than people think. GDPR treats them very differently. We cover this in depth in part 2 of our series.',
    date: '11.2024',
    url: 'https://linkedin.com/in/espen-h-kristensen-4770a525',
    likes: 18,
  },
];
