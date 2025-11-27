// data/blogPosts.ts
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  image: string;
  contentHtml: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'advanced-grammar-mistakes',
    title: '10 Grammar Mistakes Even Advanced Learners Still Make',
    description:
      'Think your grammar is advanced? These 10 common mistakes still trap C1–C2 learners. See if you make any of them.',
    date: '2025-11-27',
    readingTime: '7 min read',
    image: '/images/blog/advanced-grammar-mistakes.jpg',
    contentHtml: `
      <p>Even advanced learners with years of experience still make surprisingly simple grammar mistakes. These errors often appear in exams like IELTS, TOEFL or Cambridge tests, and they can easily lower your score.</p>

      <p>Read through the 10 mistakes below and check how many you already knew. At the end, you can try a short quiz to see if you really fixed them.</p>

      <h2>1. "Despite of" ❌</h2>
      <p><strong>Wrong:</strong> Despite of the rain, we went out.<br>
      <strong>Correct:</strong> Despite the rain, we went out.</p>

      <h2>2. "I suggest you to..." ❌</h2>
      <p>After <em>suggest</em>, we do not use <em>to + verb</em>.</p>
      <p><strong>Correct:</strong> I suggest you <strong>go</strong> there early.<br>
      <strong>Correct:</strong> I suggest <strong>going</strong> there early.</p>

      <h2>3. "In my opinion I think..." ❌</h2>
      <p>This expression is redundant. Use just one of them.</p>
      <p><strong>Better:</strong> In my opinion, this is wrong.<br>
      <strong>Better:</strong> I think this is wrong.</p>

      <h2>4. "Much people" ❌</h2>
      <p><strong>Much</strong> is used with uncountable nouns, <strong>many</strong> with countable nouns.</p>
      <p><strong>Correct:</strong> Many people agree with you.</p>

      <h2>5. "I didn’t went" ❌</h2>
      <p>When we use <em>did</em> in the past, the main verb stays in base form.</p>
      <p><strong>Correct:</strong> I didn’t go to the party.</p>

      <h2>6. "I look forward to see you" ❌</h2>
      <p>After <em>look forward to</em>, we use a noun or gerund.</p>
      <p><strong>Correct:</strong> I look forward to seeing you.</p>

      <h2>7. "The news are good" ❌</h2>
      <p><em>News</em> is an uncountable noun and takes a singular verb.</p>
      <p><strong>Correct:</strong> The news is good today.</p>

      <h2>8. "More better" ❌</h2>
      <p><strong>Better</strong> is already a comparative form. Do not add <em>more</em>.</p>
      <p><strong>Correct:</strong> This option is better.</p>

      <h2>9. "I’ve lived here since 10 years" ❌</h2>
      <p>Use <strong>for</strong> with a period of time, and <strong>since</strong> with a starting point.</p>
      <p><strong>Correct:</strong> I’ve lived here for 10 years.<br>
      <strong>Correct:</strong> I’ve lived here since 2015.</p>

      <h2>10. "He explained me the problem" ❌</h2>
      <p>We explain <em>something to someone</em>.</p>
      <p><strong>Correct:</strong> He explained the problem to me.</p>

      <h2>Mini Quiz: Can You Avoid These Mistakes?</h2>
      <p>The best way to remember these rules is to use them in context.</p>
      <p><a href="/quiz/advanced-grammar-mistakes" rel="nofollow">👉 Take the Advanced Grammar Mistakes Quiz (10 questions)</a></p>
    `,
  },
  {
    slug: 'c1-c2-grammar-test-most-people-score-6-10',
    title: 'Can You Pass This C1–C2 Grammar Test? Most People Score 6/10',
    description:
      'Think your English is advanced? Try this C1–C2 grammar challenge. Most learners score between 5 and 7 out of 10.',
    date: '2025-11-27',
    readingTime: '6 min read',
    image: '/images/blog/c1-c2-grammar-test.jpg',
    contentHtml: `
      <p>Many learners say they are C1 or C2, but when they take a focused grammar test, their score tells a different story. This mini challenge checks some of the most important structures at advanced level.</p>

      <p>Below you will see sample questions that test inversion, mixed conditionals, participle clauses and advanced linking structures.</p>

      <h2>Sample Question 1</h2>
      <p><strong>Had I known about the delay, I ___ earlier.</strong></p>
      <ul>
        <li>A) would leave</li>
        <li><strong>B) would have left ✔</strong></li>
        <li>C) left</li>
        <li>D) had left</li>
      </ul>
      <p>This is a classic third conditional structure. The unreal result in the past needs <em>would have + past participle</em>.</p>

      <h2>Sample Question 2</h2>
      <p><strong>No sooner ___ than the teacher started the test.</strong></p>
      <ul>
        <li>A) we sit down</li>
        <li>B) did we sit down</li>
        <li><strong>C) had we sat down ✔</strong></li>
        <li>D) we had sat down</li>
      </ul>
      <p>After <em>No sooner</em>, we normally use inversion with the past perfect in narrative contexts.</p>

      <h2>Sample Question 3</h2>
      <p><strong>Hardly had she finished speaking when people ___ to clap.</strong></p>
      <ul>
        <li><strong>A) began ✔</strong></li>
        <li>B) had begun</li>
        <li>C) were beginning</li>
        <li>D) would begin</li>
      </ul>
      <p>We often use past simple in the second clause to show what happened immediately after the first action.</p>

      <h2>What Does Your Score Really Mean?</h2>
      <ul>
        <li><strong>0–4/10:</strong> You probably need strong B2 revision.</li>
        <li><strong>5–7/10:</strong> Solid B2+, moving towards C1.</li>
        <li><strong>8–10/10:</strong> Very strong C1–C2 control of grammar.</li>
      </ul>

      <p>If you want a more accurate result, you should complete a full-length test.</p>

      <p><a href="/quiz/c1-c2-full-test" rel="nofollow">👉 Take the full 20-question C1–C2 Grammar Test now</a></p>
    `,
  },
  {
    slug: 'daily-grammar-quiz-improve-english-in-2-minutes',
    title: 'Daily Grammar Quiz – Improve Your English in 2 Minutes',
    description:
      'Build a daily habit with quick grammar questions. One short quiz a day can slowly transform your English.',
    date: '2025-11-27',
    readingTime: '5 min read',
    image: '/images/blog/daily-grammar-quiz.jpg',
    contentHtml: `
      <p>Improving your English does not always require long study sessions. Sometimes, two focused minutes a day are more powerful than one hour once a week.</p>

      <p>A daily grammar quiz helps you review key structures, notice your weak points and build confidence over time.</p>

      <h2>Why a Daily Quiz Works So Well</h2>
      <ul>
        <li><strong>Repetition:</strong> You see similar patterns again and again until they feel natural.</li>
        <li><strong>Low pressure:</strong> Just a few questions a day feels easy and sustainable.</li>
        <li><strong>Instant feedback:</strong> You immediately see what you got right or wrong.</li>
      </ul>

      <h2>Example Daily Quiz</h2>
      <p><strong>1) If I ___ more time, I would learn another language.</strong></p>
      <ul>
        <li>A) have</li>
        <li><strong>B) had ✔</strong></li>
        <li>C) will have</li>
        <li>D) would have</li>
      </ul>

      <p><strong>2) She is looking forward ___ you again.</strong></p>
      <ul>
        <li>A) see</li>
        <li>B) to see</li>
        <li><strong>C) to seeing ✔</strong></li>
        <li>D) seeing</li>
      </ul>

      <h2>How to Use a Daily Grammar Quiz</h2>
      <ul>
        <li>Choose a time that you can keep every day, for example after breakfast.</li>
        <li>Do not rush; focus on understanding your mistakes.</li>
        <li>Write down tricky sentences in a notebook to review later.</li>
      </ul>

      <p>If you want to turn this into a habit, bookmark a single page and return to it every day.</p>

      <p><a href="/quiz/daily-grammar-quiz" rel="nofollow">👉 Start the Daily Grammar Quiz now</a></p>
    `,
  },
  {
    slug: 'ielts-grammar-tricks-you-need-to-know',
    title: 'IELTS Grammar Tricks You Need to Know',
    description:
      'Small grammar details can make a big difference in your IELTS score. Learn key structures examiners look for.',
    date: '2025-11-27',
    readingTime: '8 min read',
    image: '/images/blog/ielts-grammar-tricks.jpg',
    contentHtml: `
      <p>Many IELTS candidates focus on vocabulary and ideas, but forget that grammar is a separate scoring criterion. A few targeted grammar upgrades can push your band score higher, especially from 5.5–6.0 to 6.5–7.0.</p>

      <h2>1. Use a Range of Tenses</h2>
      <p>Examiners want to see that you can switch between past, present and future naturally.</p>
      <p>For example, in Writing Task 2 you might:</p>
      <ul>
        <li>Describe general facts in the present simple.</li>
        <li>Refer to changes over time using present perfect.</li>
        <li>Talk about future consequences using future forms or conditionals.</li>
      </ul>

      <h2>2. Add Complex Sentences Carefully</h2>
      <p>Complex sentences are essential for a high band score, but they must be accurate.</p>
      <p>Link ideas with words like <em>although, whereas, even though, while, provided that</em>.</p>

      <h2>3. Avoid Repeating Basic Structures</h2>
      <p>Too many short, simple sentences can limit your score.</p>
      <p>Instead of writing five sentences with "and", use relative clauses and participle clauses.</p>

      <h2>4. Be Precise with Articles</h2>
      <p>Incorrect use of <em>a, an, the</em> is one of the most common problems for IELTS candidates.</p>
      <p>Remember:</p>
      <ul>
        <li>Use <strong>a/an</strong> when you introduce something for the first time.</li>
        <li>Use <strong>the</strong> when both the writer and reader know which thing you mean.</li>
        <li>Use no article for general ideas and plural nouns.</li>
      </ul>

      <h2>5. Train with Exam-Style Questions</h2>
      <p>The fastest way to improve your grammar for IELTS is to practise with questions that feel like the real exam.</p>

      <p><a href="/quiz/ielts-grammar-mini-test" rel="nofollow">👉 Try the IELTS Grammar Mini Test (10 questions)</a></p>
    `,
  },
  {
    slug: 'prepositions-advanced-learners-get-wrong',
    title: '20 Prepositions Advanced Learners Still Get Wrong',
    description:
      'Prepositions are small but dangerous. Here are 20 common mistakes and the correct forms for each one.',
    date: '2025-11-27',
    readingTime: '7 min read',
    image: '/images/blog/advanced-prepositions.jpg',
    contentHtml: `
      <p>Prepositions are one of the last things even advanced learners fully master. They are short, but they can completely change the meaning of a sentence.</p>

      <p>Below are some of the most common problems with prepositions at higher levels.</p>

      <h2>1. "Married with" vs "Married to"</h2>
      <p><strong>Wrong:</strong> She is married with a doctor.<br>
      <strong>Correct:</strong> She is married to a doctor.</p>

      <h2>2. "In the weekend" vs "At the weekend"</h2>
      <p><strong>Wrong:</strong> We will travel in the weekend.<br>
      <strong>Correct:</strong> We will travel at the weekend.</p>

      <h2>3. "Good in" vs "Good at"</h2>
      <p><strong>Wrong:</strong> He is good in maths.<br>
      <strong>Correct:</strong> He is good at maths.</p>

      <h2>4. "On the bus" vs "In the bus"</h2>
      <p>We usually say <strong>on the bus</strong>, <strong>on the train</strong>, <strong>on the plane</strong>.</p>

      <h2>5. "Afraid from" vs "Afraid of"</h2>
      <p><strong>Wrong:</strong> She is afraid from spiders.<br>
      <strong>Correct:</strong> She is afraid of spiders.</p>

      <p>And many more similar structures cause trouble in everyday speech and in exams.</p>

      <h2>How to Practise Prepositions Effectively</h2>
      <ul>
        <li>Learn them in phrases, not as single words.</li>
        <li>Write your own example sentences.</li>
        <li>Notice prepositions when you read or listen to native content.</li>
      </ul>

      <p>To test yourself, you can try a focused quiz with the most confusing preposition combinations.</p>

      <p><a href="/quiz/advanced-prepositions" rel="nofollow">👉 Take the Advanced Prepositions Quiz (20 questions)</a></p>
    `,
  },
];