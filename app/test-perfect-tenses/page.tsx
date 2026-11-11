import GrammarTopicGuide from '@/components/GrammarTopicGuide';
import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'English Perfect Tenses: Guide, Examples and Practice',
  description: 'Compare present, past and future perfect forms with worked questions and explanations. Review time relationships, then practise with a free test.',
  path: '/test-perfect-tenses',
});

export default function TestPerfectTensesPage() {
  return <GrammarTopicGuide title="English Perfect Tenses: Guide and Examples" path="/test-perfect-tenses" testSlug="test-perfect-past" />;
}
