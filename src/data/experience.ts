export interface Job {
  company: string;
  role: string;
  period: string;
  description: string;
  tags?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  details?: string;
}

export interface Certification {
  name: string;
  date: string;
}

export interface Publication {
  title: string;
  url: string;
  date: string;
  description: string;
  type: 'article' | 'video' | 'series';
}

export const jobs: Job[] = [
  {
    company: 'PwC Norway',
    role: 'Manager',
    period: '08.2025 – ongoing',
    description: 'Leading data engineering and AI initiatives in consulting.',
    tags: ['Data Engineering', 'AI', 'Leadership'],
  },
  {
    company: 'Kantega AS',
    role: 'Data Engineer',
    period: '12.2022 – 07.2025',
    description: 'Built cloud data platforms in Azure and Databricks. Developed RAG blueprints, streaming pipelines, and data anonymisation solutions for clients across finance and public sector.',
    tags: ['Azure', 'Databricks', 'Python', 'RAG', 'Kafka'],
  },
  {
    company: 'Avella AS',
    role: 'Integration Consultant',
    period: '09.2021 – 11.2022',
    description: 'Designed integration solutions for health and pharmaceutical clients. Led internal academy and methodology development. Certified in IBM ACE and Software AG platforms.',
    tags: ['Integration', 'IBM ACE', 'XSLT', 'Java'],
  },
  {
    company: 'Kobler AS',
    role: 'News Trend Analyst',
    period: '04.2019 – 06.2020',
    description: 'Sole developer of an NLP-based MVP for news trend analysis. Built NER pipelines, deployed on AWS ECS with Docker, and contributed to data-driven ad targeting.',
    tags: ['Python', 'NLP', 'Docker', 'AWS'],
  },
];

export const education: Education[] = [
  {
    institution: 'University of Oslo',
    degree: 'Single courses (master): Language Technology & Machine Learning',
    period: '2022',
    details: 'Reinforcement Learning, Decision Making Under Uncertainty, Responsible Data Science. Grade A.',
  },
  {
    institution: 'University of Oslo',
    degree: 'Enkeltemner (master): Språkteknologi og maskinlæring',
    period: '08.2018 – 01.2020',
  },
  {
    institution: 'University of Oslo',
    degree: 'Bachelor Mathematics, Informatics and Technology',
    period: '08.2014 – 06.2018',
  },
];

export const certifications: Certification[] = [
  { name: 'PL-300 Microsoft Certified: Power BI Data Analyst', date: '01.2024' },
  { name: 'DP-900 Azure Data Fundamentals', date: '02.2022' },
  { name: 'Confluent Fundamentals Accreditation', date: '10.2022' },
  { name: 'IBM Certified Solution Developer – App Connect V11', date: '09.2022' },
  { name: 'IBM Event Streams Developer Essentials', date: '05.2022' },
  { name: 'Certified SAFe® 5 Agilist', date: '09.2021' },
];

export const publications: Publication[] = [
  {
    title: 'Norway published "The 10 commandments of AI" — here\'s what they say, and why they matter',
    url: 'https://medium.com/@espenhk/norway-published-the-10-commandments-of-ai-heres-what-they-say-and-why-they-matter-2b670967eb9b',
    date: '11.2025',
    description: 'Analysis of Norway\'s ten guiding principles for AI policy by think tank Langsikt.',
    type: 'article',
  },
  {
    title: 'Anonymizing Data in Practice (4-part series)',
    url: 'https://medium.com/@espenhk/anonymizing-data-in-practice-the-whys-the-how-s-and-the-wtf-s-1-4-the-why-ac80fe18f710',
    date: '10.2024',
    description: 'Comprehensive series covering the why, how, what, and message of data anonymisation.',
    type: 'series',
  },
  {
    title: 'Exploring the Responsible AI Landscape: Books for Every Level',
    url: 'https://medium.com/@espenhk/exploring-the-responsible-ai-landscape-books-for-every-level-of-curiosity-and-expertise-fee05a296b8d',
    date: '10.2023',
    description: 'Curated book recommendations on responsible AI. Also published on Kantega\'s blog.',
    type: 'article',
  },
  {
    title: 'Breaking down AlphaGo – Reinforcement Learning in Games',
    url: 'https://www.youtube.com/watch?v=ZclWqNVEegw',
    date: '06.2022',
    description: 'Video presentation breaking down the AlphaGo paper and reinforcement learning concepts.',
    type: 'video',
  },
];
