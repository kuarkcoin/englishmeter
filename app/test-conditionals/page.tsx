import GrammarTopicGuide from '@/components/GrammarTopicGuide';
import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'English Conditionals: Guide, Examples and Practice',
  description: 'Review conditional sentence patterns with worked questions and answer explanations, then take a free English conditionals practice test.',
  path: '/test-conditionals',
});

export default function TestConditionalsPage() {
  return <GrammarTopicGuide title="English Conditionals: Guide and Examples" path="/test-conditionals" testSlug="test-conditionals" />;
}
