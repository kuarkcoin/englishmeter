import GrammarTopicGuide from '@/components/GrammarTopicGuide';
import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'English Relative Clauses: Guide, Examples and Practice',
  description: 'Review relative pronouns and defining and non-defining clauses with worked examples and explanations. Test your understanding with free practice.',
  path: '/test-relatives',
});

export default function TestRelativesPage() {
  return <GrammarTopicGuide title="English Relative Clauses: Guide and Examples" path="/test-relatives" testSlug="test-relatives" />;
}
